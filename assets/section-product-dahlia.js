(function () {
  'use strict';

  document.querySelectorAll('[data-section-type="product-dahlia"]').forEach(function (section) {
    var sectionId = section.dataset.sectionId;

    // ----------------------------------------------------------------
    // Parse product data injected by Liquid
    // ----------------------------------------------------------------
    var productData;
    try {
      productData = JSON.parse(section.dataset.product.replace(/&quot;/g, '"'));
    } catch (e) {
      productData = null;
    }

    if (!productData) return;

    var variants  = productData.variants;
    var numOptions = productData.options ? productData.options.length : 0;

    // Track currently selected option values [opt1, opt2, ...]
    var selectedOptions = [];

    // Seed from currently selected variant
    var initialVariant = variants.find(function (v) { return v.available; }) || variants[0];
    if (initialVariant && initialVariant.options) {
      selectedOptions = initialVariant.options.slice();
    }

    // ----------------------------------------------------------------
    // Gallery
    // ----------------------------------------------------------------
    var galleryMain  = section.querySelector('#pd-main-' + sectionId);
    var thumbButtons = section.querySelectorAll('.pd-gallery__thumb');
    var mainSlides   = section.querySelectorAll('.pd-gallery__slide');

    function activateSlide(mediaId) {
      mainSlides.forEach(function (slide) {
        var active = slide.dataset.mediaId === String(mediaId);
        slide.classList.toggle('is-active', active);
      });
      thumbButtons.forEach(function (btn) {
        var active = btn.dataset.mediaId === String(mediaId);
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
    }

    thumbButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activateSlide(btn.dataset.mediaId);
      });
    });

    // Hover zoom: track cursor position to set transform-origin
    if (galleryMain) {
      galleryMain.addEventListener('mousemove', function (e) {
        var rect  = galleryMain.getBoundingClientRect();
        var xPct  = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        var yPct  = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        var slide = galleryMain.querySelector('.pd-gallery__slide.is-active .pd-gallery__img');
        if (slide) slide.style.transformOrigin = xPct + '% ' + yPct + '%';
      });

      galleryMain.addEventListener('mouseleave', function () {
        var slide = galleryMain.querySelector('.pd-gallery__slide.is-active .pd-gallery__img');
        if (slide) slide.style.transformOrigin = 'center center';
      });
    }

    // ----------------------------------------------------------------
    // Variant selection
    // ----------------------------------------------------------------
    var pillGroups = section.querySelectorAll('.pd-variants[data-option-position]');
    var variantIdInput = section.querySelector('[data-variant-id]');
    var priceContainer = section.querySelector('[data-price-container]');
    var tamaraLine     = section.querySelector('[data-tamara-line]');
    var atcBtn         = section.querySelector('[data-atc-btn]');

    function findVariant(options) {
      return variants.find(function (v) {
        return v.options.every(function (opt, i) {
          return opt === options[i];
        });
      });
    }

    function formatMoney(cents) {
      var amount = (cents / 100).toFixed(2).replace(/\.00$/, '');
      return amount;
    }

    function updateUI(variant) {
      if (!variant) return;

      // Variant ID in form
      if (variantIdInput) variantIdInput.value = variant.id;

      // Price
      if (priceContainer) {
        var html = '';
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          html  = '<span class="pd-price__sale" data-price>' + formatMoney(variant.price) + ' ' + (window.theme && window.theme.currencySymbol ? window.theme.currencySymbol : 'ر.س') + '</span>';
          html += '<span class="pd-price__compare" data-compare-price>' + formatMoney(variant.compare_at_price) + ' ' + (window.theme && window.theme.currencySymbol ? window.theme.currencySymbol : 'ر.س') + '</span>';
        } else {
          html = '<span class="pd-price__regular" data-price>' + formatMoney(variant.price) + ' ' + (window.theme && window.theme.currencySymbol ? window.theme.currencySymbol : 'ر.س') + '</span>';
        }
        priceContainer.innerHTML = html;
      }

      // Tamara
      if (tamaraLine) {
        var installment = formatMoney(Math.round(variant.price / 4));
        var text = tamaraLine.dataset.template || tamaraLine.textContent;
        // Simple replacement — locale string uses {{ amount }}
        tamaraLine.textContent = tamaraLine.textContent.replace(/[\d,\.]+/, installment);
      }

      // ATC button
      if (atcBtn) {
        atcBtn.disabled = !variant.available;
        // Text is set via Liquid server-side; JS updates on client
        // (no translation lookup here — keep original locale string logic on load)
      }

      // Variant image — switch gallery to variant's first image if it has one
      if (variant.featured_image && variant.featured_image.id) {
        activateSlide(variant.featured_image.id);
      }

      // URL update (without page reload)
      var url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url.toString());
    }

    pillGroups.forEach(function (group) {
      var pos = parseInt(group.dataset.optionPosition, 10) - 1; // 0-indexed
      group.querySelectorAll('.pd-variant-pill').forEach(function (pill) {
        pill.addEventListener('click', function () {
          // Update selected options
          selectedOptions[pos] = pill.dataset.value;

          // Update pill active states in this group
          group.querySelectorAll('.pd-variant-pill').forEach(function (p) {
            var active = p.dataset.value === selectedOptions[pos];
            p.classList.toggle('is-selected', active);
            p.setAttribute('aria-pressed', String(active));
          });

          // Find matching variant
          var matched = findVariant(selectedOptions);
          if (matched) updateUI(matched);
        });
      });
    });

    // ----------------------------------------------------------------
    // Quantity +/–
    // ----------------------------------------------------------------
    var qtyInput = section.querySelector('[data-qty-input]');
    var qtyMinus = section.querySelector('[data-qty-minus]');
    var qtyPlus  = section.querySelector('[data-qty-plus]');

    function clampQty(val) {
      return Math.max(1, Math.min(999, parseInt(val, 10) || 1));
    }

    if (qtyMinus && qtyInput) {
      qtyMinus.addEventListener('click', function () {
        qtyInput.value = clampQty(qtyInput.value - 1);
      });
    }

    if (qtyPlus && qtyInput) {
      qtyPlus.addEventListener('click', function () {
        qtyInput.value = clampQty(parseInt(qtyInput.value, 10) + 1);
      });
    }

    if (qtyInput) {
      qtyInput.addEventListener('change', function () {
        qtyInput.value = clampQty(qtyInput.value);
      });
    }

    // ----------------------------------------------------------------
    // Buy Now — add to cart then redirect to checkout
    // ----------------------------------------------------------------
    var buyNowBtn = section.querySelector('[data-buy-now]');
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', function () {
        var formId = buyNowBtn.dataset.formId;
        var form   = document.getElementById(formId);
        if (!form) return;

        var id  = form.querySelector('[data-variant-id]').value;
        var qty = form.querySelector('[data-qty-input]').value || 1;

        fetch('/cart/add.js', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ id: parseInt(id, 10), quantity: parseInt(qty, 10) })
        })
          .then(function (res) {
            if (res.ok) window.location.href = '/checkout';
          })
          .catch(function () {
            // Fallback: native form submit
            form.submit();
          });
      });
    }

    // ----------------------------------------------------------------
    // Tabs (desktop) / Accordion (mobile)
    // ----------------------------------------------------------------
    var tabsWrapper = section.querySelector('[data-pd-tabs]');
    if (!tabsWrapper) return;

    var tabBtns  = tabsWrapper.querySelectorAll('.pd-tabs__tab');
    var panels   = tabsWrapper.querySelectorAll('.pd-tabs__panel');

    function activateTab(tabId) {
      tabBtns.forEach(function (btn) {
        var active = btn.dataset.tab === tabId;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });

      panels.forEach(function (panel) {
        var active = panel.id.startsWith('pd-panel-' + tabId);
        panel.classList.toggle('is-active', active);
        if (active) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    }

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isMobile = window.matchMedia('(max-width: 767px)').matches;
        if (isMobile) {
          // Accordion: toggle this tab; close others
          var alreadyOpen = btn.classList.contains('is-active');
          // Close all
          tabBtns.forEach(function (b) {
            b.classList.remove('is-active');
            b.setAttribute('aria-selected', 'false');
          });
          panels.forEach(function (p) {
            p.classList.remove('is-active');
            p.setAttribute('hidden', '');
          });
          // Open clicked (if it wasn't already open)
          if (!alreadyOpen) activateTab(btn.dataset.tab);
        } else {
          activateTab(btn.dataset.tab);
        }
      });
    });

  }); // end forEach section

})();
