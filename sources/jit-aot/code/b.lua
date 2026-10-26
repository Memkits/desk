-- Lua 版本：luajit b.lua <case> <rounds>（同一份代码也给 Lua 5.4 跑）
local clock = os.clock
local bit = rawget(_G, 'bit')
local band, bxor, rshift
if bit then band, bxor, rshift = bit.band, bit.bxor, bit.rshift
else band = load('return function(a,b) return a & b end')(); bxor = load('return function(a,b) return a ~ b end')(); rshift = load('return function(a,b) return (a & 0xffffffff) >> b end')() end
local seed = 42
local function rnd() seed = (seed * 48271) % 2147483647; return seed end
local C = {}

function C.nbody()
  local PI, DP = math.pi, 365.24; local SM = 4 * PI * PI
  local raw = {{0,0,0,0,0,0,SM},
    {4.84143144246472090e+00,-1.16032004402742839e+00,-1.03622044471123109e-01,1.66007664274403694e-03*DP,7.69901118419740425e-03*DP,-6.90460016972063023e-05*DP,9.54791938424326609e-04*SM},
    {8.34336671824457987e+00,4.12479856412430479e+00,-4.03523417114321381e-01,-2.76742510726862411e-03*DP,4.99852801234917238e-03*DP,2.30417297573763929e-05*DP,2.85885980666130812e-04*SM},
    {1.28943695621391310e+01,-1.51111514016986312e+01,-2.23307578892655734e-01,2.96460137564761618e-03*DP,2.37847173959480950e-03*DP,-2.96589568540237556e-05*DP,4.36624404335156298e-05*SM},
    {1.53796971148509165e+01,-2.59193146099879641e+01,1.79258772950371181e-01,2.68067772490389322e-03*DP,1.62824170038242295e-03*DP,-9.51592254519715870e-05*DP,5.15138902046611451e-05*SM}}
  local B = {}
  for i, b in ipairs(raw) do B[i] = {x=b[1],y=b[2],z=b[3],vx=b[4],vy=b[5],vz=b[6],m=b[7]} end
  local n, dt, sqrt = #B, 0.01, math.sqrt
  for s = 1, 1000000 do
    for i = 1, n do local a = B[i]
      for j = i + 1, n do local b = B[j]
        local dx, dy, dz = a.x - b.x, a.y - b.y, a.z - b.z
        local d2 = dx*dx + dy*dy + dz*dz
        local mag = dt / (d2 * sqrt(d2))
        a.vx = a.vx - dx*b.m*mag; a.vy = a.vy - dy*b.m*mag; a.vz = a.vz - dz*b.m*mag
        b.vx = b.vx + dx*a.m*mag; b.vy = b.vy + dy*a.m*mag; b.vz = b.vz + dz*a.m*mag
      end
    end
    for i = 1, n do local b = B[i]; b.x = b.x + dt*b.vx; b.y = b.y + dt*b.vy; b.z = b.z + dt*b.vz end
  end
  return B[1].x + B[2].y
end

local function fib(n) if n < 2 then return n end return fib(n-1) + fib(n-2) end
function C.fib() return fib(32) end

-- 多态：用元表模拟五种“类”
local K = {}
local coef = {3.14159, 1, 0.5, 2.598, 2}
for k = 1, 5 do local c = coef[k]; local mt = {}; mt.__index = mt; function mt.area(self) return c * self.r * self.r end; K[k] = mt end
local function mkShapes(kinds) local a = {} for i = 0, 999999 do a[i+1] = setmetatable({r = (i % 100) * 0.01}, K[(i % kinds) + 1]) end return a end
local MONO, POLY
local function sumArea(a) local s = 0 for p = 1, 10 do for i = 1, #a do s = s + a[i]:area() end end return s end
function C.mono() MONO = MONO or mkShapes(1); return sumArea(MONO) end
function C.poly() POLY = POLY or mkShapes(5); return sumArea(POLY) end

local function mk(d) if d == 0 then return {} end return {mk(d-1), mk(d-1)} end
local function chk(t) if t[1] == nil then return 1 end return 1 + chk(t[1]) + chk(t[2]) end
function C.trees() local s = 0 for i = 1, 20 do s = s + chk(mk(14)) end return s end

