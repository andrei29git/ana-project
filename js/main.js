/* ════════════════════════════════════════════════════════════════
   for Ana - animations & interactions
═══════════════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ─── Reasons ─────────────────────────────────────────────────────── */
// DAVID: rewrite these in your own words - the more specific, the better.
const REASONS = [
  "the way your eyes look. I've never seen anyone look at the world the way you do.",
  "how you love without half-measures, completely, and unapoloegtically.",
  "the way your mind works, and how you notice things other people walk right past. (i.e. how autistic you are)",
  "because you make long distance survivable just by existing on the other end of it.",
  "that night we first met, and how it felt like I'd known you forever.",
  "that beautiful smile of yours. I can't get enough of it.",
  "the way you said 'I love you' that first time. I replayed it for weeks.",
  "how you laugh at things that are genuinely funny, not just to be polite.",
  "that you came to visit even when it was hard. every single time.",
  "the way you look in literally every photo I have ever taken of you.",
  "because being loved by you is not a thing I will ever take for granted.",
  "how you make ordinary evenings feel like they actually mattered.",
];

let reasonIndex = 0;
const reasonCard = document.getElementById('reason-card');
const reasonText = document.getElementById('reason-text');
const reasonNum  = document.getElementById('reason-num');
const reasonBtn  = document.getElementById('reason-btn');

function showReason(i) {
  reasonNum.textContent  = `no. ${i + 1}`;
  reasonText.textContent = REASONS[i];
}
showReason(0);

reasonBtn.addEventListener('click', () => {
  reasonCard.classList.remove('shuffling');
  void reasonCard.offsetWidth;
  reasonCard.classList.add('shuffling');
  reasonIndex = (reasonIndex + 1) % REASONS.length;
  setTimeout(() => showReason(reasonIndex), 210);
});

/* ─── Records - click to play the song + spin the disc ────────────── */
// DAVID: put your three mp3 files in the "audio" folder next to index.html,
// named exactly: white-dress.mp3, heartbeat.mp3, flashing-lights.mp3
// (different names? just change them here.)
const TRACKS = {
  '1': 'audio/white-dress.mp3',
  '2': 'audio/heartbeat.mp3',
  '3': 'audio/flashing-lights.mp3',
};

const records = document.querySelectorAll('.record');
const players = new Map();

records.forEach(rec => {
  const audio = new Audio(TRACKS[rec.dataset.record]);
  audio.preload = 'none';
  players.set(rec, audio);

  // when the song finishes, freeze the disc and lift the arm
  audio.addEventListener('ended', () => rec.classList.add('paused'));

  rec.addEventListener('click', () => {
    const playing = rec.classList.contains('spinning') && !rec.classList.contains('paused');

    if (playing) {
      audio.pause();
      rec.classList.add('paused');          // freeze disc, lift arm
      return;
    }

    // only one record plays at a time - pause the others
    records.forEach(other => {
      if (other === rec) return;
      players.get(other).pause();
      if (other.classList.contains('spinning')) other.classList.add('paused');
    });

    audio.play().catch(() => {});           // silent if the file isn't there yet
    rec.classList.add('spinning');
    rec.classList.remove('paused');
  });
});

