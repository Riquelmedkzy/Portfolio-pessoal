document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('home-ready');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactScreen = window.matchMedia('(max-width: 720px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -7% 0px' });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const serviceItems = document.querySelectorAll('[data-service]');
  const serviceWord = document.querySelector('[data-service-word]');
  const serviceDescription = document.querySelector('[data-service-description]');

  serviceItems.forEach((item) => {
    const activate = () => {
      serviceItems.forEach((entry) => entry.classList.remove('is-active'));
      item.classList.add('is-active');
      if (serviceWord) serviceWord.textContent = item.dataset.service || '';
      if (serviceDescription) serviceDescription.textContent = item.dataset.description || '';
    };

    item.addEventListener('mouseenter', activate);
    item.addEventListener('focusin', activate);
  });

  if (!reducedMotion.matches && !compactScreen.matches && finePointer.matches) {
    document.querySelectorAll('[data-project-card]').forEach((card) => {
      const visual = card.querySelector('.project-visual');
      if (!visual) return;

      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        visual.style.setProperty('--tilt-x', `${(-y * 2.5).toFixed(2)}deg`);
        visual.style.setProperty('--tilt-y', `${(x * 3.5).toFixed(2)}deg`);
      });

      card.addEventListener('pointerleave', () => {
        visual.style.setProperty('--tilt-x', '0deg');
        visual.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  const canvas = document.querySelector('[data-nexus-canvas]');
  if (!canvas || !canvas.getContext) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  let width = 0;
  let height = 0;
  let nodes = [];
  let animationFrame = null;
  let pointer = { x: 0, y: 0, active: false };
  let tabVisible = document.visibilityState === 'visible';
  let canvasVisible = true;
  const labelBindings = [...document.querySelectorAll('[data-network-label]')].map((label, index) => ({
    label,
    nodeIndex: [2, 14, 31][index] || index,
  }));

  const palette = {
    copper: [216, 95, 42],
    white: [243, 239, 232],
    muted: [119, 113, 105],
  };

  const makeNode = (index, total) => {
    const angle = (index / total) * Math.PI * 2 + Math.random() * 0.8;
    const radius = 0.14 + Math.random() * 0.38;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.72,
      z: Math.random() * 1.4 - 0.7,
      vx: (Math.random() - 0.5) * 0.00022,
      vy: (Math.random() - 0.5) * 0.00018,
      vz: (Math.random() - 0.5) * 0.00045,
      copper: index % 5 === 0,
      size: 0.8 + Math.random() * 1.8,
    };
  };

  const project = (node) => {
    const depth = 1.55 / (1.7 + node.z);
    const originX = width * (compactScreen.matches ? 0.58 : 0.72);
    const originY = height * 0.47;
    const spread = Math.min(width, height) * (compactScreen.matches ? 0.78 : 1.06);
    const influenceX = pointer.active ? (pointer.x - width / 2) * 0.018 * depth : 0;
    const influenceY = pointer.active ? (pointer.y - height / 2) * 0.018 * depth : 0;

    return {
      x: originX + node.x * spread * depth + influenceX,
      y: originY + node.y * spread * depth + influenceY,
      depth,
    };
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = compactScreen.matches ? 20 : 42;
    nodes = Array.from({ length: count }, (_, index) => makeNode(index, count));
    labelBindings.forEach(({ nodeIndex }) => {
      const anchor = nodes[nodeIndex % nodes.length];
      anchor.copper = true;
      anchor.size = 2.7;
    });
    draw(true);
  };

  const update = () => {
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;

      if (Math.abs(node.x) > 0.64) node.vx *= -1;
      if (Math.abs(node.y) > 0.48) node.vy *= -1;
      if (Math.abs(node.z) > 0.72) node.vz *= -1;
    });
  };

  function draw(staticFrame = false) {
    context.clearRect(0, 0, width, height);
    const projected = nodes.map(project);
    const maxDistance = compactScreen.matches ? 145 : 205;

    projected.forEach((point, index) => {
      for (let otherIndex = index + 1; otherIndex < projected.length; otherIndex += 1) {
        const other = projected[otherIndex];
        const dx = point.x - other.x;
        const dy = point.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance > maxDistance) continue;

        const alpha = Math.max(0, (1 - distance / maxDistance) * 0.3);
        const color = nodes[index].copper || nodes[otherIndex].copper ? palette.copper : palette.muted;
        context.strokeStyle = `rgba(${color.join(',')},${alpha})`;
        context.lineWidth = 0.65;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    });

    projected.forEach((point, index) => {
      const node = nodes[index];
      const color = node.copper ? palette.copper : (index % 4 === 0 ? palette.white : palette.muted);
      const radius = node.size * point.depth;
      context.fillStyle = `rgba(${color.join(',')},${0.48 + point.depth * 0.34})`;
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, Math.PI * 2);
      context.fill();
    });

    if (!compactScreen.matches) {
      const canvasRect = canvas.getBoundingClientRect();
      labelBindings.forEach(({ label, nodeIndex }) => {
        const source = projected[nodeIndex % projected.length];
        const labelRect = label.getBoundingClientRect();
        const targetX = labelRect.left - canvasRect.left - 7;
        const targetY = labelRect.top - canvasRect.top + labelRect.height / 2;

        context.save();
        context.setLineDash([3, 6]);
        context.strokeStyle = 'rgba(216,95,42,0.7)';
        context.lineWidth = 0.8;
        context.beginPath();
        context.moveTo(source.x, source.y);
        context.lineTo(targetX, targetY);
        context.stroke();
        context.setLineDash([]);
        context.fillStyle = 'rgba(243,239,232,0.95)';
        context.beginPath();
        context.arc(targetX, targetY, 2.2, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });
    }

    if (!staticFrame && tabVisible && canvasVisible && !reducedMotion.matches && !document.documentElement.classList.contains('demo-motion-off')) {
      update();
      animationFrame = window.requestAnimationFrame(() => draw(false));
    }
  }

  const stop = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = null;
  };

  const start = () => {
    stop();
    if (reducedMotion.matches || !tabVisible || !canvasVisible || document.documentElement.classList.contains('demo-motion-off')) {
      draw(true);
      return;
    }
    draw(false);
  };

  document.addEventListener('presentation:motion', event => {if(event.detail.paused)stop();else start();});
  const hero = canvas.closest('.nexus-hero');
  hero?.addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX, y: event.clientY, active: true };
  });
  hero?.addEventListener('pointerleave', () => { pointer.active = false; });

  document.addEventListener('visibilitychange', () => {
    tabVisible = document.visibilityState === 'visible';
    if (tabVisible) start();
    else stop();
  });

  if ('IntersectionObserver' in window && hero) {
    const canvasObserver = new IntersectionObserver(([entry]) => {
      canvasVisible = entry.isIntersecting;
      if (canvasVisible) start();
      else stop();
    }, { rootMargin: '120px 0px', threshold: 0 });
    canvasObserver.observe(hero);
  }

  let resizeFrame = null;
  const scheduleResize = () => {
    if (resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = null;
      resize();
      start();
    });
  };

  window.addEventListener('resize', scheduleResize, { passive: true });
  reducedMotion.addEventListener?.('change', start);
  resize();
  start();
});