local WORDS
function C.words()
  if not WORDS then seed = 7; WORDS = {} for i = 1, 1000000 do WORDS[i] = 'w' .. (rnd() % 50000) end end
  local m, n = {}, 0
  for i = 1, #WORDS do local w = WORDS[i]; local c = m[w]; if c then m[w] = c + 1 else m[w] = 1; n = n + 1 end end
  return n + m[WORDS[1]]
end

function C.branchy()
  seed = 1; local x = 0
  for i = 0, 4999999 do
    local k = band(rnd(), 7)
    if k == 0 then x = x + i
    elseif k == 1 then x = bxor(x, i)
    elseif k == 2 then x = (x * 3) % 4294967296
    elseif k == 3 then x = x - rshift(i, 1)
    elseif k == 4 then x = (x + 7) % 4294967296
    elseif k == 5 then x = bxor(x, rshift(x, 3))
    elseif k == 6 then x = (x * 5 + 1) % 4294967296
    else x = (x - 3) % 4294967296 end
  end
  return x
end

function C.interp()
  local code = {0, 0, 4, 3, 1, 4, 5, 6, 7, 1, 8}
  local pc, sp, i, acc, N = 1, 0, 0, 0, 1000000
  local st = {}
  while true do
    local op = code[pc]; pc = pc + 1
    if op == 0 then sp = sp + 1; st[sp] = i
    elseif op == 1 then sp = sp + 1; st[sp] = acc
    elseif op == 2 then local b = st[sp]; sp = sp - 1; st[sp] = st[sp] * b
    elseif op == 3 then st[sp] = st[sp] % 7
    elseif op == 4 then local b = st[sp]; sp = sp - 1; st[sp] = st[sp] + b
    elseif op == 5 then acc = st[sp]; sp = sp - 1
    elseif op == 6 then i = i + 1
    elseif op == 7 then local t = code[pc]; pc = pc + 1; if i < N then pc = t end
    else return acc end
  end
end

local MA, MB
function C.matmul()
  local n = 256
  if not MA then MA, MB = {}, {} for i = 0, n*n-1 do MA[i] = (i % 13) * 0.5; MB[i] = (i % 7) * 0.25 end end
  local Cm = {} for i = 0, n*n-1 do Cm[i] = 0 end
  for i = 0, n-1 do for k = 0, n-1 do local a = MA[i*n+k]; local ro, rb = i*n, k*n
    for j = 0, n-1 do Cm[ro+j] = Cm[ro+j] + a * MB[rb+j] end end end
  return Cm[n*n-1] + Cm[1234]
end

local DATA
local RULES = {}
for r in (os.getenv('RULES') or '7,3,100;11,5,2000;13,0,50'):gmatch('[^;]+') do local t = {} for v in r:gmatch('[^,]+') do t[#t+1] = tonumber(v) end RULES[#RULES+1] = t end
local function data() if not DATA then seed = 3; DATA = {} for i = 1, 2000000 do DATA[i] = rnd() % 100000 end end return DATA end
function C.rules_interp()
  local D, c = data(), 0
  for i = 1, #D do local x = D[i]; local ok = true
    for k = 1, #RULES do local r = RULES[k]; if not (x % r[1] == r[2] or x < r[3]) then ok = false; break end end
    if ok then c = c + 1 end end
  return c
end
local GEN
function C.rules_jit()
  local D = data()
  if not GEN then local parts = {} for k, r in ipairs(RULES) do parts[k] = string.format('(x %% %d == %d or x < %d)', r[1], r[2], r[3]) end
    GEN = load('return function(D) local c = 0 for i = 1, #D do local x = D[i] if ' .. table.concat(parts, ' and ') .. ' then c = c + 1 end end return c end')() end
  return GEN(D)
end
function C.hello() return 0 end

local name, R = arg[1], tonumber(arg[2] or '10')
local f, res, out = C[name], 0, {}
for r = 1, R do local t0 = clock(); res = f(); out[#out+1] = string.format('%.2f', (clock() - t0) * 1000) end
if name ~= 'hello' then print(table.concat(out, ' ')) end
print('ck', string.format('%.6g', res))
