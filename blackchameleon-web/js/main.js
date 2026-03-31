/* BLACK CHAMELEON v3 — main.js */

/* 1. Scroll progress bar */
(function () {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* 2. Scroll reveal */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

/* 3. Catalog image swap */
function catalogSwap(thumb) {
  const wrap = thumb.closest('.catalog-visual');
  const main = wrap.querySelector('.catalog-main-img');
  wrap.querySelectorAll('.catalog-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
  main.style.opacity = '0';
  main.style.transition = 'opacity 0.2s';
  setTimeout(() => {
    main.src = thumb.src;
    main.style.opacity = '';
    main.style.transition = '';
  }, 180);
}

/* 4. Catalog arrow step */
function catalogStep(btn, dir) {
  const visual = btn.closest('.catalog-visual');
  const thumbs = Array.from(visual.querySelectorAll('.catalog-thumb'));
  const activeIdx = thumbs.findIndex(t => t.classList.contains('active'));
  const nextIdx = (activeIdx + dir + thumbs.length) % thumbs.length;
  catalogSwap(thumbs[nextIdx]);
  // scroll active thumb into view
  thumbs[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

/* 5. Active nav link */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });
})();

/* 5. Smooth anchor links */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* 6. Hero slideshow */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  let current = 0;
  let timer;

  window.heroGoTo = function (idx) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
    clearInterval(timer);
    timer = setInterval(heroNext, 4500);
  };

  function heroNext() {
    heroGoTo((current + 1) % slides.length);
  }

  window.heroStep = function (dir) {
    heroGoTo((current + dir + slides.length) % slides.length);
  };

  timer = setInterval(heroNext, 4500);
})();

/* 7. Click ripple effect */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .bc-ripple {
      position: fixed; pointer-events: none; border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      animation: bc-ripple-anim 0.55s ease forwards;
      z-index: 99999; mix-blend-mode: multiply;
    }
    @keyframes bc-ripple-anim {
      0%   { width: 0; height: 0; opacity: 1; transform: translate(-50%,-50%) scale(0); }
      60%  { opacity: 0.6; }
      100% { width: 80px; height: 80px; opacity: 0; transform: translate(-50%,-50%) scale(1); }
    }
  `;
  document.head.appendChild(style);
  document.addEventListener('click', (e) => {
    const el = document.createElement('div');
    el.className = 'bc-ripple';
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY + 'px';
    el.style.background = 'radial-gradient(circle, #7dff00 0%, rgba(125,255,0,0.3) 60%, transparent 100%)';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  });
})();
