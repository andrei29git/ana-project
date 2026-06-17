/* ════════════════════════════════════════════════════════════════
   our little games — the secret section
   A hub (games.html) links to one page per game:
     this-or-that.html   → game "thisorthat", LEVELS mode
     favorites.html      → game "favorites",  sequential mode
   Both are "does he know me?" games: David pre-guesses Ana's picks
   and the page scores her picks against his guesses.
═══════════════════════════════════════════════════════════════════ */

/* ╔══════════════════════════════════════════════════════════════╗
   ║  DAVID — EDIT EVERYTHING IN THIS CONFIG BLOCK                 ║
   ╚══════════════════════════════════════════════════════════════╝ */

// ── Database (optional, do this last) ───────────────────────────────
// Leave as null to use THIS browser's local storage (works now, no setup).
// To turn on real cross-device save + history, paste your Firebase project
// config object here (Firebase console, Project settings, Web app).
const FIREBASE_CONFIG = null;

// ── Game 1: this or that  (LEVELS) ──────────────────────────────────
// Each entry in `levels` is ONE LEVEL on the levels page, a whole topic.
// A level has a `name` and its own `rounds` (the bread / spread / etc).
// Clicking a level plays through its rounds one by one.
//   • add a level  → add an object to `levels`
//   • add a round  → add an object to that level's `rounds`
//   • add a choice → add an object to that round's `options`
// Each option is a PICTURE: set `img: 'images/your-photo.jpg'`.
// `label` is the caption / fallback. `guess` = the option index you think
// Ana will pick (0 = first, 1 = second, …). Nothing is hardcoded by count.
const THIS_OR_THAT = {
  key: 'thisorthat',
  title: 'build your perfect...',
  emoji: '🍞',
  intro: "every level is a little build. pick what you'd actually want. I already guessed it all, so let's see how well I know you.",
  levels: [
    {
      name: 'sandwich',
      rounds: [
        { category: 'bread',   options: [ { label: 'bagel', img: 'images/games/build-your-perfect/level-1-sandwich/bread-1-bagel.jpeg' }, { label: 'croissant', img: 'images/games/build-your-perfect/level-1-sandwich/bread-2-croissant.jpg' } ], guess: 1 },
        { category: 'spread',  options: [ { label: 'butter',    img: 'images/games/build-your-perfect/level-1-sandwich/spread-1-butter.jpg' },     { label: 'almette',       img: 'images/games/build-your-perfect/level-1-sandwich/spread-2-almette.png' } ],      guess: 1 },
        { category: 'protein', options: [ { label: 'fried egg', img: 'images/games/build-your-perfect/level-1-sandwich/protein-1-fried-egg.jpg' }, { label: 'smoked salmon', img: 'images/games/build-your-perfect/level-1-sandwich/protein-2-smoked-salmon.jpg' } ], guess: 0 },
        { category: 'cheese',  options: [ { label: 'shredded cheese', img: 'images/games/build-your-perfect/level-1-sandwich/cheese-1-shredded-cheese.jpg' }, { label: 'mozarella', img: 'images/games/build-your-perfect/level-1-sandwich/cheese-2-mozarella.jpg' } ], guess: 0 },
        { category: 'veggie',  options: [ { label: 'avocado', img: 'images/games/build-your-perfect/level-1-sandwich/veggie-1-avocado.jpg' }, { label: 'lettuce', img: 'images/games/build-your-perfect/level-1-sandwich/veggie-2-lettuce.jpg' } ], guess: 0 },
      ],
    },
    {
      name: 'vacation',
      rounds: [
        { category: 'destination', options: [ { label: 'tropical beach', img: 'images/games/build-your-perfect/level-2-vacation/destination-1-tropical-beach.jpg' }, { label: 'big city',        img: 'images/games/build-your-perfect/level-2-vacation/destination-2-big-city.jpg' } ],       guess: 1 },
        { category: 'stay',        options: [ { label: 'mansion',        img: 'images/games/build-your-perfect/level-2-vacation/stay-1-mansion.png' },              { label: 'cozy airbnb',     img: 'images/games/build-your-perfect/level-2-vacation/stay-2-cozy-airbnb.jpg' } ],          guess: 1 },
        { category: 'activity',    options: [ { label: 'spa day',        img: 'images/games/build-your-perfect/level-2-vacation/activity-1-spa-day.jpg' },          { label: 'shopping day',    img: 'images/games/build-your-perfect/level-2-vacation/activity-2-shopping-day.jpg' } ],     guess: 1 },
        { category: 'food',        options: [ { label: 'fine dining',    img: 'images/games/build-your-perfect/level-2-vacation/food-1-fine-dining.jpg' },          { label: 'romantic picnic', img: 'images/games/build-your-perfect/level-2-vacation/food-2-romantic-picnic.jpg' } ],     guess: 1 },
        { category: 'vibe',        options: [ { label: 'relaxing',       img: 'images/games/build-your-perfect/level-2-vacation/vibe-1-relaxing.jpg' },             { label: 'romantic',        img: 'images/games/build-your-perfect/level-2-vacation/vibe-2-romantic.jpg' } ],            guess: 1 },
      ],
    },
    {
      name: 'night in',
      rounds: [
        { category: 'food',        options: [ { label: 'pizza',         img: 'images/games/build-your-perfect/level-3-night-in/food-1-pizza.jpg' },               { label: 'sushi',             img: 'images/games/build-your-perfect/level-3-night-in/food-2-sushi.jpg' } ],                guess: 1 },
        { category: 'drink',       options: [ { label: 'hot chocolate',  img: 'images/games/build-your-perfect/level-3-night-in/drink-1-hot-chocolate.jpg' },      { label: 'soda',              img: 'images/games/build-your-perfect/level-3-night-in/drink-2-soda.jpg' } ],                guess: 0 },
        { category: 'watch',       options: [ { label: 'horror',         img: 'images/games/build-your-perfect/level-3-night-in/watch-1-horror.jpg' },             { label: 'shark documentary', img: 'images/games/build-your-perfect/level-3-night-in/watch-2-shark-documentary.jpg' } ],   guess: 1 },
        { category: 'cozy factor', options: [ { label: 'blanket fort',   img: 'images/games/build-your-perfect/level-3-night-in/cozy-factor-1-blanket-fort.jpg' }, { label: 'candles',           img: 'images/games/build-your-perfect/level-3-night-in/cozy-factor-2-candles.jpg' } ],       guess: 0 },
        { category: 'bonus',       options: [ { label: 'face masks',     img: 'images/games/build-your-perfect/level-3-night-in/bonus-1-face-masks.jpg' },         { label: 'baking together',   img: 'images/games/build-your-perfect/level-3-night-in/bonus-2-baking-together.jpg' } ],     guess: 1 },
      ],
    },
    // … add as many levels (topics) as you like
  ],
};

