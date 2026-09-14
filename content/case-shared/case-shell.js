(() => {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    let queued = false;
    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 18);
      queued = false;
    };
    window.addEventListener("scroll", () => {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function initSmoothScroll() {
    if (reduced.matches || !window.Lenis || window.__caseLenis) return;
    const lenis = new window.Lenis({
      lerp: 0.095,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: false
    });
    window.__caseLenis = lenis;
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  function initHandoff() {
    const handoff = document.querySelector(".case-handoff");
    if (!handoff) return;
    if (reduced.matches || !("IntersectionObserver" in window)) {
      handoff.classList.add("revealed");
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      handoff.classList.toggle("revealed", entry.isIntersecting);
    }, { threshold: 0.62 });
    observer.observe(handoff);
  }

  function init() {
    initHeader();
    initSmoothScroll();
    initHandoff();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
