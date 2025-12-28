// --- REAL NBA DB ---
// DATA SOURCE: 2023-24 Season Averages (Approximate for Beta)
// STRICT RULE: DO NOT MAKE UP STATS. USE REAL DATA ONLY.

const PLAYERS = [
  // TIER 1: MVPs
  { 
    id: '203999', name: 'Nikola Jokic', team: 'DEN', cost: 6.0, avg: 62.0, type: 'BIG', badges: ['👑', '✌️'],
    avg_stats: { pts: 26.4, reb: 12.4, ast: 9.0, stl: 1.4, blk: 0.9, to: 3.0 }
  },
  { 
    id: '1629029', name: 'Luka Doncic', team: 'DAL', cost: 5.8, avg: 59.5, type: 'GUARD', badges: ['🔥', '👑'],
    avg_stats: { pts: 33.9, reb: 9.2, ast: 9.8, stl: 1.4, blk: 0.5, to: 4.0 }
  },
  { 
    id: '203507', name: 'Giannis Antetokounmpo', team: 'MIL', cost: 5.7, avg: 58.0, type: 'BIG', badges: ['✌️', '🔒'],
    avg_stats: { pts: 30.4, reb: 11.5, ast: 6.5, stl: 1.2, blk: 1.1, to: 3.4 }
  },
  { 
    id: '203954', name: 'Joel Embiid', team: 'PHI', cost: 5.9, avg: 60.5, type: 'BIG', badges: ['🔥'],
    avg_stats: { pts: 34.7, reb: 11.0, ast: 5.6, stl: 1.2, blk: 1.7, to: 3.8 }
  },
  { 
    id: '1628983', name: 'Shai Gilgeous-Alexander', team: 'OKC', cost: 5.5, avg: 56.0, type: 'GUARD', badges: ['✌️'],
    avg_stats: { pts: 30.1, reb: 5.5, ast: 6.2, stl: 2.0, blk: 0.9, to: 2.2 }
  },
  { 
    id: '1628369', name: 'Jayson Tatum', team: 'BOS', cost: 5.2, avg: 52.0, type: 'WING', badges: ['🔥'],
    avg_stats: { pts: 26.9, reb: 8.1, ast: 4.9, stl: 1.0, blk: 0.6, to: 2.5 }
  },
  { 
    id: '1641705', name: 'Victor Wembanyama', team: 'SAS', cost: 5.4, avg: 54.5, type: 'BIG', badges: ['🖐️', '🔒'],
    avg_stats: { pts: 21.4, reb: 10.6, ast: 3.9, stl: 1.2, blk: 3.6, to: 3.7 }
  },
  
  // TIER 2: STARS
  { 
    id: '2544', name: 'LeBron James', team: 'LAL', cost: 4.8, avg: 49.0, type: 'WING', badges: ['👑'],
    avg_stats: { pts: 25.7, reb: 7.3, ast: 8.3, stl: 1.3, blk: 0.5, to: 3.5 }
  },
  { 
    id: '1630162', name: 'Anthony Edwards', team: 'MIN', cost: 4.6, avg: 47.5, type: 'GUARD', badges: ['🔥'],
    avg_stats: { pts: 25.9, reb: 5.4, ast: 5.1, stl: 1.3, blk: 0.5, to: 3.1 }
  },
  { 
    id: '201142', name: 'Kevin Durant', team: 'PHX', cost: 4.7, avg: 48.0, type: 'WING', badges: [],
    avg_stats: { pts: 27.1, reb: 6.6, ast: 5.0, stl: 0.9, blk: 1.2, to: 3.3 }
  },
  { 
    id: '1626164', name: 'Devin Booker', team: 'PHX', cost: 4.4, avg: 45.0, type: 'GUARD', badges: ['🔥'],
    avg_stats: { pts: 27.1, reb: 4.5, ast: 6.9, stl: 0.9, blk: 0.4, to: 2.6 }
  },
  { 
    id: '1630169', name: 'Tyrese Haliburton', team: 'IND', cost: 4.5, avg: 46.5, type: 'GUARD', badges: ['✌️'],
    avg_stats: { pts: 20.1, reb: 3.9, ast: 10.9, stl: 1.2, blk: 0.7, to: 2.3 }
  },
  { 
    id: '201939', name: 'Stephen Curry', team: 'GSW', cost: 4.3, avg: 44.0, type: 'GUARD', badges: ['🔥'],
    avg_stats: { pts: 26.4, reb: 4.5, ast: 5.1, stl: 0.7, blk: 0.4, to: 2.8 }
  },
  { 
    id: '1629027', name: 'Trae Young', team: 'ATL', cost: 4.2, avg: 43.5, type: 'GUARD', badges: ['✌️'],
    avg_stats: { pts: 25.7, reb: 2.8, ast: 10.8, stl: 1.3, blk: 0.2, to: 4.4 }
  },
  { 
    id: '1627734', name: 'Domantas Sabonis', team: 'SAC', cost: 4.9, avg: 50.0, type: 'BIG', badges: ['👑'],
    avg_stats: { pts: 19.4, reb: 13.7, ast: 8.2, stl: 0.9, blk: 0.6, to: 3.1 }
  },
  { 
    id: '203076', name: 'Anthony Davis', team: 'LAL', cost: 4.8, avg: 49.5, type: 'BIG', badges: ['🔒', '✌️'],
    avg_stats: { pts: 24.7, reb: 12.6, ast: 3.5, stl: 1.2, blk: 2.3, to: 2.1 }
  },
  { 
    id: '1628368', name: 'DeAaron Fox', team: 'SAC', cost: 4.1, avg: 41.0, type: 'GUARD', badges: ['🔥'],
    avg_stats: { pts: 26.6, reb: 4.6, ast: 5.6, stl: 2.0, blk: 0.4, to: 2.6 }
  },
  { 
    id: '1628973', name: 'Jalen Brunson', team: 'NYK', cost: 4.0, avg: 40.5, type: 'GUARD', badges: [],
    avg_stats: { pts: 28.7, reb: 3.6, ast: 6.7, stl: 0.9, blk: 0.2, to: 2.4 }
  },
  
  // TIER 3: STARTERS 
  { 
    id: '203081', name: 'Damian Lillard', team: 'MIL', cost: 3.7, avg: 39.0, type: 'GUARD', badges: ['🔥'],
    avg_stats: { pts: 24.3, reb: 4.4, ast: 7.0, stl: 1.0, blk: 0.2, to: 2.6 }
  },
  { 
    id: '1628389', name: 'Bam Adebayo', team: 'MIA', cost: 3.6, avg: 38.0, type: 'BIG', badges: ['🔒'],
    avg_stats: { pts: 19.3, reb: 10.4, ast: 3.9, stl: 1.1, blk: 0.9, to: 2.3 }
  },
  { 
    id: '1629627', name: 'Zion Williamson', team: 'NOP', cost: 3.5, avg: 37.0, type: 'BIG', badges: [],
    avg_stats: { pts: 22.9, reb: 5.8, ast: 5.0, stl: 1.1, blk: 0.7, to: 2.7 }
  },
  { 
    id: '202331', name: 'Paul George', team: 'PHI', cost: 3.5, avg: 37.5, type: 'WING', badges: ['🔒'],
    avg_stats: { pts: 22.6, reb: 5.2, ast: 3.5, stl: 1.5, blk: 0.5, to: 2.1 }
  },
  { 
    id: '202695', name: 'Kawhi Leonard', team: 'LAC', cost: 3.8, avg: 40.0, type: 'WING', badges: ['🔒'],
    avg_stats: { pts: 23.7, reb: 6.1, ast: 3.6, stl: 1.6, blk: 0.9, to: 1.8 }
  },
  { 
    id: '202681', name: 'Kyrie Irving', team: 'DAL', cost: 3.4, avg: 36.5, type: 'GUARD', badges: ['🔥'],
    avg_stats: { pts: 25.6, reb: 5.0, ast: 5.2, stl: 1.3, blk: 0.5, to: 1.8 }
  },
  { 
    id: '1630163', name: 'LaMelo Ball', team: 'CHA', cost: 3.6, avg: 38.5, type: 'GUARD', badges: ['👑'],
    avg_stats: { pts: 23.9, reb: 5.1, ast: 8.0, stl: 1.8, blk: 0.2, to: 3.8 }
  },
  { 
    id: '1631096', name: 'Chet Holmgren', team: 'OKC', cost: 3.3, avg: 35.0, type: 'BIG', badges: ['🔒'],
    avg_stats: { pts: 16.5, reb: 7.9, ast: 2.4, stl: 0.6, blk: 2.3, to: 1.6 }
  },
  
  // TIER 4: ROTATION
  { 
    id: '1631114', name: 'Jalen Williams', team: 'OKC', cost: 2.8, avg: 32.0, type: 'WING', badges: [],
    avg_stats: { pts: 19.1, reb: 4.0, ast: 4.5, stl: 1.1, blk: 0.6, to: 1.9 }
  },
  { 
    id: '1628969', name: 'Mikal Bridges', team: 'NYK', cost: 2.7, avg: 31.0, type: 'WING', badges: ['🔒'],
    avg_stats: { pts: 19.6, reb: 4.5, ast: 3.6, stl: 1.0, blk: 0.4, to: 2.0 }
  },
  { 
    id: '1626167', name: 'Myles Turner', team: 'IND', cost: 2.6, avg: 30.5, type: 'BIG', badges: ['🔒'],
    avg_stats: { pts: 17.1, reb: 6.9, ast: 1.3, stl: 0.5, blk: 1.9, to: 1.5 }
  },
  { 
    id: '1628401', name: 'Derrick White', team: 'BOS', cost: 2.5, avg: 29.0, type: 'GUARD', badges: ['🔒'],
    avg_stats: { pts: 15.2, reb: 4.2, ast: 5.2, stl: 1.0, blk: 1.2, to: 1.5 }
  },
  { 
    id: '203468', name: 'CJ McCollum', team: 'NOP', cost: 2.8, avg: 32.5, type: 'GUARD', badges: [],
    avg_stats: { pts: 20.0, reb: 4.3, ast: 4.6, stl: 0.9, blk: 0.6, to: 1.7 }
  },
  { 
    id: '203497', name: 'Rudy Gobert', team: 'MIN', cost: 2.9, avg: 33.0, type: 'BIG', badges: ['🔒', '✌️'],
    avg_stats: { pts: 14.0, reb: 12.9, ast: 1.3, stl: 0.7, blk: 2.1, to: 1.6 }
  },
  { 
    id: '201950', name: 'Jrue Holiday', team: 'BOS', cost: 2.6, avg: 30.0, type: 'GUARD', badges: ['🔒'],
    avg_stats: { pts: 12.5, reb: 5.4, ast: 4.8, stl: 0.9, blk: 0.8, to: 1.8 }
  },
  { 
    id: '1627750', name: 'Jamal Murray', team: 'DEN', cost: 2.9, avg: 33.5, type: 'GUARD', badges: ['🔥'],
    avg_stats: { pts: 21.2, reb: 4.1, ast: 6.5, stl: 1.0, blk: 0.7, to: 2.1 }
  },
  
  // TIER 5: VALUE
  { 
    id: '1630559', name: 'Austin Reaves', team: 'LAL', cost: 1.9, avg: 25.0, type: 'GUARD', badges: [],
    avg_stats: { pts: 15.9, reb: 4.3, ast: 5.5, stl: 0.8, blk: 0.3, to: 2.1 }
  },
  { 
    id: '1630581', name: 'Josh Giddey', team: 'CHI', cost: 1.8, avg: 24.5, type: 'GUARD', badges: ['✌️'],
    avg_stats: { pts: 12.3, reb: 6.4, ast: 4.8, stl: 0.6, blk: 0.6, to: 2.1 }
  },
  { 
    id: '1626156', name: 'DLo Russell', team: 'LAL', cost: 1.9, avg: 25.5, type: 'GUARD', badges: ['🔥'],
    avg_stats: { pts: 18.0, reb: 3.1, ast: 6.3, stl: 0.9, blk: 0.5, to: 2.1 }
  },
  { 
    id: '1627936', name: 'Alex Caruso', team: 'OKC', cost: 1.5, avg: 20.0, type: 'GUARD', badges: ['🔒'],
    avg_stats: { pts: 10.1, reb: 3.8, ast: 3.5, stl: 1.7, blk: 1.0, to: 1.3 }
  },
  { 
    id: '1629675', name: 'Naz Reid', team: 'MIN', cost: 1.7, avg: 23.0, type: 'BIG', badges: [],
    avg_stats: { pts: 13.5, reb: 5.2, ast: 1.3, stl: 0.8, blk: 0.9, to: 1.4 }
  },
  { 
    id: '1626171', name: 'Bobby Portis', team: 'MIL', cost: 1.6, avg: 22.5, type: 'BIG', badges: ['✌️'],
    avg_stats: { pts: 13.8, reb: 7.4, ast: 1.3, stl: 0.8, blk: 0.4, to: 1.1 }
  },
  { 
    id: '202691', name: 'Klay Thompson', team: 'DAL', cost: 1.7, avg: 23.5, type: 'WING', badges: [],
    avg_stats: { pts: 17.9, reb: 3.3, ast: 2.3, stl: 0.6, blk: 0.5, to: 1.5 }
  },
  
  // TIER 6: BARGAIN (Simplified for brevity but REAL)
  { 
    id: '1630631', name: 'Jose Alvarado', team: 'NOP', cost: 0.9, avg: 15.0, type: 'GUARD', badges: ['🔒'],
    avg_stats: { pts: 7.1, reb: 2.3, ast: 2.1, stl: 1.1, blk: 0.3, to: 1.0 }
  },
  { 
    id: '1630202', name: 'Payton Pritchard', team: 'BOS', cost: 0.8, avg: 14.0, type: 'GUARD', badges: [],
    avg_stats: { pts: 9.6, reb: 3.2, ast: 3.4, stl: 0.5, blk: 0.1, to: 0.7 }
  },
  { 
    id: '1630573', name: 'Sam Hauser', team: 'BOS', cost: 0.7, avg: 12.0, type: 'WING', badges: [],
    avg_stats: { pts: 9.0, reb: 3.5, ast: 1.0, stl: 0.5, blk: 0.3, to: 0.4 }
  },
  { 
    id: '1628470', name: 'Torrey Craig', team: 'CHI', cost: 0.6, avg: 10.0, type: 'WING', badges: ['🔒'],
    avg_stats: { pts: 5.7, reb: 4.1, ast: 1.1, stl: 0.6, blk: 0.4, to: 0.8 }
  },
  { 
    id: '1628436', name: 'Luke Kornet', team: 'BOS', cost: 0.6, avg: 11.0, type: 'BIG', badges: [],
    avg_stats: { pts: 5.3, reb: 4.1, ast: 1.1, stl: 0.4, blk: 1.0, to: 0.5 }
  }
];

