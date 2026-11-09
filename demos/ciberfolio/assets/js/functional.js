document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-loading-form]').forEach((form) => {
    form.addEventListener('submit', () => {
      const button = form.querySelector('button[type="submit"]');
      if (!button) return;
      button.setAttribute('aria-busy', 'true');
      button.disabled = true;
      const label = button.querySelector('span');
      if (label) label.textContent = 'Processando…';
    });
  });

  document.querySelectorAll('form[data-confirm]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!window.confirm(form.dataset.confirm || 'Confirmar esta ação?')) event.preventDefault();
    });
  });

  const fileInput = document.querySelector('[data-profile-file]');
  const fileName = document.querySelector('[data-file-name]');
  const preview = document.querySelector('[data-profile-preview]');
  let previewUrl = null;
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      if (fileName) fileName.textContent = file.name;
      if (preview && file.type.startsWith('image/')) {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = URL.createObjectURL(file);
        preview.src = previewUrl;
      }
    });
  }
});
