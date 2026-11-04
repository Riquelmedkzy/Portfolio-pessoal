/* Native animation APIs: progressive enhancement, no scroll hijacking. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precise = matchMedia('(hover: hover) and (pointer: fine)');
  const toggle = document.querySelector('[data-motion-toggle]');
  let paused = false;
  try { paused = localStorage.getItem('portfolio-motion') === 'paused'; } catch {}
  const active = () => !paused && !reduced.matches;
  const running = new Set();
  let stopParticles = () => {};
  function enter(el, delay = 0, title = false) {
    if (!active() || !el.animate) return;
    const frames = title
      ? [{ transform: 'translateY(28px)', clipPath: 'inset(0 0 75% 0)' }, { transform: 'translateY(0)', clipPath: 'inset(0)' }]
      : [{ opacity: .3, transform: 'translateY(26px)' }, { opacity: 1, transform: 'translateY(0)' }];
    const animation = el.animate(frames, { duration: title ? 1000 : 700, delay, easing: 'cubic-bezier(.16,1,.3,1)' });
    running.add(animation);
    animation.finished.then(() => running.delete(animation)).catch(() => running.delete(animation));
  }
  function update() {
    root.classList.toggle('motion-enabled', active());
    root.classList.toggle('motion-paused', !active());
    if (toggle) {
      toggle.textContent = active() ? 'Pausar movimento' : 'Ativar movimento';
      toggle.setAttribute('aria-label', active() ? 'Pausar animações' : 'Ativar animações');
      toggle.setAttribute('aria-pressed', String(!active()));
      toggle.disabled = reduced.matches;
      toggle.title = reduced.matches ? 'Movimento reduzido pela preferência do dispositivo' : '';
    }
    if (!active()) {
      running.forEach(a => a.finish());
      document.querySelectorAll('.device-composition,.portrait-motion').forEach(el => el.style.removeProperty('transform'));
    }
    document.dispatchEvent(new CustomEvent('portfolio-motion', { detail: { paused: !active() } }));
    stopParticles();
  }
  toggle?.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'on'); } catch {}
    update();
  });
  reduced.addEventListener('change', update);
  update();
  document.querySelectorAll('body:not(.home-page) .title-line').forEach((line, i) => enter(line, i * 130, true));
  const revealTargets = document.querySelectorAll('.section-heading,.project-item,.services>h2,.service-list article,.working>h2,.working li,.contact-strip,.case-body section,.about-layout>div,.contact-note,.page-heading');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        enter(entry.target, Math.min(i * 70, 140));
        observer.unobserve(entry.target);
      });
    }, { threshold: .08 });
    revealTargets.forEach(el => observer.observe(el));
  }
  document.querySelectorAll('.project-image').forEach(stage => {
    const surface = stage.querySelector('.device-composition');
    if (!surface) return;
    let frame = 0;
    stage.addEventListener('pointermove', event => {
      if (!active() || !precise.matches) return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        surface.style.transform = `perspective(1000px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) translateY(-4px)`;
        frame = 0;
      });
    });
    stage.addEventListener('pointerleave', () => { cancelAnimationFrame(frame); surface.style.removeProperty('transform'); });
  });
  const canvas = document.querySelector('.hero-particles');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  let width = 0, height = 0, raf = 0, last = 0, visible = true, points = [];
  let color = getComputedStyle(root).getPropertyValue('--accent').trim();
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = Array.from({ length: width < 700 ? 16 : 28 }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16 }));
  }
  function draw(time) {
    raf = 0;
    if (!active() || !visible || document.hidden) return;
    if (time - last > 33) {
      last = time;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color; ctx.strokeStyle = color;
      for (const p of points) {
        p.x = (p.x + p.vx + width) % width; p.y = (p.y + p.vy + height) % height;
        ctx.globalAlpha = .35; ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j], distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 125) { ctx.globalAlpha = (1 - distance / 125) * .16; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
    }
    raf = requestAnimationFrame(draw);
  }
  function playback() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (active() && visible && !document.hidden) raf = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, width, height);
  }
  stopParticles = playback;
  new ResizeObserver(resize).observe(canvas);
  new MutationObserver(() => { color = getComputedStyle(root).getPropertyValue('--accent').trim(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { color = getComputedStyle(root).getPropertyValue('--accent').trim(); });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; playback(); }).observe(canvas);
  document.addEventListener('visibilitychange', playback);
  resize(); playback();
})();
