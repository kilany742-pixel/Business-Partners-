/**
 * script.js — Business Partners × Frontieri | Eid Al-Adha 2025
 * Author: Ahmed Kilany
 *
 * Modules:
 *  1.  Loading Screen
 *  2.  Header scroll behaviour + mobile nav
 *  3.  Background particle canvas
 *  4.  Confetti canvas
 *  5.  Typing effect
 *  6.  Stats counter
 *  7.  Product slider (touch + arrow + auto)
 *  8.  Greeting card (open / close)
 *  9.  Download card as PNG  ← MAIN FEATURE (professional implementation)
 * 10.  Share (Web Share API fallback)
 * 11.  Mouse-move parallax
 * 12.  Scroll reveal (IntersectionObserver)
 * 13.  Smooth scroll for nav links
 * 14.  Audio toggle
 * 15.  Toast notification helper
 * 16.  Body gradient animation
 */

'use strict';

/* ================================================================
   GLOBAL STATE
   ================================================================ */
let isDownloading = false;       // guard against double-clicks
let confettiAnimId = null;
let confettiPieces = [];
let cardParticleAnimId = null;

/* ================================================================
   DOM REFS (gathered once)
   ================================================================ */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ================================================================
   1. LOADING SCREEN
   ================================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const ls = $('loading-screen');
    ls.classList.add('hidden');
    // Kick off entrance animations that need the page visible
    startParticles();
    startBodyGradient();
    animateStats();
  }, 2500);
});

/* ================================================================
   2. HEADER — scroll + mobile nav
   ================================================================ */
(function initHeader() {
  const header  = $('site-header');
  const menuBtn = $('menu-btn');
  const mobileNav = $('mobile-nav');

  // Sticky glass on scroll
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile hamburger
  menuBtn.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    mobileNav.setAttribute('aria-hidden', !open);
    menuBtn.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });

  // Close mobile nav on link click
  $$('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      menuBtn.querySelector('i').className = 'fa-solid fa-bars';
    });
  });
})();

/* ================================================================
   3. BACKGROUND PARTICLE CANVAS
   ================================================================ */
const bgCanvas = $('bg-canvas');
const bgCtx    = bgCanvas.getContext('2d');
let   bgParts  = [];

function resizeBgCanvas() {
  bgCanvas.width  = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBgCanvas, { passive: true });

function makeBgParticle() {
  return {
    x:       Math.random() * bgCanvas.width,
    y:       Math.random() * bgCanvas.height,
    r:       Math.random() * 1.8 + 0.4,
    alpha:   Math.random() * 0.5 + 0.1,
    speed:   Math.random() * 0.35 + 0.08,
    drift:   (Math.random() - 0.5) * 0.25,
    twinkle: Math.random() * Math.PI * 2,
    hue:     Math.random() > 0.5 ? 200 + Math.random() * 30 : 40 + Math.random() * 20,
  };
}

function startParticles() {
  resizeBgCanvas();
  for (let i = 0; i < 100; i++) bgParts.push(makeBgParticle());
  drawBgParticles();
}

function drawBgParticles() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  bgParts.forEach(p => {
    p.twinkle += 0.018;
    p.alpha    = 0.1 + Math.abs(Math.sin(p.twinkle)) * 0.5;
    p.y       -= p.speed;
    p.x       += p.drift;
    if (p.y < -5) { p.y = bgCanvas.height + 5; p.x = Math.random() * bgCanvas.width; }
    if (p.x < -5 || p.x > bgCanvas.width + 5) { p.x = Math.random() * bgCanvas.width; p.y = bgCanvas.height; }

    bgCtx.save();
    bgCtx.globalAlpha = p.alpha;
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `hsl(${p.hue}, 80%, 70%)`;
    bgCtx.shadowColor = `hsl(${p.hue}, 90%, 65%)`;
    bgCtx.shadowBlur  = 6;
    bgCtx.fill();
    bgCtx.restore();
  });
  requestAnimationFrame(drawBgParticles);
}

/* ================================================================
   4. CONFETTI CANVAS
   ================================================================ */
const confCanvas = $('confetti-canvas');
const confCtx    = confCanvas.getContext('2d');

