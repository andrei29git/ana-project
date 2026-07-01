/* Tear-off desk calendar — one real-dated page per day, July 1 → August 1.
   Content lives in js/calendar-data.js (CALENDAR_DATA). This file only
   handles unlocking, the tear animation, the torn-page pile (archive),
   and the day-card modal. August 1st (the finale) is special: instead of
   opening an inline card, it navigates to capsule.html. */

(function () {
  const calGroup = document.getElementById('desk-calendar');
  if (!calGroup || typeof CALENDAR_DATA === 'undefined') return;

  // ── TEST MODE ──────────────────────────────────────────────────
  // true  → every page is treated as unlocked, so you can keep tearing
  //         straight through the whole calendar to preview it.
  // false → real behavior: only today (or a missed earlier day) tears.
  // SET THIS BACK TO false BEFORE SHE EVER SEES THIS PAGE.
  const TEST_MODE = false;

  const STORAGE_KEY    = 'ana_calendar';
  const MAX_PILE_TIERS = 5;
  const WEEKDAYS_LONG  = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const MONTHS_LONG    = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  const DAYS      = CALENDAR_DATA.slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  const LAST_DATE = DAYS[DAYS.length - 1].date;

  // locked to Romania time, not the visitor's own local timezone/clock -
  // so a new page unlocks at midnight in Romania for everyone, everywhere,
  // regardless of where the browser happens to think it is.
  function todayStr() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Bucharest' });
  }
  function parseISODate(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  function weekdayLabel(s) { return WEEKDAYS_LONG[parseISODate(s).getDay()].toUpperCase(); }
  function monthLabel(s)   { return MONTHS_LONG[parseISODate(s).getMonth()].toUpperCase(); }
  function dayNum(s)       { return String(parseISODate(s).getDate()); }
  function fullLabel(s) {
    const d = parseISODate(s);
    return `${WEEKDAYS_LONG[d.getDay()]} · ${MONTHS_LONG[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  // ── persisted state: which dates have been torn/opened ────────────
  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { torn: Array.isArray(s.torn) ? s.torn : [] };
    } catch { return { torn: [] }; }
  }
  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  const state = loadState();

  function isTorn(date) { return state.torn.includes(date); }
  function markTorn(date) {
    if (!isTorn(date)) { state.torn.push(date); saveState(); }
  }
  function tornSorted() { return state.torn.slice().sort(); }

  // the front page: the first unlocked-but-untorn day, in order (so a
  // missed day is caught up before "today" ever shows). if she's fully
  // caught up, the front page is the next locked day. if every day
  // (including the finale) is torn, the finale stays as the front page.
  // in TEST_MODE, every day counts as unlocked - the date check never runs.
  function frontEntry() {
    const today = todayStr();
    for (const entry of DAYS) {
      if ((TEST_MODE || entry.date <= today) && !isTorn(entry.date)) return { entry, locked: false };
    }
    if (!TEST_MODE) {
      const next = DAYS.find(e => e.date > today);
      if (next) return { entry: next, locked: true };
    }
    return { entry: DAYS[DAYS.length - 1], locked: false, done: true };
  }

  // ── desk elements ───────────────────────────────────────────────
  // the calendar and the torn-page pile are two separate desk objects
  // (each its own .desk-item, so each gets its own hover-lift + shadow)
  const sheetEl    = document.getElementById('cal-sheet');
  const weekdayEl  = document.getElementById('cal-weekday');
  const monthEl    = document.getElementById('cal-month');
  const dayNumEl   = document.getElementById('cal-day-num');
  const pileItemEl = document.getElementById('desk-calendar-pile');
  const pileShadow = document.getElementById('cal-pile-shadow');
  const pileLayers = [1, 2, 3, 4, 5].map(n => document.getElementById(`cal-pile-${n}`));

  let current = null; // { entry, locked, done }

  function renderPile() {
    const n = Math.min(state.torn.length, MAX_PILE_TIERS);
    pileLayers.forEach((el, i) => {
      if (!el) return;
      if (i < n) {
        if (el.dataset.shown !== '1') {
          el.dataset.shown = '1';
          gsap.fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(2)' });
        }
      } else {
        el.dataset.shown = '0';
        gsap.set(el, { opacity: 0 });
      }
    });
    // the grounding shadow only makes sense once at least one page has landed
    if (pileShadow) gsap.to(pileShadow, { opacity: n > 0 ? 1 : 0, duration: 0.3 });
    // with nothing torn yet there's nothing to hover/click here - disable
    // the pile as an object entirely so it doesn't show its label or lift
    // over empty desk space
    if (pileItemEl) pileItemEl.style.pointerEvents = n > 0 ? 'auto' : 'none';
  }

  function renderFront(animateIn) {
    current = frontEntry();
    const { entry, locked, done } = current;

    weekdayEl.textContent = weekdayLabel(entry.date);
    monthEl.textContent   = monthLabel(entry.date);
    dayNumEl.textContent  = dayNum(entry.date);

    calGroup.classList.toggle('desk-calendar--locked', !!locked);
    calGroup.classList.toggle('desk-calendar--finale', entry.date === LAST_DATE);
    calGroup.classList.toggle('desk-calendar--done', !!done);

    if (animateIn) {
      gsap.fromTo(sheetEl,
        { opacity: 0, y: 10, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.6)' }
      );
    }
    renderPile();
  }

  // ── tiny toast, same technique as the site's other secret toasts ──
  function showToast(msg, e) {
    const toast = document.createElement('p');
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: 'fixed',
      fontFamily: "'Fraunces', serif",
      fontStyle: 'italic',
      fontSize: '0.95rem',
      color: 'var(--ivory, #f3e8d4)',
      textShadow: '0 1px 8px rgba(0,0,0,0.7)',
      pointerEvents: 'none',
      zIndex: 9999,
      whiteSpace: 'nowrap',
      left: ((e && e.clientX) || window.innerWidth / 2) + 'px',
      top: ((e && e.clientY) || window.innerHeight / 2) + 'px',
      transform: 'translate(-50%, -50%)',
    });
    document.body.appendChild(toast);
    gsap.fromTo(toast, { opacity: 0, y: 0 }, {
      opacity: 1, y: -18, duration: 0.4, ease: 'power2.out',
      onComplete() {
        gsap.to(toast, {
          opacity: 0, y: -34, delay: 1.2, duration: 0.5, ease: 'power2.in',
          onComplete() { toast.remove(); },
        });
      },
    });
  }

  function wobble(el) {
    gsap.timeline()
      .set(el, { transformOrigin: '50% 90%' })
      .to(el, { rotate: 5, duration: 0.07 }, 0)
      .to(el, { rotate: -5, duration: 0.07 }, 0.07)
      .to(el, { rotate: 3, duration: 0.07 }, 0.14)
      .to(el, { rotate: 0, duration: 0.07 }, 0.21);
  }

  // ── tear ────────────────────────────────────────────────────────
  let tearing = false;
  function tearFrontPage(e) {
    if (tearing || !current) return;
    const { entry, locked } = current;

    if (locked) {
      wobble(sheetEl);
      showToast(`not yet · back on ${monthLabel(entry.date)} ${dayNum(entry.date)}`, e);
      return;
    }

    tearing = true;
    const dateOpened = entry.date;
    const isFinale   = dateOpened === LAST_DATE;

    const tl = gsap.timeline({
      onComplete() {
        markTorn(dateOpened);
        // the finale doesn't open an inline card - it's the anniversary
        // page, so tearing it takes her straight there instead.
        if (isFinale) {
          window.location.href = 'capsule.html';
          return;
        }
        // clearProps wipes GSAP's cached transform/origin entirely rather
        // than tweening back to 0 - switching transformOrigin between
        // tears ('10% 90%') and center ('50% 50%') on the same element
        // otherwise leaves GSAP's internal matrix slightly off each time,
        // and that error compounds tear after tear (a real GSAP+SVG quirk).
        gsap.set(sheetEl, { clearProps: 'all' });
        renderFront(true);
        tearing = false;
        openDayCard(dateOpened);
      },
    });
    // origin near the top-center mimics a real tear-off page: it's still
    // hinged near the spiral, so the jagged torn edge at the bottom swings
    // the widest arc (as it should - that's what's actually tearing away),
    // while the top edge sits close to the pivot and barely moves.
    tl.to(sheetEl, { rotate: -18, x: -15, y: 55, scale: 0.92, opacity: 0, duration: 0.5, ease: 'power2.in', transformOrigin: '50% 3%' }, 0);
  }

  calGroup.addEventListener('click', tearFrontPage);

  if (pileItemEl) {
    pileItemEl.addEventListener('click', () => {
      if (state.torn.length) openArchive();
    });
  }

  // ── day-card modal ─────────────────────────────────────────────
  const overlay   = document.getElementById('calendar-overlay');
  const wrap      = document.getElementById('calendar-wrap');
  const modal     = document.getElementById('calendar-modal');
  const contentEl = document.getElementById('calendar-modal-content');
  const closeBtn  = document.getElementById('calendar-modal-close');
  const prevBtn   = document.getElementById('calendar-nav-prev');
  const nextBtn   = document.getElementById('calendar-nav-next');
  if (!overlay || !wrap || !modal) return;

  let modalDate  = null;
  let modalAudio = null;
  // prev/next only make sense when browsing the pile's archive - a freshly
  // torn page opened straight from the calendar has nowhere to "move" to.
  let navAllowed = false;

  function renderCard(date) {
    // the finale never renders inline, even when revisited from the
    // archive - it always leads to its own page.
    if (date === LAST_DATE) { window.location.href = 'capsule.html'; return; }

    const entry = DAYS.find(d => d.date === date);
    if (!entry) return;
    modalDate = date;

    if (modalAudio) { modalAudio.pause(); modalAudio = null; }

    let inner = `<p class="cal-card-eyebrow">${fullLabel(date)}</p>`;
    inner += `<h3 class="cal-card-title">${entry.title}</h3>`;

    if (entry.type === 'photo' && entry.image) {
      inner += `<div class="cal-card-photo"><img loading="lazy" decoding="async" src="${entry.image}" alt="${entry.title}"></div>`;
      if (entry.body) inner += `<p class="cal-card-caption">${entry.body}</p>`;
    } else if (entry.type === 'song' && entry.audio) {
      inner += `<div class="cal-card-song">
                  <button class="cal-song-play" id="cal-song-play" type="button" aria-label="play song">▶</button>
                  <span class="cal-song-note">♪ ♫</span>
                </div>`;
      if (entry.body) inner += `<p class="cal-card-caption">${entry.body}</p>`;
    } else {
      inner += `<p class="cal-card-body">${entry.body || ''}</p>`;
    }

    contentEl.innerHTML = inner;

    if (entry.type === 'song' && entry.audio) {
      const playBtn = document.getElementById('cal-song-play');
      modalAudio = new Audio(entry.audio);
      playBtn.addEventListener('click', () => {
        if (modalAudio.paused) {
          modalAudio.play().catch(() => {});
          playBtn.textContent = '⏸';
          playBtn.classList.add('playing');
        } else {
          modalAudio.pause();
          playBtn.textContent = '▶';
          playBtn.classList.remove('playing');
        }
      });
      modalAudio.addEventListener('ended', () => {
        playBtn.textContent = '▶';
        playBtn.classList.remove('playing');
      });
    }

    const sorted = tornSorted();
    const idx = sorted.indexOf(date);
    prevBtn.disabled = idx <= 0;
    nextBtn.disabled = idx === -1 || idx >= sorted.length - 1;
  }

  function openDayCard(date, allowNav) {
    if (date === LAST_DATE) { window.location.href = 'capsule.html'; return; }
    navAllowed = !!allowNav;
    modal.classList.toggle('calendar-modal--no-nav', !navAllowed);
    renderCard(date);
    overlay.classList.add('open');
    requestAnimationFrame(() => wrap.classList.add('open'));
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function openArchive() {
    const sorted = tornSorted();
    if (sorted.length) openDayCard(sorted[sorted.length - 1], true);
  }

  function closeDayCard() {
    overlay.classList.remove('open');
    wrap.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalAudio) { modalAudio.pause(); modalAudio = null; }
    setTimeout(() => { contentEl.innerHTML = ''; }, 350);
  }

  function goPrev() {
    if (!navAllowed) return;
    const sorted = tornSorted();
    const idx = sorted.indexOf(modalDate);
    if (idx > 0) renderCard(sorted[idx - 1]);
  }
  function goNext() {
    if (!navAllowed) return;
    const sorted = tornSorted();
    const idx = sorted.indexOf(modalDate);
    if (idx !== -1 && idx < sorted.length - 1) renderCard(sorted[idx + 1]);
  }

  closeBtn.addEventListener('click', closeDayCard);
  overlay.addEventListener('click', closeDayCard);
  wrap.addEventListener('click', (e) => { if (e.target === wrap) closeDayCard(); });
  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);
  document.addEventListener('keydown', (e) => {
    if (!wrap.classList.contains('open')) return;
    if (e.key === 'Escape')     closeDayCard();
    if (e.key === 'ArrowLeft')  goPrev();
    if (e.key === 'ArrowRight') goNext();
  });

  // ── init ────────────────────────────────────────────────────────
  renderFront(false);

  // catch a midnight rollover if the tab is left open / regains focus
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') renderFront(false);
  });
})();
