/**
 * script.js | Business Partners × Froneri | Eid 2025
 * Author: Ahmed Kilany — طارق زهران edition
 */
'use strict';

const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let downloading = false;

/* ══════════════════════════════════
   1. LOADER
══════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    $('loader').classList.add('out');
    startBgParticles();
    startGradient();
    initStats();
    cloneAutoTrack(); // duplicate track for seamless loop
  }, 2700);
});

/* ══════════════════════════════════
   2. HEADER
══════════════════════════════════ */
(function(){
  const hdr = $('header');
  const btn = $('menuBtn');
  const nav = $('mobileNav');
  window.addEventListener('scroll', () =>
    hdr.classList.toggle('scrolled', window.scrollY > 50), { passive: true });
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    btn.querySelector('i').className = 'fa-solid fa-bars';
  }));
})();

/* ══════════════════════════════════
   3. BACKGROUND PARTICLES
══════════════════════════════════ */
const bgC   = $('bgCanvas');
const bgCtx = bgC.getContext('2d');
let   bgPs  = [];

// BP brand colours for particles
const BP_HUES = [210, 45, 130, 50, 0]; // blue, gold, green, yellow, red

function resizeBg() { bgC.width = window.innerWidth; bgC.height = window.innerHeight; }
window.addEventListener('resize', resizeBg, { passive: true });

function mkP() {
  return {
    x: Math.random() * bgC.width,
    y: Math.random() * bgC.height,
    r: Math.random() * 1.6 + .3,
    alpha: Math.random() * .5 + .1,
    speed: Math.random() * .3 + .08,
    drift: (Math.random() - .5) * .2,
    twk:   Math.random() * Math.PI * 2,
    hue:   BP_HUES[Math.floor(Math.random() * BP_HUES.length)],
  };
}

function startBgParticles() {
  resizeBg();
  for (let i = 0; i < 90; i++) bgPs.push(mkP());
  drawBg();
}

function drawBg() {
  bgCtx.clearRect(0, 0, bgC.width, bgC.height);
  bgPs.forEach(p => {
    p.twk += .016;
    p.alpha = .08 + Math.abs(Math.sin(p.twk)) * .45;
    p.y -= p.speed; p.x += p.drift;
    if (p.y < -5) { p.y = bgC.height + 5; p.x = Math.random() * bgC.width; }
    if (p.x < -5 || p.x > bgC.width + 5) { p.x = Math.random() * bgC.width; p.y = bgC.height; }
    bgCtx.save();
    bgCtx.globalAlpha = p.alpha;
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `hsl(${p.hue},80%,65%)`;
    bgCtx.shadowColor = `hsl(${p.hue},90%,60%)`;
    bgCtx.shadowBlur = 5;
    bgCtx.fill();
    bgCtx.restore();
  });
  requestAnimationFrame(drawBg);
}

/* ══════════════════════════════════
   4. CONFETTI
══════════════════════════════════ */
const cC   = $('confCanvas');
const cCtx = cC.getContext('2d');
let   cPs  = [], cAnim = null;

const COLORS = ['#fbbf24','#e63946','#1d7fd4','#2ec44a','#f4c01e','#f9a8d4','#93c5fd','#fff'];

function resizeC() { cC.width = window.innerWidth; cC.height = window.innerHeight; }
window.addEventListener('resize', resizeC, { passive: true });
resizeC();

function launchConfetti() {
  resizeC(); cPs = [];
  for (let i = 0; i < 200; i++) {
    cPs.push({
      x: Math.random() * cC.width,
      y: -20 - Math.random() * 280,
      w: Math.random() * 10 + 4, h: Math.random() * 5 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - .5) * .2,
      vx: (Math.random() - .5) * 2.5,
      vy: Math.random() * 2.5 + 1.5,
      alpha: 1, decay: Math.random() * .005 + .002,
    });
  }
  if (cAnim) cancelAnimationFrame(cAnim);
  animC();
}

function animC() {
  cCtx.clearRect(0, 0, cC.width, cC.height);
  cPs = cPs.filter(p => p.alpha > .02);
  cPs.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.angle += p.spin;
    p.vy += .055; p.alpha = Math.max(0, p.alpha - p.decay);
    cCtx.save();
    cCtx.globalAlpha = p.alpha;
    cCtx.translate(p.x, p.y); cCtx.rotate(p.angle);
    cCtx.fillStyle = p.color;
    cCtx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    cCtx.restore();
  });
  if (cPs.length > 0) cAnim = requestAnimationFrame(animC);
  else { cCtx.clearRect(0,0,cC.width,cC.height); cAnim = null; }
}

