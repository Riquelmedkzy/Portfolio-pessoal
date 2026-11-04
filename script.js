const root = document.documentElement;
const media = matchMedia('(prefers-color-scheme: dark)');
const dark = () => root.dataset.theme ? root.dataset.theme === 'dark' : media.matches;
const theme = document.querySelector('[data-theme-toggle]');
function labelTheme() { if(theme) {theme.textContent = dark() ? 'Tema claro' : 'Tema escuro'; theme.setAttribute('aria-label', 'Ativar ' + theme.textContent.toLowerCase());} }
labelTheme(); media.addEventListener('change',labelTheme);
theme?.addEventListener('click',()=>{root.dataset.theme = dark() ? 'light' : 'dark';try {localStorage.setItem('portfolio-theme',root.dataset.theme);}catch{} labelTheme();});
const menu = document.querySelector('[data-menu]'), nav = document.querySelector('#navigation');
function closeMenu(){menu?.setAttribute('aria-expanded','false');nav?.classList.remove('open');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){closeMenu();menu.focus();}});
matchMedia('(min-width: 801px)').addEventListener('change',closeMenu);
const copy=document.querySelector('[data-copy-email]');
copy?.addEventListener('click',async()=>{const status=document.querySelector('[data-copy-status]');try{await navigator.clipboard.writeText('matheusriquelmeweb@gmail.com');status.textContent='Email copiado.';}catch{status.textContent='Selecione e copie o email exibido acima.';}});
const pause=document.querySelector('[data-pause-motion]');
pause?.addEventListener('click',()=>{const paused=pause.getAttribute('aria-pressed')!=='true';pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Retomar animações':'Pausar animações';document.querySelector('.skills-main')?.classList.toggle('motion-paused',paused);document.dispatchEvent(new CustomEvent('portfolio-motion',{detail:{paused}}));});
