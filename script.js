/* ==========================================
   CINEMATIC BIRTHDAY SITE - SCRIPT.JS
========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPasscodeScreen();
  initLoader();
  initAudioSystem();
  initPageNavigation();
  initGiftBox();
  initCandles();
  initCountdown();
  initGalleryLightbox();
  initHeartTrailCanvas();
  initFloatingBackground();
  initFinaleFireworks();
  initReactions();
});

/* ==========================================
   1. LOADER & PROGRESS BAR
========================================== */
function initLoader() {
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const loaderOverlay = document.getElementById('loader-overlay');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress > 100) progress = 100;
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.innerText = `${progress}%`;
    
    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (loaderOverlay) {
          loaderOverlay.style.opacity = '0';
          setTimeout(() => loaderOverlay.classList.add('hidden'), 800);
        }
      }, 400);
    }
  }, 120);
}

/* ==========================================
   2. AUDIO CONTROLLER (WEB AUDIO SYNTHESIZER)
========================================== */
let audioCtx = null;
let isPlaying = false;
let isMuted = false;
let musicInterval = null;

function initAudioSystem() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const muteBtn = document.getElementById('mute-btn');
  const volumeSlider = document.getElementById('volume-slider');

  // First interaction audio start
  const startAudioOnInteraction = () => {
    if (!audioCtx) {
      startAmbientAudio();
    }
    document.removeEventListener('click', startAudioOnInteraction);
    document.removeEventListener('touchstart', startAudioOnInteraction);
  };
  document.addEventListener('click', startAudioOnInteraction);
  document.addEventListener('touchstart', startAudioOnInteraction);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (!audioCtx) {
        startAmbientAudio();
      } else {
        togglePlayPause();
      }
    });
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause);
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      muteBtn.innerHTML = isMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
    });
  }
}

function startAmbientAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    isPlaying = true;
    updateAudioUI();
    playBirthdayMelodyLoop();
  } catch (e) {
    console.log('Web Audio not supported');
  }
}

function togglePlayPause() {
  if (!audioCtx) {
    startAmbientAudio();
    return;
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
    isPlaying = true;
  } else if (isPlaying) {
    audioCtx.suspend();
    isPlaying = false;
  } else {
    audioCtx.resume();
    isPlaying = true;
  }
  updateAudioUI();
}

function updateAudioUI() {
  const playPauseBtn = document.getElementById('play-pause-btn');
  const musicIcon = document.getElementById('music-icon');
  const discIcon = document.getElementById('disc-icon');

  if (playPauseBtn) {
    playPauseBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
  }
  if (discIcon && musicIcon) {
    if (isPlaying) {
      discIcon.style.display = 'inline-block';
      musicIcon.style.display = 'none';
    } else {
      discIcon.style.display = 'none';
      musicIcon.style.display = 'inline-block';
    }
  }
}

// Synthesize ambient soft birthday notes
function playBirthdayMelodyLoop() {
  const notes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 261.63, 261.63, 293.66, 261.63, 392.00, 349.23];
  let noteIndex = 0;

  musicInterval = setInterval(() => {
    if (!audioCtx || isMuted || !isPlaying) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const vol = parseFloat(document.getElementById('volume-slider')?.value || 1.0);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[noteIndex], audioCtx.currentTime);

    gain.gain.setValueAtTime(vol * 0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);

    noteIndex = (noteIndex + 1) % notes.length;
  }, 500);
}

/* ==========================================
   3. PAGE NAVIGATION
========================================== */
function initPageNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetPageId = btn.getAttribute('data-target');
      if (targetPageId) {
        goToPage(targetPageId);
      }
    });
  });
}

function goToPage(pageNumber) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));

  const targetPage = document.getElementById(`page-${pageNumber}`);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Page specific triggers
    if (pageNumber === '6' || pageNumber === '7') {
      triggerConfetti();
    }
  }
}

/* ==========================================
   4. PAGE 1: GIFT UNBOXING
========================================== */
function initGiftBox() {
  const giftBox = document.getElementById('gift-box');
  const unboxedContent = document.getElementById('unboxed-content');
  const startBtn = document.getElementById('start-journey-btn');

  if (giftBox) {
    giftBox.addEventListener('click', () => {
      giftBox.classList.add('opened');
      triggerSparkles(giftBox);
      triggerConfetti();

      setTimeout(() => {
        giftBox.style.display = 'none';
        document.querySelector('.teaser-badge').style.display = 'none';
        document.querySelector('.gift-hint').style.display = 'none';
        if (unboxedContent) unboxedContent.classList.remove('hidden');
      }, 600);
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => goToPage(2));
  }
}

/* ==========================================
   5. PAGE 2: CANDLE BLOWING & TYPEWRITER
========================================== */
let blownCount = 0;

function initCandles() {
  const candles = document.querySelectorAll('.candle');
  candles.forEach(candle => {
    candle.addEventListener('click', () => {
      if (!candle.classList.contains('blown')) {
        candle.classList.add('blown');
        blownCount++;

        if (blownCount === candles.length) {
          onAllCandlesBlown();
        }
      }
    });
  });
}

function onAllCandlesBlown() {
  const cakeHint = document.getElementById('cake-hint');
  if (cakeHint) cakeHint.innerHTML = '✨ Wish Made! Candles Blown! ✨';
  triggerConfetti();

  const wishCards = document.querySelectorAll('.wish-item-card');
  wishCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('highlight');
    }, index * 200);
  });
}

