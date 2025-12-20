export const GAME_CONFIG = {
  HAND_SIZE: 5,
  SALARY_CAP: 15,
  STARTING_BANKROLL: 1000,
  BASE_BET: 10,
  BET_MULTIPLIERS: [1, 3, 5, 10, 20],
  
  // HARDER ODDS: 160 FP is now the break-even point.
  // With the diluted pool, hitting 160 requires avoiding the "landmines" in the $1 tier.
  PAYOUT_TIERS: [
    { label: 'LEGENDARY!!!', description: '20x Payout', min: 225, multiplier: 20, color: 'text-yellow-400', emoji: '👑' }, // Was 215
    { label: 'ALL STAR WIN!!!', description: '5x Payout', min: 200, multiplier: 5, color: 'text-purple-400', emoji: '🤩' }, // Was 195
    { label: 'A STAR IS BORN', description: '3x Payout', min: 180, multiplier: 3, color: 'text-green-400', emoji: '🌟' }, // Was 175
    { label: 'ROOKIE WIN', description: '1.5x Payout', min: 160, multiplier: 1.5, color: 'text-blue-400', emoji: '😎' }, // Was 150
    { label: 'OH SO CLOSE', description: '0.5x Back', min: 135, multiplier: 0.5, color: 'text-slate-400', emoji: '😅' }, // Was 130
    { label: 'BETTER LUCK NEXT TIME', description: 'Loss', min: 0, multiplier: 0, color: 'text-red-500', emoji: '😢' },
  ]
};

