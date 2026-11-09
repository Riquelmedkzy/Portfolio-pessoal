/* Interações da página Universos; sem dependências externas. */
(() => {
  const page = document.querySelector('[data-universes-page]');
  if (!page) return;

  const selectors = Array.from(page.querySelectorAll('[data-universe-select]'));
  const stories = Array.from(page.querySelectorAll('[data-universe-story]'));
  const relatedFilms = Array.from(page.querySelectorAll('[data-related-films]'));
  const status = document.querySelector('#universe-selection-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const scrollTo = (element) => {
    if (!element) return;
    element.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  };

  const selectUniverse = (slug, shouldScroll = true) => {
    const activeButton = selectors.find(button => button.dataset.universeSelect === slug);
    if (!activeButton) return;
    page.dataset.activeUniverse = slug;
    selectors.forEach(button => {
      const selected = button === activeButton;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    stories.forEach(story => { story.hidden = story.dataset.universeStory !== slug; });
    relatedFilms.forEach(section => { section.hidden = section.dataset.relatedFilms !== slug; });
    if (status) status.textContent = `Universo de ${activeButton.querySelector('.universe-panel__actor')?.textContent.replace('Interpretado por ', '') ?? 'Peter Parker'} selecionado.`;
    if (shouldScroll) scrollTo(document.querySelector(`#story-${CSS.escape(slug)}`));
  };

  selectors.forEach((button, index) => {
    button.addEventListener('click', () => selectUniverse(button.dataset.universeSelect));
    button.addEventListener('keydown', event => {
      const forward = ['ArrowRight', 'ArrowDown'].includes(event.key);
      const backward = ['ArrowLeft', 'ArrowUp'].includes(event.key);
      if (!forward && !backward) return;
      event.preventDefault();
      const nextIndex = (index + (forward ? 1 : selectors.length - 1)) % selectors.length;
      selectors[nextIndex].focus();
      selectUniverse(selectors[nextIndex].dataset.universeSelect, false);
    });
  });

  document.querySelectorAll('[data-return-selection]').forEach(button => button.addEventListener('click', () => {
    const current = selectors.find(item => item.dataset.universeSelect === page.dataset.activeUniverse);
    scrollTo(document.querySelector('#universes-selector'));
    window.setTimeout(() => current?.focus({ preventScroll: true }), reducedMotion.matches ? 0 : 350);
  }));

  const floatingReturn = document.querySelector('.story-switch-floating');
  if (floatingReturn && 'IntersectionObserver' in window) {
    const introObserver = new IntersectionObserver(([entry]) => {
      floatingReturn.classList.toggle('is-away', !entry.isIntersecting);
    }, { threshold: 0.08 });
    introObserver.observe(document.querySelector('#universes-selector'));
  } else if (floatingReturn) {
    floatingReturn.classList.add('is-away');
  }

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-pending');
        entry.target.classList.add('is-visible');
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
    page.querySelectorAll('[data-story-reveal]').forEach(element => {
      element.classList.add('is-pending');
      observer.observe(element);
    });
  }

  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const chapterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const image = entry.target.querySelector('[data-parallax]');
        if (image) image.style.setProperty('--story-shift', `${Math.max(-8, Math.min(8, (0.5 - entry.intersectionRatio) * 12)).toFixed(1)}px`);
      });
    }, { threshold: [0, 0.5, 1] });
    stories.forEach(story => story.querySelectorAll('.story-chapter__image-wrap').forEach(item => chapterObserver.observe(item)));
  }

  if (page.dataset.activeUniverse) selectUniverse(page.dataset.activeUniverse, false);
})();
