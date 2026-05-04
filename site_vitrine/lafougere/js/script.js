/* ================================================
   LA FOUGÈRE — script.js
================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navigation sticky ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Burger menu mobile ── */
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Ferme au clic sur un lien
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Filtres catalogue ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  if (filterBtns.length && productCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        productCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = match ? '' : 'none';
            if (match) {
              requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            }
          }, 200);
        });
      });
    });
  }

  /* ── Boutons "Commander" ── */
  document.querySelectorAll('.product-action').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = 'Ajoute';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = 'Commander';
        btn.classList.remove('added');
      }, 2200);
    });
  });

  /* ── Formulaire contact ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      btn.textContent = 'Envoi en cours…';
      btn.disabled = true;
      setTimeout(() => {
        contactForm.style.display = 'none';
        const success = document.getElementById('formSuccess');
        if (success) success.style.display = 'block';
      }, 1200);
    });
  }

  /* ── Scroll animations (Intersection Observer) ── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.07}s`;
      observer.observe(el);
    });
  }

});
