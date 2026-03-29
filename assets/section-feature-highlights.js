(function () {
  'use strict';

  const stops = document.querySelectorAll('[data-section-type="feature-highlights"] .features__stop');
  if (!stops.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  stops.forEach(function (stop) {
    observer.observe(stop);
  });
})();
