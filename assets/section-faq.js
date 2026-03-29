(function () {
  'use strict';

  document.querySelectorAll('[data-section-type="faq"]').forEach(function (section) {
    section.querySelectorAll('[data-faq-trigger]').forEach(function (trigger) {
      var answerId = trigger.getAttribute('aria-controls');
      var answer = document.getElementById(answerId);
      if (!answer) return;

      // Initialise: remove the HTML hidden attr so CSS transition works,
      // but keep max-height:0 via class absence.
      answer.removeAttribute('hidden');
      answer.style.maxHeight = '0';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'max-height 0.38s ease, visibility 0.38s';
      answer.style.visibility = 'hidden';

      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Close all others in this section
        section.querySelectorAll('[data-faq-trigger]').forEach(function (t) {
          if (t === trigger) return;
          var a = document.getElementById(t.getAttribute('aria-controls'));
          t.setAttribute('aria-expanded', 'false');
          if (a) {
            a.style.maxHeight = '0';
            a.style.visibility = 'hidden';
          }
        });

        // Toggle this one
        trigger.setAttribute('aria-expanded', String(!isOpen));
        if (!isOpen) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.visibility = 'visible';
        } else {
          answer.style.maxHeight = '0';
          answer.style.visibility = 'hidden';
        }
      });
    });
  });
})();
