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

// ============ Album gallery: click a thumbnail to feature it ============
const albumFeaturedImg = document.getElementById('albumFeaturedImg');
const albumThumbs = document.querySelectorAll('.album-thumb');

if (albumFeaturedImg && albumThumbs.length) {
  const albumFeatured = albumFeaturedImg.closest('.album-featured');

  albumThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (thumb.classList.contains('is-active')) return;

      const newSrc = thumb.dataset.src;
      const newAlt = thumb.dataset.alt || '';

      if (albumFeatured) albumFeatured.classList.add('is-switching');

      window.setTimeout(() => {
        albumFeaturedImg.src = newSrc;
        albumFeaturedImg.alt = newAlt;
        if (albumFeatured) albumFeatured.classList.remove('is-switching');
      }, 150);

      albumThumbs.forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });
  });
}

// ============ Footer year ============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============ Contact form: submits to Formspree ============
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    formStatus.textContent = 'Sending\u2026';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        formStatus.textContent = 'Thank you \u2014 your inquiry is on its way. I\u2019ll be in touch within 48 hours.';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong sending that \u2014 please try again, or email directly.';
      }
    } catch (err) {
      formStatus.textContent = 'Something went wrong sending that \u2014 please try again, or email directly.';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
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
  document.querySelectorAll('.album-photo img, .portrait-frame img, .album-featured img').forEach(img => {
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
const estInquireLink = document.getElementById('estInquireLink');
const checkAvailabilityLink = document.getElementById('checkAvailabilityLink');

if (estVideo && estPhoto && estTotal) {
  const selections = { video: null, photo: null };
  const activeAddons = new Set();
  let additionalHours = 0;

  // What each video tier includes for free — no more "choice of one," everything
  // listed here is simply included.
  const TIER_ADDONS = {
    'Essential':  { included: [] },
    'Signature':  { included: ['toasts-edit', 'social-teaser', 'drone'] },
    'Cinematic':  { included: ['toasts-edit', 'social-teaser', 'drone'] },
    'Full Story': { included: ['toasts-edit', 'social-teaser', 'drone', 'engagement-film', 'couples-portrait'] },
  };

  const ADDON_LABELS = {
    'toasts-edit': 'Toasts, Ceremony & Dances Edit',
    'social-teaser': 'One-Minute Social Media Teaser Film',
    'drone': 'Drone Coverage',
    'engagement-film': 'Engagement Film',
    'couples-portrait': "Additional Couples' Portrait Session",
    'expedited': 'Expedited Delivery (1 Week Early)',
    'livestream': 'Live Streaming During Ceremony',
  };

  const formatMoney = (n) => '$' + n.toLocaleString('en-US');

  function updateInquiryLinks() {
    if (!estInquireLink && !checkAvailabilityLink) return;

    const video = selections.video;
    const photo = selections.photo;
    const params = new URLSearchParams();

    if (video) { params.set('video', video.tier); params.set('videoPrice', video.price); }
    if (photo) { params.set('photo', photo.tier); params.set('photoPrice', photo.price); }

    const addonParts = [];
    if (additionalHours > 0) addonParts.push(`${additionalHours} Additional Hour${additionalHours > 1 ? 's' : ''}:${additionalHours * 400}`);
    activeAddons.forEach(id => {
      const el = document.querySelector(`.addon[data-addon="${id}"]`);
      const price = el ? el.dataset.price : '';
      addonParts.push(`${ADDON_LABELS[id] || id}:${price}`);
    });
    if (addonParts.length) params.set('addons', addonParts.join(','));

    params.set('total', estTotal.textContent.replace(/[^0-9]/g, ''));

    const query = params.toString();
    const href = query ? `index.html?${query}#contact` : 'index.html#contact';
    if (estInquireLink) estInquireLink.href = href;
    if (checkAvailabilityLink) checkAvailabilityLink.href = href;
  }

  function updateEstimate() {
    const video = selections.video;
    const photo = selections.photo;

    estVideo.textContent = video ? `${video.tier} — ${formatMoney(video.price)}` : 'Not selected';
    estPhoto.textContent = photo ? `${photo.tier} — ${formatMoney(photo.price)}` : 'Not selected';

    const packageSubtotal = (video ? video.price : 0) + (photo ? photo.price : 0);
    const hasBundle = video && photo;
    const discount = hasBundle ? Math.round(packageSubtotal * 0.2) : 0;

    estDiscount.textContent = '\u2212' + formatMoney(discount);
    estDiscountLine.hidden = !hasBundle;

    // Add-ons: toggled paid items plus additional hours, never discounted.
    let addonsTotal = additionalHours * 400;
    activeAddons.forEach(id => {
      const el = document.querySelector(`.addon[data-addon="${id}"]`);
      if (el) addonsTotal += parseInt(el.dataset.price, 10);
    });

    estAddonsValue.textContent = '+' + formatMoney(addonsTotal);
    estAddonsLine.hidden = addonsTotal <= 0;

    estTotal.textContent = formatMoney(packageSubtotal - discount + addonsTotal);

    renderAddons();
    updateInquiryLinks();
  }

  function renderAddons() {
    const tier = selections.video ? selections.video.tier : null;
    const rules = tier ? TIER_ADDONS[tier] : { included: [] };

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

      addon.classList.remove('is-included', 'is-active');

      if (isIncluded) {
        addon.classList.add('is-included');
        if (status) { status.hidden = false; status.textContent = 'Included'; }
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
  updateInquiryLinks();
}

// ============ Package recap: read selection passed from the Rates page ============
const packageRecap = document.getElementById('packageRecap');
const packageRecapLines = document.getElementById('packageRecapLines');
const packageSummaryField = document.getElementById('packageSummary');
const messageField = document.getElementById('message');

if (packageRecap && packageRecapLines) {
  const params = new URLSearchParams(window.location.search);
  const video = params.get('video');
  const videoPrice = params.get('videoPrice');
  const photo = params.get('photo');
  const photoPrice = params.get('photoPrice');
  const addonsParam = params.get('addons');
  const total = params.get('total');

  function addRecapLine(label, value, isTotal) {
    const row = document.createElement('div');
    row.className = 'package-recap-line' + (isTotal ? ' package-recap-line--total' : '');
    const labelSpan = document.createElement('span');
    labelSpan.textContent = label;
    const valueSpan = document.createElement('span');
    valueSpan.textContent = value;
    row.append(labelSpan, valueSpan);
    packageRecapLines.appendChild(row);
  }

  if (video || photo) {
    const formatMoney = (n) => '$' + Number(n).toLocaleString('en-US');
    const summaryParts = [];

    if (video) {
      addRecapLine('Video', `${video} \u2014 ${formatMoney(videoPrice)}`);
      summaryParts.push(`Video: ${video} (${formatMoney(videoPrice)})`);
    }
    if (photo) {
      addRecapLine('Photo', `${photo} \u2014 ${formatMoney(photoPrice)}`);
      summaryParts.push(`Photo: ${photo} (${formatMoney(photoPrice)})`);
    }
    if (addonsParam) {
      addonsParam.split(',').forEach(part => {
        const [name, price] = part.split(':');
        if (!name) return;
        addRecapLine(name, price ? formatMoney(price) : '');
        summaryParts.push(`${name}${price ? ` (${formatMoney(price)})` : ''}`);
      });
    }
    if (total) {
      addRecapLine('Estimated Total', formatMoney(total), true);
      summaryParts.push(`Estimated Total: ${formatMoney(total)}`);
    }

    packageRecap.hidden = false;

    const summaryText = summaryParts.join(' | ');
    if (packageSummaryField) packageSummaryField.value = summaryText;
    if (messageField && !messageField.value) {
      messageField.value = `I'm interested in the following package:\n${summaryParts.join('\n')}\n\n`;
    }
  }
}

// ============ Package accordion: click to expand, collapses on scroll-away ============
const formatToggles = document.querySelectorAll('.format-toggle');

if (formatToggles.length) {
  formatToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.format-card');
      if (!card) return;
      const expanded = card.classList.toggle('is-expanded');
      toggle.setAttribute('aria-expanded', String(expanded));

      // Autoplaying video clips only need to play while their card is open.
      const video = card.querySelector('.format-media video');
      if (video) {
        if (expanded) video.play().catch(() => {});
        else video.pause();
      }
    });
  });

  if ('IntersectionObserver' in window) {
    const collapseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const stillExpanded = entry.target.classList.contains('is-expanded');
        const isSelected = entry.target.classList.contains('is-selected');
        if (!entry.isIntersecting && stillExpanded && !isSelected) {
          entry.target.classList.remove('is-expanded');
          const toggle = entry.target.querySelector('.format-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
          const video = entry.target.querySelector('.format-media video');
          if (video) video.pause();
        }
      });
    }, { threshold: 0 });

    document.querySelectorAll('.formats-grid--horizontal .format-card')
      .forEach(card => collapseObserver.observe(card));
  }
}

