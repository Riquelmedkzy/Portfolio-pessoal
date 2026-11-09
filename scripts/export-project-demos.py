"""Export public presentation templates only. No DB connections, accounts, secrets or uploads."""
from pathlib import Path
import re,json,subprocess,shutil,html,urllib.parse
PHP='/opt/lampp/bin/php'; work=Path('.local/project-demo-export');work.mkdir(parents=True,exist_ok=True)
SOURCES={'pokelab':Path('/home/user/Projetos/pokemon'),'mundo-invertido':Path('/home/user/Projetos/projinvertido'),'ciberfolio':Path('/home/user/Documentos/ChatGPT/Ciberfólio'),'gestao-compras':Path('/opt/lampp/htdocs/2350/projcompras')}
base='''<?php
error_reporting(E_ALL);ini_set('display_errors','stderr');$_SESSION=[];
define('BASE_PATH',$argv[1]);define('BASE_URL','');define('VIEWS_PATH',BASE_PATH.'/views');define('INCLUDES_PATH',VIEWS_PATH.'/includes');
function e($v){return htmlspecialchars((string)($v??''),ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
function asset($p){return 'assets/'.$p;}function css($n){return asset('css/'.$n.'.css');}function js($n){return asset('js/'.$n.'.js');}function img($n){return asset('img/'.$n);}
function current_user(){return null;}function csrf_token(){return 'demo-no-server';}function csrf(){return 'demo-no-server';}
function csrf_field(){return '';}
function url($r='home'){return '/index.php?route='.$r;}
function route($r='home',$params=[]){if($r==='pokemon_detalhes')return 'pokemon-'.(int)($params['id']??1).'.html';if(!in_array($r,['home','team'],true))return 'account.html';$name=isset($params['element'])?$r.'-'.$params['element']:($r==='home'?'index':'team');unset($params['element']);return $name.'.html'.($params?'?'.http_build_query($params):'');}
function project_link($p){return ['task_app'=>'../lista-tarefas/index.html','football_news'=>'../nexusfc/index.html','aranhaverso'=>'../aranhaverso/index.html','hogwarts'=>'../hogwarts/index.html'][$p]??'';}
$params=json_decode($argv[3],true);$_GET=$params;$_SERVER['REQUEST_METHOD']='GET';$kind=$argv[2];$r=$params['route']??'home';$errors=[];$old=[];$viewer=null;$erro=null;$sucesso=null;
'''
for slug,source in SOURCES.items():
 out=Path('demos')/slug;out.mkdir(parents=True,exist_ok=True)
 for folder in ['css','js','fonts','img']:
  if (source/'views/assets'/folder).is_dir():shutil.copytree(source/'views/assets'/folder,out/'assets'/folder,dirs_exist_ok=True)
 extra='';pages=[]
 if slug=='pokelab':
  config=(source/'config.php').read_text();extra=config[config.index('function role_label'):config.index('spl_autoload_register')]+config[config.index('function type_labels'):config.index('function user_avatar')]
  extra+="\nrequire BASE_PATH.'/models/PokemonRepository.php';$pokemons=(new PokemonRepository())->getAll();usort($pokemons,fn($a,$b)=>strcasecmp($a['name'],$b['name']));$title='PokéLab — demo';\n"
  extra+="if($r==='pokemon_detalhes'){$pokemon=(new PokemonRepository())->getPokemonById((int)$params['id']);$title=$pokemon['name'];$view='pokemon';}else{$view=$r==='team'?'team':'home';$isBuilder=$r==='team';}\n"
  extra+="require INCLUDES_PATH.'/header.php';require VIEWS_PATH.'/'.$view.'.php';require INCLUDES_PATH.'/footer.php';"
  pokemons=json.loads((source/'views/assets/js/pokemon.json').read_text())
  types=['fire','water','grass','electric','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy','normal']
  pages=[('index',{'route':'home'}),('team',{'route':'team'})]+[(f'{r}-{t}',{'route':r,'element':t}) for r in ['home','team'] for t in types]+[(f'pokemon-{p["id"]}',{'route':'pokemon_detalhes','id':p['id']}) for p in pokemons]
 elif slug=='mundo-invertido':
  extra="$title='Mundo Invertido — demonstração';$pageClass=$r==='home'?'home-page':($r==='temporadas'?'explore-page':'inner-page');$view=['home'=>'home','temporadas'=>'portfolio','contact'=>'contact','auth_login'=>'login','register'=>'register','password_forgot'=>'forgot_password'][$r];require INCLUDES_PATH.'/header.php';require VIEWS_PATH.'/'.$view.'.php';require INCLUDES_PATH.'/footer.php';"
  pages=[('index',{'route':'home'})]+[(r,{'route':r}) for r in ['temporadas','contact','auth_login','register','password_forgot']]
 elif slug=='ciberfolio':
  extra="$view=['home'=>'home','sobre'=>'sobre','servico'=>'servico','portfolio'=>'portfolio','contact'=>'contact','auth_login'=>'login','register'=>'register','passwordReset_forgot'=>'forgot_password'][$r];require INCLUDES_PATH.'/header.php';require VIEWS_PATH.'/'.$view.'.php';require INCLUDES_PATH.'/footer.php';"
  pages=[('index',{'route':'home'})]+[(r,{'route':r}) for r in ['sobre','servico','portfolio','contact','auth_login','register','passwordReset_forgot']]
 else:
  extra="$user=['username'=>'Visitante de exemplo','email'=>'visitante@example.invalid','user_type'=>'comum','foto_perfil'=>null];$view=['home'=>'profile','auth_login'=>'login','register'=>'register','profile'=>'profile'][$r];echo '<!doctype html><html lang=\"pt-BR\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Gestão de compras — demo</title></head><body><main><h1>Gestão de compras</h1><nav><a href=\"index.html\">Início</a> · <a href=\"register.html\">Cadastro</a> · <a href=\"auth_login.html\">Acesso</a> · <a href=\"profile.html\">Perfil fictício</a></nav>';require VIEWS_PATH.'/'.$view.'.php';echo '</main></body></html>';"
  pages=[('index',{'route':'home'})]+[(r,{'route':r}) for r in ['auth_login','register','profile']]
 runner=work/(slug+'.php');runner.write_text(base+extra)
 def rewrite(match):
  original=html.unescape(match[0]);q=urllib.parse.parse_qs(original.split('?',1)[-1].strip());r=q.get('route',['home'])[0]
  if slug=='pokelab':
   if r=='pokemon_detalhes':return 'pokemon-'+q.get('id',['1'])[0]+'.html'
   if r in ['home','team']:
    name=('index' if r=='home' else 'team') if 'element' not in q else r+'-'+q['element'][0]
    rest={k:v[0] for k,v in q.items() if k not in ['route','element']}
    return name+'.html'+('?' +urllib.parse.urlencode(rest) if rest else '')
   return 'account.html'
  known={params['route']:name+'.html' for name,params in pages}
  return known.get(r,'account.html')
 for name,params in pages:
  result=subprocess.run([PHP,str(runner),str(source),slug,json.dumps(params)],capture_output=True,text=True,check=True)
  if result.stderr.strip():raise RuntimeError(slug+': '+result.stderr)
  doc=result.stdout.replace('data-sound aria-', 'data-sound disabled title="Som não incluído na demonstração" aria-')
  doc=doc.replace('/index.php? route=', '/index.php?route=')
  doc=re.sub(r'/index\.php\?[^"#\s<>]*',rewrite,doc)
  doc=doc.replace('/views/assets/','assets/')
  doc=re.sub(r'<script>(.*?)</script>','',doc,flags=re.S)
  doc=re.sub(r'<script[^>]*src="[^"]*/functional.js"[^>]*></script>','',doc)
  doc=re.sub(r'<(?:video|audio)\b.*?</(?:video|audio)>','<p class="demo-media-note">Mídia disponível na aplicação original; esta demo prioriza navegação e interação.</p>',doc,flags=re.S)
  doc=re.sub(r'<button[^>]*data-video-id="([^\"]+)"[^>]*>.*?</button>',lambda m:'<a class="button" href="https://www.youtube.com/watch?v='+html.escape(m[1])+'" target="_blank" rel="noopener noreferrer">Trailer no YouTube</a>',doc,flags=re.S)
  if slug=='ciberfolio':
   symbols=dict(re.findall(r'<symbol id="([^"]+)"[^>]*>(.*?)</symbol>',(source/'views/assets/img/nexus-icons.svg').read_text(),re.S))
   doc=re.sub(r'<use href="assets/img/nexus-icons.svg#([^"]+)"></use>',lambda m:symbols.get(m[1],''),doc)
   doc=doc.replace('<svg class="icon" aria-hidden','<svg class="icon" viewBox="0 0 24 24" aria-hidden')
  doc=doc.replace('</head>','<meta name="robots" content="noindex,follow"><link rel="stylesheet" href="../presentation.css"><script src="../presentation.js"></script></head>')
  # Only public fixture data is exported; no database-backed session exists.
  if slug=='pokelab':doc=doc.replace('Entre ou crie uma conta para guardar sua equipe no banco de dados.','Nesta demo, a equipe é um rascunho local. Login e gravação no banco estão desativados.').replace('Entrar e salvar','Sobre esta demo')
  note=f'<aside class="demo-presentation-note"><a href="../../{slug}.html" target="_blank" rel="noopener noreferrer">Ver estudo de caso</a><span>Demo navegável · sem backend · formulários não enviam dados</span><button type="button" data-presentation-pause>Pausar movimento</button></aside>'
  doc=doc.replace('</body>',note+'</body>')
  (out/(name+'.html')).write_text(doc)
 (out/'account.html').write_text(f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Limites da demo</title><link rel="stylesheet" href="../presentation.css"></head><body class="demo-account"><main><h1>Uma prévia para explorar.</h1><p>Esta demonstração não cria contas, autentica usuários ou envia mensagens. Não informe dados pessoais. Os recursos de servidor estão disponíveis somente na aplicação original.</p><a href="index.html">Voltar à demonstração</a></main></body></html>')
 if slug=='gestao-compras':
  (out/'assets/img').mkdir(parents=True,exist_ok=True)
  (out/'assets/img/profile-demo.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#e8effa"/><circle cx="48" cy="34" r="15" fill="#829bc0"/><path d="M19 84a29 29 0 0 1 58 0" fill="#829bc0"/></svg>')
  (out/'assets').mkdir(exist_ok=True)
  for file in out.glob('*.html'):
   doc=file.read_text().replace('href="/"','href="index.html"').replace('perfil_padrao.png','profile-demo.svg').replace('<head>','<head><link rel="stylesheet" href="../forms-demo.css">');doc=re.sub(r'<input\b([^>]*)(?:type="file")([^>]*)>','<p>Envio de imagem disponível somente na aplicação original.</p>',doc);file.write_text(doc)
 print(slug,len(pages),'páginas exportadas sem banco')

file=Path('demos/pokelab/assets/js/index.js')
file.write_text(file.read_text().replace('${base}/views/assets/','assets/'))
# Connect the original Ciberfólio canvas clock to the isolated demo's pause control.
file=Path('demos/ciberfolio/assets/js/home.js')
code=file.read_text().replace('if (!staticFrame && tabVisible && canvasVisible && !reducedMotion.matches)',"if (!staticFrame && tabVisible && canvasVisible && !reducedMotion.matches && !document.documentElement.classList.contains('demo-motion-off'))").replace('if (reducedMotion.matches || !tabVisible || !canvasVisible)',"if (reducedMotion.matches || !tabVisible || !canvasVisible || document.documentElement.classList.contains('demo-motion-off'))")
code=code.replace("  const hero = canvas.closest", "  document.addEventListener('presentation:motion', event => {if(event.detail.paused)stop();else start();});\n  const hero = canvas.closest")
file.write_text(code)
