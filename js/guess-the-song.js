/* ════════════════════════════════════════════════════════════════
   guess the song — lyric mini-game
   Standalone page (guess-the-song.html), same "does he know me?" family
   as the other games in js/games.js, but with its own file since the
   round shape (audio clips, string-based correct answers) and the
   reveal-then-play-a-clip flow don't fit the shared runQuiz() path.
═══════════════════════════════════════════════════════════════════ */

/* ╔══════════════════════════════════════════════════════════════╗
   ║  DAVID — EDIT EVERYTHING IN THIS CONFIG BLOCK                 ║
   ╚══════════════════════════════════════════════════════════════╝ */

const GAME_TITLE = 'guess the song';
const GAME_EMOJI = '🎵';
const GAME_INTRO = "a lyric, four songs, one right answer. let's see if you know our music as well as I think you do.";

// ── Round data — THE thing to edit. One entry per round. ────────────
// lyric       the snippet shown before she picks (paste real lyrics here)
// options     exactly the 4 title strings shown as choices (any order —
//             they get shuffled on screen automatically)
// correct     must exactly match one of the strings in `options`
// audio       path to the full song file (drop it in audio/lyric-game/)
// clipStart   seconds into the song where the played clip should start.
//             decimals are fine (e.g. 142.5 = 142s and 500ms) if you want
//             it to land exactly on a word instead of the nearest second.
// clipLength  how many seconds to play before it auto-stops (ignored if
//             playToEnd is true). also accepts decimals.
// playToEnd   optional, defaults to false — set true to let the song play
//             all the way to the end instead of auto-stopping at clipLength
// shared song pool for rounds 1-4 below (title + features + artist, so
// options double as a little "who made this" reveal)
const SONG_POOL = [
  'Flashing Lights (feat. Dwele) - Kanye West',
  'Fancy (feat. T.I. & Swizz Beatz) - Drake',
  'American Boy (feat. Kanye West) - Estelle',
  'Homecoming (feat. Chris Martin) - Kanye West',
];

const ROUNDS = [
  {
    lyric: "I'm just sayin', hey, Mona Lisa / Come home, you know you can't roam without Caesar",
    options: SONG_POOL,
    correct: SONG_POOL[0], // Flashing Lights
    audio: 'audio/flashing-lights.mp3',
    clipStart: 138,
    clipLength: 16,
    playToEnd: true,
  },
  {
    lyric: 'Go, go, go, go, go, go',
    options: [
      'Go! - Common',
      'Carnival (feat. Rich The Kid & Playboi Carti) - Kanye West & Ty Dolla $ign',
      'We On Go - BIA',
      'Go (feat. Q-Tip) - The Chemical Brothers',
    ],
    correct: 'Go! - Common',
    audio: 'audio/lyric-game/go!.mp3',
    clipStart: 0, 
    clipLength: 15,
    playToEnd: true,
  },
  {
    lyric: 'She ride it like Six Flags / We turn up to the max / I whop her from the back / I gave that bitch a cramp',
    options: [
      'Carnival (feat. Rich The Kid & Playboi Carti) - Kanye West & Ty Dolla $ign',
      'On Repeat (feat. Rich The Kid & Destroy Lonely) - Ty Dolla $ign',
      "Can't Be Fucked With - Ty Dolla $ign",
      'Type Shit (feat. Travis Scott & Playboi Carti) - Future',
    ],
    correct: 'Carnival (feat. Rich The Kid & Playboi Carti) - Kanye West & Ty Dolla $ign',
    audio: 'audio/lyric-game/carnival.mp3',
    clipStart: 71,
    clipLength: 12,
    playToEnd: true,
  },
  // … add or remove rounds freely, the game just plays through however
  //   many are in this array
];

