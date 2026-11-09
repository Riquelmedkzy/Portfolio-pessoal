document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('internal-ready');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactScreen = window.matchMedia('(max-width: 720px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const revealItems = document.querySelectorAll('[data-internal-page] .reveal');

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const detailButtons = [...document.querySelectorAll('[data-service-detail]')];
  const detailPanel = document.querySelector('.service-detail');
  const detailNumber = document.querySelector('[data-service-number]');
  const detailTitle = document.querySelector('[data-service-title]');
  const detailCopy = document.querySelector('[data-service-copy]');
  const detailOutput = document.querySelector('[data-service-output]');

  detailButtons.forEach((button) => {
    const activate = () => {
      detailButtons.forEach((entry) => {
        entry.setAttribute('aria-pressed', String(entry === button));
        entry.closest('.service-entry')?.classList.toggle('is-active', entry === button);
      });
      if (detailNumber) detailNumber.textContent = button.dataset.number || '';
      if (detailTitle) detailTitle.textContent = button.dataset.title || '';
      if (detailCopy) detailCopy.textContent = button.dataset.description || '';
      if (detailOutput) detailOutput.textContent = button.dataset.output || '';
      detailPanel?.classList.remove('is-switching');
      window.requestAnimationFrame(() => detailPanel?.classList.add('is-switching'));
    };
    button.addEventListener('click', activate);
    button.addEventListener('mouseenter', () => {
      if (!compactScreen.matches) activate();
    });
  });

  if (!reducedMotion.matches && !compactScreen.matches && finePointer.matches) {
    document.querySelectorAll('[data-person]').forEach((person) => {
      person.addEventListener('pointermove', (event) => {
        const rect = person.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        person.style.setProperty('--person-x', `${(x * 10).toFixed(2)}px`);
        person.style.setProperty('--person-y', `${(y * 7).toFixed(2)}px`);
      });
      person.addEventListener('pointerleave', () => {
        person.style.setProperty('--person-x', '0px');
        person.style.setProperty('--person-y', '0px');
      });
    });

    document.querySelectorAll('[data-tilt-surface]').forEach((surface) => {
      surface.addEventListener('pointermove', (event) => {
        const rect = surface.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        surface.style.setProperty('--work-tilt-x', `${(-y * 2.2).toFixed(2)}deg`);
        surface.style.setProperty('--work-tilt-y', `${(x * 3).toFixed(2)}deg`);
      });
      surface.addEventListener('pointerleave', () => {
        surface.style.setProperty('--work-tilt-x', '0deg');
        surface.style.setProperty('--work-tilt-y', '0deg');
      });
    });
  }

  const videoTrigger = document.querySelector('[data-video-trigger]');
  const videoDialog = document.querySelector('[data-video-dialog]');
  const videoStage = document.querySelector('[data-video-stage]');
  const videoClose = document.querySelector('[data-video-close]');
  let returnFocus = null;

  const unloadVideo = () => {
    if (videoStage) videoStage.innerHTML = '<p>O player será carregado quando a demonstração for aberta.</p>';
    document.body.classList.remove('has-modal');
  };

  const closeVideo = () => {
    if (!videoDialog?.open) return;
    unloadVideo();
    videoDialog.close();
  };

  if (videoTrigger && videoDialog && videoStage) {
    videoTrigger.addEventListener('click', () => {
      returnFocus = document.activeElement;
      videoStage.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/Q0rVdXMZ8_M?rel=0" title="Demonstração em vídeo da NexusFC" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
      videoDialog.showModal();
      document.body.classList.add('has-modal');
      videoClose?.focus();
    });
    videoClose?.addEventListener('click', closeVideo);
    videoDialog.addEventListener('click', (event) => {
      if (event.target === videoDialog) closeVideo();
    });
    videoDialog.addEventListener('close', () => {
      unloadVideo();
      returnFocus?.focus?.();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && videoDialog.open) closeVideo();
    });
  }

  const contactForm = document.querySelector('[data-contact-form]');
  const submitButton = document.querySelector('[data-submit-button]');
  contactForm?.addEventListener('submit', () => {
    if (!contactForm.checkValidity() || !submitButton) return;
    submitButton.setAttribute('aria-busy', 'true');
    submitButton.textContent = 'Enviando mensagem…';
  });

  document.querySelector('[data-form-notice]')?.focus({ preventScroll: true });
});
