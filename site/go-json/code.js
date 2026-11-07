// 代码卡。cols: [[标题, 源码, 颜色]]；行首 !! = 高亮
CODE.iface = { fn: '自定义编解码接口：v1 与 v2', cols: [['v1：一整段字节', `type Marshaler interface {
    MarshalJSON() ([]byte, error)
}

type Unmarshaler interface {
    UnmarshalJSON([]byte) error
}`, '#FF7A93'], ['v2：直接在流上读写', `type MarshalerTo interface {
!!    MarshalJSONTo(*jsontext.Encoder) error
}

type UnmarshalerFrom interface {
!!    UnmarshalJSONFrom(*jsontext.Decoder) error
}`, '#5FE0A0']], fs: 27, note: '编码器、解码器带着选项一路往下传；不用先找出值的边界，再从头解析一遍。' };
CODE.api = { fn: 'encoding/json/v2 的入口函数', src: `import (
    "encoding/json/v2"
    "encoding/json/jsontext"
)

b, err := json.Marshal(v)             // 和以前一样
err = json.Unmarshal(b, &v)

!!err = json.MarshalWrite(w, v)         // io.Writer
!!err = json.UnmarshalRead(r, &v)       // io.Reader

!!err = json.MarshalEncode(jsontext.NewEncoder(w), v)
!!err = json.UnmarshalDecode(jsontext.NewDecoder(r), &v)`, fs: 28 };
CODE.opts = { fn: '选项：放在参数最后，可以任意组合', src: `b, err := json.Marshal(v,
    json.Deterministic(true),          // 同样的输入，同样的字节
    jsontext.WithIndent("  "),         // 取代 MarshalIndent
)

err = json.Unmarshal(b, &cfg,
    json.RejectUnknownMembers(true),   // 有未知字段就报错
    json.StringifyNumbers(true),       // 数字放在字符串里读写
)

opts := json.JoinOptions(a, b)         // 合成一组，往下传`, fs: 28 };
CODE.withm = { fn: 'WithMarshalers：不改类型，临时指定编码方式', src: `// time.Duration 在 v2 里默认报错，这里指定成 "1m30s" 这样的字符串
m := json.MarshalFunc(func(d time.Duration) ([]byte, error) {
    return []byte(strconv.Quote(d.String())), nil
})

!!b, err := json.Marshal(job, json.WithMarshalers(m))
// {"name":"backup","timeout":"1m30s"}`, fs: 28, note: '对应的还有 UnmarshalFunc 与 WithUnmarshalers；也有直接操作编码器的 MarshalToFunc。' };
CODE.tags = { fn: 'v2 的结构体标签', src: `type User struct {
    ID     int64          \`json:"id,string"\`         // 数字写成 "123"
    Email  string         \`json:"email,omitempty"\`   // 编码出 "" 时省略
!!    Age    int            \`json:"age,omitzero"\`      // 是零值时省略
!!    Region string         \`json:"region,case:ignore"\` // REGION、Region 都认
!!    Extra  jsontext.Value \`json:",embed"\`           // 认不出的字段收在这里
}`, fs: 26, note: 'embed 的字段类型是 jsontext.Value 或 map[~string]T 时，叫“嵌入的兜底字段”，一个结构体只能有一个。' };
CODE.d_strict = { fn: '变化 1、2：会报错', cols: [['v1', `json.Unmarshal(
  []byte(\`{"name":"a","name":"b"}\`), &u)
// err == nil，u.Name == "b"

json.Unmarshal([]byte("\\"\\xff\\""), &s)
// err == nil，s == "\\ufffd"`, '#FF7A93'], ['v2', `json.Unmarshal(
  []byte(\`{"name":"a","name":"b"}\`), &u)
!!// 错误：duplicate object member name

json.Unmarshal([]byte("\\"\\xff\\""), &s)
!!// 错误：invalid UTF-8`, '#5FE0A0']], fs: 26, note: '兼容选项：jsontext.AllowDuplicateNames(true)、jsontext.AllowInvalidUTF8(true)。' };
CODE.d_nil = { fn: '变化 3：nil 切片和映射', cols: [['v1', `type Resp struct {
    Items []string
    Meta  map[string]int
}
json.Marshal(Resp{})
!!// {"Items":null,"Meta":null}`, '#FF7A93'], ['v2', `type Resp struct {
    Items []string
    Meta  map[string]int
}
json.Marshal(Resp{})
!!// {"Items":[],"Meta":{}}`, '#5FE0A0']], fs: 27, note: '兼容选项：json.FormatNilSliceAsNull(true)、json.FormatNilMapAsNull(true)。' };
CODE.d_case = { fn: '变化 4：大小写匹配（不报错！）', cols: [['v1', `type U struct{ Name string }

var u U
json.Unmarshal(
  []byte(\`{"NAME":"zoe"}\`), &u)
!!// u.Name == "zoe"`, '#FF7A93'], ['v2', `type U struct{ Name string }

var u U
json.Unmarshal(
  []byte(\`{"NAME":"zoe"}\`), &u)
!!// err == nil，u.Name == ""`, '#5FE0A0']], fs: 27, note: '兼容：json.MatchCaseInsensitiveNames(true)，或在字段上写 case:ignore。' };
CODE.d_omit = { fn: '变化 5：omitempty 的含义', cols: [['v1：按 Go 的值', `type Q struct {
    N  int  \`json:"n,omitempty"\`
    OK bool \`json:"ok,omitempty"\`
}
json.Marshal(Q{})
!!// {}`, '#FF7A93'], ['v2：按编码出的 JSON', `type Q struct {
    N  int  \`json:"n,omitempty"\`
    OK bool \`json:"ok,omitempty"\`
}
json.Marshal(Q{})
!!// {"n":0,"ok":false}`, '#5FE0A0']], fs: 26, note: '想按零值省略：改用 omitzero（v1 自 Go 1.24 起也支持）。' };
CODE.d_dur = { fn: '变化 6：time.Duration', cols: [['v1', `type Job struct {
    Timeout time.Duration
}
json.Marshal(Job{90 * time.Second})
!!// {"Timeout":90000000000}
// 纳秒？毫秒？读的一方要猜`, '#FF7A93'], ['v2', `type Job struct {
    Timeout time.Duration
}
json.Marshal(Job{90 * time.Second})
!!// 错误：no default representation
// 用 WithMarshalers 或兼容选项指定`, '#5FE0A0']], fs: 26, note: '兼容选项：json.FormatDurationAsNano(true)（在 v1 包里）。另：v2 统一了指针接收者方法的调用（#22967）。' };
CODE.mig = { fn: '按需组合新旧行为', src: `import (
    jsonv1 "encoding/json"
    "encoding/json/v2"
    "encoding/json/jsontext"
)

// v2 的默认，但允许重复键
!!json.Marshal(v, json.DefaultOptionsV2(), jsontext.AllowDuplicateNames(true))

// v1 的默认，但拒绝重复键
!!json.Marshal(v, jsonv1.DefaultOptionsV1(), jsontext.AllowDuplicateNames(false))`, fs: 27, note: '两个例子都来自官方博客；更多场景见 go.dev/doc/jsonv2-migration。' };
CODE.serde = { fn: 'Rust：serde 派生宏 + serde_json', src: `use serde::{Deserialize, Serialize};

!!#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct User {
    id: u64,
    user_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    email: Option<String>,
}

let u: User = serde_json::from_str(text)?;   // 编译期已生成解析代码
let s = serde_json::to_string(&u)?;`, fs: 27 };
CODE.decl = { fn: '同一个结构：Go · Rust · C++（glaze）', cols: [['Go（json/v2）', `type User struct {
  ID    int64  \`json:"id"\`
  Name  string \`json:"name"\`
  Email string \`json:"email,omitempty"\`
}
json.Unmarshal(b, &u,
  json.RejectUnknownMembers(true))`, '#5CB4FF'], ['Rust（serde）', `#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct User {
  id: i64,
  name: String,
  #[serde(default)]
  email: Option<String>,
}`, '#FFB25C']], fs: 25, note: 'C++ 的 glaze：聚合类型可以直接反射；也可写 glz::meta 指定字段名，用 glz::read_json(u, buf) 读取。运行时读标签（Go）vs 编译期展开（Rust、C++）。' };
