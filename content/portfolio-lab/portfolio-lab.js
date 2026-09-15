(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reducedMotion.matches) return;

  document.documentElement.style.scrollBehavior = 'auto';

  let targetY = window.scrollY;
  let currentY = window.scrollY;
  let frame = 0;
  let internalScroll = false;

  const clampTarget = () => {
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    targetY = Math.max(0, Math.min(targetY, maxY));
  };

  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  const settle = () => {
    const distance = targetY - currentY;

    if (Math.abs(distance) < 0.5) {
      currentY = targetY;
      internalScroll = true;
      window.scrollTo({ top: currentY, left: 0, behavior: 'instant' });
      internalScroll = false;
      frame = 0;
      return;
    }

    currentY += distance * 0.14;
    internalScroll = true;
    window.scrollTo({ top: currentY, left: 0, behavior: 'instant' });
    internalScroll = false;
    frame = requestAnimationFrame(settle);
  };

  const begin = () => {
    if (!frame) frame = requestAnimationFrame(settle);
  };

  const handleWheel = (event) => {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    event.preventDefault();
    targetY += event.deltaY;
    clampTarget();
    begin();
  };

  window.addEventListener('wheel', handleWheel, { passive: false });

  window.addEventListener('scroll', () => {
    if (internalScroll || frame) return;
    currentY = window.scrollY;
    targetY = currentY;
  }, { passive: true });

  window.addEventListener('resize', () => {
    clampTarget();
    currentY = window.scrollY;
  }, { passive: true });

  window.addEventListener('keydown', (event) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
      stop();
      currentY = window.scrollY;
      targetY = currentY;
    }
  });

  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) stop();
  });
})();
