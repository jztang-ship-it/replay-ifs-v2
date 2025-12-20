// src/services/mockAPI.js
// WE ARE SWITCHING TO ESPN IDs. THEY ARE MORE STABLE FOR IMAGES.

export const PLAYER_POOL = [
  // ==========================================
  // TIER 5: SUPERSTARS ($5)
  // ==========================================
  { id: 3112335, name: "Nikola Jokic", team: "DEN", avgFP: 58.2, cost: 5, avatar: "🃏" },
  { id: 3945274, name: "Luka Doncic", team: "DAL", avgFP: 56.8, cost: 5, avatar: "🪄" },
  { id: 3032977, name: "Giannis Antetokounmpo", team: "MIL", avgFP: 55.4, cost: 5, avatar: "🦌" },
  { id: 3059318, name: "Joel Embiid", team: "PHI", avgFP: 59.1, cost: 5, avatar: "🔔" },
  { id: 4278073, name: "Shai Gilgeous-Alexander", team: "OKC", avgFP: 52.3, cost: 5, avatar: "⚡" },
  { id: 4065648, name: "Jayson Tatum", team: "BOS", avgFP: 50.1, cost: 5, avatar: "🍀" },
  { id: 5104157, name: "Victor Wembanyama", team: "SAS", avgFP: 52.0, cost: 5, avatar: "👽" },
  { id: 3155942, name: "Domantas Sabonis", team: "SAC", avgFP: 50.5, cost: 5, avatar: "🐂" },

  // ==========================================
  // TIER 4: ALL-STARS ($4)
  // ==========================================
  { id: 1966, name: "LeBron James", team: "LAL", avgFP: 48.5, cost: 4, avatar: "👑" },
  { id: 3975, name: "Stephen Curry", team: "GSW", avgFP: 47.2, cost: 4, avatar: "🎯" },
  { id: 3202, name: "Kevin Durant", team: "PHX", avgFP: 46.8, cost: 4, avatar: "🐍" },
  { id: 6583, name: "Anthony Davis", team: "LAL", avgFP: 49.0, cost: 4, avatar: "〰️" },
  { id: 4431611, name: "Anthony Edwards", team: "MIN", avgFP: 43.5, cost: 4, avatar: "🐜" },
  { id: 3155526, name: "Devin Booker", team: "PHX", avgFP: 43.8, cost: 4, avatar: "☀️" },
  { id: 4395628, name: "Tyrese Haliburton", team: "IND", avgFP: 45.4, cost: 4, avatar: "🚧" },
  { id: 3908809, name: "Donovan Mitchell", team: "CLE", avgFP: 44.9, cost: 4, avatar: "🕷️" },
  { id: 6442, name: "Kyrie Irving", team: "DAL", avgFP: 42.1, cost: 4, avatar: "👁️" },
  { id: 4066261, name: "Bam Adebayo", team: "MIA", avgFP: 41.5, cost: 4, avatar: "🔥" },
  { id: 4277905, name: "Trae Young", team: "ATL", avgFP: 44.2, cost: 4, avatar: "❄️" },
  { id: 6606, name: "Damian Lillard", team: "MIL", avgFP: 41.2, cost: 4, avatar: "⌚" },

  // ==========================================
  // TIER 3: STARTERS ($3)
  // ==========================================
  { id: 3917376, name: "Jaylen Brown", team: "BOS", avgFP: 38.5, cost: 3, avatar: "☘️" },
  { id: 3934672, name: "Jalen Brunson", team: "NYK", avgFP: 39.2, cost: 3, avatar: "🗽" },
  { id: 4431678, name: "Tyrese Maxey", team: "PHI", avgFP: 38.0, cost: 3, avatar: "💎" },
  { id: 4871609, name: "Alperen Sengun", team: "HOU", avgFP: 37.5, cost: 3, avatar: "🚀" },
  { id: 4279888, name: "Ja Morant", team: "MEM", avgFP: 44.0, cost: 3, avatar: "🥷" },
  { id: 4066336, name: "Lauri Markkanen", team: "UTA", avgFP: 36.5, cost: 3, avatar: "🇫🇮" },
  { id: 4397226, name: "Desmond Bane", team: "MEM", avgFP: 36.0, cost: 3, avatar: "💪" },
  { id: 4277961, name: "Jaren Jackson Jr.", team: "MEM", avgFP: 35.5, cost: 3, avatar: "🦄" },
  { id: 4432166, name: "Cade Cunningham", team: "DET", avgFP: 35.8, cost: 3, avatar: "🏎️" },
  { id: 6430, name: "Jimmy Butler", team: "MIA", avgFP: 37.2, cost: 3, avatar: "☕" },
  { id: 3102529, name: "Clint Capela", team: "ATL", avgFP: 28.5, cost: 3, avatar: "🛡️" },
  { id: 4432816, name: "LaMelo Ball", team: "CHA", avgFP: 40.8, cost: 3, avatar: "🛸" },

  // ==========================================
  // TIER 2: ROTATION ($2)
  // ==========================================
  { id: 4066457, name: "Austin Reaves", team: "LAL", avgFP: 28.5, cost: 2, avatar: "🎸" },
  { id: 2990992, name: "Marcus Smart", team: "MEM", avgFP: 26.0, cost: 2, avatar: "🧠" },
  { id: 3908800, name: "De'Aaron Fox", team: "SAC", avgFP: 42.9, cost: 2, avatar: "🦊" }, 
  { id: 3064514, name: "Julius Randle", team: "MIN", avgFP: 37.0, cost: 2, avatar: "🦁" },
  { id: 4278594, name: "Darius Garland", team: "CLE", avgFP: 34.0, cost: 2, avatar: "🎭" },
  { id: 4278129, name: "Deandre Ayton", team: "POR", avgFP: 32.0, cost: 2, avatar: "🌵" },
  { id: 3149673, name: "Pascal Siakam", team: "IND", avgFP: 36.2, cost: 2, avatar: "🌶️" },
  { id: 3934719, name: "OG Anunoby", team: "NYK", avgFP: 27.0, cost: 2, avatar: "🧣" },
  { id: 3032976, name: "Rudy Gobert", team: "MIN", avgFP: 32.5, cost: 2, avatar: "🗼" },
  { id: 3934673, name: "Mikal Bridges", team: "NYK", avgFP: 33.2, cost: 2, avatar: "🌉" },
  { id: 3936299, name: "Jamal Murray", team: "DEN", avgFP: 34.8, cost: 2, avatar: "🏹" },
  { id: 3037789, name: "Bogdan Bogdanovic", team: "ATL", avgFP: 29.0, cost: 2, avatar: "🇷🇸" },

  // ==========================================
  // TIER 1: BENCH ($1)
  // ==========================================
  { id: 4278059, name: "Jose Alvarado", team: "NOP", avgFP: 18.5, cost: 1, avatar: "🥑" },
  { id: 2991350, name: "Alex Caruso", team: "OKC", avgFP: 19.5, cost: 1, avatar: "🚕" },
  { id: 2581018, name: "Kentavious Caldwell-Pope", team: "ORL", avgFP: 18.2, cost: 1, avatar: "🏹" },
  { id: 3213, name: "Al Horford", team: "BOS", avgFP: 19.8, cost: 1, avatar: "👴" },
  { id: 4066354, name: "Payton Pritchard", team: "BOS", avgFP: 16.5, cost: 1, avatar: "👟" },
  { id: 4277833, name: "Sam Hauser", team: "BOS", avgFP: 12.5, cost: 1, avatar: "🎯" },
  { id: 4431766, name: "Christian Braun", team: "DEN", avgFP: 15.5, cost: 1, avatar: "💪" },
  { id: 4277943, name: "Tyler Herro", team: "MIA", avgFP: 29.5, cost: 1, avatar: "👶" },
  { id: 4278078, name: "Michael Porter Jr.", team: "DEN", avgFP: 28.8, cost: 1, avatar: "🛡️" },
  { id: 3064436, name: "Aaron Gordon", team: "DEN", avgFP: 27.5, cost: 1, avatar: "🔨" },
  { id: 3074752, name: "Terry Rozier", team: "MIA", avgFP: 28.5, cost: 1, avatar: "👻" },
  { id: 4278508, name: "Keldon Johnson", team: "SAS", avgFP: 26.0, cost: 1, avatar: "🐎" }
];