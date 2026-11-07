/**
 * ==========================================================================
 * 1989 COASTAL VINTAGE THEME - JAVASCRIPT
 * Portfolio of Diandra Anggari
 * 
 * Features:
 * 1. Mobile Navigation (Hamburger Menu Toggle & ARIA Accessibility)
 * 2. Dark Mode Toggle (Local Storage Persistence & Icon State)
 * 3. Smooth Scrolling & Scrolled Header Effect
 * 4. Timed Logo Animation Trigger
 * 5. Contact Form (mailto)
 * 6. Cursor Glow
 * 7. Projects Carousel (tombol geser)
 * 8. Experience Timeline Glow (mengikuti scroll)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========================================================================
  // 1. MOBILE NAVIGATION (HAMBURGER MENU)
  // ========================================================================
  const hamburgerBtn = document.getElementById('hamburger-menu') || document.querySelector('.hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (hamburgerBtn && navMenu) {
    /**
     * Toggles the mobile menu open/closed state and updates ARIA attributes.
     * @param {boolean} [forceClose=false] - If true, forces the menu to close.
     */
    const toggleMenu = (forceClose = false) => {
      const isOpen = forceClose ? false : !navMenu.classList.contains('open');

      navMenu.classList.toggle('open', isOpen);
      hamburgerBtn.classList.toggle('is-active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    };

    // Toggle menu when clicking the hamburger button
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close the menu when any nav link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMenu(true);
      });
    });

    // Close menu when clicking outside of navbar
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        toggleMenu(true);
      }
    });

    // Close menu on pressing the Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(true);
        hamburgerBtn.focus();
      }
    });
  }

  // ========================================================================
  // 2. DARK MODE TOGGLE & LOCAL STORAGE PERSISTENCE
  // ========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const THEME_STORAGE_KEY = 'portfolio_theme';

  /**
   * Updates the UI theme class, data-theme attribute, and FontAwesome icon.
   * @param {boolean} isDark - True for dark mode, false for light mode.
   */
  const setThemeState = (isDark) => {
    document.body.classList.toggle('dark-theme', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
      );

      const icon = themeToggleBtn.querySelector('i');
      if (icon) {
        if (isDark) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        } else {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        }
      }
    }
  };

  // Crucial: Check localStorage on page load and apply theme immediately
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  } catch (err) {
    // Storage bisa diblokir (mode private / pengaturan browser); lanjut tanpa menyimpan.
  }
  if (savedTheme === 'dark') {
    setThemeState(true);
  } else if (savedTheme === 'light') {
    setThemeState(false);
  } else {
    // If no preference saved, respect system preference
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemeState(systemPrefersDark);
  }

  // Handle theme toggle button click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const willBeDark = !document.body.classList.contains('dark-theme');
      setThemeState(willBeDark);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, willBeDark ? 'dark' : 'light');
      } catch (err) {
        // Abaikan: tema tetap berubah, hanya tidak tersimpan.
      }
    });
  }

  // ========================================================================
  // 3. SMOOTH SCROLLING & SCROLLED HEADER EFFECT
  // ========================================================================
  const header = document.querySelector('.header');

  // Add scroll listener: if window.scrollY > 50, add .header--scrolled
  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  // Initial check on load in case the page was reloaded scrolled down
  handleHeaderScroll();

  // Smooth scrolling for all internal anchor links (href starting with "#")
  const internalAnchorLinks = document.querySelectorAll('a[href^="#"]');

  internalAnchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Calculate offset position accounting for sticky header height
        const headerHeight = header ? header.offsetHeight : 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Set focus to the target element for keyboard accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  // ========================================================================
  // 4. LOGO ANIMATION TRIGGER
  // ========================================================================
  const logo = document.getElementById('logo-animation');

  /**
   * Triggers the logo animation 1 second after DOMContentLoaded.
   */
  const triggerLogoAnimation = () => {
    if (logo) {
      setTimeout(() => {
        logo.classList.add('is-animated');
      }, 1000);
    }
  };

  triggerLogoAnimation();

  // ========================================================================
  // 5. CONTACT FORM MAILTO SUBMISSION
  // ========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name || 'Prospective Collaborator'}`);
      const body = encodeURIComponent(
        `Hi Diandra,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
      );

      window.location.href = `mailto:hi.diandraanggari@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // ========================================================================
  // 6. CURSOR GLOW (hanya di perangkat dengan mouse)
  // ========================================================================
  const glow = document.querySelector('.cursor-glow');
  const hasHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

  if (glow && hasHover) {
    let glowX = 0;
    let glowY = 0;
    let ticking = false;

    // requestAnimationFrame: gerakan lebih halus & hemat performa
    document.addEventListener('mousemove', (e) => {
      glowX = e.clientX;
      glowY = e.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          glow.style.left = glowX + 'px';
          glow.style.top = glowY + 'px';
          ticking = false;
        });
      }
    });

    // Membesar sedikit saat hover di elemen yang bisa diklik
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        glow.style.transform = 'translate(-50%, -50%) scale(1.3)';
      });
      el.addEventListener('mouseleave', () => {
        glow.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }

  // ========================================================================
  // 7. PROJECTS CAROUSEL (tombol geser; swipe/scroll native tetap berfungsi)
  // ========================================================================
  const track = document.getElementById('projects-track');
  const prevBtn = document.getElementById('projects-prev');
  const nextBtn = document.getElementById('projects-next');
  const controls = document.getElementById('projects-controls');

  if (track && prevBtn && nextBtn) {
    const prefersReducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getStep = () => {
      const card = track.querySelector('.project-card');
      if (!card) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };

    const updateCarousel = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const canScroll = maxScroll > 4;
      if (controls) controls.hidden = !canScroll;
      prevBtn.disabled = track.scrollLeft <= 4;
      nextBtn.disabled = track.scrollLeft >= maxScroll - 4;
    };

    const scrollByStep = (direction) => {
      track.scrollBy({
        left: direction * getStep(),
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    };

    prevBtn.addEventListener('click', () => scrollByStep(-1));
    nextBtn.addEventListener('click', () => scrollByStep(1));

    let carouselTicking = false;
    track.addEventListener('scroll', () => {
      if (carouselTicking) return;
      carouselTicking = true;
      requestAnimationFrame(() => {
        updateCarousel();
        carouselTicking = false;
      });
    }, { passive: true });

    window.addEventListener('resize', updateCarousel);
    window.addEventListener('load', updateCarousel);
    updateCarousel();
  }

  // ========================================================================
  // 8. EXPERIENCE TIMELINE: CAHAYA BIRU MENGIKUTI SCROLL
  // ========================================================================
  const timeline = document.querySelector('.timeline');

  if (timeline) {
    const progress = document.createElement('div');
    progress.className = 'timeline__progress';
    progress.setAttribute('aria-hidden', 'true');
    timeline.appendChild(progress);

    const dots = Array.from(timeline.querySelectorAll('.timeline-dot'));
    let timelineTicking = false;

    const updateTimeline = () => {
      const rect = timeline.getBoundingClientRect();
      // Garis acuan di 60% tinggi layar: cahaya "turun" saat halaman di-scroll
      const reference = window.innerHeight * 0.6;
      const reached = Math.min(Math.max(reference - rect.top, 0), rect.height);
      progress.style.height = reached + 'px';

      dots.forEach((dot) => {
        const dotY = dot.getBoundingClientRect().top - rect.top + dot.offsetHeight / 2;
        dot.classList.toggle('is-active', dotY <= reached);
      });
    };

    const onTimelineScroll = () => {
      if (timelineTicking) return;
      timelineTicking = true;
      requestAnimationFrame(() => {
        updateTimeline();
        timelineTicking = false;
      });
    };

    window.addEventListener('scroll', onTimelineScroll, { passive: true });
    window.addEventListener('resize', onTimelineScroll);
    window.addEventListener('load', updateTimeline);
    updateTimeline();
  }
});
