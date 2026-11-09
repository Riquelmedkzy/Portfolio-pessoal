const root=document.querySelector('[data-ecosystem]');
if(root){
 const map=root.querySelector('[data-map]'),list=root.querySelector('[data-tech-list]'),nodes=[...map.querySelectorAll('[data-tech-select]')],panels=[...root.querySelectorAll('[data-tech-panel]')],paths=[...root.querySelectorAll('[data-connection]')],category=root.querySelector('[data-tech-category]');
 let selected='javascript',view='map',hovered=null;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function highlight(id){const related=new Set([id]);paths.forEach(p=>{const active=p.dataset.source===id||p.dataset.target===id;p.classList.toggle('is-connected',active);if(active){related.add(p.dataset.source);related.add(p.dataset.target);}});nodes.forEach(n=>{n.classList.toggle('is-related',related.has(n.dataset.techSelect));n.classList.toggle('is-selected',n.dataset.techSelect===selected);});}
 function select(id,announce=true){
  const panel=panels.find(p=>p.dataset.techPanel===id);if(!panel)return;
  const node=nodes.find(n=>n.dataset.techSelect===id);if(node?.hidden){category.value='all';filter(false);}
  selected=id;panels.forEach(p=>p.classList.toggle('is-current',p===panel));
  root.querySelectorAll('[data-tech-select][aria-pressed]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.techSelect===id)));
  highlight(id);
  if(announce)root.querySelector('[data-tech-status]').textContent=`${panel.querySelector('h2').textContent}: ${panel.querySelector('header+p').textContent}`;
  if(!reduced.matches&&!document.documentElement.classList.contains('motion-paused')&&panel.animate)panel.animate([{opacity:.45,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:240,easing:'ease-out'});
 }
 function draw(){
  if(view!=='map')return;const r=map.getBoundingClientRect();if(!r.width)return;
  const positions=new Map(nodes.map(n=>{const b=n.getBoundingClientRect();return[n.dataset.techSelect,{x:(b.left+b.width/2-r.left)/r.width*1000,y:(b.top+b.height/2-r.top)/r.height*620,hidden:n.hidden}];}));
  paths.forEach(p=>{const a=positions.get(p.dataset.source),b=positions.get(p.dataset.target);p.style.display=a.hidden||b.hidden?'none':'';const dx=(b.x-a.x)*.5;p.setAttribute('d',`M${a.x} ${a.y} C${a.x+dx} ${a.y},${b.x-dx} ${b.y},${b.x} ${b.y}`);});
 }
 function filter(reselect=true){const c=category.value;nodes.forEach(n=>n.hidden=c!=='all'&&n.dataset.category!==c);list.querySelectorAll('[data-list-category]').forEach(s=>s.hidden=c!=='all'&&s.dataset.listCategory!==c);if(reselect&&nodes.find(n=>n.dataset.techSelect===selected)?.hidden)select(nodes.find(n=>!n.hidden).dataset.techSelect);draw();}
 root.addEventListener('click',event=>{const b=event.target.closest('[data-tech-select]');if(b)select(b.dataset.techSelect);});
 nodes.forEach(n=>{n.addEventListener('pointerenter',()=>{hovered=n.dataset.techSelect;highlight(hovered);});n.addEventListener('pointerleave',()=>{hovered=null;highlight(selected);});n.addEventListener('focus',()=>highlight(n.dataset.techSelect));n.addEventListener('blur',()=>highlight(selected));n.addEventListener('keydown',event=>{const visible=nodes.filter(n=>!n.hidden);const index=visible.indexOf(n);const step={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[event.key];if(step){event.preventDefault();visible[(index+step+visible.length)%visible.length].focus();}});});
 root.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;root.dataset.view=view;root.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw();}));
 category.addEventListener('change',()=>filter());root.dataset.view='map';
 if('ResizeObserver' in window)new ResizeObserver(draw).observe(map);else addEventListener('resize',draw);
 if('IntersectionObserver' in window)new IntersectionObserver(([entry])=>map.classList.toggle('is-offscreen',!entry.isIntersecting)).observe(map);
 document.addEventListener('visibilitychange',()=>map.classList.toggle('is-tab-hidden',document.hidden));
 document.fonts?.ready.then(draw);select(selected,false);draw();
}
