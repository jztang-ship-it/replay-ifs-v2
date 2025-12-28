// --- EXPANDED REAL NBA DB ---
// Includes Headshot URLs, Stats, and expanded roster for better math

const PLAYERS = [
  // TIER 1: MVPs ($5.00 - $6.00)
  { id: '203999', name: 'Nikola Jokic', team: 'DEN', cost: 6.0, avg: 62.0, type: 'BIG', badges: ['👑', '✌️'] },
  { id: '1629029', name: 'Luka Doncic', team: 'DAL', cost: 5.8, avg: 59.5, type: 'GUARD', badges: ['🔥', '👑'] },
  { id: '203507', name: 'Giannis Antetokounmpo', team: 'MIL', cost: 5.7, avg: 58.0, type: 'BIG', badges: ['✌️', '🔒'] },
  { id: '203954', name: 'Joel Embiid', team: 'PHI', cost: 5.9, avg: 60.5, type: 'BIG', badges: ['🔥'] },
  { id: '1628983', name: 'Shai Gilgeous-Alexander', team: 'OKC', cost: 5.5, avg: 56.0, type: 'GUARD', badges: ['✌️'] },
  { id: '1628369', name: 'Jayson Tatum', team: 'BOS', cost: 5.2, avg: 52.0, type: 'WING', badges: ['🔥'] },
  { id: '1641705', name: 'Victor Wembanyama', team: 'SAS', cost: 5.4, avg: 54.5, type: 'BIG', badges: ['🖐️', '🔒'] },
  
  // TIER 2: STARS ($4.00 - $4.90)
  { id: '2544', name: 'LeBron James', team: 'LAL', cost: 4.8, avg: 49.0, type: 'WING', badges: ['👑'] },
  { id: '1630162', name: 'Anthony Edwards', team: 'MIN', cost: 4.6, avg: 47.5, type: 'GUARD', badges: ['🔥'] },
  { id: '201142', name: 'Kevin Durant', team: 'PHX', cost: 4.7, avg: 48.0, type: 'WING', badges: [] },
  { id: '1626164', name: 'Devin Booker', team: 'PHX', cost: 4.4, avg: 45.0, type: 'GUARD', badges: ['🔥'] },
  { id: '1630169', name: 'Tyrese Haliburton', team: 'IND', cost: 4.5, avg: 46.5, type: 'GUARD', badges: ['✌️'] },
  { id: '201939', name: 'Stephen Curry', team: 'GSW', cost: 4.3, avg: 44.0, type: 'GUARD', badges: ['🔥'] },
  { id: '1629027', name: 'Trae Young', team: 'ATL', cost: 4.2, avg: 43.5, type: 'GUARD', badges: ['✌️'] },
  { id: '1627734', name: 'Domantas Sabonis', team: 'SAC', cost: 4.9, avg: 50.0, type: 'BIG', badges: ['👑'] },
  { id: '203076', name: 'Anthony Davis', team: 'LAL', cost: 4.8, avg: 49.5, type: 'BIG', badges: ['🔒', '✌️'] },
  { id: '1628368', name: 'DeAaron Fox', team: 'SAC', cost: 4.1, avg: 41.0, type: 'GUARD', badges: ['🔥'] },
  { id: '1628973', name: 'Jalen Brunson', team: 'NYK', cost: 4.0, avg: 40.5, type: 'GUARD', badges: [] },
  { id: '1629630', name: 'Ja Morant', team: 'MEM', cost: 4.3, avg: 45.0, type: 'GUARD', badges: ['🔥'] },
  
  // TIER 3: STARTERS ($3.00 - $3.90) - EXPANDED FOR MATH
  { id: '203081', name: 'Damian Lillard', team: 'MIL', cost: 3.7, avg: 39.0, type: 'GUARD', badges: ['🔥'] },
  { id: '1628389', name: 'Bam Adebayo', team: 'MIA', cost: 3.6, avg: 38.0, type: 'BIG', badges: ['🔒'] },
  { id: '1629627', name: 'Zion Williamson', team: 'NOP', cost: 3.5, avg: 37.0, type: 'BIG', badges: [] },
  { id: '202331', name: 'Paul George', team: 'PHI', cost: 3.5, avg: 37.5, type: 'WING', badges: ['🔒'] },
  { id: '202695', name: 'Kawhi Leonard', team: 'LAC', cost: 3.8, avg: 40.0, type: 'WING', badges: ['🔒'] },
  { id: '202681', name: 'Kyrie Irving', team: 'DAL', cost: 3.4, avg: 36.5, type: 'GUARD', badges: ['🔥'] },
  { id: '1630163', name: 'LaMelo Ball', team: 'CHA', cost: 3.6, avg: 38.5, type: 'GUARD', badges: ['👑'] },
  { id: '1631096', name: 'Chet Holmgren', team: 'OKC', cost: 3.3, avg: 35.0, type: 'BIG', badges: ['🔒'] },
  { id: '1630178', name: 'Tyrese Maxey', team: 'PHI', cost: 3.2, avg: 34.0, type: 'GUARD', badges: ['🔥'] },
  { id: '1627742', name: 'Brandon Ingram', team: 'NOP', cost: 3.1, avg: 33.0, type: 'WING', badges: [] },
  { id: '1628374', name: 'Lauri Markkanen', team: 'UTA', cost: 3.0, avg: 32.5, type: 'BIG', badges: [] },
  { id: '1630560', name: 'Cam Thomas', team: 'BKN', cost: 3.0, avg: 32.0, type: 'GUARD', badges: ['🔥'] },
  
  // TIER 4: ROTATION ($2.00 - $2.90) - CRITICAL FILLERS
  { id: '1631114', name: 'Jalen Williams', team: 'OKC', cost: 2.8, avg: 32.0, type: 'WING', badges: [] },
  { id: '1628969', name: 'Mikal Bridges', team: 'NYK', cost: 2.7, avg: 31.0, type: 'WING', badges: ['🔒'] },
  { id: '1626167', name: 'Myles Turner', team: 'IND', cost: 2.6, avg: 30.5, type: 'BIG', badges: ['🔒'] },
  { id: '1628401', name: 'Derrick White', team: 'BOS', cost: 2.5, avg: 29.0, type: 'GUARD', badges: ['🔒'] },
  { id: '203468', name: 'CJ McCollum', team: 'NOP', cost: 2.8, avg: 32.5, type: 'GUARD', badges: [] },
  { id: '203497', name: 'Rudy Gobert', team: 'MIN', cost: 2.9, avg: 33.0, type: 'BIG', badges: ['🔒', '✌️'] },
  { id: '201950', name: 'Jrue Holiday', team: 'BOS', cost: 2.6, avg: 30.0, type: 'GUARD', badges: ['🔒'] },
  { id: '1627750', name: 'Jamal Murray', team: 'DEN', cost: 2.9, avg: 33.5, type: 'GUARD', badges: ['🔥'] },
  { id: '1627832', name: 'Fred VanVleet', team: 'HOU', cost: 2.8, avg: 32.0, type: 'GUARD', badges: [] },
  { id: '202699', name: 'Tobias Harris', team: 'DET', cost: 2.4, avg: 28.0, type: 'WING', badges: [] },
  { id: '1629028', name: 'Deandre Ayton', team: 'POR', cost: 2.7, avg: 31.5, type: 'BIG', badges: ['✌️'] },
  { id: '1629636', name: 'Darius Garland', team: 'CLE', cost: 2.5, avg: 29.5, type: 'GUARD', badges: [] },
  
  // TIER 5: VALUE ($1.00 - $1.90)
  { id: '1630559', name: 'Austin Reaves', team: 'LAL', cost: 1.9, avg: 25.0, type: 'GUARD', badges: [] },
  { id: '1630581', name: 'Josh Giddey', team: 'CHI', cost: 1.8, avg: 24.5, type: 'GUARD', badges: ['✌️'] },
  { id: '1626156', name: 'DLo Russell', team: 'LAL', cost: 1.9, avg: 25.5, type: 'GUARD', badges: ['🔥'] },
  { id: '203114', name: 'Khris Middleton', team: 'MIL', cost: 1.8, avg: 24.0, type: 'WING', badges: [] },
  { id: '1630529', name: 'Herb Jones', team: 'NOP', cost: 1.6, avg: 22.0, type: 'WING', badges: ['🔒'] },
  { id: '1627936', name: 'Alex Caruso', team: 'OKC', cost: 1.5, avg: 20.0, type: 'GUARD', badges: ['🔒'] },
  { id: '1629675', name: 'Naz Reid', team: 'MIN', cost: 1.7, avg: 23.0, type: 'BIG', badges: [] },
  { id: '1628370', name: 'Malik Monk', team: 'SAC', cost: 1.8, avg: 24.0, type: 'GUARD', badges: ['🔥'] },
  { id: '1626171', name: 'Bobby Portis', team: 'MIL', cost: 1.6, avg: 22.5, type: 'BIG', badges: ['✌️'] },
  { id: '202691', name: 'Klay Thompson', team: 'DAL', cost: 1.7, avg: 23.5, type: 'WING', badges: [] },
  { id: '101108', name: 'Chris Paul', team: 'SAS', cost: 1.9, avg: 25.0, type: 'GUARD', badges: [] },
  { id: '1627741', name: 'Buddy Hield', team: 'GSW', cost: 1.5, avg: 21.0, type: 'WING', badges: ['🔥'] },

  // TIER 6: BARGAIN ($0.50 - $0.90)
  { id: '1630631', name: 'Jose Alvarado', team: 'NOP', cost: 0.9, avg: 15.0, type: 'GUARD', badges: ['🔒'] },
  { id: '1630202', name: 'Payton Pritchard', team: 'BOS', cost: 0.8, avg: 14.0, type: 'GUARD', badges: [] },
  { id: '1630573', name: 'Sam Hauser', team: 'BOS', cost: 0.7, avg: 12.0, type: 'WING', badges: [] },
  { id: '1629626', name: 'Bol Bol', team: 'PHX', cost: 0.9, avg: 16.0, type: 'BIG', badges: [] },
  { id: '203083', name: 'Andre Drummond', team: 'PHI', cost: 0.9, avg: 18.0, type: 'BIG', badges: ['✌️'] },
  { id: '1631128', name: 'Christian Braun', team: 'DEN', cost: 0.8, avg: 14.5, type: 'WING', badges: [] },
  { id: '1630167', name: 'Obi Toppin', team: 'IND', cost: 0.9, avg: 15.5, type: 'BIG', badges: [] },
  { id: '1628470', name: 'Torrey Craig', team: 'CHI', cost: 0.6, avg: 10.0, type: 'WING', badges: ['🔒'] },
  { id: '202687', name: 'Bismack Biyombo', team: 'OKC', cost: 0.5, avg: 9.0, type: 'BIG', badges: ['🔒'] },
  { id: '201599', name: 'DeAndre Jordan', team: 'DEN', cost: 0.5, avg: 8.5, type: 'BIG', badges: [] },
  { id: '203648', name: 'Thanasis A.', team: 'MIL', cost: 0.5, avg: 5.0, type: 'WING', badges: [] },
  { id: '1628436', name: 'Luke Kornet', team: 'BOS', cost: 0.6, avg: 11.0, type: 'BIG', badges: [] },
];

