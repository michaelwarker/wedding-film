// ============ Mobile nav toggle ============
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  primaryNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============ Scroll reveal: chapters fade and rise into view ============
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length && 'IntersectionObserver' in window) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }
} else {
  // No IntersectionObserver support — just show everything immediately.
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ============ Footer year ============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============ Contact form (demo only — no backend wired up) ============
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = 'This form isn\u2019t connected to anything yet \u2014 wire it up to Formspree, Basin, or your own endpoint to start receiving inquiries.';
  });
}

// ============ Lightbox: click a photo to enlarge it ============
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox && lightboxImg && lightboxClose) {
  let lastFocused = null;

  function openLightbox(img) {
    lastFocused = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  // Only photos get the lightbox — videos already have their own native controls.
  document.querySelectorAll('.album-photo img, .portrait-frame img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img));
  });

  lightboxClose.addEventListener('click', closeLightbox);

  // Clicking the dark backdrop (not the image itself) also closes it.
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

// ============ Price estimator + add-ons (Rates page only) ============
const estVideo = document.getElementById('estVideo');
const estPhoto = document.getElementById('estPhoto');
const estTotal = document.getElementById('estTotal');
const estDiscountLine = document.getElementById('estDiscountLine');
const estDiscount = document.getElementById('estDiscount');
const estAddonsLine = document.getElementById('estAddonsLine');
const estAddonsValue = document.getElementById('estAddons');
const estClear = document.getElementById('estClear');
const addonsHint = document.getElementById('addonsHint');
const addHoursCount = document.getElementById('addHoursCount');

if (estVideo && estPhoto && estTotal) {
  const selections = { video: null, photo: null };
  const activeAddons = new Set();
  let additionalHours = 0;

  // What each video tier includes for free, and which single item is a
  // complimentary "choice of one" pick made at booking.
  const TIER_ADDONS = {
    'Essential':  { included: [],                                choice: [] },
    'Signature':  { included: ['toasts-edit', 'social-teaser'],  choice: ['drone', 'rehearsal'] },
    'Cinematic':  { included: ['toasts-edit', 'social-teaser', 'drone'], choice: [] },
    'Full Story': { included: ['toasts-edit', 'social-teaser', 'drone'], choice: ['rehearsal', 'engagement-film'] },
  };

  const formatMoney = (n) => '$' + n.toLocaleString('en-US');

  function updateEstimate() {
    const video = selections.video;
    const photo = selections.photo;

    estVideo.textContent = video ? `${video.tier} — ${formatMoney(video.price)}` : 'Not selected';
    estPhoto.textContent = photo ? `${photo.tier} — ${formatMoney(photo.price)}` : 'Not selected';

    const packageSubtotal = (video ? video.price : 0) + (photo ? photo.price : 0);
    const hasBundle = video && photo;
    const discount = hasBundle ? Math.round(packageSubtotal * 0.2) : 0;

    if (hasBundle) {
      estDiscountLine.hidden = false;
      estDiscount.textContent = '\u2212' + formatMoney(discount);
    } else {
      estDiscountLine.hidden = true;
    }

    // Add-ons: toggled paid items plus additional hours, never discounted.
    let addonsTotal = additionalHours * 400;
    activeAddons.forEach(id => {
      const el = document.querySelector(`.addon[data-addon="${id}"]`);
      if (el) addonsTotal += parseInt(el.dataset.price, 10);
    });

    if (addonsTotal > 0) {
      estAddonsLine.hidden = false;
      estAddonsValue.textContent = '+' + formatMoney(addonsTotal);
    } else {
      estAddonsLine.hidden = true;
    }

    estTotal.textContent = formatMoney(packageSubtotal - discount + addonsTotal);

    renderAddons();
  }

  function renderAddons() {
    const tier = selections.video ? selections.video.tier : null;
    const rules = tier ? TIER_ADDONS[tier] : { included: [], choice: [] };

    if (addonsHint) {
      addonsHint.textContent = tier
        ? `Here's what's included with the ${tier} video package — and what you can add.`
        : "Select a video package above to see what's already included — and what you can add on.";
    }

    document.querySelectorAll('.addon[data-addon]').forEach(addon => {
      const id = addon.dataset.addon;
      if (id === 'add-hours') return; // hourly item is always available, handled separately

      const toggle = addon.querySelector('.addon-toggle');
      const status = addon.querySelector('.addon-status');
      const isIncluded = rules.included.includes(id);
      const isChoice = rules.choice.includes(id);

      addon.classList.remove('is-included', 'is-choice', 'is-active');

      if (isIncluded) {
        addon.classList.add('is-included');
        if (status) { status.hidden = false; status.textContent = 'Included'; }
        if (toggle) toggle.hidden = true;
        activeAddons.delete(id);
      } else if (isChoice) {
        addon.classList.add('is-choice');
        if (status) { status.hidden = false; status.textContent = 'Your Free Choice'; }
        if (toggle) toggle.hidden = true;
        activeAddons.delete(id);
      } else {
        if (status) status.hidden = true;
        if (toggle) toggle.hidden = false;
        if (activeAddons.has(id)) addon.classList.add('is-active');
      }
    });
  }

  // Tier selection (video + photo cards)
  document.querySelectorAll('.select-btn').forEach(btn => {
    const card = btn.closest('.format-card');
    if (!card) return;
    const group = card.dataset.group;
    const tier = card.dataset.tier;
    const price = parseInt(card.dataset.price, 10);

    btn.addEventListener('click', () => {
      const alreadySelected = card.classList.contains('is-selected');

      document.querySelectorAll(`.format-card[data-group="${group}"]`).forEach(c => {
        c.classList.remove('is-selected');
      });

      if (alreadySelected) {
        selections[group] = null;
      } else {
        card.classList.add('is-selected');
        selections[group] = { tier, price };
      }

      updateEstimate();
    });
  });

  // Toggleable paid add-ons
  document.querySelectorAll('.addon-toggle').forEach(toggle => {
    const addon = toggle.closest('.addon');
    if (!addon) return;
    const id = addon.dataset.addon;
    if (addon.dataset.noPrice) return; // Rehearsal Dinner links to Contact instead

    toggle.addEventListener('click', () => {
      if (activeAddons.has(id)) {
        activeAddons.delete(id);
      } else {
        activeAddons.add(id);
      }
      updateEstimate();
    });
  });

  // Hourly stepper for Additional Coverage
  document.querySelectorAll('.addon-step').forEach(stepBtn => {
    stepBtn.addEventListener('click', () => {
      const delta = parseInt(stepBtn.dataset.step, 10);
      additionalHours = Math.max(0, additionalHours + delta);
      if (addHoursCount) addHoursCount.textContent = String(additionalHours);
      updateEstimate();
    });
  });

  if (estClear) {
    estClear.addEventListener('click', () => {
      selections.video = null;
      selections.photo = null;
      activeAddons.clear();
      additionalHours = 0;
      if (addHoursCount) addHoursCount.textContent = '0';
      document.querySelectorAll('.format-card.is-selected').forEach(c => c.classList.remove('is-selected'));
      updateEstimate();
    });
  }

  renderAddons();
}

