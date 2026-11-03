import { animateStyle } from '../vendor/motion-one/10.18.0/animate-style.js';
import { inView } from '../vendor/motion-one/10.18.0/in-view.js';

const main = document.querySelector('.skills-main');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const routeScenes = [...document.querySelectorAll('.skills-route-scene')];
const sceneStates = routeScenes.map((scene) => ({
  scene,
  active: false,
  drawn: false,
  routes: [...scene.querySelectorAll('.skills-route')].map((path, index) => ({
    path,
    light: scene.querySelectorAll('.skills-route-light')[index],
    length: path.getTotalLength(),
    animation: null,
  })),
}));
const motionHandles = new Set();
const entryAnimations = new Set();
let motionObservers = [];
let animationFrame = 0;
let lastLightUpdate = 0;

function animate(element, property, keyframes, options, isRoute = false) {
  try {
    const animation = animateStyle(element, property, keyframes, options)();
    if (animation && typeof animation.pause === 'function') {
      motionHandles.add(animation);
      if (!isRoute) entryAnimations.add(animation);
      animation.finished.then(() => {
        motionHandles.delete(animation);
        entryAnimations.delete(animation);
      }).catch(() => {
        motionHandles.delete(animation);
        entryAnimations.delete(animation);
      });
    }
    return animation;
  } catch {
    return null;
  }
}

function drawScene(state) {
  if (state.drawn || reducedMotion.matches) return;
  state.drawn = true;

  state.routes.forEach((route, index) => {
    route.path.style.strokeDasharray = `${route.length}`;
    route.path.style.strokeDashoffset = `${route.length}`;
    route.animation = animate(route.path, 'strokeDashoffset', [route.length, 0], {
      duration: 1.45,
      delay: index * 0.12,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    }, true);
    if (!route.animation) route.path.style.strokeDashoffset = '0';
  });
}

function canAnimate() {
  return !document.hidden && !reducedMotion.matches;
}

function updateScenePlayback() {
  const canPlay = canAnimate();
  let hasActiveScene = false;

  entryAnimations.forEach((animation) => {
    if (canPlay && animation.playState === 'paused') animation.play();
    if (!canPlay && animation.playState === 'running') animation.pause();
  });

  sceneStates.forEach((state) => {
    const active = state.active && canPlay;
    state.scene.classList.toggle('is-active', active);
    if (active) hasActiveScene = true;

    state.routes.forEach((route) => {
      if (!route.animation || route.animation.playState === 'finished') return;
      if (active && route.animation.playState === 'paused') route.animation.play();
      if (!active && route.animation.playState === 'running') route.animation.pause();
    });
  });

  const ribbon = document.querySelector('.tech-ribbon');
  ribbon?.classList.toggle('is-in-view', Boolean(canPlay && ribbon.dataset.inView === 'true'));

  if (hasActiveScene && !animationFrame) {
    animationFrame = window.requestAnimationFrame(moveRouteLights);
  } else if (!hasActiveScene && animationFrame) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
}

function moveRouteLights(timestamp) {
  animationFrame = 0;
  if (!canAnimate() || !sceneStates.some((state) => state.active)) return;

  if (timestamp - lastLightUpdate >= 40) {
    sceneStates.forEach((state, sceneIndex) => {
      if (!state.active) return;
      state.routes.forEach((route, routeIndex) => {
        if (!route.light || !route.length) return;
        const cycle = 11000 + routeIndex * 1300;
        const phase = (timestamp / cycle + sceneIndex * 0.31 + routeIndex * 0.23) % 1;
        const point = route.path.getPointAtLength(route.length * phase);
        route.light.setAttribute('cx', point.x.toFixed(2));
        route.light.setAttribute('cy', point.y.toFixed(2));
      });
    });
    lastLightUpdate = timestamp;
  }

  animationFrame = window.requestAnimationFrame(moveRouteLights);
}

function stopMotionObservers() {
  motionObservers.forEach((stop) => stop());
  motionObservers = [];
}

function setMotionObservers() {
  stopMotionObservers();
  if (reducedMotion.matches) return;

  const hero = document.querySelector('.skills-hero');
  const title = document.querySelector('.skills-title');
  const intro = document.querySelector('.skills-intro-copy');
  const ribbonTitle = document.querySelector('.skills-ribbon-title');

  if (hero && title && intro) {
    motionObservers.push(inView(hero, () => {
      animate(title, 'opacity', [0, 1], { duration: 0.7, easing: 'ease-out' });
      animate(title, 'transform', ['translateY(18px)', 'translateY(0px)'], {
        duration: 0.7,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      });
      animate(intro, 'opacity', [0, 1], { duration: 0.55, delay: 0.16, easing: 'ease-out' });
      animate(intro, 'transform', ['translateY(12px)', 'translateY(0px)'], {
        duration: 0.55,
        delay: 0.16,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      });
    }, { amount: 0.1 }));
  }

  const sectionHeadings = [ribbonTitle, ...document.querySelectorAll('.skill-category-title')].filter(Boolean);
  if (sectionHeadings.length) {
    motionObservers.push(inView(sectionHeadings, (entry) => {
      const heading = entry.target;
      animate(heading, 'opacity', [0, 1], { duration: 0.55, easing: 'ease-out' });
      animate(heading, 'transform', ['translateY(12px)', 'translateY(0px)'], {
        duration: 0.55,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      });
    }, { margin: '0px 0px -8% 0px' }));
  }

  const cards = [...document.querySelectorAll('.skill-card')];
  if (cards.length) {
    motionObservers.push(inView(cards, (entry) => {
      const card = entry.target;
      const index = [...card.parentElement.children].indexOf(card);
      const delay = Math.min(index * 0.055, 0.22);
      animate(card, 'opacity', [0, 1], { duration: 0.62, delay, easing: 'ease-out' });
      animate(card, 'transform', ['translateY(15px)', 'translateY(0px)'], {
        duration: 0.62,
        delay,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      });
    }, { margin: '0px 0px -7% 0px' }));
  }
}

if (main && 'IntersectionObserver' in window) {
  main.classList.add('has-motion');

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const state = sceneStates.find((item) => item.scene === entry.target);
      if (!state) return;
      state.active = entry.isIntersecting;
      if (state.active) drawScene(state);
    });
    updateScenePlayback();
  }, { threshold: 0 });

  sceneStates.forEach((state) => sceneObserver.observe(state.scene));

  const ribbon = document.querySelector('.tech-ribbon');
  if (ribbon) {
    const ribbonObserver = new IntersectionObserver(([entry]) => {
      ribbon.dataset.inView = entry.isIntersecting ? 'true' : 'false';
      updateScenePlayback();
    }, { threshold: 0 });
    ribbonObserver.observe(ribbon);
  }

  setMotionObservers();
  document.addEventListener('visibilitychange', updateScenePlayback);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      stopMotionObservers();
      motionHandles.forEach((animation) => {
        try {
          if (animation.playState !== 'finished') animation.finish();
        } catch {
          animation.cancel();
        }
      });
      motionHandles.clear();
      entryAnimations.clear();
      sceneStates.forEach((state) => {
        state.routes.forEach((route) => {
          route.path.style.strokeDasharray = 'none';
          route.path.style.strokeDashoffset = '0';
          route.animation = null;
        });
      });
      updateScenePlayback();
      return;
    }

    sceneStates.forEach((state) => {
      state.routes.forEach((route) => {
        route.path.style.strokeDasharray = '';
        route.path.style.strokeDashoffset = '';
      });
    });
    setMotionObservers();
    updateScenePlayback();
  });
  updateScenePlayback();
}