function stopConfetti() {
  if (cAnim) { cancelAnimationFrame(cAnim); cAnim = null; }
  cCtx.clearRect(0, 0, cC.width, cC.height); cPs = [];
}

/* ══════════════════════════════════
   5. AUTO-SCROLL PRODUCT TRACK
   Clone cards for seamless infinite loop
══════════════════════════════════ */
function cloneAutoTrack() {
  const track = $('productsTrack');
  if (!track) return;
  const originals = Array.from(track.children);
  originals.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
}

/* ══════════════════════════════════
   6. STATS COUNTER
══════════════════════════════════ */
function initStats() {
  $$('.sn').forEach(el => {
    const target = parseInt(el.dataset.t, 10);
    const dur = 1800, step = 16;
    const inc = target / (dur / step);
    let cur = 0;
    const io = new IntersectionObserver(e => {
      if (!e[0].isIntersecting) return;
      io.disconnect();
      const tick = () => {
        cur = Math.min(cur + inc, target);
        el.textContent = Math.round(cur).toLocaleString();
        if (cur < target) setTimeout(tick, step);
      };
      tick();
    }, { threshold: .5 });
    io.observe(el);
  });
}

/* ══════════════════════════════════
   7. MANUAL PRODUCT SLIDER
══════════════════════════════════ */
(function(){
  const slider = $('prodSlider');
  const prev   = $('prevBtn');
  const next   = $('nextBtn');
  const dotsW  = $('sdots');
  if (!slider) return;

  const cards = Array.from(slider.children);
  const total = cards.length;
  let cur = 0, autoId = null;

  function vis() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 480)  return 2;
    return 1;
  }

  function buildDots() {
    dotsW.innerHTML = '';
    const steps = total - vis() + 1;
    for (let i = 0; i < steps; i++) {
      const d = document.createElement('button');
      d.className = 'sdot' + (i === 0 ? ' on' : '');
      d.setAttribute('aria-label', `منتج ${i+1}`);
      d.addEventListener('click', () => { goTo(i); reset(); });
      dotsW.appendChild(d);
    }
  }

  function updDots() {
    $$('.sdot').forEach((d,i) => d.classList.toggle('on', i === cur));
  }

  function cw() {
    if (!cards[0]) return 0;
    return cards[0].offsetWidth + (parseFloat(getComputedStyle(slider).gap) || 16);
  }

  function goTo(idx) {
    const max = total - vis();
    cur = Math.max(0, Math.min(idx, max));
    slider.style.transform  = `translateX(${cur * cw()}px)`;
    slider.style.transition = 'transform .45s cubic-bezier(.4,0,.2,1)';
    updDots();
  }

  prev.addEventListener('click', () => { goTo(cur-1); reset(); });
  next.addEventListener('click', () => { goTo(cur+1); reset(); });

  function auto() { autoId = setInterval(() => goTo(cur < total - vis() ? cur+1 : 0), 3800); }
  function reset() { clearInterval(autoId); auto(); }

  // Touch
  let tx = 0;
  slider.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) { dx < 0 ? goTo(cur+1) : goTo(cur-1); reset(); }
  }, { passive: true });

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt); rt = setTimeout(() => { buildDots(); goTo(0); }, 220);
  }, { passive: true });

  buildDots(); auto();
})();

/* ══════════════════════════════════
   8. GREETING CARD — OPEN / CLOSE
══════════════════════════════════ */
(function(){
  const showBtn  = $('showCardBtn');
  const overlay  = $('cardOverlay');
  const closeBtn = $('closeCardBtn');
  const nameIn   = $('nameInput');
  const cName    = $('cardName');

  function open() {
    cName.textContent = nameIn.value.trim() || 'صديقنا العزيز';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(launchConfetti, 320);
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    stopConfetti();
  }

  showBtn.addEventListener('click', open);
  nameIn.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
})();

