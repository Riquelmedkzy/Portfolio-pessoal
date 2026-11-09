document.addEventListener('DOMContentLoaded', () => {
  const transition = document.querySelector('[data-page-transition]');
  requestAnimationFrame(() => document.body.classList.add('page-ready'));

  const header = document.querySelector('[data-site-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const panel = document.querySelector('[data-nav-panel]');

  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    if (restoreFocus) toggle.focus();
  };

  const openMenu = () => {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    requestAnimationFrame(() => panel.querySelector('a, summary, button')?.focus());
  };

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu({ restoreFocus: true });
      else openMenu();
    });

    panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeMenu({ restoreFocus: true });
      return;
    }

    if (event.key !== 'Tab' || !panel || !document.body.classList.contains('nav-open')) return;
    const focusable = [...panel.querySelectorAll('a[href], summary, button:not([disabled])')]
      .filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
  };

  updateHeader();
  let scrollFrame = null;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null;
      updateHeader();
    });
  }, { passive: true });

  document.querySelectorAll('[data-confirm-logout]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!window.confirm('Deseja sair da sua conta?')) event.preventDefault();
    });
  });

  document.querySelectorAll('[data-pending-link]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });

  const publicRoutes = new Set(['home', 'sobre', 'servico', 'portfolio', 'contact', 'auth_login', 'register', 'passwordReset_forgot', 'passwordReset_reset']);
  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!transition || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
      const target = new URL(link.href, window.location.href);
      if (target.origin !== window.location.origin || target.hash || target.href === window.location.href) return;
      const currentRoute = new URL(window.location.href).searchParams.get('route') || 'home';
      const targetRoute = target.searchParams.get('route') || 'home';
      if (!publicRoutes.has(currentRoute) || !publicRoutes.has(targetRoute) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      event.preventDefault();
      document.body.classList.add('page-leaving');
      window.setTimeout(() => { window.location.href = target.href; }, 260);
    });
  });
});

window.addEventListener('pageshow', () => document.body.classList.remove('page-leaving'));
