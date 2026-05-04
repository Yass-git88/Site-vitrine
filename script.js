'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initHeader();
  initScrollReveal();
  initMobileMenu();
  initContactForm();
  initFooterYear();
  initMagnetic();
  initParallaxOrbs();
  initCardTilt();
  initMobileFab();
  initMobileScrollSnap();
  initIframeScale();
});


/* ─────────────────────────────────────────────
   LOADER
───────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('is-hidden');
      document.querySelectorAll('.hero-anim').forEach(el => {
        el.classList.add('is-visible');
      });
    }, 1600);
  });

  setTimeout(() => {
    loader.classList.add('is-hidden');
    document.querySelectorAll('.hero-anim').forEach(el => {
      el.classList.add('is-visible');
    });
  }, 3500);
}


/* ─────────────────────────────────────────────
   CURSEUR PERSONNALISÉ
───────────────────────────────────────────── */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (!cursor || !follower) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let fx = 0, fy = 0;
  let mx = 0, my = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });

  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
    follower.style.transform = 'translate(-50%, -50%) scale(0.8)';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
  });
}


/* ─────────────────────────────────────────────
   HEADER DYNAMIQUE
───────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }

        if (currentScroll > 300) {
          if (currentScroll > lastScroll + 10) {
            header.style.transform = 'translateY(-100%)';
          } else if (currentScroll < lastScroll - 10) {
            header.style.transform = 'translateY(0)';
          }
        } else {
          header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  header.style.transition = 'background 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease, transform 0.35s ease';

  initNavHighlight();
}

function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === '#' + activeId) {
            link.style.color = 'var(--gold)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}


/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.08
  });

  elements.forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────────
   MENU MOBILE — Fullscreen overlay
   Scroll lock compatible iOS/Android
───────────────────────────────────────────── */
function initMobileMenu() {
  const burger     = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!burger || !mobileMenu) return;

  let savedScrollY = 0;

  function lockScroll() {
    savedScrollY = window.scrollY;
    document.body.classList.add('menu-open');
    document.body.style.top = '-' + savedScrollY + 'px';
  }

  function unlockScroll() {
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
  }

  function openMenu() {
    lockScroll();
    mobileMenu.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    unlockScroll();
  }

  burger.addEventListener('click', function(e) {
    e.stopPropagation();
    if (mobileMenu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  var mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
  for (var i = 0; i < mobileLinks.length; i++) {
    mobileLinks[i].addEventListener('click', function() {
      closeMenu();
    });
  }

  var footerLinks = mobileMenu.querySelectorAll('.mobile-menu__footer a');
  for (var j = 0; j < footerLinks.length; j++) {
    footerLinks[j].addEventListener('click', function() {
      closeMenu();
    });
  }
}


/* ─────────────────────────────────────────────
   FORMULAIRE DE CONTACT
───────────────────────────────────────────── */
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  if (!form) return;

  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) isValid = false;
    });

    if (!isValid) return;

    setLoadingState(true);

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        form.reset();
        inputs.forEach(i => i.classList.remove('is-success'));
        if (successMsg) {
          successMsg.style.display = 'flex';
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 6000);
        }
      } else {
        showFormError('Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.');
      }
    } catch (error) {
      showFormError('Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.');
    } finally {
      setLoadingState(false);
    }
  });

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMsg = '';

    removeFieldError(field);

    if (field.required && !value) {
      isValid = false;
      errorMsg = 'Ce champ est requis.';
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMsg = 'Veuillez entrer une adresse email valide.';
      }
    } else if (value.length < 2 && field.required) {
      isValid = false;
      errorMsg = 'Minimum 2 caractères requis.';
    }

    if (!isValid) {
      showFieldError(field, errorMsg);
    } else if (value) {
      field.classList.add('is-success');
    }

    return isValid;
  }

  function showFieldError(field, message) {
    field.classList.add('is-error');
    field.classList.remove('is-success');

    let errorEl = field.parentNode.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      errorEl.style.cssText = 'display:block;font-size:0.73rem;color:#e07070;margin-top:0.35rem;font-family:var(--font-body);';
      field.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function removeFieldError(field) {
    field.classList.remove('is-error');
    const errorEl = field.parentNode.querySelector('.field-error');
    if (errorEl) errorEl.remove();
  }

  function setLoadingState(loading) {
    if (!submitBtn) return;
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    submitBtn.disabled = loading;
    submitBtn.style.opacity = loading ? '0.7' : '1';

    if (btnText && btnLoading) {
      btnText.style.display    = loading ? 'none' : 'inline';
      btnLoading.style.display = loading ? 'inline' : 'none';
    }
  }

  function showFormError(msg) {
    let errEl = form.querySelector('.form-global-error');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'form-global-error';
      errEl.style.cssText = 'padding:0.85rem 1rem;background:rgba(220,80,80,0.06);border:1px solid rgba(220,80,80,0.2);border-radius:10px;font-size:0.88rem;color:#e07070;margin-top:0.75rem;';
      submitBtn.parentNode.insertBefore(errEl, submitBtn.nextSibling);
    }
    errEl.textContent = msg;
    setTimeout(() => errEl.remove(), 5000);
  }
}


