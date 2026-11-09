"""Export a visual demo from local PHP templates and the source's public fixture SQL.
Never connects to MySQL; no PHP, SQL, configuration or log is copied to the demo.
Usage: python3 scripts/export-aranhaverso.py SOURCE_DIR [PHP_BINARY]
"""
import sys,re,json,sqlite3,subprocess,shutil,hashlib
from pathlib import Path
source=Path(sys.argv[1]).resolve();php=sys.argv[2] if len(sys.argv)>2 else '/opt/lampp/bin/php'
out=Path('demos/aranhaverso');work=Path('.local/demo-export');out.mkdir(parents=True,exist_ok=True);work.mkdir(parents=True,exist_ok=True)
# Only INSERT fixtures for these public content tables are interpreted in memory.
sql=(source/'spiderman_db.sql').read_text();db=sqlite3.connect(':memory:');db.row_factory=sqlite3.Row
schemas={'actors':'id,slug,name,earth_designation,description,profile_image,bg_theme_class','movies':'id,actor_id,slug,title,release_year,director,synopsis,trailer_url,card_image,bg_image','movie_gallery':'movie_id,image_path,caption'}
for table,cols in schemas.items():
 db.execute('CREATE TABLE '+table+' ('+','.join(c+' TEXT' for c in cols.split(','))+')')
 match=re.search(r'INSERT INTO `'+table+r'`\s*\((.*?)\)\s*VALUES\s*(.*?);',sql,re.S)
 if not match:raise ValueError('Missing fixture: '+table)
 stmt='INSERT INTO '+table+' ('+match[1].replace('`','')+') VALUES '+match[2]
 db.execute(stmt)
actors=[dict(r) for r in db.execute('SELECT * FROM actors')];movies=[dict(r) for r in db.execute('SELECT * FROM movies')];gallery=[dict(r) for r in db.execute('SELECT * FROM movie_gallery')]
for a in actors:
 a['movies']=[m for m in movies if m['actor_id']==a['id']];a['first_movie']=a['movies'][0]['slug']
for m in movies:
 a=next(a for a in actors if a['id']==m['actor_id']);m.update({k:a[k] for k in ['earth_designation','profile_image','bg_theme_class']});m['actor_slug']=a['slug'];m['actor_name']=a['name']
fixture=work/'fixtures.json';fixture.write_text(json.dumps(dict(actors=actors,movies=movies,gallery=gallery),ensure_ascii=False))
runner=work/'render.php';runner.write_text('''<?php
error_reporting(E_ALL);ini_set('display_errors','stderr');
define('APP_ROOT',$argv[1]);define('BASE_URL','.');
function e(?string $v):string{return htmlspecialchars($v??'',ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
function asset_url(string $p):string{return 'assets/'.ltrim($p,'/');}
function img(string $p):string{return asset_url('img/'.$p);}
function css(string $n):string{return asset_url('css/'.$n.'.css');}
function js(string $n):string{return asset_url('js/'.$n.'.js');}
function movie_url(string $slug):string{return $slug.'.html';}
function home_url():string{return 'index.html';}
$data=json_decode(file_get_contents($argv[2]),true,512,JSON_THROW_ON_ERROR);
$actors=$data['actors'];$name=$argv[3];$titulo='Aranhaverso — demonstração';
if($name==='universos'){$isUniverses=true;$universeStories=require APP_ROOT.'/data/universos.php';}
elseif($name!=='home'){
 $movie=array_values(array_filter($data['movies'],fn($m)=>$m['slug']===$name))[0];$titulo=$movie['title'];
 $actorMovies=array_values(array_filter($data['movies'],fn($m)=>$m['actor_id']===$movie['actor_id']));
 $gallery=array_values(array_filter($data['gallery'],fn($g)=>$g['movie_id']===$movie['id']));$name='movie_details';
}
require APP_ROOT.'/views/includes/header.php';require APP_ROOT.'/views/'.$name.'.php';require APP_ROOT.'/views/includes/footer.php';
''')
shutil.copytree(source/'views/assets',out/'assets',dirs_exist_ok=True)
for name in ['home','universos']+[m['slug'] for m in movies]:
 r=subprocess.run([php,str(runner),str(source),str(fixture),name],capture_output=True,text=True,check=True)
 if r.stderr.strip():raise RuntimeError(r.stderr)
 html=r.stdout.replace('./index.php?route=universos','universos.html')
 # No CDN JS: the source includes an accessible local dialog fallback.
 html=re.sub(r'<(?:script|link)[^>]*(?:src|href)="https://cdn.jsdelivr.net/[^\"]+"[^>]*>(?:</script>)?','',html)
 html=html.replace('</head>','<meta name="robots" content="noindex,follow"><link rel="stylesheet" href="demo.css"><script src="demo.js" defer></script></head>')
 html=html.replace('<body ', '<body ',1).replace('</body>','<aside class="demo-banner"><a href="../../aranhaverso.html" target="_top">Voltar ao portfólio</a><span>Demo visual navegável · dados do projeto · sem backend</span><button type="button" data-demo-pause aria-pressed="false">Pausar movimento</button></aside></body>')
 # Trailers open explicitly on YouTube; no third-party embed policy required.
 html=re.sub(r'href="https://www.youtube.com/embed/([^\"]+)" data-fancybox="trailer" data-type="iframe" aria-label="[^\"]+"',r'href="https://www.youtube.com/watch?v=\1" target="_blank" rel="noopener noreferrer"',html)
 html=html.replace('ASSISTIR TRAILER','TRAILER NO YOUTUBE')
 (out/('index.html' if name=='home' else name+'.html')).write_text(html)
(out/'demo.css').write_text('''.demo-banner{position:fixed;bottom:12px;left:12px;right:12px;z-index:1000;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px 18px;border:1px solid #40516e;border-radius:10px;background:#0b1226;color:#d5def0;font:12px/1.5 sans-serif}.demo-banner a{color:#90bcff}.demo-banner button{min-height:38px;padding:6px 10px;background:#182741;border:1px solid #40516e;border-radius:6px;color:#fff;cursor:pointer}body{padding-bottom:100px}.demo-paused *{animation-play-state:paused!important;transition:none!important}.demo-paused .movie-tile{opacity:1;transform:none}.demo-paused .universe-slide__scene{transform:none!important}.universe-slide[aria-hidden=true]{visibility:hidden}@media(max-width:600px){.demo-banner span{flex-basis:100%;order:3;font-size:10px}.demo-banner{bottom:6px;left:6px;right:6px}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.movie-tile{opacity:1!important;transform:none!important}}''')
(out/'demo.js').write_text('''(()=>{const button=document.querySelector('[data-demo-pause]');let manual=false,external=false;const reduced=matchMedia('(prefers-reduced-motion:reduce)');function update(){const paused=manual||external||reduced.matches;document.documentElement.classList.toggle('demo-paused',paused);button.textContent=paused?'Retomar movimento':'Pausar movimento';button.setAttribute('aria-pressed',String(paused));button.disabled=external||reduced.matches;}button.addEventListener('click',()=>{manual=!manual;update();});addEventListener('message',event=>{if(event.source!==parent||event.data?.type!=='portfolio-demo-motion')return;external=Boolean(event.data.paused);update();});reduced.addEventListener('change',update);update();})();''')
print('Exportadas 11 páginas navegáveis; nenhuma conexão ou alteração de banco.')
print('SHA-256 das fixtures:',hashlib.sha256(sql.encode()).hexdigest())