// ── Result messages — checked top-down, first match wins ────────────
const LYRIC_TIERS = [
  { min: 100, message: 'you know every word. certified biggest fan. 🎤' },
  { min: 80,  message: 'okay, you really do know our songs.' },
  { min: 60,  message: 'pretty solid. you know the vibe.' },
  { min: 40,  message: 'hmm, we need more car singalongs.' },
  { min: 0,   message: "guess we're doing a playlist study session. 🎧" },
];

/* ╔══════════════════════════════════════════════════════════════╗
   ║  END OF CONFIG — implementation below                        ║
   ╚══════════════════════════════════════════════════════════════╝ */

(function () {
  const gameEl = document.getElementById('game-view');
  const resEl  = document.getElementById('result-view');
  if (!gameEl || !resEl) return;

  const LS_KEY = 'ana_lyric_game';
  function saveResult(rec) {
    try {
      const list = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      list.push(rec);
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    } catch { /* storage unavailable - not worth failing the game over */ }
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function scrollTop() { window.scrollTo({ top: 0, behavior: 'auto' }); }

  // splits a "Title (feat. X) - Artist" label into two explicit lines
  // (title+feat on top, artist below) instead of leaving the wrap point
  // up to however the text happens to break. options without a
  // " - Artist" suffix (e.g. placeholder rounds) just render as one line.
  function optionLabelEl(label) {
    const frag = document.createDocumentFragment();
    const sepIdx = label.lastIndexOf(' - ');
    const title  = sepIdx === -1 ? label : label.slice(0, sepIdx);
    const artist = sepIdx === -1 ? '' : label.slice(sepIdx + 3);

    const titleEl = document.createElement('span');
    titleEl.className = 'quiz-option-title';
    titleEl.textContent = title;
    frag.appendChild(titleEl);

    if (artist) {
      const artistEl = document.createElement('span');
      artistEl.className = 'quiz-option-artist';
      artistEl.textContent = artist;
      frag.appendChild(artistEl);
    }
    return frag;
  }

  const show = (el) => { gameEl.hidden = el !== gameEl; resEl.hidden = el !== resEl; scrollTop(); };

  // ── audio: only one clip plays at a time, and it self-stops ───────
  let currentAudio = null;
  function stopAudio() {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  }
  // keeps the reveal step's play/pause button in sync with what the audio
  // is actually doing, whether that's triggered by her clicking it, the
  // clip auto-stopping, or the song reaching its natural end
  function setClipButtonState(playing) {
    const btn = document.getElementById('clip-replay');
    if (!btn) return;
    btn.textContent = playing ? '⏸' : '▶';
    btn.classList.toggle('playing', playing);
    btn.setAttribute('aria-label', playing ? 'pause clip' : 'play clip');
  }

  function playClip(round) {
    stopAudio();
    const audio = new Audio(round.audio);
    currentAudio = audio;
    const start = round.clipStart || 0;

    audio.addEventListener('play', () => setClipButtonState(true));
    audio.addEventListener('pause', () => setClipButtonState(false));

    // calling play() before a pending seek has actually landed can start
    // playback from 0:00 and silently drop the seek (a real race, not
    // theoretical - confirmed while testing this). Wait for the seek to be
    // CONFIRMED (the 'seeked' event) before starting playback; only skip
    // straight to play() when there's nothing to seek to in the first place.
    if (start > 0) {
      audio.addEventListener('loadedmetadata', () => { audio.currentTime = start; }, { once: true });
      audio.addEventListener('seeked', () => audio.play().catch(() => {}), { once: true });
    } else {
      audio.play().catch(() => {}); // silent if the file isn't there yet
    }

    if (!round.playToEnd) {
      audio.addEventListener('timeupdate', () => {
        if (round.clipLength && audio.currentTime >= start + round.clipLength) audio.pause();
      });
    }
  }
  // leaving the tab (or the game) stops playback rather than leaving a
  // clip running in the background
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAudio(); });

  let current = 0;
  const answers = [];

  function renderRound() {
    const round = ROUNDS[current];
    gameEl.innerHTML = `
      <p class="game-progress">${current + 1} / ${ROUNDS.length}</p>
      <h2 class="game-prompt">which song is this lyric from?</h2>
      <div class="quiz-lyric">“${round.lyric}”</div>
      <div class="quiz-options"></div>
    `;
    const opts = gameEl.querySelector('.quiz-options');
    // give the grid more room when any option has the "Title (feat. X) -
    // Artist" two-line format, so the title line has space to fit on one row
    if (round.options.some((l) => l.includes(' - '))) opts.classList.add('quiz-options--wide');
    shuffle(round.options.slice()).forEach((label) => {
      const b = document.createElement('button');
      b.className = 'quiz-option';
      b.dataset.label = label; // b.textContent no longer equals the full
                                // label now that it's split into two spans
      b.appendChild(optionLabelEl(label));
      b.addEventListener('click', () => selectAnswer(label, b, opts, round));
      opts.appendChild(b);
    });
    scrollTop();
  }

  function selectAnswer(picked, btnEl, optsContainer, round) {
    answers[current] = picked;
    const right = picked === round.correct;

    optsContainer.querySelectorAll('.quiz-option').forEach((b) => {
      b.disabled = true;
      if (b.dataset.label === round.correct) b.classList.add('quiz-option--correct');
      else if (b === btnEl) b.classList.add('quiz-option--wrong');
    });

    const isLast = current + 1 >= ROUNDS.length;
    const reveal = document.createElement('div');
    reveal.className = 'quiz-reveal';
    reveal.innerHTML = `
      <p class="quiz-reveal-message quiz-reveal-message--${right ? 'right' : 'wrong'}">
        ${right ? '✓ you got it!' : `✗ it was “${round.correct}”`}
      </p>
      <button class="quiz-clip-replay" id="clip-replay" type="button" aria-label="pause clip">⏸</button>
      <button class="game-btn" id="round-next">${isLast ? 'see results' : 'next round'}</button>
    `;
    gameEl.appendChild(reveal);
    scrollTop();

    playClip(round); // autoplays - the button above already shows the pause icon to match

    gameEl.querySelector('#clip-replay').addEventListener('click', () => {
      if (!currentAudio) { playClip(round); return; }
      if (currentAudio.paused) currentAudio.play().catch(() => {});
      else currentAudio.pause();
    });
    gameEl.querySelector('#round-next').addEventListener('click', () => {
      stopAudio();
      current++;
      current < ROUNDS.length ? renderRound() : finish();
    });
  }

  function finish() {
    stopAudio();
    const total = ROUNDS.length;
    let score = 0;
    ROUNDS.forEach((r, i) => { if (answers[i] === r.correct) score++; });
    const percent = Math.round((score / total) * 100);
    const tier = LYRIC_TIERS.find(t => percent >= t.min) || LYRIC_TIERS[LYRIC_TIERS.length - 1];

    saveResult({ game: 'lyric', gameTitle: GAME_TITLE, score, total, percent, date: new Date().toISOString() });

    const breakdown = ROUNDS.map((r, i) => {
      const right = answers[i] === r.correct;
      return `
        <li class="guess-row guess-row--${right ? 'right' : 'wrong'}">
          <span class="guess-cat">${r.correct}</span>
          <span class="guess-mine">${right ? 'you got it' : 'you said ' + answers[i]}</span>
          <span class="guess-mark">${right ? '✓ correct' : '✗ wrong'}</span>
        </li>`;
    }).join('');

    resEl.innerHTML = `
      <p class="result-eyebrow">${GAME_TITLE}</p>
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
    <span class="game-intro-emoji">${GAME_EMOJI}</span>
    <h2 class="game-prompt">${GAME_TITLE}</h2>
    <p class="game-intro">${GAME_INTRO}</p>
    <button class="game-btn" id="game-start">let's go ✦</button>
  `;
  gameEl.querySelector('#game-start').addEventListener('click', () => { current = 0; renderRound(); });
  show(gameEl);
})();
