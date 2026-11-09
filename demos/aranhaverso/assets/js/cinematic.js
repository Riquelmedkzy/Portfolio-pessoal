/* ARANHAVERSO — shared navigation, universe selection, catalog and media */
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.site-nav');

  const closeMenu = () => {
    if (!toggle || !nav) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
    document.addEventListener('click', event => {
      if (nav.classList.contains('is-open') && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  const selectors = Array.from(document.querySelectorAll('.universe-selector'));
  const slides = Array.from(document.querySelectorAll('.universe-slide'));
  const selectUniverse = slug => {
    selectors.forEach(button => {
      const selected = button.dataset.universe === slug;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    slides.forEach(slide => {
      const selected = slide.dataset.slide === slug;
      slide.classList.toggle('is-active', selected);
      slide.setAttribute('aria-hidden', String(!selected));
      slide.querySelectorAll('a').forEach(link => { link.tabIndex = selected ? 0 : -1; });
    });
  };

  selectors.forEach(button => button.addEventListener('click', () => selectUniverse(button.dataset.universe)));
  if (selectors.length) {
    selectUniverse(selectors.find(button => button.classList.contains('is-active'))?.dataset.universe ?? selectors[0].dataset.universe);
    document.querySelector('.universe-switcher')?.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const index = selectors.indexOf(document.activeElement);
      if (index < 0) return;
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      const next = selectors[(index + step + selectors.length) % selectors.length];
      next.focus();
      selectUniverse(next.dataset.universe);
    });
  }

  const hero = document.querySelector('.multiverse-hero');
  if (hero && !reducedMotion.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let frame = 0;
    hero.addEventListener('pointermove', event => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        hero.style.setProperty('--pointer-x', ((event.clientX - bounds.left) / bounds.width - 0.5).toFixed(2));
        hero.style.setProperty('--pointer-y', ((event.clientY - bounds.top) / bounds.height - 0.5).toFixed(2));
        frame = 0;
      });
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--pointer-x', '0');
      hero.style.setProperty('--pointer-y', '0');
    }, { passive: true });
  }

  const filters = Array.from(document.querySelectorAll('.film-filter'));
  const cards = Array.from(document.querySelectorAll('.movie-tile'));
  const resultStatus = document.querySelector('#filter-results');
  filters.forEach(button => button.addEventListener('click', () => {
    const slug = button.dataset.filter;
    filters.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('is-active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    let visibleCount = 0;
    cards.forEach(card => {
      const visible = slug === 'all' || card.dataset.actor === slug;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (resultStatus) resultStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'filme exibido' : 'filmes exibidos'}.`;
  }));

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const catalogObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-pending');
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    cards.forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
      card.classList.add('is-pending');
      catalogObserver.observe(card);
    });
  }

})();
