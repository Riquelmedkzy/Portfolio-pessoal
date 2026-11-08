// Progressive entrance: all content remains visible without JavaScript.
(() => {
 if (!document.body.classList.contains('home-page')) return;
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const root = document.documentElement;
 if (reduced.matches || root.classList.contains('motion-paused')) return;
 const animations=[];
 const play=(selector,frames,delay,duration)=>document.querySelectorAll(selector).forEach(el=>animations.push(el.animate(frames,{duration,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})));
 play('.site-header',[{opacity:0,transform:'translateY(-18px)'},{opacity:1,transform:'none'}],0,750);
 document.querySelectorAll('.title-line').forEach((el,i)=>animations.push(el.animate([{opacity:0,transform:'translateY(55px) rotateX(-18deg)',filter:'blur(8px)'},{opacity:1,transform:'none',filter:'blur(0)'}],{duration:1100,delay:180+i*180,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})));
 play('.orbit-portrait',[{opacity:0,transform:'translateX(35px) scale(.94)',filter:'blur(12px)'},{opacity:1,transform:'none',filter:'blur(0)'}],380,1500);
 play('.hero-intro',[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}],650,900);
 play('.hero .actions,.hero .availability',[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],850,850);
 const finish=()=>animations.forEach(a=>a.finish());
 document.addEventListener('portfolio-motion',e=>{if(e.detail.paused)finish()});reduced.addEventListener('change',()=>{if(reduced.matches)finish()});
})();