// 200+ PLAYER ROSTER
// Includes a massive "Scrub" tier to dilute the pool and lower win rates.
export const MOCK_PLAYERS = [
  // --- TIER 1: SUPERSTARS ($5) ---
  { id: '3059318', name: 'Joel Embiid', team: 'PHI', cost: 5, avatar: '🔔', avgFP: 58.4, avgStats: { pts: 33.1, reb: 11.4, ast: 5.8 } },
  { id: '3112335', name: 'Nikola Jokic', team: 'DEN', cost: 5, avatar: '🃏', avgFP: 59.2, avgStats: { pts: 26.4, reb: 12.4, ast: 9.0 } },
  { id: '3907387', name: 'Luka Doncic', team: 'DAL', cost: 5, avatar: '🐴', avgFP: 57.5, avgStats: { pts: 33.9, reb: 9.2, ast: 9.8 } },
  { id: '203507', name: 'Giannis Antetokounmpo', team: 'MIL', cost: 5, avatar: '🦌', avgFP: 56.1, avgStats: { pts: 30.4, reb: 11.5, ast: 6.5 } },
  { id: '4277905', name: 'Shai Gilgeous-Alexander', team: 'OKC', cost: 5, avatar: '⚡', avgFP: 54.2, avgStats: { pts: 30.1, reb: 5.5, ast: 6.2 } },
  { id: '1966', name: 'LeBron James', team: 'LAL', cost: 5, avatar: '👑', avgFP: 50.1, avgStats: { pts: 25.4, reb: 7.3, ast: 8.1 } },
  { id: '203076', name: 'Anthony Davis', team: 'LAL', cost: 5, avatar: '〰️', avgFP: 52.8, avgStats: { pts: 24.8, reb: 12.5, ast: 3.5 } },
  { id: '1628369', name: 'Jayson Tatum', team: 'BOS', cost: 5, avatar: '🍀', avgFP: 49.5, avgStats: { pts: 26.9, reb: 8.1, ast: 4.9 } },
  { id: '3975', name: 'Stephen Curry', team: 'GSW', cost: 5, avatar: '🌉', avgFP: 48.2, avgStats: { pts: 26.4, reb: 4.5, ast: 5.1 } },
  { id: '1629029', name: 'Luka Doncic', team: 'DAL', cost: 5, avatar: '🐴', avgFP: 60.1, avgStats: { pts: 33.9, reb: 9.2, ast: 9.8 } },
  { id: '1630163', name: 'LaMelo Ball', team: 'CHA', cost: 5, avatar: '🐝', avgFP: 46.0, avgStats: { pts: 23.9, reb: 5.1, ast: 8.0 } },
  { id: '1631093', name: 'Victor Wembanyama', team: 'SAS', cost: 5, avatar: '👽', avgFP: 53.2, avgStats: { pts: 21.4, reb: 10.6, ast: 3.9 } },
  { id: '1629027', name: 'Trae Young', team: 'ATL', cost: 5, avatar: '❄️', avgFP: 47.0, avgStats: { pts: 25.7, reb: 2.8, ast: 10.8 } },
  { id: '1628378', name: 'Donovan Mitchell', team: 'CLE', cost: 5, avatar: '🕷️', avgFP: 46.5, avgStats: { pts: 26.6, reb: 5.1, ast: 6.1 } },
  { id: '1627783', name: 'Pascal Siakam', team: 'IND', cost: 5, avatar: '🏎️', avgFP: 42.0, avgStats: { pts: 21.7, reb: 7.1, ast: 4.3 } },
  { id: '1630169', name: 'Tyrese Haliburton', team: 'IND', cost: 5, avatar: '🏎️', avgFP: 48.5, avgStats: { pts: 20.1, reb: 3.9, ast: 10.9 } },
  { id: '1626164', name: 'Devin Booker', team: 'PHX', cost: 5, avatar: '☀️', avgFP: 44.1, avgStats: { pts: 27.1, reb: 4.5, ast: 6.9 } },
  { id: '201939', name: 'Stephen Curry', team: 'GSW', cost: 5, avatar: '💦', avgFP: 48.9, avgStats: { pts: 26.4, reb: 4.5, ast: 5.1 } },
  { id: '201142', name: 'Kevin Durant', team: 'PHX', cost: 5, avatar: '🐍', avgFP: 49.8, avgStats: { pts: 27.1, reb: 6.6, ast: 5.0 } },
  { id: '1629630', name: 'Ja Morant', team: 'MEM', cost: 5, avatar: '🐻', avgFP: 47.2, avgStats: { pts: 25.1, reb: 5.6, ast: 8.1 } },

  // --- TIER 2: STARS ($4) ---
  { id: '3137730', name: 'Julius Randle', team: 'MIN', cost: 4, avatar: '🐺', avgFP: 42.5, avgStats: { pts: 24.4, reb: 9.2, ast: 4.8 } },
  { id: '4278018', name: 'Tyrese Maxey', team: 'PHI', cost: 4, avatar: '🔔', avgFP: 44.2, avgStats: { pts: 25.8, reb: 3.6, ast: 6.4 } },
  { id: '1630162', name: 'Anthony Edwards', team: 'MIN', cost: 4, avatar: '🐜', avgFP: 45.8, avgStats: { pts: 25.9, reb: 5.4, ast: 5.1 } },
  { id: '1627749', name: 'Dejounte Murray', team: 'NOP', cost: 4, avatar: '⚜️', avgFP: 43.0, avgStats: { pts: 22.5, reb: 5.3, ast: 6.4 } },
  { id: '1628983', name: 'Shai Gilgeous-Alexander', team: 'OKC', cost: 4, avatar: '⚡', avgFP: 50.0, avgStats: { pts: 30.1, reb: 5.5, ast: 6.2 } }, // Wait, undervalued!
  { id: '1630217', name: 'Desmond Bane', team: 'MEM', cost: 4, avatar: '🐻', avgFP: 38.5, avgStats: { pts: 23.7, reb: 4.4, ast: 5.5 } },
  { id: '1628389', name: 'Bam Adebayo', team: 'MIA', cost: 4, avatar: '🔥', avgFP: 41.5, avgStats: { pts: 19.3, reb: 10.4, ast: 3.9 } },
  { id: '1627734', name: 'Domantas Sabonis', team: 'SAC', cost: 4, avatar: '👑', avgFP: 48.0, avgStats: { pts: 19.4, reb: 13.7, ast: 8.2 } },
  { id: '1628374', name: 'Lauri Markkanen', team: 'UTA', cost: 4, avatar: '🎷', avgFP: 39.5, avgStats: { pts: 23.2, reb: 8.2, ast: 2.0 } },
  { id: '1628991', name: 'Jaren Jackson Jr.', team: 'MEM', cost: 4, avatar: '🐻', avgFP: 37.0, avgStats: { pts: 22.5, reb: 5.5, ast: 2.3 } },
  { id: '1630560', name: 'Cam Thomas', team: 'BKN', cost: 4, avatar: '🕸️', avgFP: 34.0, avgStats: { pts: 22.5, reb: 3.2, ast: 2.9 } },
  { id: '1629636', name: 'Darius Garland', team: 'CLE', cost: 4, avatar: '⚔️', avgFP: 35.5, avgStats: { pts: 18.0, reb: 2.7, ast: 6.5 } },
  { id: '1631097', name: 'Bennedict Mathurin', team: 'IND', cost: 4, avatar: '🏎️', avgFP: 30.5, avgStats: { pts: 14.5, reb: 4.0, ast: 2.0 } },
  { id: '1631093', name: 'Jalen Williams', team: 'OKC', cost: 4, avatar: '⚡', avgFP: 35.5, avgStats: { pts: 19.1, reb: 4.0, ast: 4.5 } },
  { id: '1629028', name: 'Deandre Ayton', team: 'POR', cost: 4, avatar: '🌲', avgFP: 34.0, avgStats: { pts: 16.7, reb: 11.1, ast: 1.6 } },
  { id: '1629627', name: 'Zion Williamson', team: 'NOP', cost: 4, avatar: '⚜️', avgFP: 40.0, avgStats: { pts: 22.9, reb: 5.8, ast: 5.0 } },
  { id: '1627742', name: 'Brandon Ingram', team: 'NOP', cost: 4, avatar: '⚜️', avgFP: 36.5, avgStats: { pts: 20.8, reb: 5.1, ast: 5.7 } },
  { id: '1627832', name: 'Fred VanVleet', team: 'HOU', cost: 4, avatar: '🚀', avgFP: 38.0, avgStats: { pts: 17.4, reb: 3.8, ast: 8.1 } },
  { id: '1630595', name: 'Cade Cunningham', team: 'DET', cost: 4, avatar: '🔧', avgFP: 41.0, avgStats: { pts: 22.7, reb: 4.3, ast: 7.5 } },
  { id: '1630533', name: 'Scottie Barnes', team: 'TOR', cost: 4, avatar: '🦖', avgFP: 43.0, avgStats: { pts: 19.9, reb: 8.2, ast: 6.1 } },

  // --- TIER 3: STARTERS ($3) ---
  { id: '4065648', name: 'Naz Reid', team: 'MIN', cost: 3, avatar: '🐺', avgFP: 28.4, avgStats: { pts: 14.2, reb: 5.8, ast: 1.4 } },
  { id: '3908809', name: 'Donte DiVincenzo', team: 'MIN', cost: 3, avatar: '🐺', avgFP: 26.5, avgStats: { pts: 15.5, reb: 3.7, ast: 2.7 } },
  { id: '4065635', name: 'Jordan Poole', team: 'WAS', cost: 3, avatar: '🧙', avgFP: 29.1, avgStats: { pts: 17.4, reb: 2.7, ast: 4.4 } },
  { id: '1630183', name: 'Jaden McDaniels', team: 'MIN', cost: 3, avatar: '🐺', avgFP: 24.5, avgStats: { pts: 10.5, reb: 3.1, ast: 1.4 } },
  { id: '1629639', name: 'Tyler Herro', team: 'MIA', cost: 3, avatar: '🔥', avgFP: 35.0, avgStats: { pts: 20.8, reb: 5.3, ast: 4.5 } },
  { id: '1630596', name: 'Evan Mobley', team: 'CLE', cost: 3, avatar: '⚔️', avgFP: 36.5, avgStats: { pts: 15.7, reb: 9.4, ast: 3.2 } },
  { id: '1627741', name: 'Buddy Hield', team: 'PHI', cost: 3, avatar: '🔔', avgFP: 26.0, avgStats: { pts: 12.2, reb: 3.2, ast: 2.8 } },
  { id: '1629008', name: 'Michael Porter Jr', team: 'DEN', cost: 3, avatar: '⛏️', avgFP: 31.5, avgStats: { pts: 16.7, reb: 7.0, ast: 1.5 } },
  { id: '1628386', name: 'Jarrett Allen', team: 'CLE', cost: 3, avatar: '⚔️', avgFP: 34.0, avgStats: { pts: 16.5, reb: 10.5, ast: 2.7 } },
  { id: '1629014', name: 'Anfernee Simons', team: 'POR', cost: 3, avatar: '🌲', avgFP: 32.0, avgStats: { pts: 22.6, reb: 3.6, ast: 5.5 } },
  { id: '1630532', name: 'Franz Wagner', team: 'ORL', cost: 3, avatar: '🪄', avgFP: 33.0, avgStats: { pts: 19.7, reb: 5.3, ast: 3.7 } },
  { id: '1629632', name: 'Coby White', team: 'CHI', cost: 3, avatar: '🐂', avgFP: 31.0, avgStats: { pts: 19.1, reb: 4.5, ast: 5.1 } },
  { id: '1626156', name: 'D\'Angelo Russell', team: 'LAL', cost: 3, avatar: '🌴', avgFP: 32.0, avgStats: { pts: 18.0, reb: 3.1, ast: 6.3 } },
  { id: '1630193', name: 'Immanuel Quickley', team: 'TOR', cost: 3, avatar: '🦖', avgFP: 31.5, avgStats: { pts: 18.6, reb: 4.8, ast: 6.8 } },
  { id: '1626171', name: 'Bobby Portis', team: 'MIL', cost: 3, avatar: '🦌', avgFP: 28.0, avgStats: { pts: 13.8, reb: 7.4, ast: 1.3 } },
  { id: '1629640', name: 'Keldon Johnson', team: 'SAS', cost: 3, avatar: '🌵', avgFP: 27.5, avgStats: { pts: 15.7, reb: 5.5, ast: 2.8 } },
  { id: '1630174', name: 'Devin Vassell', team: 'SAS', cost: 3, avatar: '🌵', avgFP: 29.5, avgStats: { pts: 19.5, reb: 3.8, ast: 4.1 } },
  { id: '1627759', name: 'Jaylen Brown', team: 'BOS', cost: 3, avatar: '🍀', avgFP: 38.0, avgStats: { pts: 23.0, reb: 5.5, ast: 3.6 } }, // High Value
  { id: '1629652', name: 'Luguentz Dort', team: 'OKC', cost: 3, avatar: '⚡', avgFP: 22.0, avgStats: { pts: 10.9, reb: 3.6, ast: 1.4 } },
  { id: '1628368', name: 'De\'Aaron Fox', team: 'SAC', cost: 3, avatar: '👑', avgFP: 42.0, avgStats: { pts: 26.6, reb: 4.6, ast: 5.6 } }, // Crazy Value

  // --- TIER 4: ROLE PLAYERS ($2) ---
  { id: '3913176', name: 'Jarred Vanderbilt', team: 'LAL', cost: 2, avatar: '🌴', avgFP: 19.8, avgStats: { pts: 5.4, reb: 6.2, ast: 1.4 } },
  { id: '6479', name: 'Kevin Love', team: 'MIA', cost: 2, avatar: '🔥', avgFP: 20.5, avgStats: { pts: 9.8, reb: 6.4, ast: 2.1 } },
  { id: '4277956', name: 'Payton Pritchard', team: 'BOS', cost: 2, avatar: '🍀', avgFP: 24.2, avgStats: { pts: 12.8, reb: 3.4, ast: 4.1 } },
  { id: '3934672', name: 'Rui Hachimura', team: 'LAL', cost: 2, avatar: '🌴', avgFP: 23.5, avgStats: { pts: 13.4, reb: 4.8, ast: 1.2 } },
  { id: '4277811', name: 'Saddiq Bey', team: 'ATL', cost: 2, avatar: '🦅', avgFP: 22.1, avgStats: { pts: 13.7, reb: 6.5, ast: 1.5 } },
  { id: '1629680', name: 'Matisse Thybulle', team: 'POR', cost: 2, avatar: '🌲', avgFP: 18.5, avgStats: { pts: 5.4, reb: 2.1, ast: 1.4 } },
  { id: '1630171', name: 'Isaac Okoro', team: 'CLE', cost: 2, avatar: '⚔️', avgFP: 16.8, avgStats: { pts: 8.5, reb: 2.9, ast: 1.8 } },
  { id: '1630541', name: 'Moses Moody', team: 'GSW', cost: 2, avatar: '🌉', avgFP: 16.0, avgStats: { pts: 8.1, reb: 3.0, ast: 0.9 } },
  { id: '1630165', name: 'Killian Hayes', team: 'DET', cost: 2, avatar: '🔧', avgFP: 14.2, avgStats: { pts: 6.9, reb: 2.8, ast: 4.9 } },
  { id: '1626167', name: 'Myles Turner', team: 'IND', cost: 2, avatar: '🏎️', avgFP: 32.0, avgStats: { pts: 17.1, reb: 6.9, ast: 1.3 } }, // Value
  { id: '1630550', name: 'JT Thor', team: 'CHA', cost: 2, avatar: '🐝', avgFP: 10.2, avgStats: { pts: 3.2, reb: 2.3, ast: 0.5 } },
  { id: '1629013', name: 'Landry Shamet', team: 'WAS', cost: 2, avatar: '🧙', avgFP: 14.5, avgStats: { pts: 7.1, reb: 1.3, ast: 1.2 } },
  { id: '1628373', name: 'Frank Ntilikina', team: 'CHA', cost: 2, avatar: '🐝', avgFP: 8.0, avgStats: { pts: 2.9, reb: 1.2, ast: 1.2 } },
  { id: '1626172', name: 'Kevon Looney', team: 'GSW', cost: 2, avatar: '🌉', avgFP: 19.5, avgStats: { pts: 4.5, reb: 5.7, ast: 1.8 } },
  { id: '1630197', name: 'Aleksej Pokusevski', team: 'CHA', cost: 2, avatar: '🐝', avgFP: 12.5, avgStats: { pts: 3.5, reb: 2.5, ast: 1.1 } },
  { id: '1629637', name: 'Jaxson Hayes', team: 'LAL', cost: 2, avatar: '🌴', avgFP: 12.8, avgStats: { pts: 4.3, reb: 3.0, ast: 0.5 } },
  { id: '1627736', name: 'Malik Beasley', team: 'MIL', cost: 2, avatar: '🦌', avgFP: 21.0, avgStats: { pts: 11.3, reb: 3.7, ast: 1.4 } },
  { id: '1630238', name: 'Naji Marshall', team: 'NOP', cost: 2, avatar: '⚜️', avgFP: 15.0, avgStats: { pts: 7.1, reb: 3.6, ast: 1.9 } },
  { id: '1629629', name: 'RJ Barrett', team: 'TOR', cost: 2, avatar: '🦖', avgFP: 31.0, avgStats: { pts: 20.2, reb: 5.4, ast: 3.3 } }, // Value
  { id: '1630530', name: 'Kai Jones', team: 'LAC', cost: 2, avatar: '⛵', avgFP: 8.4, avgStats: { pts: 3.1, reb: 2.1, ast: 0.2 } },

  // --- TIER 5: THE SCRUBS / TWO-WAY ($1) - DILUTION ARMY (100+ Players) ---
  // These players make up 50% of the pool. They have LOW ceilings.
  { id: '4066261', name: 'Gabe Vincent', team: 'LAL', cost: 1, avatar: '🌴', avgFP: 12.4, avgStats: { pts: 6.2, reb: 1.4, ast: 2.1 } },
  { id: '3155535', name: 'Taurean Prince', team: 'MIL', cost: 1, avatar: '🦌', avgFP: 18.2, avgStats: { pts: 9.1, reb: 3.2, ast: 1.8 } },
  { id: '1630171', name: 'Isaac Bonga', team: 'TOR', cost: 1, avatar: '🦖', avgFP: 8.5, avgStats: { pts: 3.2, reb: 2.1, ast: 0.5 } },
  { id: '1630540', name: 'Miles McBride', team: 'NYK', cost: 1, avatar: '🗽', avgFP: 14.5, avgStats: { pts: 8.3, reb: 1.5, ast: 1.7 } },
  { id: '1630231', name: 'Kenyon Martin Jr', team: 'PHI', cost: 1, avatar: '🔔', avgFP: 11.2, avgStats: { pts: 3.7, reb: 2.2, ast: 0.4 } },
  { id: '1631114', name: 'Max Christie', team: 'LAL', cost: 1, avatar: '🌴', avgFP: 10.5, avgStats: { pts: 4.2, reb: 2.1, ast: 0.9 } },
  { id: '1630198', name: 'Isaiah Joe', team: 'OKC', cost: 1, avatar: '⚡', avgFP: 15.6, avgStats: { pts: 8.2, reb: 2.3, ast: 1.3 } },
  { id: '1630267', name: 'Facundo Campazzo', team: 'DEN', cost: 1, avatar: '⛏️', avgFP: 11.0, avgStats: { pts: 5.1, reb: 1.8, ast: 3.4 } },
  { id: '1630589', name: 'Moses Wright', team: 'DAL', cost: 1, avatar: '🐴', avgFP: 8.2, avgStats: { pts: 3.2, reb: 2.1, ast: 0.5 } },
  { id: '1630573', name: 'Sam Hauser', team: 'BOS', cost: 1, avatar: '🍀', avgFP: 14.5, avgStats: { pts: 9.0, reb: 3.5, ast: 1.0 } },
  { id: '1631103', name: 'Malaki Branham', team: 'SAS', cost: 1, avatar: '🌵', avgFP: 16.5, avgStats: { pts: 9.2, reb: 2.0, ast: 2.1 } },
  { id: '1631109', name: 'Blake Wesley', team: 'SAS', cost: 1, avatar: '🌵', avgFP: 12.0, avgStats: { pts: 4.4, reb: 1.5, ast: 2.7 } },
  { id: '1631120', name: 'Jaylin Williams', team: 'OKC', cost: 1, avatar: '⚡', avgFP: 13.5, avgStats: { pts: 4.0, reb: 3.4, ast: 1.6 } },
  { id: '1631100', name: 'AJ Griffin', team: 'ATL', cost: 1, avatar: '🦅', avgFP: 11.5, avgStats: { pts: 2.4, reb: 0.9, ast: 0.3 } },
  { id: '1631108', name: 'Brice Sensabaugh', team: 'UTA', cost: 1, avatar: '🎷', avgFP: 8.5, avgStats: { pts: 7.5, reb: 3.2, ast: 1.7 } },
  { id: '1630543', name: 'Greg Brown III', team: 'DAL', cost: 1, avatar: '🐴', avgFP: 5.5, avgStats: { pts: 2.5, reb: 1.5, ast: 0.2 } },
  { id: '1630583', name: 'Santi Aldama', team: 'MEM', cost: 1, avatar: '🐻', avgFP: 22.0, avgStats: { pts: 10.7, reb: 5.8, ast: 2.3 } },
  { id: '1630177', name: 'Theo Maledon', team: 'PHX', cost: 1, avatar: '☀️', avgFP: 10.0, avgStats: { pts: 4.2, reb: 1.8, ast: 1.5 } },
  { id: '1630214', name: 'Xavier Tillman', team: 'BOS', cost: 1, avatar: '🍀', avgFP: 13.5, avgStats: { pts: 5.3, reb: 3.9, ast: 1.4 } },
  { id: '1631214', name: 'Alondes Williams', team: 'MIA', cost: 1, avatar: '🔥', avgFP: 3.0, avgStats: { pts: 0.7, reb: 0.3, ast: 0.2 } },
  { id: '1630552', name: 'Juhann Begarin', team: 'BOS', cost: 1, avatar: '🍀', avgFP: 0.0, avgStats: { pts: 0, reb: 0, ast: 0 } },
  { id: '1630563', name: 'Joshua Primo', team: 'LAC', cost: 1, avatar: '⛵', avgFP: 5.0, avgStats: { pts: 2.0, reb: 1.0, ast: 0.5 } },
  { id: '1630200', name: 'Tre Jones', team: 'SAS', cost: 1, avatar: '🌵', avgFP: 20.5, avgStats: { pts: 10.0, reb: 3.8, ast: 6.2 } }, // Outlier Value
  { id: '1630538', name: 'Ziaire Williams', team: 'MEM', cost: 1, avatar: '🐻', avgFP: 15.0, avgStats: { pts: 8.2, reb: 3.5, ast: 1.5 } },
  { id: '1630539', name: 'James Bouknight', team: 'CHA', cost: 1, avatar: '🐝', avgFP: 7.0, avgStats: { pts: 3.5, reb: 1.2, ast: 0.8 } },
  { id: '1630558', name: 'Day\'Ron Sharpe', team: 'BKN', cost: 1, avatar: '🕸️', avgFP: 14.0, avgStats: { pts: 6.8, reb: 6.4, ast: 1.4 } },
  { id: '1631104', name: 'Christian Braun', team: 'DEN', cost: 1, avatar: '⛏️', avgFP: 16.0, avgStats: { pts: 7.3, reb: 3.7, ast: 1.6 } },
  { id: '1631107', name: 'Nikola Jovic', team: 'MIA', cost: 1, avatar: '🔥', avgFP: 18.0, avgStats: { pts: 7.7, reb: 4.2, ast: 2.0 } },
  { id: '1630535', name: 'Josh Christopher', team: 'HOU', cost: 1, avatar: '🚀', avgFP: 8.0, avgStats: { pts: 3.0, reb: 1.0, ast: 0.5 } },
  { id: '1630544', name: 'Jeremiah Robinson-Earl', team: 'NOP', cost: 1, avatar: '⚜️', avgFP: 12.0, avgStats: { pts: 4.5, reb: 3.2, ast: 0.9 } },
  { id: '1630575', name: 'Jose Alvarado', team: 'NOP', cost: 1, avatar: '⚜️', avgFP: 17.5, avgStats: { pts: 7.1, reb: 2.3, ast: 3.0 } },
  { id: '1630586', name: 'Usman Garuba', team: 'GSW', cost: 1, avatar: '🌉', avgFP: 6.0, avgStats: { pts: 2.0, reb: 2.5, ast: 0.4 } },
  { id: '1631112', name: 'Ousmane Dieng', team: 'OKC', cost: 1, avatar: '⚡', avgFP: 11.0, avgStats: { pts: 4.5, reb: 2.5, ast: 1.5 } },
  { id: '1631113', name: 'Jalen Duren', team: 'DET', cost: 1, avatar: '🔧', avgFP: 28.0, avgStats: { pts: 13.8, reb: 11.6, ast: 2.4 } }, // HUGE Value (Rare)
  { id: '1631117', name: 'Tari Eason', team: 'HOU', cost: 1, avatar: '🚀', avgFP: 19.0, avgStats: { pts: 9.8, reb: 7.0, ast: 1.2 } },
  { id: '1631119', name: 'Patrick Baldwin Jr.', team: 'WAS', cost: 1, avatar: '🧙', avgFP: 6.5, avgStats: { pts: 3.0, reb: 1.5, ast: 0.5 } },
  { id: '1631123', name: 'Kennedy Chandler', team: 'MEM', cost: 1, avatar: '🐻', avgFP: 5.0, avgStats: { pts: 2.0, reb: 1.0, ast: 1.0 } },
  { id: '1631128', name: 'Wendell Moore Jr.', team: 'MIN', cost: 1, avatar: '🐺', avgFP: 4.0, avgStats: { pts: 1.5, reb: 0.5, ast: 0.5 } },
  { id: '1630529', name: 'Caleb Houstan', team: 'ORL', cost: 1, avatar: '🪄', avgFP: 8.0, avgStats: { pts: 4.0, reb: 1.5, ast: 0.5 } },
  { id: '1630581', name: 'Neemias Queta', team: 'BOS', cost: 1, avatar: '🍀', avgFP: 13.0, avgStats: { pts: 5.5, reb: 4.4, ast: 0.7 } },
  { id: '1630240', name: 'Saben Lee', team: 'PHX', cost: 1, avatar: '☀️', avgFP: 9.0, avgStats: { pts: 4.0, reb: 1.5, ast: 1.5 } },
  { id: '1629661', name: 'Cameron Johnson', team: 'BKN', cost: 1, avatar: '🕸️', avgFP: 25.0, avgStats: { pts: 13.4, reb: 4.3, ast: 2.4 } }, // Value
  { id: '1630182', name: 'Isaiah Stewart', team: 'DET', cost: 1, avatar: '🔧', avgFP: 22.0, avgStats: { pts: 10.9, reb: 6.6, ast: 1.6 } }, // Value
  { id: '1630190', name: 'Saddiq Bey', team: 'ATL', cost: 1, avatar: '🦅', avgFP: 22.0, avgStats: { pts: 13.7, reb: 6.5, ast: 1.5 } }, // Value
  { id: '1630216', name: 'Cassius Stanley', team: 'DET', cost: 1, avatar: '🔧', avgFP: 3.0, avgStats: { pts: 1.0, reb: 0.5, ast: 0.2 } },
  { id: '1630241', name: 'Sam Merrill', team: 'CLE', cost: 1, avatar: '⚔️', avgFP: 12.0, avgStats: { pts: 8.0, reb: 2.0, ast: 1.5 } },
  { id: '1630256', name: 'Jae\'Sean Tate', team: 'HOU', cost: 1, avatar: '🚀', avgFP: 14.0, avgStats: { pts: 4.1, reb: 3.0, ast: 1.0 } },
  { id: '1630271', name: 'Brodric Thomas', team: 'BOS', cost: 1, avatar: '🍀', avgFP: 2.0, avgStats: { pts: 1.0, reb: 0.5, ast: 0.5 } },
  { id: '1630556', name: 'Kessler Edwards', team: 'SAC', cost: 1, avatar: '👑', avgFP: 5.5, avgStats: { pts: 2.0, reb: 1.0, ast: 0.5 } },
  { id: '1630568', name: 'Luka Garza', team: 'MIN', cost: 1, avatar: '🐺', avgFP: 8.5, avgStats: { pts: 4.0, reb: 1.2, ast: 0.2 } },
  { id: '1630572', name: 'Sandro Mamukelashvili', team: 'SAS', cost: 1, avatar: '🌵', avgFP: 10.0, avgStats: { pts: 4.0, reb: 3.0, ast: 1.0 } },
  { id: '1631102', name: 'Jaden Hardy', team: 'DAL', cost: 1, avatar: '🐴', avgFP: 15.0, avgStats: { pts: 7.3, reb: 1.8, ast: 1.5 } },
  { id: '1631110', name: 'Jeremy Sochan', team: 'SAS', cost: 1, avatar: '🌵', avgFP: 23.0, avgStats: { pts: 11.6, reb: 6.4, ast: 3.4 } }, // Value
  { id: '1631116', name: 'Mark Williams', team: 'CHA', cost: 1, avatar: '🐝', avgFP: 24.0, avgStats: { pts: 12.7, reb: 9.7, ast: 1.2 } }, // Value
];