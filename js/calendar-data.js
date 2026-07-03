/* ════════════════════════════════════════════════════════════════
   Calendar content — one entry per day, July 1 → August 1.
   DAVID: this is the only file you need to touch to fill in days.

   Each entry:
     { date: 'YYYY-MM-DD', type: 'note' | 'photo' | 'song', title, body, image?, audio? }

     date   the real calendar date this page unlocks on. Leave these
            alone — they have to stay in order and cover every day.
     type   'note'  → title + body text (a little written note)
            'photo' → title + image (+ optional body as a caption)
            'song'  → title + audio (+ optional body as a caption)
     title  short heading shown on the opened card
     body   the note text, or a caption under a photo/song
     image  path to a photo — only read when type is 'photo'
            (drop the file in images/calendar/ and point to it here)
     audio  path to a song — only read when type is 'song'
            (drop the file in audio/calendar/ and point to it here)
     audioStart          optional, seconds — jumps straight to this point
                          in the song instead of playing from 0:00. Use
                          this when it's really about one line, not the
                          whole track.
     audioSnippetSeconds optional, seconds — if set, playback auto-stops
                          this many seconds after audioStart instead of
                          continuing into the rest of the song.
     audioPlayToEnd       optional, defaults to false — set true to ignore
                          audioSnippetSeconds and let the song play out to
                          the end instead of auto-stopping.

   You don't have to fill these in order or all at once — any day can
   stay a placeholder until you're ready, it just won't feel finished
   to her if she reaches it before you've written it.

   August 1st (the last entry) doesn't work like the others. Tearing it
   doesn't open a card here at all — it navigates straight to
   capsule.html, the anniversary finale page. Its title/body below
   aren't shown anywhere anymore; edit capsule.html itself instead.
   ═══════════════════════════════════════════════════════════════════ */

const CALENDAR_DATA = [
  {
    date: '2026-07-01',
    type: 'note',
    title: 'day one - AN Advent calendar for you, my love ❤️',
    body: "As you have probably seen already, there is little paper calendar that lives on the desk, one page for every day between now and August 1st. Tear today's page whenever you want it, and it's yours to keep. You can always find it again in the pile. I'll be filling these in as we go and for today we have another little round of Build your perfect... . Happy 11 months and day one, my love. <a class=\"cal-card-link\" href=\"this-or-that.html?level=lazy-sunday\">play today's round →</a>.",
  },
  {
    date: '2026-07-02',
    type: 'song',
    title: 'devil in a new dress',
    audio: 'audio/calendar/diand.mp3',
    audioStart: 0,
    audioSnippetSeconds: 20, // plays ~20s from audioStart then stops - adjust if you want more/less
    audioPlayToEnd: false, // set true to let it play out instead of stopping at audioSnippetSeconds
    body: '"Uh, put your hands to the constellations / The way you look should be a sin, you my sensation". These two lines made me think of you. 🥰🥰',
  },
  {
    date: '2026-07-03',
    type: 'note',
    title: 'day three - a little game for you',
    body: "Hello my LOVE ❤️. I made you a guess the song game, just a little test of how well you know some of our favourite songs. Let's see how good you do 😊. <a class=\"cal-card-link\" href=\"guess-the-song.html\">play guess the song →</a>",
  },
  { date: '2026-07-04', type: 'note', title: 'TODO', body: 'TODO — David: write day 4.' },
  { date: '2026-07-05', type: 'note', title: 'TODO', body: 'TODO — David: write day 5.' },
  { date: '2026-07-06', type: 'note', title: 'TODO', body: 'TODO — David: write day 6.' },
  { date: '2026-07-07', type: 'note', title: 'TODO', body: 'TODO — David: write day 7.' },
  { date: '2026-07-08', type: 'note', title: 'TODO', body: 'TODO — David: write day 8.' },
  { date: '2026-07-09', type: 'note', title: 'TODO', body: 'TODO — David: write day 9.' },
  {
    date: '2026-07-10',
    type: 'photo',
    title: 'TODO — caption this one',
    image: 'images/calendar/july-10.jpg',
    body: 'TODO — David: this is a placeholder photo slot. Drop a real image in images/calendar/ and point "image" at it above, then write a caption here.',
  },
  { date: '2026-07-11', type: 'note', title: 'TODO', body: 'TODO — David: write day 11.' },
  { date: '2026-07-12', type: 'note', title: 'TODO', body: 'TODO — David: write day 12.' },
  { date: '2026-07-13', type: 'note', title: 'TODO', body: 'TODO — David: write day 13.' },
  { date: '2026-07-14', type: 'note', title: 'TODO', body: 'TODO — David: write day 14.' },
  { date: '2026-07-15', type: 'note', title: 'TODO', body: 'TODO — David: write day 15.' },
  { date: '2026-07-16', type: 'note', title: 'TODO', body: 'TODO — David: write day 16.' },
  { date: '2026-07-17', type: 'note', title: 'TODO', body: 'TODO — David: write day 17.' },
  { date: '2026-07-18', type: 'note', title: 'TODO', body: 'TODO — David: write day 18.' },
  { date: '2026-07-19', type: 'note', title: 'TODO', body: 'TODO — David: write day 19.' },
  {
    date: '2026-07-20',
    type: 'song',
    title: 'TODO — name the song',
    audio: 'audio/calendar/july-20.mp3',
    body: 'TODO — David: this is a placeholder song slot. Drop a real mp3 in audio/calendar/ and point "audio" at it above, then write why this one, this day.',
  },
  { date: '2026-07-21', type: 'note', title: 'TODO', body: 'TODO — David: write day 21.' },
  { date: '2026-07-22', type: 'note', title: 'TODO', body: 'TODO — David: write day 22.' },
  { date: '2026-07-23', type: 'note', title: 'TODO', body: 'TODO — David: write day 23.' },
  { date: '2026-07-24', type: 'note', title: 'TODO', body: 'TODO — David: write day 24.' },
  { date: '2026-07-25', type: 'note', title: 'TODO', body: 'TODO — David: write day 25.' },
  { date: '2026-07-26', type: 'note', title: 'TODO', body: 'TODO — David: write day 26.' },
  { date: '2026-07-27', type: 'note', title: 'TODO', body: 'TODO — David: write day 27.' },
  { date: '2026-07-28', type: 'note', title: 'TODO', body: 'TODO — David: write day 28.' },
  { date: '2026-07-29', type: 'note', title: 'TODO', body: 'TODO — David: write day 29.' },
  { date: '2026-07-30', type: 'note', title: 'TODO', body: 'TODO — David: write day 30.' },
  { date: '2026-07-31', type: 'note', title: 'TODO', body: 'TODO — David: write day 31 — the eve of it.' },
  {
    // tearing this page navigates to capsule.html instead of showing a
    // card — title/body here are unused, kept only so this entry has a
    // shape consistent with the rest. write the real finale in capsule.html.
    date: '2026-08-01',
    type: 'finale',
    title: 'the finale',
    body: '',
  },
];
