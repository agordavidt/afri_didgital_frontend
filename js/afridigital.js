/**
 * AfriDigital — Shared Page Scripts
 * Covers: courses.html (department), contact.html, course_single.html (department-single)
 *
 * Sections:
 *  1. Navigation (Command Bar — shared across all pages)
 *  2. Scroll Reveal
 *  3. Back to Top
 *  4. Courses Page  (filter pills, sort, wishlist)
 *  5. Contact Page  (topic selector, form validation, FAQ pills)
 *  6. Course Single (tabs, curriculum accordion, sticky enroll card, wishlist)
 */

(function () {
  'use strict';

  /* ============================================================
     1. NAVIGATION — Command Bar
     Works with: #mainNav, #navBurger, #navMobile
  ============================================================ */
  var nav     = document.getElementById('mainNav');
  var burger  = document.getElementById('navBurger');
  var mobile  = document.getElementById('navMobile');

  if (nav) {
    var isPage = nav.classList.contains('nav-page');

    function updateNav() {
      if (isPage) {
        nav.classList.toggle('scrolled', window.scrollY > 40);
      } else {
        nav.classList.toggle('nav-solid', window.scrollY > 50);
      }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav(); // run on load
  }

  if (burger && mobile) {
    burger.addEventListener('click', function () {
      mobile.classList.toggle('open');
      burger.classList.toggle('open');
    });

    // Close mobile menu when clicking outside nav
    document.addEventListener('click', function (e) {
      if (nav && !nav.contains(e.target)) {
        mobile.classList.remove('open');
        burger.classList.remove('open');
      }
    });
  }


  /* ============================================================
     2. SCROLL REVEAL
     Works with: .sr elements (opacity + translateY animation)
  ============================================================ */
  var revealEls = document.querySelectorAll('.sr');
  if (revealEls.length) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('sr-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(function (el) { revealObs.observe(el); });
  }


  /* ============================================================
     3. BACK TO TOP
     Works with: .backtop
  ============================================================ */
  var backTop = document.querySelector('.backtop');
  if (backTop) {
    backTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ============================================================
     4. COURSES PAGE (courses.html → courses.html)
     Works with: .filter-pill, #courseCount, #coursesGrid,
                 .course-item[data-category], #sortSelect,
                 .btn-wishlist
  ============================================================ */
  var filterPills  = document.querySelectorAll('.filter-pill');
  var coursesGrid  = document.getElementById('coursesGrid');
  var courseCount  = document.getElementById('courseCount');
  var sortSelect   = document.getElementById('sortSelect');

  // --- Filter pills ---
  if (filterPills.length && coursesGrid) {
    filterPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        // Update active pill
        filterPills.forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active');

        var filter = this.dataset.filter || 'all';
        var visible = 0;

        document.querySelectorAll('.course-item').forEach(function (item) {
          var show = filter === 'all' || item.dataset.category === filter;
          item.style.display = show ? '' : 'none';
          if (show) {
            visible++;
            item.style.animationDelay = (visible * 0.055) + 's';
          }
        });

        if (courseCount) { courseCount.textContent = visible; }
      });
    });
  }

  // --- Sort select ---
  if (sortSelect && coursesGrid) {
    sortSelect.addEventListener('change', function () {
      var val = this.value;
      var items = Array.from(document.querySelectorAll('.course-item')).filter(function (el) {
        return el.style.display !== 'none';
      });

      items.sort(function (a, b) {
        if (val === 'price-low') {
          return parseFloat(a.dataset.price || 0) - parseFloat(b.dataset.price || 0);
        }
        if (val === 'price-high') {
          return parseFloat(b.dataset.price || 0) - parseFloat(a.dataset.price || 0);
        }
        if (val === 'rating') {
          return parseFloat(b.dataset.rating || 0) - parseFloat(a.dataset.rating || 0);
        }
        if (val === 'popular') {
          return parseInt(b.dataset.enrolled || 0, 10) - parseInt(a.dataset.enrolled || 0, 10);
        }
        // 'newest' or default — keep original DOM order (do nothing meaningful)
        return 0;
      });

      items.forEach(function (item) { coursesGrid.appendChild(item); });
    });
  }

  // --- Wishlist toggle (.btn-wishlist on courses listing) ---
  document.querySelectorAll('.btn-wishlist').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var icon = this.querySelector('i');
      if (!icon) return;
      var wished = icon.classList.contains('icofont-heart');
      icon.className = wished ? 'icofont-heart-alt' : 'icofont-heart';
      this.style.color = wished ? '' : '#EF4444';
      this.classList.toggle('wished', !wished);
      // Micro-feedback: brief scale pop
      this.style.transform = 'scale(1.3)';
      var btn = this;
      setTimeout(function () { btn.style.transform = ''; }, 200);
    });
  });


  /* ============================================================
     5. CONTACT PAGE (contact.html)
     Works with: .topic-btn, #selectedTopic,
                 #contactForm + field IDs,
                 #charCounter, #successMsg,
                 .faq-pill / .faq-item
  ============================================================ */

  // --- Topic selector (contact subject pills) ---
  var topicBtns    = document.querySelectorAll('.topic-btn');
  var selectedTopic = document.getElementById('selectedTopic');

  if (topicBtns.length) {
    topicBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        topicBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        if (selectedTopic) {
          selectedTopic.value = this.dataset.topic || this.textContent.trim();
        }
        // Auto-fill subject field if it exists
        var subjectField = document.getElementById('contactSubject');
        if (subjectField && !subjectField.value) {
          subjectField.value = this.dataset.subject || this.textContent.trim();
        }
      });
    });
  }

  // --- Message character counter ---
  var contactMessage = document.getElementById('contactMessage');
  var charCounter    = document.getElementById('charCounter');

  if (contactMessage && charCounter) {
    contactMessage.addEventListener('input', function () {
      var len = this.value.length;
      charCounter.textContent = len;
      charCounter.style.color = len > 900 ? '#EF4444' : '';
    });
  }

  // --- Contact form validation ---
  var contactForm = document.getElementById('contactForm');
  var successMsg  = document.getElementById('successMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      function validate(fieldId, errorId, test, msg) {
        var field = document.getElementById(fieldId);
        var error = document.getElementById(errorId);
        if (!field) return;
        var ok = test(field.value.trim());
        field.classList.toggle('is-invalid', !ok);
        field.classList.toggle('is-valid',    ok);
        if (error) { error.textContent = ok ? '' : (msg || 'This field is required.'); }
        if (!ok) valid = false;
      }

      validate('fullName',      'nameError',    function (v) { return v.length >= 2; },
               'Please enter your full name (at least 2 characters).');
      validate('contactEmail',  'emailError',   function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
               'Please enter a valid email address.');
      validate('contactSubject','subjectError', function (v) { return v.length >= 3; },
               'Please enter a subject for your message.');
      validate('contactMessage','messageError', function (v) { return v.length >= 20; },
               'Please write at least 20 characters so we can help you properly.');

      // Consent checkbox
      var consent      = document.getElementById('consentCheck');
      var consentError = document.getElementById('consentError');
      if (consent && !consent.checked) {
        valid = false;
        if (consentError) { consentError.textContent = 'You must agree to continue.'; }
      } else if (consentError) {
        consentError.textContent = '';
      }

      if (valid) {
        // Show success state
        contactForm.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
          // Scroll success message into view
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Real-time clear on input
    contactForm.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input', function () {
        this.classList.remove('is-invalid');
      });
    });
  }

  // --- FAQ topic pills ---
  var faqPills = document.querySelectorAll('.faq-pill');
  var faqItems = document.querySelectorAll('.faq-item');

  if (faqPills.length && faqItems.length) {
    faqPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        faqPills.forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active');

        var filter = this.dataset.topic || 'all';

        faqItems.forEach(function (item) {
          var match = filter === 'all' || item.dataset.topic === filter;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  }


  /* ============================================================
     6. COURSE SINGLE PAGE (course_single.html → course_single.html)
     Works with: .hero-tabs-bar .tab-btn, #overview #curriculum
                 #instructor #reviews (tab panels),
                 #curriculumAccordion sections,
                 .btn-wishlist-card, .enroll-card (sticky)
  ============================================================ */

  // --- Course detail tabs (Overview / Curriculum / Instructor / Reviews) ---
  var tabBtns  = document.querySelectorAll('.hero-tabs-bar .tab-btn');
  var tabPanes = document.querySelectorAll('.tab-pane');

  if (tabBtns.length && tabPanes.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = this.dataset.tab;

        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        tabPanes.forEach(function (pane) {
          var show = pane.id === target;
          pane.style.display = show ? '' : 'none';
          pane.classList.toggle('active', show);
        });

        // Smooth scroll to content area
        var contentArea = document.getElementById(target);
        if (contentArea) {
          contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Show first tab by default if none active
    var activeTab = document.querySelector('.hero-tabs-bar .tab-btn.active');
    if (!activeTab && tabBtns[0]) { tabBtns[0].click(); }
  }

  // --- Curriculum accordion (expand/collapse sections) ---
  var accordionHeaders = document.querySelectorAll('#curriculumAccordion .acc-header');

  accordionHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      var body   = this.nextElementSibling;
      var isOpen = this.classList.contains('open');

      // Collapse all
      accordionHeaders.forEach(function (h) {
        h.classList.remove('open');
        var b = h.nextElementSibling;
        if (b) { b.style.maxHeight = '0'; b.style.opacity = '0'; }
      });

      // Open clicked if it was closed
      if (!isOpen && body) {
        this.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        body.style.opacity   = '1';
      }
    });
  });

  // Open first section by default
  if (accordionHeaders.length) {
    var firstHeader = accordionHeaders[0];
    var firstBody   = firstHeader.nextElementSibling;
    firstHeader.classList.add('open');
    if (firstBody) {
      firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
      firstBody.style.opacity   = '1';
    }
  }

  // --- Wishlist toggle on course single card ---
  var wishlistCard = document.querySelector('.btn-wishlist-card');
  if (wishlistCard) {
    wishlistCard.addEventListener('click', function (e) {
      e.preventDefault();
      var wished = this.dataset.wished === 'true';
      this.dataset.wished = (!wished).toString();
      var icon = this.querySelector('i');
      if (icon) {
        icon.className = wished ? 'icofont-heart-alt' : 'icofont-heart';
      }
      var label = this.querySelector('span');
      if (label) {
        label.textContent = wished ? 'Add to Wishlist' : 'Wishlisted';
      }
      this.classList.toggle('active', !wished);
      this.style.color = wished ? '' : '#EF4444';
    });
  }

  // --- Sticky enroll card (desktop sidebar) ---
  var enrollCard   = document.querySelector('.enroll-card');
  var enrollTrigger = document.querySelector('.enroll-card-preview'); // hero enroll area

  if (enrollCard && enrollTrigger) {
    var stickyObs = new IntersectionObserver(function (entries) {
      // When the hero enroll preview scrolls out of view, make sidebar card visible/sticky
      var visible = entries[0].isIntersecting;
      enrollCard.classList.toggle('card-visible', !visible);
    }, { threshold: 0 });

    stickyObs.observe(enrollTrigger);
  }

  // --- Progress bar animation (course completion bars on single page) ---
  var progressBars = document.querySelectorAll('.skill-bar-fill, .prog-fill');
  if (progressBars.length) {
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          barObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    progressBars.forEach(function (bar) { barObs.observe(bar); });
  }

})();