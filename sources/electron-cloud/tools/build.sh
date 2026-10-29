python3 -c "
s=open('page_src.html').read().replace('<script>/*EC*/</script>','<script>'+open('ec.js').read()+'</script>').replace('<script>/*MOL*/</script>','<script>'+open('mol.js').read()+'</script>').replace('<script>/*ISO*/</script>','<script>'+open('iso.js').read()+'</script>')
open('电子云周期表.html','w').write(s)
t=s.replace('<script src=\"https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js\"></script>','')
i=t.rindex('<script>\n(() => {')
t='<meta charset=\"utf-8\">'+t[:i]+'<script type=\"module\">\nimport * as THREE from \"./three.module.js\"; window.THREE = THREE;\n'+t[i+len('<script>\n'):]
open('test.html','w').write(t)"
