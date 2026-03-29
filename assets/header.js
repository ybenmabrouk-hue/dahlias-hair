(function () {
  'use strict';

  const header = document.querySelector('[data-section-type="header"]');
  if (!header) return;

  const toggle = header.querySelector('.header-hamburger');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  function openNav() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-label', toggle.dataset.labelClose);
  }

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-label', toggle.dataset.labelOpen);
  }

  toggle.addEventListener('click', function () {
    if (nav.classList.contains('is-open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !header.contains(e.target)) {
      closeNav();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
      toggle.focus();
    }
  });

  // Close drawer when viewport widens past mobile breakpoint
  const mq = window.matchMedia('(min-width: 768px)');
  mq.addEventListener('change', function (e) {
    if (e.matches) closeNav();
  });
})();