/* ══════════════════════════════════
   9. DOWNLOAD — PROFESSIONAL
   ──────────────────────────────
   • scale:2.5 for retina quality
   • useCORS:true for froneri.eg images
   • Hides buttons before capture
   • iOS-safe anchor download
   • Toast on success
══════════════════════════════════ */
(function(){
  const dlBtn   = $('dlBtn');
  const dlIdle  = $('dlIdle');
  const dlLoad  = $('dlLoad');
  const actions = $('gcActions');
  const closeX  = $('closeCardBtn');
  const card    = $('greetCard');
  const cName   = $('cardName');

  if (!dlBtn) return;
  dlBtn.addEventListener('click', doDownload);

  async function doDownload() {
    if (downloading) return;
    downloading = true;

    // Show loading state
    dlBtn.disabled = true;
    dlIdle.style.display = 'none';
    dlLoad.style.display = 'flex';

    // Pause confetti
    stopConfetti();

    // Hide UI elements from screenshot
    actions.style.setProperty('display', 'none', 'important');
    closeX.style.setProperty('display',  'none', 'important');

    await sleep(220);

    try {
      const rect = card.getBoundingClientRect();

      const canvas = await html2canvas(card, {
        scale          : 2.5,
        useCORS        : true,
        allowTaint     : false,
        backgroundColor: null,
        logging        : false,
        removeContainer: true,
        width          : rect.width,
        height         : rect.height,
        windowWidth    : document.documentElement.scrollWidth,
        windowHeight   : document.documentElement.scrollHeight,
        scrollX        : 0,
        scrollY        : -window.scrollY,
        ignoreElements : el =>
          el.id === 'gcActions'   ||
          el.id === 'closeCardBtn'||
          el.id === 'confCanvas'  ||
          el.id === 'bgCanvas'    ||
          el.id === 'toast'       ||
          el.id === 'loader',
      });

      // Canvas → Blob
      const blob = await new Promise((res, rej) => {
        canvas.toBlob(b => b ? res(b) : rej(new Error('toBlob null')), 'image/png', 1.0);
      });

      // Safe filename (supports Arabic)
      const raw  = cName.textContent.trim() || 'greeting';
      const safe = raw
        .replace(/[\\/:*?"<>|]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-{2,}/g, '-')
        .substring(0, 60) || 'greeting';
      const fname = `Eid-Greeting-${safe}.png`;

      // iOS-safe download
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href = url; a.download = fname;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 6000);

      showToast('تم تحميل التهنئة بنجاح ✨');

    } catch (err) {
      console.error('[Download]', err);
      showToast('حدث خطأ، حاول مرة أخرى 🙏', 'error');
    } finally {
      actions.style.removeProperty('display');
      closeX.style.removeProperty('display');
      dlBtn.disabled = false;
      dlIdle.style.display = '';
      dlLoad.style.display = 'none';
      downloading = false;
      setTimeout(launchConfetti, 400);
    }
  }
})();

/* ══════════════════════════════════
   10. SHARE
══════════════════════════════════ */
(function(){
  const btn = $('shareBtn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const data = {
      title: 'عيد أضحى مبارك ✨',
      text : 'تهنئة خاصة من Business Partners — طارق زهران — الإسماعيلية',
      url  : window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(data); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('تم نسخ الرابط ✅');
      } catch { showToast('لا يمكن المشاركة الآن', 'error'); }
    }
  });
})();

/* ══════════════════════════════════
   11. AUDIO TOGGLE
   (Mega Ice Cream jingle وهمي — اضف ملف mp3)
══════════════════════════════════ */
(function(){
  const btn   = $('audioBtn');
  const audio = $('bgAudio');
  let   on    = false;

  btn.addEventListener('click', () => {
    // Check if audio source loaded
    if (!audio.src && !audio.querySelector('source[src]')) {
      showToast('ضع ملف mega-jingle.mp3 في assets/audio/', 'info');
      return;
    }
    if (on) {
      audio.pause(); on = false;
      btn.querySelector('i').className = 'fa-solid fa-music';
      btn.classList.remove('on');
    } else {
      audio.play().catch(() => showToast('ضع ملف صوتي في assets/audio/', 'info'));
      on = true;
      btn.querySelector('i').className = 'fa-solid fa-volume-high';
      btn.classList.add('on');
    }
  });
})();

/* ══════════════════════════════════
   12. SCROLL REVEAL
══════════════════════════════════ */
(function(){
  if (!('IntersectionObserver' in window)) {
    $$('.reveal').forEach(el => el.classList.add('shown'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('shown'), i * 110);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));
})();

/* ══════════════════════════════════
   13. SMOOTH SCROLL
══════════════════════════════════ */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    const off = ($('header')?.offsetHeight || 65) + 10;
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════
   14. TOAST
══════════════════════════════════ */
let toastT = null;
function showToast(msg, type = 'success') {
  const el = $('toast');
  $('toast-text').textContent = msg;
  el.className = type === 'error' ? 'error' : type === 'info' ? 'info' : '';
  el.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => el.classList.remove('show'), 3400);
}

/* ══════════════════════════════════
   15. BODY GRADIENT ANIMATION
══════════════════════════════════ */
function startGradient() {
  let t = 0;
  (function step() {
    t += .0015;
    const h = 220 + Math.sin(t) * 12;
    document.body.style.background =
      `radial-gradient(ellipse at 65% 15%, hsl(${h},62%,5%) 0%, hsl(225,72%,3%) 55%, #020710 100%)`;
    requestAnimationFrame(step);
  })();
}