/* ─────────────────────────────────────────────
   FOOTER YEAR
───────────────────────────────────────────── */
function initFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


/* ─────────────────────────────────────────────
   MAGNETIC BUTTONS
───────────────────────────────────────────── */
function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;

  const elements = document.querySelectorAll('.magnetic');

  elements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { el.style.transition = ''; }, 400);
    });
  });
}


/* ─────────────────────────────────────────────
   PARALLAX ORBS ON MOUSE MOVE
───────────────────────────────────────────── */
function initParallaxOrbs() {
  if (window.matchMedia('(hover: none)').matches) return;

  const orbs = document.querySelectorAll('.hero__orb');
  if (!orbs.length) return;

  let rafId = null;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        orbs.forEach((orb, i) => {
          const speed = (i + 1) * 12;
          orb.style.transform = 'translate(' + (targetX * speed) + 'px, ' + (targetY * speed) + 'px)';
        });
        rafId = null;
      });
    }
  });
}


/* ─────────────────────────────────────────────
   CARD TILT ON HOVER
───────────────────────────────────────────── */
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -8;
      const rotateY = (x - 0.5) * 8;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, border-color 0.4s';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}


/* ─────────────────────────────────────────────
   MOBILE FLOATING CTA
───────────────────────────────────────────── */
function initMobileFab() {
  const fab = document.getElementById('mobileFab');
  if (!fab) return;
  if (window.innerWidth > 640) return;

  let shown = false;

  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.5 && !shown) {
      shown = true;
      fab.classList.add('is-visible');
    } else if (window.scrollY <= window.innerHeight * 0.3 && shown) {
      shown = false;
      fab.classList.remove('is-visible');
    }
  }, { passive: true });

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fab.classList.remove('is-visible');
          shown = false;
        } else if (window.scrollY > window.innerHeight * 0.5) {
          fab.classList.add('is-visible');
          shown = true;
        }
      });
    }, { threshold: 0.3 });
    observer.observe(contactSection);
  }
}


/* ─────────────────────────────────────────────
   MOBILE SCROLL SNAP INDICATOR
───────────────────────────────────────────── */
function initMobileScrollSnap() {
  if (window.innerWidth > 640) return;

  const grid = document.querySelector('.portfolio__grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.project-card');
  if (cards.length < 2) return;

  const dots = document.createElement('div');
  dots.className = 'scroll-dots';
  dots.setAttribute('aria-hidden', 'true');
  dots.style.cssText = 'display:flex;justify-content:center;gap:6px;padding:0.75rem 0;';

  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.style.cssText = 'width:6px;height:6px;border-radius:50%;background:' + (i === 0 ? 'var(--gold)' : 'var(--surface-2)') + ';transition:background 0.3s,transform 0.3s;';
    dots.appendChild(dot);
  });

  grid.parentNode.insertBefore(dots, grid.nextSibling);

  let ticking = false;
  grid.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollLeft = grid.scrollLeft;
        const cardWidth = cards[0].offsetWidth + 16;
        const activeIndex = Math.round(scrollLeft / cardWidth);
        dots.querySelectorAll('span').forEach((dot, i) => {
          if (i === activeIndex) {
            dot.style.background = 'var(--gold)';
            dot.style.transform = 'scale(1.3)';
          } else {
            dot.style.background = 'var(--surface-2)';
            dot.style.transform = 'scale(1)';
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


/* ─────────────────────────────────────────────
   UTILITAIRES
───────────────────────────────────────────── */
function simulateApiCall(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ─────────────────────────────────────────────
   IFRAME PREVIEW — responsive scale
───────────────────────────────────────────── */
function initIframeScale() {
  const iframes = document.querySelectorAll('.project-card__preview iframe');
  if (!iframes.length) return;

  function scaleIframes() {
    iframes.forEach(iframe => {
      const container = iframe.closest('.project-card__preview');
      if (!container) return;
      const scale = container.offsetWidth / 1440;
      iframe.style.transform = `scale(${scale})`;
    });
  }

  scaleIframes();
  window.addEventListener('resize', scaleIframes);
}
