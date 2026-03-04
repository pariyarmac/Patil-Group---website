/* ============================================================
   main.js — Patil Group Local Clone Interactive Behaviours
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR: Hide on scroll-down, show on scroll-up ---- */
  const navbar = document.getElementById('navbar');
  const navbarWrapper = document.getElementById('navbar-wrapper');
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentY = window.scrollY;

        // Scrolled state (slightly more opaque glass)
        if (currentY > 20) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Hide when scrolling DOWN past 80px, show when scrolling UP
        if (currentY > lastScrollY && currentY > 80) {
          navbarWrapper.classList.add('nav-hidden');
        } else {
          navbarWrapper.classList.remove('nav-hidden');
        }

        lastScrollY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  });

  /* ---- MOBILE MENU ---- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMenu() {
    mobileMenu.style.transform = 'translateX(0)';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.style.transform = 'translateX(100%)';
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMenu);

  /* ---- HERO VIDEO: autoplay ---- */
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    heroVideo.play().catch(() => {
      // Autoplay blocked — video stays paused, poster shows
    });
  }

  /* ---- SCROLL REVEAL: Highlight cards ---- */
  const cards = document.querySelectorAll('.highlight-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => revealObserver.observe(card));

  /* ---- SCROLL REVEAL: Project cards ---- */
  const projectSlides = document.querySelectorAll('.project-slide');
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        projectObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  projectSlides.forEach(slide => projectObserver.observe(slide));

  // Ensure all project slides are visible for the infinite loop
  document.querySelectorAll('.project-slide').forEach(slide => {
    slide.classList.add('visible');
    slide.style.opacity = '1';
    slide.style.transform = 'translateY(0)';
  });

  /* ---- PROJECT CAROUSEL (Infinite Loop & Pause on Hover) ---- */
  const track = document.getElementById('carousel-track');
  const container = document.getElementById('carousel-container');

  // Remove transition from track to allow smooth requestAnimationFrame updates
  if (track) {
    track.classList.remove('transition-transform', 'duration-500', 'ease-out');
  }
  const slides = Array.from(track.querySelectorAll('.project-slide'));
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (track && container && slides.length > 0) {
    // Clone slides for infinite loop
    slides.forEach(slide => {
      const clone = slide.cloneNode(true);
      track.appendChild(clone);
    });

    let scrollPos = 0;
    let isPaused = false;
    const speed = 0.8; // Pixels per frame

    function getSlideWidth() {
      const slide = slides[0];
      const style = window.getComputedStyle(slide);
      const parentStyle = window.getComputedStyle(track);
      const margin = parseFloat(style.marginRight) || 0;
      const gap = parseFloat(parentStyle.gap) || 0;
      return slide.offsetWidth + margin + gap;
    }

    function animate() {
      if (!isPaused) {
        scrollPos += speed;
        const totalWidth = getSlideWidth() * slides.length;

        if (scrollPos >= totalWidth) {
          scrollPos = 0;
        }

        track.style.transform = `translateX(-${scrollPos}px)`;
      }
      requestAnimationFrame(animate);
    }

    // Start animation
    requestAnimationFrame(animate);

    // Pause on hover
    container.addEventListener('mouseenter', () => {
      isPaused = true;
    });
    container.addEventListener('mouseleave', () => {
      isPaused = false;
    });

    // Button controls (Simple jumps)
    if (prevBtn && nextBtn) {
      nextBtn.addEventListener('click', () => {
        const step = getSlideWidth();
        scrollPos += step;
        const totalWidth = getSlideWidth() * slides.length;
        if (scrollPos >= totalWidth) scrollPos -= totalWidth;
        track.style.transform = `translateX(-${scrollPos}px)`;
      });

      prevBtn.addEventListener('click', () => {
        const step = getSlideWidth();
        scrollPos -= step;
        if (scrollPos < 0) {
          const totalWidth = getSlideWidth() * slides.length;
          scrollPos += totalWidth;
        }
        track.style.transform = `translateX(-${scrollPos}px)`;
      });

      // Ensure buttons are always enabled for infinite loop
      prevBtn.disabled = false;
      nextBtn.disabled = false;
      prevBtn.style.opacity = '1';
      nextBtn.style.opacity = '1';
    }

    // Handle resize
    window.addEventListener('resize', () => {
      scrollPos = 0;
      track.style.transform = `translateX(0)`;
    });
  }

  /* ---- NUMBER COUNTER ANIMATION ---- */
  function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const current = Math.floor(easeProgress * (end - start) + start);

      // Format number with commas
      obj.innerText = current.toLocaleString();

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Trigger animations
  setTimeout(() => {
    animateValue('stat-years', 0, 50, 2500);
    animateValue('stat-sleepers', 0, 4000000, 3000);
  }, 1000);



});
