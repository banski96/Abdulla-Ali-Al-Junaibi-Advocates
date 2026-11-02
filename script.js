document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Navigation Toggle ---
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuButton.contains(e.target)) {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 2. Dynamic Copyright Year ---
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // --- 3. Back to Top Button ---
  const topButton = document.querySelector('.top');
  if (topButton) {
    window.addEventListener('scroll', () => {
      topButton.classList.toggle('visible', window.scrollY > 350);
    }, { passive: true });

    topButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 4. Hero Carousel Animation (Pictures + Content) ---
  const slides = [...document.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('.slider-dots .dot')];
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');

  if (slides.length > 0) {
    let currentSlide = 0;
    let slideTimer;

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentSlide);
      });
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    };

    const startSlider = () => {
      slideTimer = setInterval(() => showSlide(currentSlide + 1), 6500);
    };

    const resetSliderTimer = () => {
      clearInterval(slideTimer);
      startSlider();
    };

    nextBtn?.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      resetSliderTimer();
    });

    prevBtn?.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      resetSliderTimer();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        resetSliderTimer();
      });
    });

    startSlider();
  }

  // --- 5. Interactive Cursor Feedback on Hover ---
  const interactiveElements = document.querySelectorAll('.interactive-card, .trust-item, .work-grid article');
  interactiveElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // --- 6. Shared Consultation Popup Modal ---
  const modalHTML = `
    <section class="consult-dialog" role="dialog" aria-modal="true" aria-labelledby="consult-title">
      <button class="consult-close" type="button" aria-label="Close consultation form">&times;</button>
      <span class="consult-kicker">Abdulla Ali Al Junaibi Advocates</span>
      <h2 id="consult-title">Book a consultation</h2>
      <p>Share a few details about your matter. Our team will review your enquiry promptly.</p>
      <form class="consult-form" id="consult-form">
        <div class="form-field">
          <label for="consult-name">Full name *</label>
          <input id="consult-name" name="name" autocomplete="name" required>
        </div>
        <div class="form-field">
          <label for="consult-email">Email address *</label>
          <input id="consult-email" name="email" type="email" autocomplete="email" required>
        </div>
        <div class="form-field">
          <label for="consult-phone">Phone number</label>
          <input id="consult-phone" name="phone" type="tel" autocomplete="tel">
        </div>
        <div class="form-field">
          <label for="consult-area">Practice Area *</label>
          <select id="consult-area" name="area" required>
            <option value="">Select a practice area</option>
            <option>Litigation & Court Representation</option>
            <option>Contracts & Agreements</option>
            <option>Corporate & Commercial Law</option>
            <option>Real Estate & Property Settlements</option>
            <option>Wills & Estate Planning</option>
            <option>Other Legal Consultancy</option>
          </select>
        </div>
        <div class="form-field full">
          <label for="consult-message">Brief description of your matter *</label>
          <textarea id="consult-message" name="message" required placeholder="Please avoid including confidential or sensitive documents at this stage."></textarea>
        </div>
        <button class="btn gold" type="submit">Prepare consultation request</button>
        <p class="form-note">Submitting opens an email draft addressed to admin@aljunaibi-advocates.ae. Please review it before sending.</p>
        <p class="form-status" role="status"></p>
      </form>
    </section>
  `;

  const modal = document.createElement('div');
  modal.className = 'consult-modal';
  modal.id = 'consultation-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = modalHTML;
  document.body.appendChild(modal);

  const openModal = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('consult-name')?.focus(), 100);
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-open-consultation]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  modal.querySelector('.consult-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Form submission handler
  const consultForm = document.getElementById('consult-form');
  consultForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(consultForm);
    const subject = encodeURIComponent('Consultation Request — ' + formData.get('name'));
    const body = encodeURIComponent(
      'Name: ' + formData.get('name') + '\n' +
      'Email: ' + formData.get('email') + '\n' +
      'Phone: ' + (formData.get('phone') || 'Not provided') + '\n' +
      'Practice Area: ' + formData.get('area') + '\n\n' +
      'Matter Description:\n' + formData.get('message')
    );

    const statusEl = modal.querySelector('.form-status');
    statusEl.textContent = 'Your email application will now open with your consultation request prepared.';
    statusEl.classList.add('show');
    
    window.location.href = `mailto:admin@aljunaibi-advocates.ae?subject=${subject}&body=${body}`;
  });

  // --- 7. Scroll Animation Observer for Content ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

});