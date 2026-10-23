/* Only portfolio-shell anchors; v2 app retains progress and all demo state. */
(() => {
  'use strict';
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', event => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target || !window.__caseLenis) return;
      event.preventDefault();
      const clearance = innerWidth <= 760 ? 84 : 104;
      const y = target.getBoundingClientRect().top + scrollY - clearance;
      window.__caseLenis.scrollTo(a.getAttribute('href') === '#top' ? 0 : y);
      history.pushState(null, '', a.getAttribute('href'));
      if (a.classList.contains('skip')) { target.setAttribute('tabindex', '-1'); target.focus({preventScroll:true}); }
    });
  });
})();