// ── Game 2: what's your favorite?  (pick 1 from several) ────────────
const FAVORITES = {
  key: 'favorites',
  title: "what's your favorite?",
  emoji: '⭐',
  intro: 'pick your favorite from each set. yes, I guessed these too.',
  rounds: [
    { prompt: 'favorite season',       options: [ { label: 'spring', img: '' }, { label: 'summer', img: '' }, { label: 'autumn', img: '' }, { label: 'winter', img: '' } ], guess: 2 },
    { prompt: 'favorite kind of date', options: [ { label: 'dinner out', img: '' }, { label: 'movie night', img: '' }, { label: 'a walk', img: '' }, { label: 'staying in', img: '' } ], guess: 3 },
    { prompt: 'favorite little treat', options: [ { label: 'ice cream', img: '' }, { label: 'chocolate', img: '' }, { label: 'pastries', img: '' } ], guess: 1 },
    // … add as many rounds as you like
  ],
};

// ── Game 3: guess the shark  (QUIZ) ─────────────────────────────────
// A photo quiz: each round shows a shark photo and 4 name options; she
// picks which shark it is. `image` is the photo (drop it in
// images/games/guess-the-shark/), `correct` is the index of the right
// answer (0 = first option). Add a round = add an object; any number of
// options works.
const GUESS_THE_SHARK = {
  key: 'shark',
  title: 'guess the shark',
  emoji: '🦈',
  intro: "you and your sharks. one photo, four names, pick the right one. let's see if you really know them.",
  rounds: [
    { image: 'images/games/guess-the-shark/1-great-white.jpg',     options: [ { label: 'great white' }, { label: 'tiger shark' }, { label: 'bull shark' }, { label: 'mako' } ], correct: 0 },
    { image: 'images/games/guess-the-shark/2-hammerhead.jpeg',     options: [ { label: 'hammerhead' }, { label: 'nurse shark' }, { label: 'lemon shark' }, { label: 'blacktip reef' } ], correct: 0 },
    { image: 'images/games/guess-the-shark/3-whale-shark.jpg',     options: [ { label: 'whale shark' }, { label: 'basking shark' }, { label: 'megamouth' }, { label: 'goblin shark' } ], correct: 0 },
    { image: 'images/games/guess-the-shark/4-thresher-shark.jpg',  options: [ { label: 'thresher' }, { label: 'blue shark' }, { label: 'sand tiger' }, { label: 'mako' } ], correct: 0 },
    { image: 'images/games/guess-the-shark/5-nurse-shark.jpg',     options: [ { label: 'nurse shark' }, { label: 'leopard shark' }, { label: 'wobbegong' }, { label: 'angel shark' } ], correct: 0 },
    // … add as many shark photos as you like
  ],
};

