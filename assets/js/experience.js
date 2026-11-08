/* Independent orbital panels, a still portrait, and accessible page interactions. */
(() => {
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const active=()=>!root.classList.contains('motion-paused')&&!reduced.matches;
 document.querySelectorAll('.orbit-stage').forEach(stage=>{
  const panels=[...stage.querySelectorAll('.orbit-panel')];
  let width=stage.clientWidth,height=stage.clientHeight,phase=.5,last=0,raf=0,visible=true;
  function position(){
   panels.forEach(panel=>{const angle=phase+Number(panel.dataset.phase),depth=Math.sin(angle),x=Math.cos(angle)*width*.38;
    // Foreground panels travel below the face; back panels pass behind the head.
    const y=depth*height*.25-width*.045*Math.cos(angle);
    const scale=.72+(depth+1)*.14;
    panel.style.transform=`translate(-50%,-50%) translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scale(${scale.toFixed(3)}) rotateY(${(-Math.cos(angle)*14).toFixed(2)}deg) rotateZ(${(Math.cos(angle)*-5).toFixed(2)}deg)`;
    panel.style.zIndex=depth>0?'20':'2';panel.style.opacity=(.72+(depth+1)*.14).toFixed(2);
   });
  }
  function draw(time){raf=0;if(!active()||document.hidden||!visible)return;const dt=last?Math.min(time-last,64):0;last=time;phase+=dt/1000*(Math.PI*2/30);position();raf=requestAnimationFrame(draw);}
  function playback(){cancelAnimationFrame(raf);raf=0;last=0;if(active()&&!document.hidden&&visible)raf=requestAnimationFrame(draw);}
  new ResizeObserver(()=>{width=stage.clientWidth;height=stage.clientHeight;position();}).observe(stage);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;playback();}).observe(stage);
  document.addEventListener('portfolio-motion',playback);document.addEventListener('visibilitychange',playback);reduced.addEventListener('change',playback);position();playback();
 });
 const type=document.querySelector('[data-typewriter]');
 if(type){const phrases=['Desenvolvimento web.','Aplicativos com propósito.','Interfaces que conectam.'];let index=0,chars=phrases[0].length,erasing=true,timer=0;const tick=()=>{if(!active()||document.hidden)return;const word=phrases[index];chars+=erasing?-1:1;type.textContent=word.slice(0,chars);let delay=erasing?35:65;if(chars===0){erasing=false;index=(index+1)%phrases.length;delay=250;}else if(!erasing&&chars===word.length){erasing=true;delay=2000;}timer=setTimeout(tick,delay);};const playback=()=>{clearTimeout(timer);if(active()&&!document.hidden)timer=setTimeout(tick,2000);else type.textContent='Desenvolvimento web e apps.';};document.addEventListener('portfolio-motion',playback);document.addEventListener('visibilitychange',playback);playback();}
 const filterButtons=[...document.querySelectorAll('[data-filter]')];
 filterButtons.forEach(button=>button.addEventListener('click',()=>{filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const cards=[...document.querySelectorAll('[data-project-type]')];cards.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.projectType!==button.dataset.filter;if(!card.hidden&&active())card.animate([{opacity:.2,filter:'blur(4px)',transform:'translateY(12px)'},{opacity:1,filter:'blur(0)',transform:'none'}],{duration:400,easing:'ease-out'});});document.querySelector('[data-filter-status]').textContent=`${cards.filter(c=>!c.hidden).length} projetos exibidos.`;}));
 const form=document.querySelector('[data-contact-form]');
 form?.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const subject=`Projeto de ${String(data.get('name')).trim()}`;const body=`Olá, Riquelme!\n\n${String(data.get('message')).trim()}\n\nNome: ${String(data.get('name')).trim()}\nEmail: ${String(data.get('email')).trim()}`;const url=`mailto:matheusriquelmeweb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;window.location.href=url;document.querySelector('[data-form-status]').textContent='Mensagem preparada. Conclua o envio no seu aplicativo de email. Se ele não abriu, use o endereço acima.';});
 const loader=document.querySelector('[data-loader]');
 if(loader){let seen=false;try{seen=sessionStorage.getItem('portfolio-loaded')==='yes';}catch{}if(!seen&&active()&&document.readyState!=='complete'){loader.hidden=false;const number=loader.querySelector('[data-loader-number]'),bar=loader.querySelector('[data-loader-progress]');const assets=[...document.images].filter(i=>i.loading!=='lazy');const progress=()=>{const complete=assets.filter(i=>i.complete).length;const value=Math.round(assets.length?complete/assets.length*100:100);number.innerHTML=`${value}<small>%</small>`;bar.style.width=`${value}%`;};assets.forEach(img=>{img.addEventListener('load',progress,{once:true});img.addEventListener('error',progress,{once:true});});let done=false;const finish=()=>{if(done)return;done=true;number.innerHTML='100<small>%</small>';bar.style.width='100%';if(active())loader.animate([{opacity:1},{opacity:0}],{duration:300}).finished.then(()=>{loader.hidden=true;}).catch(()=>{loader.hidden=true;});else loader.hidden=true;try{sessionStorage.setItem('portfolio-loaded','yes');}catch{}};progress();addEventListener('load',finish,{once:true});setTimeout(finish,1800);document.addEventListener('portfolio-motion',()=>{if(!active())finish();});}}
})();
