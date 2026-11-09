document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.querySelector('#message-modal');
  if (!dialog) return;
  let trigger = null;

  const closeDialog = () => {
    dialog.close();
  };

  document.querySelectorAll('[data-message-open]').forEach((button) => {
    button.addEventListener('click', async () => {
      trigger = button;
      document.querySelector('#modal-id').textContent = `#${button.dataset.id}`;
      document.querySelector('#modal-name').textContent = button.dataset.name || '';
      document.querySelector('#modal-subject').textContent = button.dataset.subject || '';
      document.querySelector('#modal-message').textContent = button.dataset.message || '';
      dialog.showModal();
      document.body.classList.add('has-modal');

      const statusCell = button.closest('tr')?.querySelector('[data-status-cell]');
      const badge = statusCell?.querySelector('.status-badge--pendente');
      if (!badge) return;

      try {
        const response = await fetch(dialog.dataset.markReadUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content || ''
          },
          body: JSON.stringify({ id: button.dataset.id })
        });
        const data = await response.json();
        if (data.sucesso) {
          badge.textContent = 'Lida';
          badge.className = 'status-badge status-badge--lida';
        }
      } catch (_) {
        // A leitura continua disponível mesmo se o feedback de status falhar.
      }
    });
  });

  dialog.querySelector('[data-message-close]')?.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('has-modal');
    trigger?.focus();
  });
});