// ── Result messages ─────────────────────────────────────────────────
// Checked top-down: first tier whose `min` percent is reached wins.
const RESULT_TIERS = [
  { min: 100, message: 'your boyfriend knows you perfectly. 💯' },
  { min: 80,  message: 'okay I basically live inside your head. 🥰' },
  { min: 60,  message: 'pretty good, I know you well.' },
  { min: 40,  message: 'hmm, I clearly have some studying to do.' },
  { min: 0,   message: "well, guess I'm spending the night on the couch tonight. 🛋️" },
];

// result messages for the shark quiz (scored against the right answer)
const SHARK_TIERS = [
  { min: 100, message: 'shark queen. every single one. 🦈👑' },
  { min: 80,  message: 'basically a marine biologist.' },
  { min: 60,  message: 'solid. you know your sharks.' },
  { min: 40,  message: 'not bad, but back to shark week with you.' },
  { min: 0,   message: 'okay, maybe sharks are more my thing than yours. 🦈' },
];

/* ╔══════════════════════════════════════════════════════════════╗
   ║  END OF CONFIG — implementation below                        ║
   ╚══════════════════════════════════════════════════════════════╝ */

(function () {
  const GAMES = { [THIS_OR_THAT.key]: THIS_OR_THAT, [FAVORITES.key]: FAVORITES, [GUESS_THE_SHARK.key]: GUESS_THE_SHARK };

  // ── storage layer (local now, Firestore-ready). Kept for the saved
  //    results + the (currently hidden) past-plays history. ──────────
  const Store = (() => {
    const LS_KEY = 'ana_game_history';
    let firestore = null;

    async function tryInitFirebase() {
      if (!FIREBASE_CONFIG) return null;
      try {
        const appMod = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
        const fsMod  = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const app = appMod.initializeApp(FIREBASE_CONFIG);
        firestore = { db: fsMod.getFirestore(app), ...fsMod };
        return firestore;
      } catch (err) {
        console.warn('[games] Firebase unavailable, using local storage.', err);
        return null;
      }
    }
    const ready = tryInitFirebase();
    const localList = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; } };

    async function saveResult(rec) {
      await ready;
      if (firestore) {
        try { const { db, collection, addDoc } = firestore; await addDoc(collection(db, 'gameResults'), rec); return; }
        catch (err) { console.warn('[games] save fell back to local.', err); }
      }
      const list = localList(); list.push(rec);
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    }

    async function getHistory() {
      await ready;
      if (firestore) {
        try {
          const { db, collection, getDocs, query, orderBy } = firestore;
          const snap = await getDocs(query(collection(db, 'gameResults'), orderBy('date', 'desc')));
          return snap.docs.map(d => d.data());
        } catch (err) { console.warn('[games] history fell back to local.', err); }
      }
      return localList().sort((a, b) => (a.date < b.date ? 1 : -1));
    }
    return { saveResult, getHistory };
  })();

  // ── per-game level progress: { levels: { [i]: {answers:[…], done:true} }, saved } ──
  const Progress = {
    k: (g) => 'ana_levels_' + g,
    load(g) { try { return JSON.parse(localStorage.getItem(this.k(g)) || '{}'); } catch { return {}; } },
    save(g, d) { localStorage.setItem(this.k(g), JSON.stringify(d)); },
    clear(g) { localStorage.removeItem(this.k(g)); },
  };

  function tierFor(percent) {
    return RESULT_TIERS.find(t => percent >= t.min) || RESULT_TIERS[RESULT_TIERS.length - 1];
  }

  // ── a single picture choice ───────────────────────────────────────
  function optionCard(opt, onClick) {
    const btn = document.createElement('button');
    btn.className = 'option-card' + (opt.img ? '' : ' option-card--empty');
    btn.innerHTML = `
      <span class="option-img"${opt.img ? ` style="background-image:url('${opt.img}')"` : ''}>
        ${opt.img ? '' : '<span class="option-img-hint">photo</span>'}
      </span>
      <span class="option-label">${opt.label}</span>
    `;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function scrollTop() { window.scrollTo({ top: 0, behavior: 'auto' }); }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ── LEVELS mode (this or that) ──────────────────────────────────
     Levels page = one tile per topic. Click a topic → play its rounds
     one by one (like before) → a single "back to menu" button. */
  function runLevels(key) {
    const game   = GAMES[key];
    const levels = game.levels || [];
    const viewEl = document.getElementById('game-view');
    if (!game || !viewEl || !levels.length) return;

    function renderMenu() {
      const prog = Progress.load(key);
      const ls = prog.levels || {};

      const tiles = levels.map((lv, i) => {
        const played = ls[i] && ls[i].done;
        return `<button class="level-tile${played ? ' level-tile--done' : ''}" data-level="${i}" aria-label="level ${i + 1}: ${lv.name}">
                  <span class="level-num">${i + 1}</span>
                  <span class="level-topic">${lv.name}</span>
                  <span class="level-star">${played ? '★' : ''}</span>
                </button>`;
      }).join('');

      viewEl.innerHTML = `
        <span class="game-intro-emoji">${game.emoji}</span>
        <h2 class="game-prompt">${game.title}</h2>
        <p class="game-intro">${game.intro}</p>
        <div class="levels-grid">${tiles}</div>
      `;
      viewEl.querySelectorAll('.level-tile').forEach(b => b.addEventListener('click', () => playLevel(parseInt(b.dataset.level, 10))));
      scrollTop();
    }

    function playLevel(li) {
      const level = levels[li];
      let current = 0;
      const answers = [];

      function renderRound() {
        const round = level.rounds[current];
        viewEl.innerHTML = `
          <p class="game-progress">${level.name} · ${current + 1} / ${level.rounds.length}</p>
          <h2 class="game-prompt">${round.category || round.prompt || ''}</h2>
          <div class="option-grid option-grid--${round.options.length}"></div>
        `;
        const grid = viewEl.querySelector('.option-grid');
        round.options.forEach((opt, idx) => grid.appendChild(optionCard(opt, () => {
          answers[current] = idx; current++;
          current < level.rounds.length ? renderRound() : finishLevel();
        })));
        scrollTop();
      }

      function finishLevel() {
        const prog = Progress.load(key);
        prog.levels = prog.levels || {};
        prog.levels[li] = { answers, done: true };
        Progress.save(key, prog);

        // this topic's score, shown right away
        let score = 0;
        level.rounds.forEach((r, ri) => { if (answers[ri] === r.guess) score++; });
        const total = level.rounds.length;
        const percent = Math.round((score / total) * 100);

        // record this topic's result for db/history
        Store.saveResult({ game: game.key, gameTitle: `${game.title}: ${level.name}`, score, total, percent, date: new Date().toISOString() });

        // breakdown: what David guessed for each round, right or wrong
        const breakdown = level.rounds.map((r, ri) => {
          const right = answers[ri] === r.guess;
          const myPick = r.options[r.guess].label;
          return `
            <li class="guess-row guess-row--${right ? 'right' : 'wrong'}">
              <span class="guess-cat">${r.category || r.prompt || ''}</span>
              <span class="guess-mine">I said ${myPick}</span>
              <span class="guess-mark">${right ? '✓ correct' : '✗ wrong'}</span>
            </li>`;
        }).join('');

        viewEl.innerHTML = `
          <p class="result-eyebrow">${level.name}</p>
          <p class="result-score">${score}<span>/${total}</span></p>
          <p class="result-percent">${percent}% match</p>
          <p class="result-message">${tierFor(percent).message}</p>
          <ul class="guess-list">${breakdown}</ul>
          <div class="result-actions">
            <button class="game-btn" id="to-menu">back to menu</button>
          </div>
        `;
        viewEl.querySelector('#to-menu').addEventListener('click', renderMenu);
        scrollTop();
      }

      renderRound();
    }

    renderMenu();
  }

  /* ── sequential mode (favorites): intro → all rounds → result ───── */
  function runGame(key) {
    const game   = GAMES[key];
    const gameEl = document.getElementById('game-view');
    const resEl  = document.getElementById('result-view');
    if (!game || !gameEl || !resEl) return;

    const show = (el) => { gameEl.hidden = el !== gameEl; resEl.hidden = el !== resEl; scrollTop(); };
    let current = 0;
    const answers = [];

    function renderRound() {
      const round = game.rounds[current];
      gameEl.innerHTML = `
        <p class="game-progress">${current + 1} / ${game.rounds.length}</p>
        <h2 class="game-prompt">${round.category || round.prompt || ''}</h2>
        <div class="option-grid option-grid--${round.options.length}"></div>
      `;
      const grid = gameEl.querySelector('.option-grid');
      round.options.forEach((opt, i) => grid.appendChild(optionCard(opt, () => {
        answers[current] = i; current++;
        current < game.rounds.length ? renderRound() : finish();
      })));
    }

    function finish() {
      const total = game.rounds.length;
      let score = 0;
      game.rounds.forEach((r, i) => { if (answers[i] === r.guess) score++; });
      const percent = Math.round((score / total) * 100);
      Store.saveResult({ game: game.key, gameTitle: game.title, score, total, percent, date: new Date().toISOString() });
      resEl.innerHTML = `
        <p class="result-eyebrow">${game.title}</p>
        <p class="result-score">${score}<span>/${total}</span></p>
        <p class="result-percent">${percent}% match</p>
        <p class="result-message">${tierFor(percent).message}</p>
        <div class="result-actions">
          <a class="game-btn" href="games.html">other games</a>
        </div>
      `;
      show(resEl);
    }

    gameEl.innerHTML = `
      <span class="game-intro-emoji">${game.emoji}</span>
      <h2 class="game-prompt">${game.title}</h2>
      <p class="game-intro">${game.intro}</p>
      <button class="game-btn" id="game-start">let's go ✦</button>
    `;
    gameEl.querySelector('#game-start').addEventListener('click', renderRound);
    show(gameEl);
  }

  /* ── QUIZ mode (guess the shark): photo + text options, scored
     against the correct answer ─────────────────────────────────── */
  function runQuiz(key) {
    const game   = GAMES[key];
    const gameEl = document.getElementById('game-view');
    const resEl  = document.getElementById('result-view');
    if (!game || !gameEl || !resEl) return;

    const show = (el) => { gameEl.hidden = el !== gameEl; resEl.hidden = el !== resEl; scrollTop(); };
    let current = 0;
    const answers = [];

    function renderRound() {
      const round = game.rounds[current];
      gameEl.innerHTML = `
        <p class="game-progress">${current + 1} / ${game.rounds.length}</p>
        <h2 class="game-prompt">which shark is this?</h2>
        <div class="quiz-photo${round.image ? '' : ' quiz-photo--empty'}"${round.image ? ` style="background-image:url('${round.image}')"` : ''}>${round.image ? '' : '<span class="option-img-hint">photo</span>'}</div>
        <div class="quiz-options"></div>
      `;
      const opts = gameEl.querySelector('.quiz-options');
      // shuffle so the correct answer isn't always in the same spot
      shuffle(round.options.map((_, i) => i)).forEach((origIdx) => {
        const b = document.createElement('button');
        b.className = 'quiz-option';
        b.textContent = round.options[origIdx].label;
        b.addEventListener('click', () => {
          answers[current] = origIdx; current++;
          current < game.rounds.length ? renderRound() : finish();
        });
        opts.appendChild(b);
      });
    }

    function finish() {
      const total = game.rounds.length;
      let score = 0;
      game.rounds.forEach((r, i) => { if (answers[i] === r.correct) score++; });
      const percent = Math.round((score / total) * 100);
      const tier = SHARK_TIERS.find(t => percent >= t.min) || SHARK_TIERS[SHARK_TIERS.length - 1];
      Store.saveResult({ game: game.key, gameTitle: game.title, score, total, percent, date: new Date().toISOString() });

      const breakdown = game.rounds.map((r, i) => {
        const right = answers[i] === r.correct;
        const correctLabel = r.options[r.correct].label;
        const herLabel = r.options[answers[i]].label;
        return `
          <li class="guess-row guess-row--${right ? 'right' : 'wrong'}">
            <span class="guess-cat">${correctLabel}</span>
            <span class="guess-mine">${right ? 'you got it' : 'you said ' + herLabel}</span>
            <span class="guess-mark">${right ? '✓ correct' : '✗ wrong'}</span>
          </li>`;
      }).join('');

      resEl.innerHTML = `
        <p class="result-eyebrow">${game.title}</p>
        <p class="result-score">${score}<span>/${total}</span></p>
        <p class="result-percent">${percent}% right</p>
        <p class="result-message">${tier.message}</p>
        <ul class="guess-list">${breakdown}</ul>
        <div class="result-actions">
          <a class="game-btn" href="games.html">other games</a>
        </div>
      `;
      show(resEl);
    }

    gameEl.innerHTML = `
      <span class="game-intro-emoji">${game.emoji}</span>
      <h2 class="game-prompt">${game.title}</h2>
      <p class="game-intro">${game.intro}</p>
      <button class="game-btn" id="game-start">let's go ✦</button>
    `;
    gameEl.querySelector('#game-start').addEventListener('click', renderRound);
    show(gameEl);
  }

  /* ── hub: past-plays history (kept, but currently hidden — there is
     no #show-history button on the hub right now, so this no-ops) ─── */
  function wireHub() {
    const menuEl    = document.getElementById('games-menu');
    const historyEl = document.getElementById('history-view');
    const histBtn   = document.getElementById('show-history');
    if (!menuEl || !historyEl || !histBtn) return;

    const show = (el) => { menuEl.hidden = el !== menuEl; historyEl.hidden = el !== historyEl; };
    histBtn.addEventListener('click', async () => {
      historyEl.innerHTML = `<p class="history-loading">loading…</p>`;
      show(historyEl);
      const list = await Store.getHistory();
      const body = list.length
        ? `<ul class="history-list">${list.map(r => `
             <li class="history-row">
               <span class="history-game">${r.gameTitle}</span>
               <span class="history-score">${r.score}/${r.total} · ${r.percent}%</span>
               <span class="history-date">${new Date(r.date).toLocaleDateString()}</span>
             </li>`).join('')}</ul>`
        : `<p class="history-empty">no games played yet.</p>`;
      historyEl.innerHTML = `<h2 class="game-prompt">past plays</h2>${body}<button class="game-btn game-btn--ghost" id="history-back">back</button>`;
      historyEl.querySelector('#history-back').addEventListener('click', () => show(menuEl));
    });
  }

  // ── decide what this page is ──────────────────────────────────────
  const pageGame = document.body.dataset.game;
  const mode = document.body.dataset.mode;
  if (pageGame) {
    if (mode === 'levels') runLevels(pageGame);
    else if (mode === 'quiz') runQuiz(pageGame);
    else runGame(pageGame);
  } else {
    wireHub();
  }
})();
