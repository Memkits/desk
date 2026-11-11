"""python3 mkgame.py game.txt → game.js（棋谱、每手名字、黑方胜率、终局归属）"""
import sys, json
from analyze import analyze, N
mv,facts,b,own,(bs,ws,sc)=analyze(sys.argv[1])
while facts and facts[-1]['p']<0: facts.pop()   # 去掉结尾的停一手
G={'n':9,'moves':[{'c':f['c'],'p':f['p']} for f in facts],'names':[f['name'] for f in facts],'wr':[.5]+[round(f['wr'],3) for f in facts],'terr':own,'score':[bs,ws],'komi':7.5}
open('game.js','w').write('window.GAME='+json.dumps(G,ensure_ascii=False)+';')
print(len(G['moves']),bs,ws)