function initPasscodeScreen() {
  const passcodeScreen = document.getElementById('passcode-screen');
  if (!passcodeScreen) return;

  const dots = document.querySelectorAll('#passcode-dots .dot');
  const errorMsg = document.getElementById('passcode-error');
  const keys = document.querySelectorAll('.keypad-grid .key-btn[data-key]');
  const clearBtn = document.getElementById('key-clear');
  const submitBtn = document.getElementById('key-submit');
  const card = document.querySelector('.passcode-card');

  const CORRECT_PASSCODE = '792026';
  let enteredPasscode = '';

  function updateDots() {
    dots.forEach((dot, index) => {
      if (index < enteredPasscode.length) {
        dot.classList.add('filled');
        dot.classList.remove('error');
      } else {
        dot.classList.remove('filled', 'error');
      }
    });
    if (errorMsg) errorMsg.classList.add('hidden');
  }

  function handleInput(digit) {
    if (enteredPasscode.length < 6) {
      enteredPasscode += digit;
      updateDots();
      if (enteredPasscode.length === 6) {
        setTimeout(verifyPasscode, 150);
      }
    }
  }

  function handleClear() {
    enteredPasscode = '';
    updateDots();
  }

  function verifyPasscode() {
    if (enteredPasscode === CORRECT_PASSCODE) {
      dots.forEach(dot => dot.classList.add('filled'));
      triggerConfetti();
      setTimeout(() => {
        passcodeScreen.classList.add('unlocked');
      }, 300);
    } else {
      dots.forEach(dot => dot.classList.add('error'));
      if (card) card.classList.add('shake');
      if (errorMsg) errorMsg.classList.remove('hidden');

      setTimeout(() => {
        if (card) card.classList.remove('shake');
        enteredPasscode = '';
        updateDots();
      }, 1000);
    }
  }

  keys.forEach(key => {
    key.addEventListener('click', () => {
      handleInput(key.getAttribute('data-key'));
    });
  });

  if (clearBtn) clearBtn.addEventListener('click', handleClear);
  if (submitBtn) submitBtn.addEventListener('click', verifyPasscode);

  document.addEventListener('keydown', (e) => {
    if (passcodeScreen.classList.contains('unlocked')) return;
    if (e.key >= '0' && e.key <= '9') {
      handleInput(e.key);
    } else if (e.key === 'Backspace') {
      enteredPasscode = enteredPasscode.slice(0, -1);
      updateDots();
    } else if (e.key === 'Enter') {
      verifyPasscode();
    }
  });
}

function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  const now = new Date();
  let targetYear = now.getFullYear();
  let targetDate = new Date(targetYear, 8, 7); // September 7, 2026
  if (now > targetDate) {
    targetDate.setFullYear(targetYear + 1);
  }

  function updateTimer() {
    const currentTime = new Date();
    const diff = targetDate - currentTime;

    if (diff <= 0) {
      daysEl.innerText = '000';
      hoursEl.innerText = '00';
      minsEl.innerText = '00';
      secsEl.innerText = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.innerText = d.toString().padStart(3, '0');
    hoursEl.innerText = h.toString().padStart(2, '0');
    minsEl.innerText = m.toString().padStart(2, '0');
    secsEl.innerText = s.toString().padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================
   6. PAGE 4: GALLERY LIGHTBOX
========================================== */
const galleryImages = [
  { src: 'images/whatsapp1.jpg', caption: 'Beautiful Moments & Pure Joy ✨' },
  { src: 'images/whatsapp2.jpg', caption: 'Shining Bright with Heartfelt Joy 💖' },
  { src: 'images/whatsapp3.jpg', caption: 'Unfiltered Smiles & Golden Memories 🌟' },
  { src: 'images/photo1.jpg', caption: 'Moments of Pure Elegance & Happiness ✨' },
  { src: 'images/photo2.jpg', caption: 'Endless Laughter & Radiant Warmth ☀️' },
  { src: 'images/photo3.jpg', caption: 'Forever Cherished Core Memory 💖' }
];
let currentImgIndex = 0;

function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index') || '0');
      openLightbox(idx);
    });
  });

  function openLightbox(idx) {
    currentImgIndex = idx;
    if (lightboxImg && lightboxCaption && lightbox) {
      lightboxImg.src = galleryImages[currentImgIndex].src;
      lightboxCaption.innerText = galleryImages[currentImgIndex].caption;
      lightbox.classList.add('active');
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentImgIndex);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
    openLightbox(currentImgIndex);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}