// ── Lazy-play timeline videos (mobile performance) ──────────────────
(function () {
  const timelineVideos = document.querySelectorAll('.tl-photo video');
  if (!('IntersectionObserver' in window)) {
    timelineVideos.forEach(v => { v.preload = 'metadata'; v.load(); v.play().catch(() => {}); });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const v = entry.target;
      if (entry.isIntersecting) {
        if (v.preload === 'none') { v.preload = 'auto'; v.load(); }
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { rootMargin: '200px 0px', threshold: 0.1 });
  timelineVideos.forEach(v => io.observe(v));
})();

// ── Flashing Lights karaoke surprise at 0:42 ────────────────────────
(function () {
  const flashingRec = document.querySelector('.record[data-record="3"]');
  const flashingAudio = players.get(flashingRec);
  const overlay = document.getElementById('karaoke-overlay');
  const karaokeVideo = document.getElementById('karaoke-video');
  const closeBtn = document.getElementById('karaoke-close');
  let triggered = false;
  let preloaded = false;

  // start fetching the karaoke video the moment Flashing Lights plays
  flashingAudio.addEventListener('play', () => {
    if (!preloaded) {
      preloaded = true;
      karaokeVideo.preload = 'auto';
      karaokeVideo.load();
    }
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('visible');
    document.getElementById('flashing-set').classList.remove('karaoke-on');
    karaokeVideo.pause();
    karaokeVideo.currentTime = 0;
  });

  flashingAudio.addEventListener('timeupdate', () => {
    if (!triggered && flashingAudio.currentTime >= 42) {
      triggered = true;
      // scroll the Flashing Lights record into view so the popup is visible
      document.getElementById('flashing-set').scrollIntoView({ behavior: 'smooth', block: 'center' });
      overlay.classList.add('visible');
      document.getElementById('flashing-set').classList.add('karaoke-on');
      karaokeVideo.preload = 'auto';
      karaokeVideo.load();
      setTimeout(() => {
        flashingAudio.pause();
        flashingRec.classList.add('paused');
        karaokeVideo.play().catch(() => {});
      }, 350);
    }
  });

  // reset if the record is paused/restarted before 0:42
  flashingAudio.addEventListener('pause', () => {
    if (flashingAudio.currentTime < 42) triggered = false;
  });
  flashingAudio.addEventListener('seeked', () => {
    if (flashingAudio.currentTime < 42) {
      triggered = false;
      overlay.classList.remove('visible');
      karaokeVideo.pause();
      karaokeVideo.currentTime = 0;
    }
  });
})();

/* ─── Hero typewriter ─────────────────────────────────────────────── */
function typewriter(target, text) {
  return new Promise(resolve => {
    let i = 0;
    const tick = setInterval(() => {
      target.textContent += text[i++];
      if (i >= text.length) { clearInterval(tick); resolve(); }
    }, 130);
  });
}

gsap.set('.hero-for',        { y: 14, rotation: -6 });
gsap.set('.hero-tagline',    { y: 14 });
gsap.set('.countdown-block', { y: 20 });

window.addEventListener('load', () => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('.hero-eyebrow',   { opacity: 1, duration: 0.9 }, 0.4)
    .to('.hero-for',        { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
    .to('.hero-name',       { opacity: 1, duration: 0.05 })
    .add(() => typewriter(document.getElementById('typed-text'), 'Ana'))
    .to('.hero-tagline',    { opacity: 1, y: 0, duration: 0.8 }, '+=0.5')
    .to('.countdown-block', { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
    .to('.scroll-cue',      { opacity: 1, duration: 0.8 }, '-=0.4');
});

/* ─── Chapter marks & headings reveal ─────────────────────────────── */
gsap.utils.toArray('.chapter-mark').forEach(el => {
  gsap.from(el, {
    opacity: 0, y: 24, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 88%' },
  });
});
gsap.utils.toArray('.section-heading').forEach(el => {
  gsap.from(el, {
    opacity: 0, y: 24, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 86%' },
  });
});

/* ─── Letter ──────────────────────────────────────────────────────── */
gsap.from('.wax-seal', {
  scale: 0.4, opacity: 0, rotation: -35,
  duration: 1, ease: 'back.out(1.8)',
  scrollTrigger: { trigger: '.letter-section', start: 'top 70%' },
});
gsap.from('.letter-paper', {
  y: 60, opacity: 0, duration: 1.1, ease: 'power3.out',
  scrollTrigger: { trigger: '.letter-section', start: 'top 62%' },
});

/* ─── Timeline - spine draw + card reveals ────────────────────────── */
const thread = document.querySelector('.tl-thread');

// the spine fills as you scroll through the thread
gsap.to('#tl-spine-fill', {
  height: '100%',
  ease: 'none',
  scrollTrigger: {
    trigger: thread,
    start: 'top 55%',
    end: 'bottom 70%',
    scrub: 0.6,
  },
});

// auto-alternate sides so inserting an event never needs hand-editing
gsap.utils.toArray('.tl-item:not(.tl-end)').forEach((item, i) => {
  item.classList.remove('tl-left', 'tl-right');
  item.classList.add(i % 2 ? 'tl-right' : 'tl-left');
});

// each item slides in from its side; node pops
gsap.utils.toArray('.tl-item').forEach(item => {
  const card = item.querySelector('.tl-card');
  const node = item.querySelector('.tl-node');
  const fromX = item.classList.contains('tl-right') ? 48 : -48;

  gsap.from(card, {
    x: fromX, opacity: 0, duration: 0.85, ease: 'power3.out',
    scrollTrigger: { trigger: item, start: 'top 84%' },
  });
  if (node) {
    gsap.from(node, {
      scale: 0, duration: 0.5, ease: 'back.out(2.2)',
      scrollTrigger: { trigger: item, start: 'top 84%' },
    });
  }
});

// season dividers
gsap.utils.toArray('.tl-season').forEach(s => {
  gsap.from(s, {
    opacity: 0, scale: 0.85, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: s, start: 'top 86%' },
  });
});

// the finale
gsap.from('.tl-finale', {
  opacity: 0, y: 30, duration: 1, ease: 'power3.out',
  scrollTrigger: { trigger: '.tl-finale', start: 'top 88%' },
});

/* ─── Records reveal ──────────────────────────────────────────────── */
gsap.from('.record-set', {
  opacity: 0, y: 60, duration: 1, stagger: 0.18, ease: 'power3.out',
  scrollTrigger: { trigger: '.records', start: 'top 78%' },
});

/* ─── Reason card reveal ──────────────────────────────────────────── */
gsap.from('#reason-card', {
  opacity: 0, y: 50, duration: 1, ease: 'power3.out',
  scrollTrigger: { trigger: '.reasons-section', start: 'top 72%' },
});

/* ─── Footer ──────────────────────────────────────────────────────── */
gsap.from('.footer > *', {
  opacity: 0, y: 24, duration: 0.8, stagger: 0.12, ease: 'power2.out',
  scrollTrigger: { trigger: '.footer', start: 'top 88%' },
});
