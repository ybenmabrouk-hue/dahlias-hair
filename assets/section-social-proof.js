(function () {
  'use strict';

  // UGC row: drag-to-scroll on desktop
  const ugcRow = document.querySelector('.social-proof__ugc');
  if (!ugcRow) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  ugcRow.addEventListener('mousedown', function (e) {
    isDown = true;
    ugcRow.style.cursor = 'grabbing';
    startX = e.pageX - ugcRow.offsetLeft;
    scrollLeft = ugcRow.scrollLeft;
  });

  ugcRow.addEventListener('mouseleave', function () {
    isDown = false;
    ugcRow.style.cursor = '';
  });

  ugcRow.addEventListener('mouseup', function () {
    isDown = false;
    ugcRow.style.cursor = '';
  });

  ugcRow.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    e.preventDefault();
    var x = e.pageX - ugcRow.offsetLeft;
    var walk = (x - startX) * 1.5;
    ugcRow.scrollLeft = scrollLeft - walk;
  });
})();
