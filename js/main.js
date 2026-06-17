/* =============================================
   NAMASTE BEAUTY STUDIO — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // --- Hero Slider ---
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroPrev = document.querySelector('.hero-prev');
  const heroNext = document.querySelector('.hero-next');

  if (heroSlides.length) {
    let heroCurrent = 0;
    let heroTimer;

    const heroGoTo = (index) => {
      heroSlides[heroCurrent].classList.remove('active');
      heroDots[heroCurrent].classList.remove('active');
      heroCurrent = (index + heroSlides.length) % heroSlides.length;
      heroSlides[heroCurrent].classList.add('active');
      heroDots[heroCurrent].classList.add('active');
    };

    const startHeroAuto = () => {
      heroTimer = setInterval(() => heroGoTo(heroCurrent + 1), 5000);
    };
    const resetHeroAuto = () => { clearInterval(heroTimer); startHeroAuto(); };

    if (heroPrev) heroPrev.addEventListener('click', () => { heroGoTo(heroCurrent - 1); resetHeroAuto(); });
    if (heroNext) heroNext.addEventListener('click', () => { heroGoTo(heroCurrent + 1); resetHeroAuto(); });
    heroDots.forEach((d, i) => d.addEventListener('click', () => { heroGoTo(i); resetHeroAuto(); }));

    // Pause on hover
    const heroEl = document.getElementById('heroSlider');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', () => clearInterval(heroTimer));
      heroEl.addEventListener('mouseleave', startHeroAuto);
    }

    // Touch swipe
    let heroStartX = 0;
    if (heroEl) {
      heroEl.addEventListener('touchstart', e => { heroStartX = e.touches[0].clientX; });
      heroEl.addEventListener('touchend', e => {
        const diff = heroStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { heroGoTo(diff > 0 ? heroCurrent + 1 : heroCurrent - 1); resetHeroAuto(); }
      });
    }

    startHeroAuto();
  }

  // --- Nav scroll effect ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- Active nav link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Mobile menu ---
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  const mobileClose = document.querySelector('.nav-mobile-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // --- Testimonial slider ---
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  if (track && slides.length) {
    let current = 0;
    let autoTimer;

    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const startAuto = () => {
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    };
    const resetAuto = () => {
      clearInterval(autoTimer);
      startAuto();
    };

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

    // Touch support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
    });

    goTo(0);
    startAuto();
  }

  // --- Fade-up on scroll ---
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => observer.observe(el));
  }

  // --- Instagram Behold-style Feed ---
  const ibWrap = document.getElementById('instaBehold');
  if (ibWrap) {
    const IG_TOKEN = 'EAAO5gL9WMIYBRjLZC5jtfEFmy7Vv8MxYQMxgjiSEogQoJwZBU7Uoq7dKSvH9c8rN4L0ojKvd7c4taklyL4rO9EsFjQpzj6zWRKYUYlvg3mRga5meuOOZCJpQfLbdb21Wp9YsFjymC0OF6KUn0R3K7RmvZAuNFxZAfqLr7dn8kjmZCEEus74mnZAHTCFnudqjpn7AS4aTYkZD';
    const IG_ID   = '17841403523019370';
    const IG_URL  = `https://graph.facebook.com/v18.0/${IG_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=9&access_token=${IG_TOKEN}`;

    // Width + radius per slot position (0 = featured/widest)
    const SLOTS = [
      { w: 380, r: 20 },
      { w: 240, r: 20 },
      { w: 160, r: 24 },
      { w: 110, r: 55 },
      { w:  80, r: 70 },
      { w:  60, r: 70 },
    ];

    const typeIcon = { VIDEO: '▶', CAROUSEL_ALBUM: '⊞' };
    let posts = [];
    let ibStart = 0;

    const buildCard = (post, slotIndex) => {
      const { w, r } = SLOTS[slotIndex];
      const isFeatured = slotIndex === 0;
      const imgSrc = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
      const caption = (post.caption || '').replace(/#\S+/g, '').trim().slice(0, 100);
      const badge = typeIcon[post.media_type] || '';

      const a = document.createElement('a');
      a.href = post.permalink;
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'insta-behold-item' + (isFeatured ? ' ib-featured' : '');
      a.style.cssText = `width:${w}px; border-radius:${r}px;`;
      a.innerHTML = `
        <img src="${imgSrc}" alt="Instagram post" loading="lazy">
        ${badge ? `<span class="ib-badge">${badge}</span>` : ''}
        ${isFeatured ? `<div class="ib-overlay"><p class="ib-caption">${caption}</p></div>` : ''}
      `;
      return a;
    };

    const render = () => {
      ibWrap.innerHTML = '';
      for (let i = 0; i < SLOTS.length; i++) {
        const post = posts[(ibStart + i) % posts.length];
        ibWrap.appendChild(buildCard(post, i));
      }
    };

    fetch(IG_URL)
      .then(r => r.json())
      .then(data => {
        if (!data.data || !data.data.length) return;
        posts = data.data;
        render();

        document.querySelector('.insta-next')?.addEventListener('click', () => {
          ibStart = (ibStart + 1) % posts.length;
          render();
        });
        document.querySelector('.insta-prev')?.addEventListener('click', () => {
          ibStart = (ibStart - 1 + posts.length) % posts.length;
          render();
        });
      })
      .catch(() => {
        ibWrap.innerHTML = `<p style="color:#aaa;font-size:0.8rem;padding:2rem 0;">
          Could not load Instagram posts. <a href="https://www.instagram.com/namaste_beauty_studio/" target="_blank">View on Instagram →</a>
        </p>`;
      });
  }

  // --- Contact form submission ---
  const form = document.querySelector('.contact-form-el');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Message Sent!';
      btn.disabled = true;
      btn.style.opacity = '0.6';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        btn.style.opacity = '';
        form.reset();
      }, 3000);
    });
  }

  // --- Strip items link to services page ---
  document.querySelectorAll('.strip-item[data-href]').forEach(item => {
    item.addEventListener('click', () => {
      window.location.href = item.dataset.href;
    });
  });

});
