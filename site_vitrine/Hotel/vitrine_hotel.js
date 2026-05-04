/* ====== CURSEUR PERSONNALISE (desktop uniquement) ====== */
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

  document.querySelectorAll('a, button, .chambre-card, .g-item, .avis-card, input, select').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
} else {
  if (ring) ring.style.display = 'none';
  if (dot) dot.style.display = 'none';
  document.body.style.cursor = 'auto';
}

/* ====== TITRE ANIME — CYCLE DE MOTS ====== */
const wordEl = document.getElementById('word-anim');
const words = ['vécu', 'imaginé', 'rêvé'];
const styles = [
  { fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', color: '#d4b98a', fontSize: '1em' },
  { fontFamily: "'Pinyon Script', cursive", fontStyle: 'normal', color: '#f0d9a8', fontSize: '1em', textShadow: '0 0 16px rgba(212,185,138,0.35)' },
  { fontFamily: "'Libre Baskerville', serif", fontStyle: 'normal', color: '#d4b98a', fontSize: '0.95em' }
];
let wi = 0;

if (wordEl) {
  function cycleWord() {
    wordEl.style.opacity = '0';
    wordEl.style.transform = 'translateY(-20px)';
    wordEl.style.transition = 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => {
      wi = (wi + 1) % words.length;
      wordEl.textContent = words[wi];
      Object.assign(wordEl.style, styles[wi]);
      wordEl.style.transform = 'translateY(20px)';
      setTimeout(() => {
        wordEl.style.opacity = '1';
        wordEl.style.transform = 'translateY(0)';
      }, 50);
    }, 500);
  }

  Object.assign(wordEl.style, styles[0]);
  setInterval(cycleWord, 3000);
}

/* ====== NAVBAR SCROLL ====== */
const navbar = document.getElementById('navbar');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  const s = window.scrollY > 60;
  if (navbar) navbar.classList.toggle('scrolled', s);
  if (navMobile) navMobile.classList.toggle('scrolled', s);
}, { passive: true });

/* ====== HAMBURGER (accessible) ====== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ====== FORMULAIRE (validation + loading + toast) ====== */
const resaForm = document.getElementById('resaForm');
const toast = document.getElementById('toast');

if (resaForm) {
  resaForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let valid = true;
    this.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      } else {
        field.classList.remove('error');
      }
    });

    const emailField = this.querySelector('#resa-email');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error');
      valid = false;
    }

    if (!valid) return;

    const submitBtn = this.querySelector('.resa-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4500);
      }
      this.reset();
    }, 1200);
  });

  resaForm.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}

/* ====== DATE MIN (pas de dates passees) ====== */
const dateArrivee = document.getElementById('resa-arrivee');
const dateDepart = document.getElementById('resa-depart');
if (dateArrivee) {
  const today = new Date().toISOString().split('T')[0];
  dateArrivee.setAttribute('min', today);
  if (dateDepart) dateDepart.setAttribute('min', today);

  dateArrivee.addEventListener('change', () => {
    if (dateDepart && dateArrivee.value) {
      dateDepart.setAttribute('min', dateArrivee.value);
      if (dateDepart.value && dateDepart.value <= dateArrivee.value) {
        dateDepart.value = '';
      }
    }
  });
}

/* ====== MARQUEE AVIS — duplication pour boucle infinie ====== */
document.querySelectorAll('.avis-track').forEach(track => {
  const cards = Array.from(track.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
});

/* ====== SCROLL REVEAL (IntersectionObserver avec stagger) ====== */
const scrollElements = document.querySelectorAll(
  '.chambre-card, .service-item, .g-item, .resa-feature, .stat-item, .plan-step, .probleme-left, .probleme-right'
);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = el.parentElement.querySelectorAll(
          '.chambre-card, .service-item, .g-item, .resa-feature, .avis-card, .stat-item, .plan-step'
        );
        const idx = Array.from(siblings).indexOf(el);
        el.style.transitionDelay = `${Math.max(0, idx) * 0.08}s`;
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  scrollElements.forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });
} else {
  scrollElements.forEach(el => el.classList.add('visible'));
}

/* ====== COMPTEUR ANIME (stats) ====== */
function animateCount(el, target, suffix, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.round(start) + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      if (nums[0]) animateCount(nums[0], 312, '', 1200);
      if (nums[1]) {
        let s1 = 0;
        const timer1 = setInterval(() => {
          s1 = Math.min(s1 + 67 / (1200 / 16), 67);
          nums[1].textContent = Math.round(s1) + '%';
          if (s1 >= 67) clearInterval(timer1);
        }, 16);
      }
      if (nums[2]) {
        setTimeout(() => { nums[2].textContent = '1 / 8'; }, 600);
      }
      statsObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) statsObs.observe(statsRow);
