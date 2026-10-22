/* ============================================================
   Yishog Integrated Services — Main JavaScript
   Features: sticky header, scroll-reveal, counter animations,
             back-to-top, mobile nav, lazy images
   ============================================================ */

(function () {
  'use strict';

  /* ── Sticky Header ───────────────────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    let lastScroll = 0;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 60);
      lastScroll = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Nav ──────────────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav   = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
    });

    // Mobile dropdown toggles
    siteNav.querySelectorAll('.nav-item').forEach(item => {
      const link = item.querySelector('.nav-link');
      if (item.querySelector('.nav-dropdown') && link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 860) {
            e.preventDefault();
            item.classList.toggle('dropdown-open');
          }
        });
      }
    });

    // Close nav when a leaf link is clicked
    siteNav.querySelectorAll('a:not(.nav-link)').forEach(a => {
      a.addEventListener('click', () => {
        siteNav.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        siteNav.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });
  }

  /* ── Scroll-Reveal (Intersection Observer) ───────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings inside a grid
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'))
            : [];
          const idx = siblings.indexOf(entry.target);
          const delay = Math.min(idx * 80, 400);
          setTimeout(() => entry.target.classList.add('revealed'), delay);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ── Lazy Image Entrances ────────────────────────────────── */
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  if (lazyImgs.length && 'IntersectionObserver' in window) {
    const imgObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.45s ease';
          entry.target.addEventListener('load', () => {
            entry.target.style.opacity = '1';
          }, { once: true });
          imgObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '100px' });

    lazyImgs.forEach(img => {
      img.style.opacity = '0';
      imgObs.observe(img);
      if (img.complete) img.style.opacity = '1';
    });
  }

  /* ── Counter Animations ──────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target) || 0;
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1600;
    const start    = performance.now();

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = target * easeOut(progress);
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObs.observe(el));
  }

  /* ── Back to Top ─────────────────────────────────────────── */
  const bttBtn = document.getElementById('back-to-top');
  if (bttBtn) {
    window.addEventListener('scroll', () => {
      bttBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Active Nav Link ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h-sm')) || 58;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
