/* Progressive motion. Content is visible even if animations cannot run. */
(() => {
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const controls=[...document.querySelectorAll('[data-motion-toggle],[data-pause-motion]')];
 let paused=false;
 try{paused=localStorage.getItem('portfolio-motion')==='paused';}catch{}
 const active=()=>!paused&&!reduced.matches;
 const animations=new Set();
 function update(){
  root.classList.toggle('motion-enabled',active());root.classList.toggle('motion-paused',!active());
  controls.forEach(button=>{const text=active()?'Pausar animações':'Retomar animações';button.setAttribute('aria-pressed',String(!active()));button.setAttribute('aria-label',text);button.title=reduced.matches?'Movimento reduzido pela preferência do dispositivo':text;button.disabled=reduced.matches;if(button.hasAttribute('data-pause-motion'))button.textContent=text;});
  if(!active())animations.forEach(a=>{try{a.finish();}catch{a.cancel();}});
  document.dispatchEvent(new CustomEvent('portfolio-motion',{detail:{paused:!active()}}));
 }
 controls.forEach(button=>button.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('portfolio-motion',paused?'paused':'on');}catch{}update();}));
 reduced.addEventListener('change',update);update();
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).forEach((entry,i)=>{observer.unobserve(entry.target);if(!active()||!entry.target.animate)return;const a=entry.target.animate([{opacity:.15,filter:'blur(5px)',transform:'translateY(22px)'},{opacity:1,filter:'blur(0)',transform:'none'}],{duration:750,delay:Math.min(i*85,255),easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});animations.add(a);a.finished.finally(()=>animations.delete(a)).catch(()=>{});});},{threshold:.06});document.querySelectorAll('.project-item,.page-heading,.service-list article,.working li,.contact-strip,.case-body section,.about-intro,.about-bio,.journey-items article,.portfolio-facts>a,.contact-form,.contact-note').forEach(el=>observer.observe(el));}
 document.querySelectorAll('.project-image').forEach(stage=>{const surface=stage.querySelector('.device-composition');if(!surface)return;let frame=0;stage.addEventListener('pointermove',event=>{if(!active()||!fine.matches)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const r=stage.getBoundingClientRect();surface.style.transform=`perspective(1000px) rotateX(${-(event.clientY-r.top-r.height/2)/r.height*5}deg) rotateY(${(event.clientX-r.left-r.width/2)/r.width*6}deg)`;});});const reset=()=>{cancelAnimationFrame(frame);surface.style.removeProperty('transform');};stage.addEventListener('pointerleave',reset);document.addEventListener('portfolio-motion',reset);});
 const canvas=document.querySelector('.ambient-particles'),ctx=canvas?.getContext('2d');if(!ctx)return;
 let width=0,height=0,raf=0,last=0,points=[],shoot=0;
 function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);points=Array.from({length:width<600?17:36},()=>({x:Math.random()*width,y:Math.random()*height,r:.4+Math.random()*.8,vy:.06+Math.random()*.12}));}
 function draw(time){raf=0;if(!active()||document.hidden)return;if(time-last>33){const dt=Math.min(time-last,70)/33;last=time;ctx.clearRect(0,0,width,height);ctx.fillStyle=getComputedStyle(root).getPropertyValue('--accent').trim();points.forEach(p=>{p.y=(p.y+p.vy*dt)%height;ctx.globalAlpha=.2+p.r*.25;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});const cycle=time%8000;if(cycle<1100){shoot=cycle/1100;const x=width*.72+shoot*180,y=height*.12+shoot*160;ctx.globalAlpha=Math.sin(shoot*Math.PI)*.35;ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-50,y-44);ctx.stroke();}ctx.globalAlpha=1;}raf=requestAnimationFrame(draw);}
 function playback(){cancelAnimationFrame(raf);raf=0;if(active()&&!document.hidden){last=performance.now();raf=requestAnimationFrame(draw);}else ctx.clearRect(0,0,width,height);}
 addEventListener('resize',resize);document.addEventListener('visibilitychange',playback);document.addEventListener('portfolio-motion',playback);resize();playback();
})();
