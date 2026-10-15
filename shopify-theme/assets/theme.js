/* Ge'ez theme — cart, drawer and navigation behaviour. */
(function () {
  'use strict';

  var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  var body = document.body;
  var drawerEnabled = body.getAttribute('data-cart-drawer-enabled') !== 'false';

  function $(selector, scope) { return (scope || document).querySelector(selector); }
  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /* ------------------------------------------------------------------ Cart API */
  function request(path, options) {
    return fetch(root + path, options).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) {
          throw new Error(data.description || data.message || 'Something went wrong. Please try again.');
        }
        return data;
      });
    });
  }

  var Cart = {
    add: function (items) {
      return request('cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: items })
      });
    },
    change: function (line, quantity) {
      return request('cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line: line, quantity: quantity })
      });
    }
  };

  /* ------------------------------------------------------- Drawer open / close */
  function drawer() { return $('[data-cart-drawer]'); }
  function overlay() { return $('[data-cart-overlay]'); }

  function openDrawer() {
    var el = drawer();
    var ov = overlay();
    if (!el) return;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    if (ov) ov.classList.add('is-open');
    body.classList.add('cart-drawer-open');
    var closeBtn = $('[data-cart-close]', el);
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    var el = drawer();
    var ov = overlay();
    if (!el) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    if (ov) ov.classList.remove('is-open');
    body.classList.remove('cart-drawer-open');
  }

  function setError(message) {
    var el = $('[data-cart-error]');
    if (!el) return;
    if (message) {
      el.textContent = message;
      el.hidden = false;
    } else {
      el.textContent = '';
      el.hidden = true;
    }
  }

  function updateCounts(count) {
    $$('.cart-count').forEach(function (node) {
      node.textContent = count;
      if (count > 0) { node.removeAttribute('hidden'); } else { node.setAttribute('hidden', ''); }
    });
  }

  /* Re-render the drawer section, then optionally open it. */
  function refreshDrawer(shouldOpen) {
    return fetch(root + '?sections=cart-drawer', { headers: { Accept: 'application/json' } })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        var html = data['cart-drawer'];
        if (!html) return;
        var parsed = new DOMParser().parseFromString(html, 'text/html');
        var fresh = parsed.getElementById('shopify-section-cart-drawer');
        var current = document.getElementById('shopify-section-cart-drawer');
        if (!fresh || !current) return;
        current.replaceWith(fresh);
        var el = drawer();
        var count = el ? parseInt(el.getAttribute('data-cart-count'), 10) : 0;
        updateCounts(isNaN(count) ? 0 : count);
        if (shouldOpen) openDrawer();
      });
  }

  /* ----------------------------------------------------------- Add to cart flow */
  function addToCart(items) {
    setError('');
    return Cart.add(items)
      .then(function () { return refreshDrawer(drawerEnabled); })
      .catch(function (error) {
        if (drawerEnabled) { openDrawer(); }
        setError(error.message);
      });
  }

  /* Delegated: quick-add buttons on collection / featured grids. */
  document.addEventListener('click', function (event) {
    var quickAdd = event.target.closest('[data-quick-add]');
    if (quickAdd) {
      event.preventDefault();
      var id = quickAdd.getAttribute('data-quick-add');
      if (!id) return;
      quickAdd.setAttribute('aria-busy', 'true');
      addToCart([{ id: Number(id), quantity: 1 }]).then(function () {
        quickAdd.removeAttribute('aria-busy');
      });
      return;
    }

    if (event.target.closest('[data-cart-close], [data-cart-overlay]')) {
      event.preventDefault();
      closeDrawer();
      return;
    }

    var trigger = event.target.closest('[data-cart-toggle]');
    if (trigger) {
      event.preventDefault();
      openDrawer();
      return;
    }

    var removeBtn = event.target.closest('.cart-line__remove');
    if (removeBtn) {
      var line = Number(removeBtn.getAttribute('data-line'));
      addToCartChange(line, 0);
    }
  });

  function addToCartChange(line, quantity) {
    setError('');
    Cart.change(line, quantity)
      .then(function () { return refreshDrawer(drawerEnabled); })
      .catch(function (error) { setError(error.message); });
  }

  /* Delegated: quantity steppers inside the drawer. */
  document.addEventListener('click', function (event) {
    var stepper = event.target.closest('[data-cart-qty]');
    if (!stepper) return;
    event.preventDefault();
    var line = Number(stepper.getAttribute('data-line'));
    var quantity = Number(stepper.getAttribute('data-quantity'));
    if (isNaN(line) || isNaN(quantity)) return;
    addToCartChange(line, quantity);
  });

  /* Delegated: quantity input inside the drawer. */
  document.addEventListener('change', function (event) {
    var input = event.target.closest('[data-cart-qty-input]');
    if (!input) return;
    var line = Number(input.getAttribute('data-line'));
    var quantity = Number(input.value);
    if (isNaN(line) || isNaN(quantity)) return;
    addToCartChange(line, quantity);
  });

  /* Escape closes the drawer. */
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeDrawer();
  });

  /* ------------------------------------------------------- Product page form */
  function initProductForm(form) {
    form.addEventListener('submit', function (event) {
      var submitButton = form.querySelector('[type="submit"]');
      if (submitButton && submitButton.disabled) return;
      event.preventDefault();
      var idInput = form.querySelector('input[name="id"]');
      var qtyInput = form.querySelector('input[name="quantity"]');
      if (!idInput || !idInput.value) return;
      var items = [{
        id: Number(idInput.value),
        quantity: qtyInput ? Number(qtyInput.value) || 1 : 1
      }];
      var originalText = submitButton ? submitButton.textContent : '';
      if (submitButton) {
        submitButton.setAttribute('aria-busy', 'true');
        submitButton.disabled = true;
      }
      addToCart(items).then(function () {
        if (submitButton) {
          submitButton.removeAttribute('aria-busy');
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      });
    });
  }

  $$('[data-product-form]').forEach(initProductForm);

  /* Variant select: navigate so price, availability and image stay in sync. */
  var variantSelect = $('[data-variant-select]');
  if (variantSelect) {
    variantSelect.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('variant', variantSelect.value);
      window.location.href = url.toString();
    });
  }

  /* Quantity stepper on the product page. */
  $$('[data-qty-stepper]').forEach(function (stepper) {
    var input = stepper.querySelector('input');
    $$('button', stepper).forEach(function (button) {
      button.addEventListener('click', function () {
        var current = Number(input.value) || 1;
        var next = current + Number(button.getAttribute('data-step'));
        if (next < 1) next = 1;
        input.value = next;
      });
    });
  });

  /* --------------------------------------------------------- Mobile menu */
  var burger = $('[data-menu-toggle]');
  var mobileMenu = $('[data-mobile-menu]');
  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      var isOpen = mobileMenu.hasAttribute('hidden') === false;
      if (isOpen) {
        mobileMenu.setAttribute('hidden', '');
        burger.setAttribute('aria-expanded', 'false');
        body.classList.remove('menu-open');
      } else {
        mobileMenu.removeAttribute('hidden');
        burger.setAttribute('aria-expanded', 'true');
        body.classList.add('menu-open');
      }
    });
  }

  /* --------------------------------------------------------------- Search */
  var searchToggle = $('[data-search-toggle]');
  var searchPanel = $('[data-search-panel]');
  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', function () {
      var isHidden = searchPanel.hasAttribute('hidden');
      if (isHidden) {
        searchPanel.removeAttribute('hidden');
        searchToggle.setAttribute('aria-expanded', 'true');
        var field = searchPanel.querySelector('input[type="search"]');
        if (field) field.focus();
      } else {
        searchPanel.setAttribute('hidden', '');
        searchToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
