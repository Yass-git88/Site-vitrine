// --- Curseur personnalisé (desktop uniquement) ---
const ring = document.getElementById('cursor-ring');
const dot = document.getElementById('cursor-dot');

if (ring && dot && window.matchMedia('(hover: hover)').matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, input, select, textarea, .dish-card, .apropos-img').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
} else {
  if (ring) ring.style.display = 'none';
  if (dot) dot.style.display = 'none';
  document.body.style.cursor = 'auto';
}

// --- Navbar scroll ---
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// --- Hamburger mobile ---
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// --- Onglets menu (accessible) ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.menu-grid');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.tab;

    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    tabPanels.forEach(panel => {
      if (panel.id === targetId) {
        panel.hidden = false;
      } else {
        panel.hidden = true;
      }
    });
  });

  btn.addEventListener('keydown', e => {
    const btns = Array.from(tabBtns);
    const idx = btns.indexOf(btn);
    let nextIdx;

    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % btns.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + btns.length) % btns.length;
    else return;

    e.preventDefault();
    btns[nextIdx].focus();
    btns[nextIdx].click();
  });
});

// --- Scroll reveal (IntersectionObserver) ---
const scrollElements = document.querySelectorAll('.scroll-reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = el.parentElement.querySelectorAll('.scroll-reveal');
        const idx = Array.from(siblings).indexOf(el);
        el.style.transitionDelay = `${idx * 0.08}s`;
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  scrollElements.forEach(el => observer.observe(el));
} else {
  scrollElements.forEach(el => el.classList.add('visible'));
}

// --- Réservation ---
const form = document.getElementById('reservation-form');
const formSuccess = document.querySelector('.form-success');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      } else {
        field.classList.remove('error');
      }
    });

    const emailField = form.querySelector('#email');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error');
      valid = false;
    }

    if (!valid) return;

    const submitBtn = form.querySelector('.form-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      form.hidden = true;
      formSuccess.hidden = false;
    }, 1200);
  });

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}

// --- Smooth date min (pas de dates passées) ---
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}


// --- Slider Avant/Après ---
document.querySelectorAll('.transfo-compare').forEach(container => {
  const slider = container.querySelector('.transfo-slider');
  const before = container.querySelector('.transfo-before');
  let isDragging = false;

  function updatePosition(x) {
    const rect = container.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    slider.style.left = pct + '%';
    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
  }

  function onStart(e) {
    isDragging = true;
    container.classList.add('dragging');
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    updatePosition(x);
  }

  function onMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    updatePosition(x);
  }

  function onEnd() {
    isDragging = false;
    container.classList.remove('dragging');
  }

  container.addEventListener('mousedown', onStart);
  container.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchend', onEnd);
});