export const fetchDraftPool = (count, excludeNames = [], maxCost = 99) => {
  let pool = PLAYERS.filter(p => !excludeNames.includes(p.name) && p.cost <= maxCost);
  pool = pool.sort(() => Math.random() - 0.5);
  return pool.slice(0, count);
};

export const getPlayerGameLog = (player) => {
  const variance = (Math.random() * 0.6) + 0.7; 
  let remainingScore = player.avg * variance;
  
  // EXTENDED STATS: PTS, REB, AST, STL, BLK, TO
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

  // Calculate Exact FP (NBA Standardish: TO is -1)
  const exactScore = pts + (reb * 1.2) + (ast * 1.5) + (stl * 3) + (blk * 3) - (to * 1);
  const finalScore = Math.max(0, Math.round(exactScore * 10) / 10);

  let activeBadges = [];
  if (finalScore >= 45) activeBadges.push('🔥');
  if ((pts>=10 && reb>=10) || (pts>=10 && ast>=10) || (reb>=10 && ast>=10)) activeBadges.push('✌️');
  if (pts>=10 && reb>=10 && ast>=10) activeBadges.push('👑');
  if (stl + blk >= 4) activeBadges.push('🔒');

  return {
    score: finalScore,
    stats: { pts, reb, ast, stl, blk, to }, // RETURN ALL 6
    badges: activeBadges
  };
};

export const getAllPlayers = () => PLAYERS;