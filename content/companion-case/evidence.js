(() => {
  'use strict';
  const dialog = document.querySelector('.media-dialog');
  const image = dialog.querySelector('img');
  document.querySelectorAll('.media-zoom').forEach(button => {
    button.addEventListener('click', () => {
      const source = button.querySelector('img');
      image.src = source.src;
      image.alt = source.alt;
      dialog.querySelector('p').textContent = source.alt;
      window.__caseLenis?.stop();
      dialog.showModal();
    });
  });
  dialog.querySelector('[data-close-media]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => window.__caseLenis?.start());
})();