const CONF_COLORS = [
  '#fbbf24','#f9a8d4','#93c5fd','#6ee7b7','#c4b5fd',
  '#fde68a','#fca5a5','#a5f3fc','#d4a017','#ffffff',
];

function resizeConfCanvas() {
  confCanvas.width  = window.innerWidth;
  confCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfCanvas, { passive: true });
resizeConfCanvas();

function launchConfetti() {
  resizeConfCanvas();
  confettiPieces = [];
  for (let i = 0; i < 200; i++) {
    confettiPieces.push({
      x:     Math.random() * confCanvas.width,
      y:     -20 - Math.random() * 300,
      w:     Math.random() * 10 + 4,
      h:     Math.random() * 6 + 3,
      color: CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)],
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - 0.5) * 0.22,
      vx:    (Math.random() - 0.5) * 3,
      vy:    Math.random() * 3 + 1.5,
      alpha: 1,
      decay: Math.random() * 0.005 + 0.002,
    });
  }
  animateConfetti();
}

function animateConfetti() {
  confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  confettiPieces = confettiPieces.filter(p => p.alpha > 0.02);
  confettiPieces.forEach(p => {
    p.x     += p.vx;
    p.y     += p.vy;
    p.angle += p.spin;
    p.vy    += 0.06;
    p.alpha  = Math.max(0, p.alpha - p.decay);
    confCtx.save();
    confCtx.globalAlpha = p.alpha;
    confCtx.translate(p.x, p.y);
    confCtx.rotate(p.angle);
    confCtx.fillStyle = p.color;
    confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confCtx.restore();
  });
  if (confettiPieces.length > 0) {
    confettiAnimId = requestAnimationFrame(animateConfetti);
  } else {
    confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  }
}

function stopConfetti() {
  if (confettiAnimId) { cancelAnimationFrame(confettiAnimId); confettiAnimId = null; }
  confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  confettiPieces = [];
}

/* ================================================================
   5. TYPING EFFECT
   ================================================================ */
(function initTyping() {
  const el     = $('typing-target');
  const phrase = 'تهنئة خاصة مقدمة من شركة بيزنس بارتنرز - فرع الإسماعيلية';
  let   i = 0, forward = true;

  function type() {
    if (forward) {
      if (i <= phrase.length) {
        el.textContent = phrase.slice(0, i++);
        setTimeout(type, 60);
      } else {
        setTimeout(() => { forward = false; type(); }, 2400);
      }
    } else {
      if (i >= 0) {
        el.textContent = phrase.slice(0, i--);
        setTimeout(type, 28);
      } else {
        setTimeout(() => { forward = true; type(); }, 600);
      }
    }
  }

  // Delay start until loader hides
  setTimeout(type, 2800);
})();

/* ================================================================
   6. STATS COUNTER
   ================================================================ */
function animateStats() {
  $$('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const dur    = 1800;
    const step   = 16;
    const inc    = target / (dur / step);
    let   cur    = 0;

    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        const tick = () => {
          cur = Math.min(cur + inc, target);
          el.textContent = Math.round(cur);
          if (cur < target) setTimeout(tick, step);
        };
        tick();
      }
    }, { threshold: 0.5 });
    io.observe(el);
  });
}

/* ================================================================
   7. PRODUCT SLIDER
   ================================================================ */
