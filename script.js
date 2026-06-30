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

// ============ Live timecode — "the camera is always rolling" ============
// Runs at a cinematic 24fps for as long as the visitor is on the page.
const recTimeEl = document.getElementById('recTime');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (recTimeEl && !reduceMotion) {
  const start = performance.now();
  const FPS = 24;

  function pad(n, len = 2) { return String(n).padStart(len, '0'); }

  function tick(now) {
    const elapsedMs = now - start;
    const totalFrames = Math.floor(elapsedMs / (1000 / FPS));
    const frames = totalFrames % FPS;
    const totalSeconds = Math.floor(totalFrames / FPS);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    recTimeEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
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

// ============ Reel cards: clicking the play button (demo placeholder) ============
document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const title = btn.getAttribute('aria-label') || 'this film';
    alert(`This is a placeholder. Swap in a real video source to ${title.toLowerCase()}.`);
  });
});
