(function () {
  'use strict';

  var bar = document.querySelector('[data-section-type="sticky-cart-bar"]');
  if (!bar) return;

  // On mobile the bar is always visible via CSS; skip JS observer
  var mq = window.matchMedia('(max-width: 767px)');
  if (mq.matches) return;

  // Show bar after hero scrolls out of view
  var hero = document.querySelector('[data-section-type="hero"]');

  function handleScroll() {
    if (!hero) {
      // Fallback: show after 400px scroll
      if (window.scrollY > 400) {
        bar.classList.add('is-visible');
      } else {
        bar.classList.remove('is-visible');
      }
      return;
    }

    var heroBottom = hero.getBoundingClientRect().bottom;
    if (heroBottom < 0) {
      bar.classList.add('is-visible');
    } else {
      bar.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Re-evaluate if viewport resizes past breakpoint
  mq.addEventListener('change', function (e) {
    if (e.matches) {
      window.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
  });
})();