(function initSlider() {
  const slider   = $('product-slider');
  const prevBtn  = $('prev-btn');
  const nextBtn  = $('next-btn');
  const dotsWrap = $('slider-dots');

  if (!slider) return;

  const cards    = Array.from(slider.children);
  const total    = cards.length;
  let   current  = 0;
  let   autoId   = null;

  // Calculate visible count based on viewport
  function visibleCount() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640)  return 2;
    return 1;
  }

  // Create dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const steps = total - visibleCount() + 1;
    for (let i = 0; i < steps; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `منتج ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    $$('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function getCardWidth() {
    if (!cards[0]) return 0;
    const style = getComputedStyle(slider);
    const gap   = parseFloat(style.gap) || 20;
    return cards[0].offsetWidth + gap;
  }

  function goTo(idx) {
    const maxIdx = total - visibleCount();
    current      = Math.max(0, Math.min(idx, maxIdx));
    const offset = getCardWidth() * current;
    slider.style.transform  = `translateX(${offset}px)`; // RTL: positive shifts right
    slider.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
    updateDots();
  }

  // Arrow buttons
  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  // Auto-play
  function startAuto() {
    autoId = setInterval(() => {
      const maxIdx = total - visibleCount();
      goTo(current < maxIdx ? current + 1 : 0);
    }, 3500);
  }
  function resetAuto() { clearInterval(autoId); startAuto(); }

  // Touch swipe
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
  }, { passive: true });

  // Resize: rebuild
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildDots(); goTo(0); }, 200);
  }, { passive: true });

  // Init
  buildDots();
  startAuto();
})();

/* ================================================================
   8. GREETING CARD — OPEN / CLOSE
   ================================================================ */
(function initGreetingCard() {
  const showBtn  = $('show-greeting-btn');
  const overlay  = $('greeting-overlay');
  const closeBtn = $('card-close-btn');
  const nameInput = $('recipient-name');
  const cardName = $('card-display-name');

  function openCard() {
    const name = nameInput.value.trim() || 'صديقنا العزيز';
    cardName.textContent = name;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(launchConfetti, 350);
    closeBtn.focus();
  }

  function closeCard() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    stopConfetti();
    showBtn.focus();
  }

  showBtn.addEventListener('click', openCard);
  nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') openCard(); });
  closeBtn.addEventListener('click', closeCard);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeCard(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeCard();
  });
})();

/* ================================================================
   9. DOWNLOAD CARD AS PNG
   ──────────────────────────────────────────────────────────────
   Professional implementation:
   • Uses html2canvas with scale:3 for retina-quality output
   • Hides action buttons before capture, restores after
   • Sanitises filename for Arabic + English names
   • Shows inline loading state on the button
   • Falls back to <a download> for iOS / older Android
   • Shows a polished toast on completion
   ================================================================ */
(function initDownload() {
  const dlBtn      = $('download-btn');
  const cardEl     = $('greeting-card');
  const actionsEl  = $('card-actions');
  const closeBtn   = $('card-close-btn');
  const cardName   = $('card-display-name');
  const dlOverlay  = $('dl-overlay');

  if (!dlBtn) return;

  dlBtn.addEventListener('click', downloadCard);

  async function downloadCard() {
    // Guard: prevent double-click during processing
    if (isDownloading) return;
    isDownloading = true;

    const recipientName = cardName.textContent.trim() || 'صديق';

    try {
      // ── Step 1: Show loading indicators ──────────────────────
      setDlButtonState('loading');
      dlOverlay.classList.add('active');
      dlOverlay.setAttribute('aria-hidden', 'false');

      // Pause confetti during capture
      stopConfetti();

      // ── Step 2: Hide elements that should NOT appear in image ─
      actionsEl.style.setProperty('display', 'none', 'important');
      closeBtn.style.setProperty('display',  'none', 'important');

      // Small tick to let the DOM repaint before capture
      await tick(120);

      // ── Step 3: Measure card for correct canvas size ──────────
      const cardRect = cardEl.getBoundingClientRect();

      // ── Step 4: Capture with html2canvas ─────────────────────
      const canvas = await html2canvas(cardEl, {
        scale:           3,          // 3× for crisp retina quality
        useCORS:         true,       // allow cross-origin images
        allowTaint:      false,
        backgroundColor: null,       // preserve rounded corners / transparency
        logging:         false,
        width:           cardRect.width,
        height:          cardRect.height,
        windowWidth:     window.innerWidth,
        windowHeight:    window.innerHeight,
        scrollX:         0,
        scrollY:         -window.scrollY,  // account for page scroll
        ignoreElements:  el =>
          el.id === 'card-actions'  ||
          el.id === 'card-close-btn'||
          el.id === 'confetti-canvas'||
          el.id === 'bg-canvas',
      });

      // ── Step 5: Convert to PNG blob ───────────────────────────
      const blob = await canvasToBlob(canvas, 'image/png', 1.0);

      // ── Step 6: Build a safe filename ─────────────────────────
      const safeName = sanitiseFilename(recipientName);
      const filename = `Eid-Greeting-${safeName}.png`;

      // ── Step 7: Trigger download ──────────────────────────────
      downloadBlob(blob, filename);

      // ── Step 8: Success feedback ──────────────────────────────
      showToast('تم تحميل التهنئة بنجاح ✨');

    } catch (err) {
      console.error('[Download] html2canvas error:', err);
      showToast('حدث خطأ، حاول مرة أخرى 🙏', 'error');
    } finally {
      // ── Step 9: Restore everything ────────────────────────────
      actionsEl.style.removeProperty('display');
      closeBtn.style.removeProperty('display');
      dlOverlay.classList.remove('active');
      dlOverlay.setAttribute('aria-hidden', 'true');
      setDlButtonState('idle');
      isDownloading = false;

      // Restart confetti after a brief pause
      setTimeout(launchConfetti, 300);
    }
  }

  /* ── Helper: toggle download button UI state ── */
  function setDlButtonState(state) {
    const idle    = dlBtn.querySelector('.dl-btn-idle');
    const loading = dlBtn.querySelector('.dl-btn-loading');
    if (state === 'loading') {
      idle.style.display    = 'none';
      loading.style.display = 'flex';
      dlBtn.disabled        = true;
    } else {
      idle.style.display    = '';
      loading.style.display = 'none';
      dlBtn.disabled        = false;
    }
  }

  /* ── Helper: canvas → Blob (Promise wrapper) ── */
  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else      reject(new Error('toBlob returned null'));
        }, type, quality);
      } catch (e) { reject(e); }
    });
  }

  /* ── Helper: cross-platform download ── */
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = filename;

    // iOS Safari: requires the element to be in the DOM briefly
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke after a short delay (let the browser process the download)
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  /* ── Helper: sanitise filename for Arabic / cross-OS safety ── */
  function sanitiseFilename(name) {
    // Keep Arabic, Latin, digits, hyphens, underscores — remove illegal chars
    return name
      .replace(/[\\/:*?"<>|]/g, '')   // remove Windows-illegal chars
      .replace(/\s+/g, '-')           // spaces → hyphens
      .replace(/-{2,}/g, '-')         // collapse double hyphens
      .trim()
      .substring(0, 60)               // cap length
      || 'greeting';
  }

  /* ── Helper: Promise-based timeout ── */
  function tick(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();

/* ================================================================
   10. SHARE (Web Share API with clipboard fallback)
   ================================================================ */
(function initShare() {
  const shareBtn = $('share-btn');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: 'عيد أضحى مبارك ✨',
      text:  'تهنئة خاصة من شركة Business Partners فرع الإسماعيلية × Frontieri Ice Cream',
      url:   window.location.href,
    };

    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) { /* user cancelled */ }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('تم نسخ الرابط ✅');
      } catch (e) { showToast('لا يمكن المشاركة الآن 🙏', 'error'); }
    }
  });
})();

/* ================================================================
   11. MOUSE-MOVE PARALLAX (desktop only)
   ================================================================ */
(function initParallax() {
  if (window.innerWidth < 1024) return;

  const blobs = $$('.mesh-blob');
  document.addEventListener('mousemove', e => {
    const cx = (e.clientX / window.innerWidth  - 0.5) * 20;
    const cy = (e.clientY / window.innerHeight - 0.5) * 20;
    blobs.forEach((b, i) => {
      const depth = (i + 1) * 0.4;
      b.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  }, { passive: true });
})();

/* ================================================================
   12. SCROLL REVEAL
   ================================================================ */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    $$('.reveal-card').forEach(el => el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger the animation for grid children
        setTimeout(() => entry.target.classList.add('revealed'), idx * 120);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  $$('.reveal-card').forEach(el => io.observe(el));
})();

/* ================================================================
   13. SMOOTH SCROLL
   ================================================================ */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerH = document.querySelector('.site-header')?.offsetHeight || 70;
    const top     = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ================================================================
   14. AUDIO TOGGLE
   ================================================================ */
(function initAudio() {
  const btn   = $('audio-btn');
  const audio = $('bg-audio');
  let   on    = false;

  btn.addEventListener('click', () => {
    if (!audio.src && !audio.children.length) {
      // No audio file present
      btn.title = 'ضع ملف صوتي في assets/audio/eid-music.mp3';
      btn.style.opacity = '0.4';
      showToast('أضف ملف صوتي في assets/audio/eid-music.mp3', 'info');
      return;
    }
    if (on) {
      audio.pause();
      on = false;
      btn.querySelector('i').className = 'fa-solid fa-music';
      btn.classList.remove('playing');
    } else {
      audio.play().catch(() => {});
      on = true;
      btn.querySelector('i').className = 'fa-solid fa-volume-high';
      btn.classList.add('playing');
    }
  });
})();

/* ================================================================
   15. TOAST NOTIFICATION
   ================================================================ */
let toastTimer = null;

function showToast(msg, type = 'success') {
  const toast   = $('toast');
  const msgEl   = $('toast-msg');
  const iconEl  = toast.querySelector('.toast-icon');

  msgEl.textContent = msg;

  // Style variants
  if (type === 'error') {
    toast.style.background    = 'linear-gradient(135deg,#7f1d1d,#991b1b)';
    toast.style.borderColor   = '#ef4444';
    toast.style.color         = '#fecaca';
    iconEl.style.color        = '#f87171';
    iconEl.className          = 'fa-solid fa-circle-exclamation toast-icon';
  } else if (type === 'info') {
    toast.style.background    = 'linear-gradient(135deg,#1e3a5f,#1e40af)';
    toast.style.borderColor   = '#3b82f6';
    toast.style.color         = '#bfdbfe';
    iconEl.style.color        = '#60a5fa';
    iconEl.className          = 'fa-solid fa-circle-info toast-icon';
  } else {
    toast.style.background    = 'linear-gradient(135deg,#064e3b,#065f46)';
    toast.style.borderColor   = '#10b981';
    toast.style.color         = '#d1fae5';
    iconEl.style.color        = '#34d399';
    iconEl.className          = 'fa-solid fa-circle-check toast-icon';
  }

  toast.setAttribute('aria-hidden', 'false');
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toast.setAttribute('aria-hidden', 'true');
  }, 3500);
}

/* ================================================================
   16. ANIMATED BODY BACKGROUND GRADIENT
   ================================================================ */
function startBodyGradient() {
  let t = 0;
  function step() {
    t += 0.002;
    const h1 = 220 + Math.sin(t)     * 15;
    const h2 = 200 + Math.sin(t+1)   * 10;
    const h3 = 230 + Math.cos(t*0.7) * 12;
    document.body.style.background =
      `radial-gradient(ellipse at 70% 10%, hsl(${h1},60%,6%) 0%, hsl(${h2},70%,3%) 45%, hsl(${h3},80%,2%) 100%)`;
    requestAnimationFrame(step);
  }
  step();
}

/* ================================================================
   17. CURSOR SPARKLE (desktop only, throttled)
   ================================================================ */
(function initCursorSparkle() {
  if (window.innerWidth < 1024 || window.matchMedia('(pointer:coarse)').matches) return;

  let lastT = 0;
  document.addEventListener('mousemove', e => {
    const now = performance.now();
    if (now - lastT < 80) return;
    lastT = now;

    const s = document.createElement('span');
    s.textContent = '✦';
    Object.assign(s.style, {
      position:      'fixed',
      left:          e.clientX + 'px',
      top:           e.clientY + 'px',
      pointerEvents: 'none',
      zIndex:        9990,
      fontSize:      (Math.random() * 10 + 8) + 'px',
      color:         Math.random() > 0.5 ? '#fbbf24' : '#f9a8d4',
      opacity:       1,
      transform:     'translate(-50%,-50%) scale(1)',
      transition:    'opacity 0.5s ease, transform 0.5s ease',
      userSelect:    'none',
    });
    document.body.appendChild(s);
    requestAnimationFrame(() => {
      s.style.opacity   = '0';
      s.style.transform = 'translate(-50%,-50%) scale(0) rotate(45deg)';
    });
    setTimeout(() => s.remove(), 520);
  }, { passive: true });
})();
