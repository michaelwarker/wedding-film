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