/* ==========================================
   7. PAGE 5: REACTION BUTTONS
========================================== */
function initReactions() {
  const reactionBtns = document.querySelectorAll('.card-reaction-btn');
  reactionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const countSpan = btn.querySelector('.react-count');
      const icon = btn.querySelector('i');
      let count = parseInt(btn.getAttribute('data-count') || '0');

      if (!btn.classList.contains('liked')) {
        count++;
        btn.classList.add('liked');
        icon.className = 'fa-solid fa-heart';
        triggerSparkles(btn);
      } else {
        count--;
        btn.classList.remove('liked');
        icon.className = 'fa-regular fa-heart';
      }
      btn.setAttribute('data-count', count);
      if (countSpan) countSpan.innerText = count;
    });
  });
}

/* ==========================================
   8. PAGE 6: FINAL SURPRISE & REPLAY
========================================== */
function initFinaleFireworks() {
  const heartTrigger = document.getElementById('heart-letter-trigger');
  const paperLetter = document.getElementById('paper-letter');
  const letterClose = document.getElementById('letter-close');
  const replayBtn = document.getElementById('replay-btn');

  if (heartTrigger && paperLetter) {
    heartTrigger.addEventListener('click', () => {
      paperLetter.classList.remove('hidden');
      triggerConfetti();
      launchFireworks();
    });
  }

  if (letterClose && paperLetter) {
    letterClose.addEventListener('click', () => {
      paperLetter.classList.add('hidden');
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      // Reset state
      blownCount = 0;
      document.querySelectorAll('.candle').forEach(c => c.classList.remove('blown'));
      document.getElementById('wishes-card')?.classList.add('hidden');
      document.getElementById('cake-hint').innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Click or tap on the flames to blow out the candles!';
      
      goToPage(1);
    });
  }
}

/* ==========================================
   9. CANVASES & PARTICLES
========================================== */
function initHeartTrailCanvas() {
  const canvas = document.getElementById('heart-trail-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const hearts = [];

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    const glow = document.getElementById('cursor-glow');
    if (glow) {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }

    if (Math.random() < 0.3) {
      hearts.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 12 + 8,
        alpha: 1,
        vy: -Math.random() * 2 - 1,
        vx: (Math.random() - 0.5) * 2,
        color: ['#FF4D8D', '#FFB6C1', '#FFD166'][Math.floor(Math.random() * 3)]
      });
    }
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < hearts.length; i++) {
      const h = hearts[i];
      h.x += h.vx;
      h.y += h.vy;
      h.alpha -= 0.015;

      if (h.alpha <= 0) {
        hearts.splice(i, 1);
        i--;
        continue;
      }

      ctx.save();
      ctx.globalAlpha = h.alpha;
      ctx.fillStyle = h.color;
      ctx.font = `${h.size}px serif`;
      ctx.fillText('❤️', h.x, h.y);
      ctx.restore();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

function initFloatingBackground() {
  const container = document.getElementById('floating-bg');
  if (!container) return;

  const symbols = ['🌸', '✨', '💖', '⭐', '🎈'];
  for (let i = 0; i < 25; i++) {
    const el = document.createElement('div');
    el.className = 'bg-particle';
    el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = `${Math.random() * 100}vw`;
    el.style.animationDuration = `${Math.random() * 8 + 6}s`;
    el.style.animationDelay = `${Math.random() * 5}s`;
    el.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
    container.appendChild(el);
  }
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

function triggerSparkles(element) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  for (let i = 0; i < 12; i++) {
    const spark = document.createElement('div');
    spark.innerText = '✨';
    spark.style.position = 'fixed';
    spark.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 60}px`;
    spark.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 60}px`;
    spark.style.pointerEvents = 'none';
    spark.style.zIndex = '99999';
    spark.style.transition = 'all 0.8s ease-out';
    document.body.appendChild(spark);

    setTimeout(() => {
      spark.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${-Math.random() * 100 - 20}px) scale(1.5)`;
      spark.style.opacity = '0';
    }, 10);

    setTimeout(() => spark.remove(), 850);
  }
}

function launchFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#FF4D8D', '#FFD166', '#7C3AED', '#38BDF8', '#F43F5E'];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1
    });
  }

  function loop() {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.01;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        i--;
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (particles.length > 0) {
      requestAnimationFrame(loop);
    }
  }
  loop();
}
