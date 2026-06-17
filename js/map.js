/* A Map of Us - every city in our timeline, pinned and clickable.
   DAVID: if any event is at the "wrong" city, edit the LOCATIONS table. */

(function () {
  const LOCATIONS = {
    hague: {
      name: 'The Hague',
      subtitle: 'Netherlands',
      blurb: 'the city across the distance',
      memories: [
        { date: 'November 20, 2025', title: 'the cursed bar' },
        { date: 'March 31, 2026',    title: 'second time at the beach' },
      ],
    },
    amsterdam: {
      name: 'Amsterdam',
      subtitle: 'Netherlands',
      blurb: "birthday girl",
      memories: [
        { date: 'September 15 – 23, 2025', title: 'the visit, and "I love you" back' },
      ],
    },
    rotterdam: {
      name: 'Rotterdam',
      subtitle: 'Netherlands',
      blurb: 'rotterdam was nice. you were better.',
      memories: [
        { date: 'November 23, 2025', title: 'first insta pic, officially us' },
        { date: 'March 22, 2026',    title: "someone's tummy was hurting" },
        { date: 'March 24, 2026',    title: 'rotterdam' },
        { date: 'May 1, 2026',       title: 'nine months, axe throwing, and cute ducks' },
      ],
    },
    utrecht: {
      name: 'Utrecht',
      subtitle: 'Netherlands',
      blurb: 'a city we fit a lot into',
      memories: [
        { date: 'September 15 – 23, 2025', title: 'the visit, and "I love you" back' },
        { date: 'May 3, 2026',             title: 'trampoline park + utrecht' },
      ],
    },
    brasov: {
      name: 'Brașov',
      subtitle: 'Romania',
      blurb: 'our second sleepover',
      memories: [
        { date: 'August 27, 2025', title: 'brașov' },
      ],
    },
    bucharest: {
      name: 'Bucharest',
      subtitle: 'Romania',
      blurb: 'home — where most of our story lives',
      memories: [
        { date: 'July 12, 2025',         title: 'an unlikely night' },
        { date: 'July 14, 2025',         title: 'our first date' },
        { date: 'August 1, 2025',        title: 'the day' },
        { date: 'August 29, 2025',       title: 'happy birthday to me, and I love you' },
        { date: 'August 30, 2025',       title: 'goodbye, for now' },
        { date: 'October 17, 2025',      title: 'zoo café' },
        { date: 'November 16, 2025',     title: 'ceramic café' },
        { date: 'December 10, 2025',     title: 'the first surprise' },
        { date: 'December 17, 2025',     title: 'christmas market' },
        { date: 'December 24, 2025',     title: 'christmas eve' },
        { date: 'January 4, 2026',       title: 'last day before the Netherlands again' },
        { date: 'February 1 – 2, 2026',  title: 'six months' },
        { date: 'February 6, 2026',      title: 'a quiet afternoon' },
        { date: 'February 14, 2026',     title: "valentine's day" },
        { date: 'February 25, 2026',     title: '. . .' },
        { date: 'April 11, 2026',        title: 'flowers for my cutiepie' },
        { date: 'April 18, 2026',        title: "mcdonald's at 2 a.m." },
        { date: 'May 9, 2026',           title: 'you and pankina' },
        { date: 'June 1, 2026',          title: 'ten months' },
        { date: 'June 3, 2026',          title: 'my cutiepie' },
        { date: 'June 11, 2026',         title: 'bath time, again' },
      ],
    },
    craiova: {
      name: 'Craiova',
      subtitle: 'Romania',
      blurb: 'a trip within a trip',
      memories: [
        { date: 'December 21, 2025', title: 'craiova christmas market' },
      ],
    },
  };

  const panel       = document.getElementById('map-panel');
  if (!panel) return;
  const cityEl      = document.getElementById('map-panel-city');
  const subtitleEl  = document.getElementById('map-panel-subtitle');
  const blurbEl     = document.getElementById('map-panel-blurb');
  const listEl      = document.getElementById('map-panel-list');
  const countEl     = document.getElementById('map-panel-count');
  const closeBtn    = document.getElementById('map-panel-close');
  const pins        = document.querySelectorAll('.map-pin');

  function openPanel(key) {
    const loc = LOCATIONS[key];
    if (!loc) return;
    cityEl.textContent     = loc.name;
    subtitleEl.textContent = loc.subtitle;
    blurbEl.textContent    = loc.blurb;
    countEl.textContent    = loc.memories.length === 1
      ? '1 memory'
      : `${loc.memories.length} memories`;

    listEl.innerHTML = '';
    loc.memories.forEach((m, i) => {
      const li = document.createElement('li');
      li.className = 'map-mem map-mem--clickable';
      li.style.animationDelay = `${0.05 + i * 0.03}s`;
      li.dataset.date = m.date;
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');
      li.innerHTML = `
        <span class="map-mem-date">${m.date}</span>
        <span class="map-mem-title">${m.title}</span>
      `;
      li.addEventListener('click', () => openMemoryModal(m.date));
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMemoryModal(m.date);
        }
      });
      listEl.appendChild(li);
    });

    panel.classList.add('map-panel--open');

    // pin styling - mark the active one
    pins.forEach(p => p.classList.toggle('map-pin--active', p.dataset.loc === key));
  }

  function closePanel() {
    panel.classList.remove('map-panel--open');
    pins.forEach(p => p.classList.remove('map-pin--active'));
    cityEl.textContent     = 'somewhere we’ve been';
    subtitleEl.textContent = 'pick a pin to remember it';
    blurbEl.textContent    = 'every dot on this map is a date with you.';
    countEl.textContent    = '';
    listEl.innerHTML       = '';
  }

  pins.forEach(p => {
    p.addEventListener('click', (e) => {
      e.stopPropagation();
      openPanel(p.dataset.loc);
    });
  });

  closeBtn.addEventListener('click', closePanel);

  // ─── memory modal (opens timeline card by date) ──────────────────
  const memoryOverlay = document.getElementById('memory-overlay');
  const memoryWrap    = document.getElementById('memory-wrap');
  const memoryModal   = document.getElementById('memory-modal');
  const memoryContent = document.getElementById('memory-modal-content');
  const memoryClose   = document.getElementById('memory-modal-close');

  // normalize so en-dash / em-dash / hyphen and stray whitespace all compare equal
  function normalizeDate(s) {
    return s.replace(/[‐-―-]/g, '-')   // any dash → "-"
            .replace(/\s+/g, ' ')                  // collapse whitespace
            .trim()
            .toLowerCase();
  }

  function findCardInDoc(doc, dateStr) {
    const target = normalizeDate(dateStr);
    const dates = doc.querySelectorAll('.tl-date');
    for (const d of dates) {
      if (normalizeDate(d.textContent) === target) {
        return d.closest('.tl-card');
      }
    }
    return null;
  }

  // The timeline cards live on timeline.html, not here. Fetch that page once
  // and cache its parsed DOM so memory clicks can pull the matching card.
  let timelineDocPromise = null;
  function loadTimelineDoc() {
    if (!timelineDocPromise) {
      timelineDocPromise = fetch('timeline.html')
        .then(r => r.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html'))
        .catch(() => null);
    }
    return timelineDocPromise;
  }
  // warm the cache so the first memory click feels instant
  loadTimelineDoc();

  async function openMemoryModal(dateStr) {
    // try the current page first (timeline page), then the fetched timeline
    let card = findCardInDoc(document, dateStr);
    if (!card) {
      const doc = await loadTimelineDoc();
      if (doc) card = findCardInDoc(doc, dateStr);
    }
    if (!card) return;

    const clone = document.importNode(card, true);
    // wire cloned videos with the same click-to-play + sound behavior as the timeline
    clone.querySelectorAll('video').forEach(v => {
      v.removeAttribute('autoplay');
      v.muted = false;
      v.parentElement.classList.add('has-video');

      v.addEventListener('click', (e) => {
        e.preventDefault();
        if (v.paused) {
          // pause every other timeline video on the page
          document.querySelectorAll('.tl-photo video').forEach(other => {
            if (other !== v) other.pause();
          });
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
      v.addEventListener('play',  () => v.parentElement.classList.add('playing'));
      v.addEventListener('pause', () => v.parentElement.classList.remove('playing'));
    });

    memoryContent.innerHTML = '';
    memoryContent.appendChild(clone);
    memoryOverlay.classList.add('open');
    memoryWrap.classList.add('open');
    memoryModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMemoryModal() {
    memoryOverlay.classList.remove('open');
    memoryWrap.classList.remove('open');
    memoryModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // pause any playing videos before clearing
    memoryContent.querySelectorAll('video').forEach(v => v.pause());
    setTimeout(() => { memoryContent.innerHTML = ''; }, 350);
  }

  memoryClose.addEventListener('click', closeMemoryModal);
  memoryOverlay.addEventListener('click', closeMemoryModal);
  // click anywhere outside the modal card (on the wrap backdrop) also closes
  memoryWrap.addEventListener('click', (e) => {
    if (e.target === memoryWrap) closeMemoryModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && memoryWrap.classList.contains('open')) {
      closeMemoryModal();
    }
  });

  // pin labels - show on hover (handled in CSS), and on focus for accessibility
  pins.forEach(p => {
    p.setAttribute('tabindex', '0');
    p.setAttribute('role', 'button');
    p.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPanel(p.dataset.loc);
      }
    });
  });
})();
