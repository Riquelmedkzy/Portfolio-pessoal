/* Film-only media controls. Fancybox v4 is preferred; native dialog is the CDN fallback. */
(() => {
  'use strict';

  const galleryLinks = [...document.querySelectorAll('a[data-fancybox="gallery"], a[data-fancybox="suit"]')];
  const galleryGroups = new Map();
  galleryLinks.forEach(link => {
    const name = link.dataset.fancybox;
    galleryGroups.set(name, [...(galleryGroups.get(name) || []), link]);
  });

  let fancyboxReady = false;
  if (window.Fancybox && typeof window.Fancybox.bind === 'function') {
    try {
      window.Fancybox.bind('[data-fancybox="trailer"]', {
        dragToClose: false,
        placeFocusBack: true,
        trapFocus: true,
        Toolbar: { display: ['close'] },
      });
      window.Fancybox.bind('[data-fancybox="gallery"], [data-fancybox="suit"]', {
        placeFocusBack: true,
        trapFocus: true,
        Toolbar: { display: ['close'] },
        Thumbs: { autoStart: true, type: 'classic' },
      });
      fancyboxReady = true;
    } catch (error) {
      console.warn('Fancybox indisponível; ativando galeria acessível de contingência.', error);
    }
  }

  if (!fancyboxReady && galleryLinks.length) {
    const dialog = document.createElement('dialog');
    dialog.className = 'film-lightbox';
    dialog.setAttribute('aria-label', 'Galeria de imagens');

    const top = document.createElement('div');
    top.className = 'film-lightbox__top';
    const counter = document.createElement('span');
    counter.className = 'film-lightbox__counter';
    counter.setAttribute('aria-live', 'polite');
    const close = document.createElement('button');
    close.className = 'film-lightbox__button';
    close.type = 'button';
    close.setAttribute('aria-label', 'Fechar imagem ampliada');
    close.textContent = '×';
    top.append(counter, close);

    const imageWrap = document.createElement('div');
    imageWrap.className = 'film-lightbox__image-wrap';
    const image = document.createElement('img');
    image.className = 'film-lightbox__image';
    image.alt = '';
    imageWrap.append(image);

    const bottom = document.createElement('div');
    bottom.className = 'film-lightbox__bottom';
    const previous = document.createElement('button');
    previous.className = 'film-lightbox__button';
    previous.type = 'button';
    previous.setAttribute('aria-label', 'Fotografia anterior');
    previous.textContent = '←';
    const caption = document.createElement('p');
    caption.className = 'film-lightbox__caption';
    const next = document.createElement('button');
    next.className = 'film-lightbox__button';
    next.type = 'button';
    next.setAttribute('aria-label', 'Próxima fotografia');
    next.textContent = '→';
    bottom.append(previous, caption, next);
    dialog.append(top, imageWrap, bottom);
    document.body.append(dialog);

    let activeItems = [];
    let activeIndex = 0;
    let returnFocus = null;

    const render = () => {
      const current = activeItems[activeIndex];
      if (!current) return;
      image.src = current.href;
      image.alt = current.querySelector('img')?.alt || current.dataset.caption || 'Fotografia do filme';
      caption.textContent = current.dataset.caption || '';
      counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(activeItems.length).padStart(2, '0')}`;
      previous.hidden = activeItems.length < 2;
      next.hidden = activeItems.length < 2;
    };
    const closeDialog = () => dialog.close();
    const move = step => {
      activeIndex = (activeIndex + step + activeItems.length) % activeItems.length;
      render();
    };

    galleryLinks.forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      activeItems = galleryGroups.get(link.dataset.fancybox) || [link];
      activeIndex = activeItems.indexOf(link);
      returnFocus = link;
      render();
      dialog.showModal();
      close.focus();
    }));
    close.addEventListener('click', closeDialog);
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    dialog.addEventListener('click', event => {
      if (event.target === dialog) closeDialog();
    });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    });
    dialog.addEventListener('close', () => {
      image.removeAttribute('src');
      returnFocus?.focus();
    });
  }

  if (!fancyboxReady) {
    const trailerLink = document.querySelector('[data-fancybox="trailer"]');
    if (trailerLink) {
      const dialog = document.createElement('dialog');
      dialog.className = 'film-trailer-dialog';
      dialog.setAttribute('aria-label', 'Trailer do filme');
      const top = document.createElement('div');
      top.className = 'film-trailer-dialog__top';
      const close = document.createElement('button');
      close.className = 'film-lightbox__button';
      close.type = 'button';
      close.setAttribute('aria-label', 'Fechar trailer');
      close.textContent = '×';
      top.append(close);
      const iframe = document.createElement('iframe');
      iframe.className = 'film-trailer-dialog__player';
      iframe.title = `Trailer: ${trailerLink.getAttribute('aria-label') || 'filme'}`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      const fallback = document.createElement('p');
      fallback.className = 'film-trailer-dialog__fallback';
      fallback.append(document.createTextNode('Se este vídeo não puder ser incorporado, '));
      const external = document.createElement('a');
      external.href = trailerLink.href.replace(/\/embed\/([^?&]+).*/, '/watch?v=$1');
      external.target = '_blank';
      external.rel = 'noopener noreferrer';
      external.textContent = 'assista no YouTube';
      fallback.append(external, document.createTextNode('.'));
      dialog.append(top, iframe, fallback);
      document.body.append(dialog);

      let returnFocus = null;
      trailerLink.addEventListener('click', event => {
        event.preventDefault();
        returnFocus = trailerLink;
        iframe.src = trailerLink.href;
        dialog.showModal();
        close.focus();
      });
      close.addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener('close', () => {
        iframe.src = 'about:blank';
        iframe.removeAttribute('src');
        returnFocus?.focus();
      });
    }
  }

  const revealTargets = document.querySelectorAll('.film-overview__body, .gallery-frame, .s-gallery-card, .related-card');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('film-is-visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    revealTargets.forEach((element, index) => {
      element.style.setProperty('--film-reveal-delay', `${Math.min(index % 6, 5) * 45}ms`);
      element.classList.add('film-reveal');
      observer.observe(element);
    });
  }
})();
