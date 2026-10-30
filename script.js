/**
 * MASTER PORTFOLIO JAVASCRIPT — MOHITH GOWD MARIDHU
 * Handles interactive behaviors, navigation, accordions, project filtering, lightboxes, and form validation
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. THEME TOGGLE (DARK / LIGHT MODE)
     ========================================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Retrieve saved theme or default to light
  const savedTheme = localStorage.getItem('mohith_portfolio_theme') || 'light';
  body.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('mohith_portfolio_theme', newTheme);
    });
  }

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const closeMobileMenu = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
    if (mobileDrawerBackdrop) {
      mobileDrawerBackdrop.classList.remove('open');
    }
    document.body.classList.remove('mobile-menu-open');
  };

  const openMobileMenu = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.add('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
    if (mobileDrawerBackdrop) {
      mobileDrawerBackdrop.classList.add('open');
    }
    document.body.classList.add('mobile-menu-open');
  };

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close drawer when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close when backdrop is clicked
    if (mobileDrawerBackdrop) {
      mobileDrawerBackdrop.addEventListener('click', () => {
        closeMobileMenu();
      });
    }

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open')) {
        if (!mobileMenuBtn.contains(e.target) && !mobileDrawer.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  /* ==========================================================================
     3. ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);

  /* ==========================================================================
     4. SERVICES ACCORDION (Single Active Item)
     ========================================================================== */
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const isAlreadyActive = card.classList.contains('active');

      // Close all cards
      serviceCards.forEach(otherCard => {
        otherCard.classList.remove('active');
        const icon = otherCard.querySelector('.toggle-icon');
        if (icon) icon.textContent = '↗';
      });

      // If clicked card was not active, open it
      if (!isAlreadyActive) {
        card.classList.add('active');
        const icon = card.querySelector('.toggle-icon');
        if (icon) icon.textContent = '✕';
      }
    });
  });

  /* ==========================================================================
     5. STATS ANIMATED COUNTER ON SCROLL
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const countUpStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      let count = 0;
      const increment = Math.ceil(target / 15) || 1;
      const speed = 60;

      const updateCount = () => {
        if (count < target) {
          count += increment;
          if (count > target) count = target;
          stat.textContent = count;
          setTimeout(updateCount, speed);
        } else {
          stat.textContent = target;
        }
      };

      updateCount();
    });
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          countUpStats();
          statsCounted = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     6. PROJECT FILTER TABS
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'grid';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* ==========================================================================
     7. LIGHTBOX MODAL (CERTIFICATES & PROJECT SCREENSHOTS)
     ========================================================================== */
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const openLightboxBtns = document.querySelectorAll('.open-lightbox-btn');

  const openLightbox = (imgSrc, caption) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = caption || 'Certificate preview';
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openLightboxBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = btn.getAttribute('data-img');
      const caption = btn.getAttribute('data-caption');
      if (imgSrc) openLightbox(imgSrc, caption);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Certificate wrapper click to open lightbox
  const certWrappers = document.querySelectorAll('.achievement-cert-wrapper');
  certWrappers.forEach(wrap => {
    wrap.addEventListener('click', (e) => {
      if (e.target.closest('.open-lightbox-btn')) return;
      const btn = wrap.querySelector('.open-lightbox-btn');
      if (btn) btn.click();
    });
  });

  /* ==========================================================================
     MOBILE INTERACTIVE COLLAPSIBLES (ABOUT, SKILLS, TOOLKIT, PROJECTS, CONTACT)
     ========================================================================== */
  
  // 1. About Me Collapsible
  const aboutToggleBtn = document.getElementById('aboutToggleBtn');
  const aboutCollapseContent = document.getElementById('aboutCollapseContent');
  if (aboutToggleBtn && aboutCollapseContent) {
    aboutToggleBtn.addEventListener('click', () => {
      const isOpen = aboutCollapseContent.classList.contains('open');
      if (isOpen) {
        aboutCollapseContent.classList.remove('open');
        aboutToggleBtn.classList.remove('open');
        aboutToggleBtn.setAttribute('aria-expanded', 'false');
        const text = aboutToggleBtn.querySelector('.toggle-icon-text');
        if (text) text.textContent = 'View Bio';
      } else {
        aboutCollapseContent.classList.add('open');
        aboutToggleBtn.classList.add('open');
        aboutToggleBtn.setAttribute('aria-expanded', 'true');
        const text = aboutToggleBtn.querySelector('.toggle-icon-text');
        if (text) text.textContent = 'Collapse';
      }
    });
  }

  // 2. Skills Category Expand/Collapse on Mobile
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');
  skillCategoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        const isOpen = card.classList.contains('open');
        card.classList.toggle('open');
        card.setAttribute('aria-expanded', !isOpen);
        const indicator = card.querySelector('.skill-cat-toggle-indicator');
        if (indicator) {
          indicator.textContent = isOpen ? '+' : '−';
        }
      }
    });
  });

  // 3. Digital Creative Toolkit Details on Tap on Mobile
  const toolCards = document.querySelectorAll('.tool-card');
  toolCards.forEach(card => {
    card.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        const isOpen = card.classList.contains('open');
        toolCards.forEach(c => {
          if (c !== card) {
            c.classList.remove('open');
            c.setAttribute('aria-expanded', 'false');
          }
        });
        card.classList.toggle('open');
        card.setAttribute('aria-expanded', !isOpen);
      }
    });
  });

  // 4. Projects Mobile Toggle
  const mobileToggleProjectsBtn = document.getElementById('mobileToggleProjectsBtn');
  const mobileProjectsWrapper = document.getElementById('mobileProjectsWrapper');
  const projectsToggleLabel = document.getElementById('projectsToggleLabel');
  if (mobileToggleProjectsBtn && mobileProjectsWrapper) {
    mobileToggleProjectsBtn.addEventListener('click', () => {
      const isOpen = mobileProjectsWrapper.classList.contains('open');
      if (isOpen) {
        mobileProjectsWrapper.classList.remove('open');
        mobileToggleProjectsBtn.classList.remove('open');
        mobileToggleProjectsBtn.setAttribute('aria-expanded', 'false');
        if (projectsToggleLabel) projectsToggleLabel.textContent = 'Open My Projects';
      } else {
        mobileProjectsWrapper.classList.add('open');
        mobileToggleProjectsBtn.classList.add('open');
        mobileToggleProjectsBtn.setAttribute('aria-expanded', 'true');
        if (projectsToggleLabel) projectsToggleLabel.textContent = 'Collapse Projects';
      }
    });
  }

  // 5. Contact Form Mobile Toggle
  const contactToggleBtn = document.getElementById('contactToggleBtn');
  const contactFormBox = document.getElementById('contactFormBox');

  const openContactForm = () => {
    if (contactFormBox) {
      contactFormBox.classList.add('open');
    }
    if (contactToggleBtn) {
      contactToggleBtn.classList.add('open');
      contactToggleBtn.setAttribute('aria-expanded', 'true');
      const text = contactToggleBtn.querySelector('.form-toggle-text');
      if (text) text.textContent = 'Close Form';
    }
  };

  const closeContactForm = () => {
    if (contactFormBox) {
      contactFormBox.classList.remove('open');
    }
    if (contactToggleBtn) {
      contactToggleBtn.classList.remove('open');
      contactToggleBtn.setAttribute('aria-expanded', 'false');
      const text = contactToggleBtn.querySelector('.form-toggle-text');
      if (text) text.textContent = 'Open Form';
    }
  };

  if (contactToggleBtn && contactFormBox) {
    contactToggleBtn.addEventListener('click', () => {
      const isOpen = contactFormBox.classList.contains('open');
      if (isOpen) {
        closeContactForm();
      } else {
        openContactForm();
      }
    });
  }

  // If any link to #contact is clicked on mobile, ensure the contact form expands
  const contactLinks = document.querySelectorAll('a[href="#contact"]');
  contactLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        openContactForm();
      }
    });
  });

  /* ==========================================================================
     8. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Toggle clicked item
        if (isActive) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          const icon = item.querySelector('.faq-icon-circle');
          if (icon) icon.textContent = '+';
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          const icon = item.querySelector('.faq-icon-circle');
          if (icon) icon.textContent = '−';
        }
      });
    }
  });

  /* ==========================================================================
     9. CONTACT FORM VALIDATION & SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const toastNotification = document.getElementById('toastNotification');

  const showToast = (title, message) => {
    if (!toastNotification) return;
    const tTitle = toastNotification.querySelector('.toast-title');
    const tMsg = toastNotification.querySelector('.toast-message');

    if (tTitle && title) tTitle.textContent = title;
    if (tMsg && message) tMsg.textContent = message;

    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4500);
  };

  /* ==========================================================================
     SMART EMAIL DISPATCHER (LAPTOP WEB GMAIL VS MOBILE NATIVE MAIL APP)
     ========================================================================== */
  const isMobileDevice = () => {
    const ua = (navigator.userAgent || '').toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'opera mini', 'mobile'];
    for (let i = 0; i < mobileKeywords.length; i++) {
      if (ua.includes(mobileKeywords[i])) return true;
    }
    // Apple iPad Desktop Safari check
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
      return true;
    }
    return false;
  };

  const getWebGmailUrl = (to, subject, body) => {
    const encTo = encodeURIComponent(to || 'maridhumohithgowd630@gmail.com');
    const encSubject = encodeURIComponent(subject || 'Portfolio Inquiry — Mohith Gowd Maridhu');
    const encBody = encodeURIComponent(body || '');
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encTo}&su=${encSubject}&body=${encBody}`;
  };

  const getNativeMailtoUrl = (to, subject, body) => {
    const encTo = to || 'maridhumohithgowd630@gmail.com';
    const encSubject = encodeURIComponent(subject || 'Portfolio Inquiry — Mohith Gowd Maridhu');
    const encBody = encodeURIComponent(body || '');
    return `mailto:${encTo}?subject=${encSubject}&body=${encBody}`;
  };

  const openSmartEmail = (to, subject, body) => {
    const targetEmail = to || 'maridhumohithgowd630@gmail.com';

    if (isMobileDevice()) {
      // Mobile Phone / Tablet: Trigger native mail app compose screen directly
      window.location.href = getNativeMailtoUrl(targetEmail, subject, body);
    } else {
      // Laptop / Desktop / PC: Open Gmail Web Composer directly in a new tab with everything filled in
      const webGmailUrl = getWebGmailUrl(targetEmail, subject, body);
      const a = document.createElement('a');
      a.href = webGmailUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Configure all direct mail links across the website on page load
  const directMailLinks = document.querySelectorAll('a[href^="mailto:"]');
  directMailLinks.forEach(link => {
    const defaultSubject = 'Inquiry / Project Collaboration — Mohith Gowd Maridhu';
    const defaultBody = 'Hi Mohith,\n\nI visited your portfolio website and would like to connect with you regarding:\n\n';

    if (!isMobileDevice()) {
      // On Laptop/Desktop: Set direct link href to Web Gmail so clicks immediately open Web Gmail in new tab
      link.href = getWebGmailUrl('maridhumohithgowd630@gmail.com', defaultSubject, defaultBody);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      // On Mobile: Set mailto with prefilled subject & body
      link.href = getNativeMailtoUrl('maridhumohithgowd630@gmail.com', defaultSubject, defaultBody);
    }

    link.addEventListener('click', (e) => {
      e.preventDefault();
      openSmartEmail('maridhumohithgowd630@gmail.com', defaultSubject, defaultBody);
    });
  });

  /* Resume / CV empty / update-in-progress notification */
  const resumeBtns = document.querySelectorAll('.resume-action-btn');
  resumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(
        'Resume Status: In Progress',
        'Mohith is currently preparing a brand new resume with recent AI projects, hackathon achievements, and verified stacks. The updated version will be uploaded soon!'
      );
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const interestInput = document.getElementById('contactInterest');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');

      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const interestError = document.getElementById('interestError');
      const messageError = document.getElementById('messageError');

      // Clear errors
      nameError.textContent = '';
      emailError.textContent = '';
      interestError.textContent = '';
      messageError.textContent = '';

      let isValid = true;

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email address.';
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Please provide a valid email format.';
        isValid = false;
      }

      if (!interestInput.value) {
        interestError.textContent = 'Please select an area of collaboration.';
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please write a brief message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 8) {
        messageError.textContent = 'Message should be at least 8 characters.';
        isValid = false;
      }

      if (isValid) {
        const toEmail = 'maridhumohithgowd630@gmail.com';
        const emailSubject = subjectInput.value.trim()
          ? `${subjectInput.value.trim()} [Portfolio Inquiry]`
          : `Portfolio Inquiry: ${interestInput.value} — from ${nameInput.value.trim()}`;

        const emailBody = 
`Hi Mohith,

Name: ${nameInput.value.trim()}
Email: ${emailInput.value.trim()}
Collaboration Area: ${interestInput.value}

Message:
${messageInput.value.trim()}

---
Sent via Mohith Gowd Maridhu's Portfolio Website`;

        // Synchronously open email without setTimeout delay so browser treats it as a direct trusted user gesture
        openSmartEmail(toEmail, emailSubject, emailBody);

        showToast(
          'Email Compose Screen Opened!',
          `Hello ${nameInput.value.trim()}! Your message is ready in your email draft. Just click Send!`
        );

        contactForm.reset();
      }
    });
  }

  /* ==========================================================================
     10. BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     11. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('active'));
  }

});
