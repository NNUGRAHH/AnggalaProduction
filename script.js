/* ===========================================================
   ANGGALA PRODUCTION — SCRIPT
   Dropdown menu · smooth scroll · scroll reveal · count-up stats
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. DROPDOWN MENU (hamburger) ---------- */
  const menuBtn   = document.getElementById('menuBtn');
  const dropdown  = document.getElementById('dropdownMenu');
  const backdrop  = document.getElementById('dropdownBackdrop');

  const openMenu = () => {
    dropdown.classList.add('is-active');
    backdrop.classList.add('is-active');
    menuBtn.classList.add('is-active');
    menuBtn.setAttribute('aria-expanded', 'true');
    dropdown.setAttribute('aria-hidden', 'false');
  };

  const closeMenu = () => {
    dropdown.classList.remove('is-active');
    backdrop.classList.remove('is-active');
    menuBtn.classList.remove('is-active');
    menuBtn.setAttribute('aria-expanded', 'false');
    dropdown.setAttribute('aria-hidden', 'true');
  };

  const toggleMenu = () => {
    dropdown.classList.contains('is-active') ? closeMenu() : openMenu();
  };

  menuBtn.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* close menu after picking a destination */
  dropdown.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  /* ---------- 2. "LIHAT LAYANAN" → SCROLL TO #layanan ---------- */
  const lihatLayananBtn = document.getElementById('lihatLayananBtn');
  const layananSection  = document.getElementById('layanan');

  lihatLayananBtn.addEventListener('click', () => {
    layananSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- 3. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 4. ANIMATED COUNT-UP (Our Experience) ---------- */
  const statNumbers = document.querySelectorAll('.stat__num');

  const formatID = (num) => num.toLocaleString('id-ID');

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1600; /* ms */
    const start = performance.now();

    /* easeOutExpo — fast start, gentle iOS-like settle */
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const value = Math.round(eased * target);
      el.textContent = formatID(value);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = formatID(target);
      }
    };

    requestAnimationFrame(tick);
  };

  const experienceSection = document.getElementById('pengalaman');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(el => animateCount(el));
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  if (experienceSection) statsObserver.observe(experienceSection);

  /* ---------- 5. SERVICE BUTTONS (placeholder — detail pages coming later) ---------- */
  document.querySelectorAll('.service-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      /* TODO: arahkan ke halaman detail layanan saat sudah dibuat */
      console.log('Layanan dipilih:', btn.dataset.service);
    });
  });

  /* ---------- 6. FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 7. BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');

  const toggleBackToTop = () => {
    if (window.scrollY > window.innerHeight * 0.6) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  };

  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 8. LOGO FALLBACK ----------
     Shows clean text instead of a broken-image icon until logo.png is added
     to assets/images/. Safe to remove once the real file is in place. */
  document.querySelectorAll('.brand__logo, .about__logo').forEach((img) => {
    img.addEventListener('error', () => {
      const label = img.classList.contains('about__logo') ? 'Anggala Production' : 'Anggala';
      const span = document.createElement('span');
      span.className = 'logo-fallback';
      span.textContent = label;
      img.replaceWith(span);
    }, { once: true });
  });

});
