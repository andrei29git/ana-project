/* Flip-clock countdown - shows fake date; triple-click reveals secret */

(function () {
  // Date shown to Ana (the decoy)
  const SHOWN_DATE = new Date('2026-07-05T01:00:00');
  // Real date (revealed by easter egg)
  const REAL_DATE  = new Date('2026-07-05T01:00:00');

  const els = {
    days:  document.getElementById('days-val'),
    hours: document.getElementById('hours-val'),
    mins:  document.getElementById('mins-val'),
    secs:  document.getElementById('secs-val'),
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function flip(el, newVal) {
    const s = pad(newVal);
    if (el.textContent === s) return;
    el.classList.add('flip-out');
    setTimeout(() => {
      el.textContent = s;
      el.classList.remove('flip-out');
      el.classList.add('flip-in');
      setTimeout(() => el.classList.remove('flip-in'), 200);
    }, 150);
  }

  function getComponents(target) {
    const diff = Math.max(0, target - Date.now());
    return {
      days:  Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins:  Math.floor((diff % 3600000) / 60000),
      secs:  Math.floor((diff % 60000) / 1000),
    };
  }

  function update(target) {
    const c = getComponents(target);
    flip(els.days,  c.days);
    flip(els.hours, c.hours);
    flip(els.mins,  c.mins);
    flip(els.secs,  c.secs);
  }

  update(SHOWN_DATE);
  setInterval(() => update(SHOWN_DATE), 1000);

  // ── Triple-click easter egg → opens apology video ─────────────────
  let clickCount = 0;
  let clickTimer  = null;
  let lastEvent   = null;

  document.getElementById('countdown').addEventListener('click', (e) => {
    lastEvent = e;
    clickCount++;
    clearTimeout(clickTimer);

    if (clickCount >= 3) {
      clickCount = 0;
      // triple-click is a secret trigger → opens the games page
      window.location.href = 'games.html';
      return;
    }
    clickTimer = setTimeout(() => { clickCount = 0; }, 600);
  });
})();
