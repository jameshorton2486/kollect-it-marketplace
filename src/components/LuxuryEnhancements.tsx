'use client';

import { useEffect, useState } from 'react';

export default function LuxuryEnhancements() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Targets: product/category cards, headings, trust pills, CTAs, footer cols, plus [data-reveal]
    const selector = [
      '.product-card',
      '.product-card-category',
      '.section-heading',
      '.section-title-main',
      '.section-subtitle',
      '.trust-pills span',
      '.trust-pill',
      '.cta-block',
      '.footer-col',
      '.footer-column',
      '.category-card',
      '[data-reveal]'
    ].join(',');

    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));

    // Prepare elements (once)
    els.forEach((el, idx) => {
      el.classList.add('reveal');
      // Support both data attributes: data-stagger-ms and data-reveal-delay (alias)
      const alias = el.dataset.revealDelay;
      const stagger = el.dataset.staggerMs;
      const base = Number(stagger ?? alias ?? 50); // default 50ms
      // A tasteful stagger, wrap every 10 for natural rhythm
      el.style.transitionDelay = `${(idx % 10) * base}ms`;
    });

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '40px' }
    );

    els.forEach(el => io.observe(el));

    // Parallax Elements
    const parallaxEls = document.querySelectorAll<HTMLElement>('[data-parallax]');
    parallaxEls.forEach(el => io.observe(el));

    // Counter Elements with Count-Up Animation
    const counterEls = document.querySelectorAll<HTMLElement>('[data-count]');
    const counterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add('is-in');

            // Animate count-up
            const target = parseInt(el.dataset.count || '0');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                el.textContent = target.toLocaleString();
                clearInterval(timer);
              } else {
                el.textContent = Math.floor(current).toLocaleString();
              }
            }, 16);

            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    counterEls.forEach(el => counterObserver.observe(el));

    // Trust Icon Items (staggered reveal)
    const trustIcons = document.querySelectorAll<HTMLElement>('.trust-icon-item');
    trustIcons.forEach((el, idx) => {
      el.style.transitionDelay = `${idx * 100}ms`;
    });
    trustIcons.forEach(el => io.observe(el));

    // Counter Items (staggered reveal)
    const counterItems = document.querySelectorAll<HTMLElement>('.counter-item');
    counterItems.forEach((el, idx) => {
      el.style.transitionDelay = `${idx * 150}ms`;
    });
    counterItems.forEach(el => io.observe(el));

    // CTA Pulse Elements
    const ctaPulse = document.querySelectorAll<HTMLElement>('.cta-pulse');
    ctaPulse.forEach(el => io.observe(el));

    // Animated Dividers
    const dividers = document.querySelectorAll<HTMLElement>('.animated-divider');
    dividers.forEach(el => io.observe(el));

    // Parallax Background Scroll Effect
    const handleParallaxScroll = () => {
      const parallaxBg = document.querySelectorAll<HTMLElement>('.parallax-bg');
      parallaxBg.forEach(el => {
        const rect = el.getBoundingClientRect();
        const scrollOffset = window.scrollY;
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-scrolling');
          el.style.setProperty('--scroll-offset', String(scrollOffset * 0.5));
        }
      });
    };

    // Scroll Progress Indicator
    const updateScrollProgress = () => {
      const progressBar = document.querySelector<HTMLElement>('.scroll-progress');
      if (progressBar) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
      }
    };

    // Sticky Cart Panel (Product Page)
    const handleStickyCart = () => {
      const stickyPanel = document.querySelector<HTMLElement>('.sticky-cart-panel');
      if (stickyPanel) {
        if (window.scrollY > 300) {
          stickyPanel.classList.add('visible');
        } else {
          stickyPanel.classList.remove('visible');
        }
      }
    };

    // FAQ Scroll Into View on Open
    const faqItems = document.querySelectorAll<HTMLDetailsElement>('.faq-item');
    faqItems.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          setTimeout(() => {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      });
    });

    // Split Fade Elements (About Page)
    const splitFadeEls = document.querySelectorAll<HTMLElement>('.split-fade-left, .split-fade-right');
    splitFadeEls.forEach(el => io.observe(el));

    // Section Headers with Icons (Shipping & Returns)
    const sectionHeaders = document.querySelectorAll<HTMLElement>('.section-header-with-icon');
    sectionHeaders.forEach(el => io.observe(el));

    // Auth Seal (Authentication Page)
    const authSeal = document.querySelectorAll<HTMLElement>('.auth-seal');
    authSeal.forEach(el => io.observe(el));

    // Verification Timeline (Authentication Page)
    const verificationTimeline = document.querySelectorAll<HTMLElement>('.verification-timeline');
    verificationTimeline.forEach(el => io.observe(el));

    // Form Groups (Auth Pages)
    const formGroups = document.querySelectorAll<HTMLElement>('.form-group');
    formGroups.forEach((el, idx) => {
      el.style.transitionDelay = `${idx * 100}ms`;
      io.observe(el);
    });

    // Checkout Sections
    const checkoutSections = document.querySelectorAll<HTMLElement>('.checkout-section');
    checkoutSections.forEach(el => io.observe(el));

    // Password Toggle Functionality
    const passwordToggles = document.querySelectorAll<HTMLElement>('.password-toggle');
    passwordToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling as HTMLInputElement;
        if (input && input.type === 'password') {
          input.type = 'text';
          toggle.classList.add('active');
        } else if (input) {
          input.type = 'password';
          toggle.classList.remove('active');
        }
      });
    });

    // Character Counter (Contact Page)
    const messageField = document.querySelector<HTMLTextAreaElement>('#message');
    const charCounter = document.querySelector<HTMLElement>('.character-counter');
    if (messageField && charCounter) {
      const updateCounter = () => {
        const remaining = 500 - messageField.value.length;
        charCounter.textContent = `${messageField.value.length} / 500`;
        if (remaining < 50) {
          charCounter.classList.add('warning');
        } else {
          charCounter.classList.remove('warning');
        }
      };
      messageField.addEventListener('input', updateCounter);
    }

    // Back to Top Button visibility
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
      handleParallaxScroll();
      updateScrollProgress();
      handleStickyCart();
    };

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      io.disconnect();
      counterObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
      aria-label="Back to top"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
