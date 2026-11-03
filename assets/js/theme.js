try { const choice = localStorage.getItem('portfolio-theme'); if (choice === 'dark' || choice === 'light') document.documentElement.dataset.theme = choice; } catch {}
document.documentElement.classList.add('js');
