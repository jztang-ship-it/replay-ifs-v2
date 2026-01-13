// src/data/pulseData.js

export const pulseTickerData = [
    { id: 1, text: "LAL 112 - BOS 108 (Final)" },
    { id: 2, text: "Curry: 38pts, 8 3PM 🔥" },
    { id: 3, text: "PHX vs DAL - Tipoff in 10m" },
    { id: 4, text: "Jokic Triple-Double Watch: 18/9/8" },
  ];
  
  export const pulseFeedData = [
    {
      id: 1,
      type: 'EXTERNAL', // News from the world
      source: 'HoopsHype',
      headline: 'Trade Rumor: Zion to NY?',
      summary: 'Sources say Knicks are preparing a massive package centered around picks. Zion reportedly "intrigued".',
      timestamp: '15m ago',
      comments: 42,
    },
    {
      id: 2,
      type: 'INTERNAL', // Replay Ecosystem
      user: 'IronMan23',
      event: 'BIG WIN',
      highlight: 'Hit a 15x Parlay!',
      details: 'Won 4,500 Coins on the Lakers/Suns over.',
      timestamp: '2h ago',
      comments: 8,
    },
    {
      id: 3,
      type: 'EXTERNAL',
      source: 'Woj',
      headline: 'Locker Room Trouble in Philly',
      summary: 'Embiid and Maxey seen having heated discussion post-game. Nurse downplays it.',
      timestamp: '3h ago',
      comments: 126,
    },
  ];