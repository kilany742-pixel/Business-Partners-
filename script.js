/**
 * script.js — Business Partners Eid Greeting
 * Author: Ahmed Kilany
 * Description: All interactive logic — loading, particles, card, confetti, audio
 */

/* ================================================================
   UTILITY: Wait for DOM
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. LOADING SCREEN
  ────────────────────────────────────────────── */
  const loadingScreen = document.getElementById('loading-screen');

  // Hide loader after animation completes (~2.5s)
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 2600);
  });

  /* ──────────────────────────────────────────────
     2. BACKGROUND PARTICLE SYSTEM
  ────────────────────────────────────────────── */
  const bgCanvas  = document.getElementById('particle-canvas');
  const bgCtx     = bgCanvas.getContext('2d');
  let bgParticles = [];

  function resizeBgCanvas() {
    bgCanvas.width  = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  resizeBgCanvas();
  window.addEventListener('resize', resizeBgCanvas);

  /** Create a single background particle */
  function createBgParticle() {
    return {
      x:        Math.random() * bgCanvas.width,
      y:        Math.random() * bgCanvas.height,
      r:        Math.random() * 2 + 0.5,
      alpha:    Math.random() * 0.5 + 0.2,
      speed:    Math.random() * 0.4 + 0.1,
      drift:    (Math.random() - 0.5) * 0.3,
      twinkle:  Math.random() * Math.PI * 2,
    };
  }

  // Initialise pool
  for (let i = 0; i < 120; i++) bgParticles.push(createBgParticle());

  /** Draw one frame of the background particle canvas */
  function drawBgParticles() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    bgParticles.forEach(p => {
      p.twinkle += 0.02;
      p.alpha    = 0.2 + Math.abs(Math.sin(p.twinkle)) * 0.6;
      p.y       -= p.speed;
      p.x       += p.drift;

      // Recycle off-screen particles
      if (p.y < -5) { p.y = bgCanvas.height + 5; p.x = Math.random() * bgCanvas.width; }
      if (p.x < -5 || p.x > bgCanvas.width + 5) {
        p.x = Math.random() * bgCanvas.width;
        p.y = bgCanvas.height + 5;
      }

      // Render — golden sparkle
      bgCtx.save();
      bgCtx.globalAlpha = p.alpha;
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      bgCtx.fillStyle = `hsl(${40 + Math.random() * 20}, 90%, ${60 + Math.random() * 20}%)`;
      bgCtx.shadowColor  = '#d4a017';
      bgCtx.shadowBlur   = 6;
      bgCtx.fill();
      bgCtx.restore();
    });

    requestAnimationFrame(drawBgParticles);
  }
  drawBgParticles();

  /* ──────────────────────────────────────────────
     3. GREETING CARD LOGIC
  ────────────────────────────────────────────── */
  const greetBtn      = document.getElementById('greet-btn');
  const nameInput     = document.getElementById('name-input');
  const overlay       = document.getElementById('greeting-overlay');
  const cardNameEl    = document.getElementById('card-name');
  const closeCardBtn  = document.getElementById('close-card-btn');
  const downloadBtn   = document.getElementById('download-btn');

  /** Open the greeting card with the entered name */
  greetBtn.addEventListener('click', openCard);
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') openCard();
  });

  function openCard() {
    const rawName = nameInput.value.trim();
    const name    = rawName || 'صديقي العزيز';

    // Inject personalised name
    cardNameEl.textContent = name;

    // Show overlay
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Start card particles
    startCardParticles();

    // Fire confetti after short delay
    setTimeout(launchConfetti, 400);
  }

  /** Close greeting card */
  function closeCard() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    stopCardParticles();
    stopConfetti();
  }

  closeCardBtn.addEventListener('click', closeCard);

  // Close on overlay background click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCard();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeCard();
  });

  /* ──────────────────────────────────────────────
     4. CARD PARTICLE SYSTEM
  ────────────────────────────────────────────── */
  const cardCanvas  = document.getElementById('card-particle-canvas');
  const cardCtx     = cardCanvas.getContext('2d');
  let cardParticles = [];
  let cardAnimId    = null;

  function resizeCardCanvas() {
    const rect      = cardCanvas.parentElement.getBoundingClientRect();
    cardCanvas.width  = rect.width  || 540;
    cardCanvas.height = rect.height || 580;
  }

  function startCardParticles() {
    resizeCardCanvas();
    cardParticles = [];

    for (let i = 0; i < 60; i++) {
      cardParticles.push({
        x:      Math.random() * cardCanvas.width,
        y:      Math.random() * cardCanvas.height,
        r:      Math.random() * 1.8 + 0.4,
        alpha:  Math.random() * 0.6 + 0.2,
        speed:  Math.random() * 0.5 + 0.15,
        drift:  (Math.random() - 0.5) * 0.4,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    function drawCardParticles() {
      cardCtx.clearRect(0, 0, cardCanvas.width, cardCanvas.height);

      cardParticles.forEach(p => {
        p.twinkle += 0.025;
        p.alpha    = 0.15 + Math.abs(Math.sin(p.twinkle)) * 0.5;
        p.y       -= p.speed;
        p.x       += p.drift;

        if (p.y < -5) { p.y = cardCanvas.height + 5; p.x = Math.random() * cardCanvas.width; }

        cardCtx.save();
        cardCtx.globalAlpha = p.alpha;
        cardCtx.beginPath();
        cardCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cardCtx.fillStyle    = '#d4a017';
        cardCtx.shadowColor  = '#ffd700';
        cardCtx.shadowBlur   = 8;
        cardCtx.fill();
        cardCtx.restore();
      });

      cardAnimId = requestAnimationFrame(drawCardParticles);
    }

    drawCardParticles();
  }

  function stopCardParticles() {
    if (cardAnimId) {
      cancelAnimationFrame(cardAnimId);
      cardAnimId = null;
    }
    cardCtx.clearRect(0, 0, cardCanvas.width, cardCanvas.height);
  }

  /* ──────────────────────────────────────────────
     5. CONFETTI SYSTEM
  ────────────────────────────────────────────── */
  // Dynamically create confetti canvas
  const confettiCanvas = document.createElement('canvas');
  confettiCanvas.id    = 'confetti-canvas';
  document.body.appendChild(confettiCanvas);
  const confettiCtx    = confettiCanvas.getContext('2d');
  let confettiPieces   = [];
  let confettiAnimId   = null;

  const CONFETTI_COLORS = [
    '#d4a017', '#ffd700', '#f5d485', '#a07010',
    '#c0a850', '#ffe066', '#fff8dc', '#e6b800',
  ];

  function resizeConfettiCanvas() {
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeConfettiCanvas();
  window.addEventListener('resize', resizeConfettiCanvas);

  function launchConfetti() {
    resizeConfettiCanvas();
    confettiPieces = [];

    for (let i = 0; i < 180; i++) {
      confettiPieces.push({
        x:       Math.random() * confettiCanvas.width,
        y:       -20 - Math.random() * 200,
        w:       Math.random() * 10 + 4,
        h:       Math.random() * 6 + 3,
        color:   CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        angle:   Math.random() * Math.PI * 2,
        spin:    (Math.random() - 0.5) * 0.2,
        vx:      (Math.random() - 0.5) * 3,
        vy:      Math.random() * 3 + 2,
        alpha:   1,
        decay:   Math.random() * 0.005 + 0.002,
      });
    }

    function animateConfetti() {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      confettiPieces = confettiPieces.filter(p => p.alpha > 0.01);

      confettiPieces.forEach(p => {
        p.x     += p.vx;
        p.y     += p.vy;
        p.angle += p.spin;
        p.vy    += 0.05; // gravity
        p.alpha -= p.decay;
        p.alpha  = Math.max(0, p.alpha);

        confettiCtx.save();
        confettiCtx.globalAlpha = p.alpha;
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.angle);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        confettiCtx.restore();
      });

      if (confettiPieces.length > 0) {
        confettiAnimId = requestAnimationFrame(animateConfetti);
      } else {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    animateConfetti();
  }

  function stopConfetti() {
    if (confettiAnimId) {
      cancelAnimationFrame(confettiAnimId);
      confettiAnimId = null;
    }
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = [];
  }

  /* ──────────────────────────────────────────────
     6. DOWNLOAD CARD AS IMAGE (html2canvas)
  ────────────────────────────────────────────── */
  downloadBtn.addEventListener('click', async () => {
    const card = document.getElementById('greeting-card');

    // Temporarily pause confetti to get a cleaner screenshot
    stopConfetti();
    stopCardParticles();

    // Small pause so canvas clears
    await new Promise(r => setTimeout(r, 200));

    try {
      const canvas = await html2canvas(card, {
        backgroundColor: null,
        useCORS: true,
        scale: 2,
        logging: false,
      });

      const link    = document.createElement('a');
      const name    = cardNameEl.textContent.trim();
      link.download = `تهنئة-عيد-الاضحى-${name}.png`;
      link.href     = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('حدث خطأ أثناء تحميل الصورة. حاول مرة أخرى.');
    } finally {
      // Restart particles after download
      startCardParticles();
      launchConfetti();
    }
  });

  /* ──────────────────────────────────────────────
     7. AUDIO TOGGLE
  ────────────────────────────────────────────── */
  const audioBtn = document.getElementById('audio-btn');
  const bgAudio  = document.getElementById('bg-audio');
  let   isPlaying = false;

  audioBtn.addEventListener('click', () => {
    if (!bgAudio.src && bgAudio.children.length === 0) {
      // No audio file available — show a friendly message
      audioBtn.style.opacity = '0.4';
      audioBtn.title = 'ضع ملف صوتي في مجلد assets بالاسم: eid-nasheed.mp3';
      return;
    }

    if (isPlaying) {
      bgAudio.pause();
      isPlaying = false;
      audioBtn.querySelector('i').className = 'fa-solid fa-volume-xmark';
    } else {
      bgAudio.play().catch(() => {});
      isPlaying = true;
      audioBtn.querySelector('i').className = 'fa-solid fa-volume-high';
    }
  });

  /* ──────────────────────────────────────────────
     8. SCROLL-REVEAL (Intersection Observer)
  ────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.glass-card, .hero-title-wrap, .hero-eyebrow');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity  = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });
  }

  /* ──────────────────────────────────────────────
     9. INPUT: Live sparkle on focus
  ────────────────────────────────────────────── */
  nameInput.addEventListener('focus', () => {
    nameInput.style.boxShadow = '0 0 0 3px rgba(212,160,23,0.15), 0 0 20px rgba(212,160,23,0.1)';
  });
  nameInput.addEventListener('blur', () => {
    nameInput.style.boxShadow = '';
  });

  /* ──────────────────────────────────────────────
     10. SMOOTH SCROLL (for anchor links if any)
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ──────────────────────────────────────────────
     11. DYNAMIC BACKGROUND GRADIENT SHIFT
  ────────────────────────────────────────────── */
  (function animateBodyGradient() {
    let hue = 220;
    let dir  = 1;

    function step() {
      hue += dir * 0.1;
      if (hue > 240) dir = -1;
      if (hue < 200) dir =  1;

      document.body.style.background =
        `radial-gradient(ellipse at 60% 20%, hsl(${hue}, 60%, 8%) 0%, hsl(225, 70%, 4%) 50%, #020710 100%)`;

      requestAnimationFrame(step);
    }
    step();
  })();

  /* ──────────────────────────────────────────────
     12. CURSOR SPARKLE (desktop only)
  ────────────────────────────────────────────── */
  if (window.innerWidth > 768) {
    const sparklePool = [];

    function createSparkle(x, y) {
      const s = document.createElement('div');
      s.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: radial-gradient(circle, #ffd700, #d4a017);
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%) scale(1);
        transition: transform 0.5s ease, opacity 0.5s ease;
        box-shadow: 0 0 6px #d4a017;
      `;
      document.body.appendChild(s);
      sparklePool.push(s);

      requestAnimationFrame(() => {
        s.style.transform = 'translate(-50%, -50%) scale(0)';
        s.style.opacity   = '0';
      });

      setTimeout(() => {
        s.remove();
        sparklePool.splice(sparklePool.indexOf(s), 1);
      }, 500);
    }

    let lastSparkleTime = 0;
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastSparkleTime > 60) { // throttle: max ~16 sparkles/sec
        lastSparkleTime = now;
        createSparkle(e.clientX, e.clientY);
      }
    });
  }

}); // end DOMContentLoaded
