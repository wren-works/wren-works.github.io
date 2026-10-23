(() => {
  'use strict';
  const button = document.querySelector('.pet-poke');
  const desktop = document.querySelector('#desktop');
  if (!button || !desktop) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;
  let count = 0;
  function reset() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    button.classList.remove('is-poked');
    button.style.transform = '';
  }
  function syncPose() {
    reset();
    button.querySelectorAll('[data-pose]').forEach(image => {
      image.hidden = image.dataset.pose !== desktop.dataset.state;
    });
  }
  function poke() {
    reset();
    button.dataset.pokes = String(++count);
    if (motion.matches) return;
    button.classList.add('is-poked');
    // Ported from PetSurface.cs: ReactionSeconds=.24; bottom-anchored squash
    // ScaleAt(1+.035*s,1-.085*s); TranslateY(-2*sin((1-s)*2*PI)*s).
    const start = performance.now();
    function render(now) {
      const strength = Math.max(0, 1 - (now - start) / 240);
      if (!strength) { reset(); return; }
      const y = -2 * Math.sin((1 - strength) * Math.PI * 2) * strength;
      button.style.transform = `translateY(${y}px) scale(${1 + .035 * strength},${1 - .085 * strength})`;
      frame = requestAnimationFrame(render);
    }
    render(start);
  }
  button.addEventListener('click', poke);
  new MutationObserver(syncPose).observe(desktop, { attributes: true, attributeFilter: ['data-state'] });
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  motion.addEventListener('change', reset);
  syncPose();
})();
