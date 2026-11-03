document.documentElement.classList.add('js-enabled');

const legacyRoutes = {
  '#sobre': './sobre.php',
  '#projetos': './projetos.php',
  '#processo': './habilidades.php',
  '#habilidades': './habilidades.php',
  '#contato': './contato.php',
};

function redirectLegacyHash() {
  const route = legacyRoutes[window.location.hash];
  if (document.body.dataset.page === 'inicio' && route) window.location.replace(route);
}

redirectLegacyHash();
window.addEventListener('pageshow', redirectLegacyHash);
window.addEventListener('hashchange', redirectLegacyHash);

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  navigation.classList.toggle('is-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});

window.matchMedia('(max-width: 700px)').addEventListener('change', (event) => {
  if (!event.matches) closeMenu();
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const reveals = [...document.querySelectorAll('.reveal')];

if ('IntersectionObserver' in window && !reducedMotion.matches && reveals.length) {
  document.documentElement.classList.add('js-motion');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  reveals.forEach((element) => revealObserver.observe(element));
}