export const fetchDraftPool = (count, excludeNames = [], maxCost = 99) => {
  let pool = PLAYERS.filter(p => !excludeNames.includes(p.name) && p.cost <= maxCost);
  pool = pool.sort(() => Math.random() - 0.5);
  return pool.slice(0, count);
};

export const getPlayerGameLog = (player) => {
  const variance = (Math.random() * 0.6) + 0.7; 
  let remainingScore = player.avg * variance;
  
  // STAT GENERATION LOGIC (Kept for GAMEPLAY SIMULATION only)
  // Note: This logic is for generating *fantasy results*, not displaying averages.
  let pts = 0, reb = 0, ast = 0, stl = 0, blk = 0, to = 0;
  
  if (player.type === 'BIG') {
    reb = Math.floor(remainingScore * 0.35 / 1.2); 
    remainingScore -= (reb * 1.2);
    pts = Math.floor(remainingScore * 0.6);
    remainingScore -= pts;
    ast = Math.floor(remainingScore / 1.5);
    blk = Math.random() > 0.5 ? Math.floor(Math.random() * 3) : 0;
    to = Math.floor(Math.random() * 3);
  } else if (player.type === 'GUARD') {
    ast = Math.floor(remainingScore * 0.35 / 1.5);
    remainingScore -= (ast * 1.5);
    pts = Math.floor(remainingScore * 0.6);
    remainingScore -= pts;
    reb = Math.floor(remainingScore / 1.2);
    stl = Math.random() > 0.5 ? Math.floor(Math.random() * 3) : 0;
    to = Math.floor(Math.random() * 4);
  } else {
    pts = Math.floor(remainingScore * 0.5);
    remainingScore -= pts;
    reb = Math.floor(remainingScore * 0.4 / 1.2);
    remainingScore -= (reb * 1.2);
    ast = Math.floor(remainingScore / 1.5);
    stl = Math.random() > 0.7 ? 1 : 0;
    to = Math.floor(Math.random() * 3);
  }

  const exactScore = pts + (reb * 1.2) + (ast * 1.5) + (stl * 3) + (blk * 3) - (to * 1);
  const finalScore = Math.max(0, Math.round(exactScore * 10) / 10);

  let activeBadges = [];
  if (finalScore >= 45) activeBadges.push('🔥');
  if ((pts>=10 && reb>=10) || (pts>=10 && ast>=10) || (reb>=10 && ast>=10)) activeBadges.push('✌️');
  if (pts>=10 && reb>=10 && ast>=10) activeBadges.push('👑');
  if (stl + blk >= 4) activeBadges.push('🔒');

  return {
    score: finalScore,
    stats: { pts, reb, ast, stl, blk, to },
    badges: activeBadges
  };
};

export const getAllPlayers = () => PLAYERS;