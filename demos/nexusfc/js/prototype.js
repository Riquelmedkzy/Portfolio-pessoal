'use strict';

(function initializeTheme() {
    const storageKey = 'noticias-futebol-theme';
    let savedTheme = null;

    try {
        savedTheme = window.localStorage.getItem(storageKey);
    } catch (error) {
        savedTheme = null;
    }

    const theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');
})();

document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'noticias-futebol-theme';
    const themeToggle = document.querySelector('.theme-toggle');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('#mobile-menu');

    const updateThemeControl = () => {
        const isDark = document.documentElement.dataset.theme !== 'light';
        const label = isDark ? 'Ativar tema claro' : 'Ativar tema escuro';

        if (themeToggle) {
            themeToggle.setAttribute('aria-label', label);
            themeToggle.setAttribute('title', label);
        }

        if (themeColor) {
            themeColor.setAttribute('content', isDark ? '#080B0D' : '#F4F6F5');
        }
    };

    updateThemeControl();

    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme;
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.add('theme-transition');
        document.documentElement.dataset.theme = nextTheme;

        try {
            window.localStorage.setItem(storageKey, nextTheme);
        } catch (error) {
            // O alternador continua funcionando durante a sessão sem armazenamento local.
        }

        updateThemeControl();
        window.setTimeout(() => document.body.classList.remove('theme-transition'), 260);
    });

    if (menuToggle && mobileMenu) {
        menuToggle.hidden = false;

        const closeMenu = () => {
            menuToggle.setAttribute('aria-label', 'Abrir menu');
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('is-open');
        };

        menuToggle.addEventListener('click', () => {
            const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
            menuToggle.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
            menuToggle.setAttribute('aria-expanded', String(willOpen));
            mobileMenu.classList.toggle('is-open', willOpen);
        });

        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                closeMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 991) {
                closeMenu();
            }
        });
    }
});
