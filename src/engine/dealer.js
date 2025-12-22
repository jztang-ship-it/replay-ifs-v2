// REAL PLAYER POOL with IDs for Headshots
const PLAYER_POOL = [
  // STARS ($4.5 - $6.5)
  { name: 'Nikola Jokic', team: 'DEN', id: '203999', baseAvg: 58, pos: 'C' },
  { name: 'Luka Doncic', team: 'DAL', id: '1629029', baseAvg: 56, pos: 'PG' },
  { name: 'Joel Embiid', team: 'PHI', id: '203954', baseAvg: 57, pos: 'C' },
  { name: 'Giannis Antetokounmpo', team: 'MIL', id: '203507', baseAvg: 55, pos: 'PF' },
  { name: 'S. Gilgeous-Alexander', team: 'OKC', id: '1628983', baseAvg: 52, pos: 'SG' },
  { name: 'Jayson Tatum', team: 'BOS', id: '1628369', baseAvg: 48, pos: 'SF' },
  { name: 'LeBron James', team: 'LAL', id: '2544', baseAvg: 49, pos: 'SF' },
  { name: 'Stephen Curry', team: 'GSW', id: '201939', baseAvg: 47, pos: 'PG' },
  { name: 'Anthony Davis', team: 'LAL', id: '203076', baseAvg: 50, pos: 'C' },
  { name: 'Kevin Durant', team: 'PHX', id: '201142', baseAvg: 48, pos: 'PF' },

  // STARTERS ($2.5 - $4.4)
  { name: 'Jalen Brunson', team: 'NYK', id: '1628973', baseAvg: 42, pos: 'PG' },
  { name: 'Tyrese Maxey', team: 'PHI', id: '1630178', baseAvg: 38, pos: 'SG' },
  { name: 'Bam Adebayo', team: 'MIA', id: '1628389', baseAvg: 39, pos: 'C' },
  { name: 'Jaylen Brown', team: 'BOS', id: '1627759', baseAvg: 36, pos: 'SG' },
  { name: 'Jamal Murray', team: 'DEN', id: '1627750', baseAvg: 35, pos: 'PG' },
  { name: 'Paolo Banchero', team: 'ORL', id: '1631094', baseAvg: 37, pos: 'PF' },
  { name: 'Chet Holmgren', team: 'OKC', id: '1631096', baseAvg: 34, pos: 'C' },
  { name: 'Mikal Bridges', team: 'BKN', id: '1628969', baseAvg: 32, pos: 'SF' },

  // ROLE PLAYERS / SLEEPERS ($0.8 - $2.4)
  { name: 'Austin Reaves', team: 'LAL', id: '1630559', baseAvg: 26, pos: 'SG' },
  { name: 'Aaron Gordon', team: 'DEN', id: '203932', baseAvg: 27, pos: 'PF' },
  { name: 'Josh Hart', team: 'NYK', id: '1628404', baseAvg: 24, pos: 'SF' },
  { name: 'Derrick White', team: 'BOS', id: '1628401', baseAvg: 28, pos: 'PG' },
  { name: 'Alex Caruso', team: 'CHI', id: '1627936', baseAvg: 22, pos: 'SG' },
  { name: 'Jaime Jaquez Jr.', team: 'MIA', id: '1631170', baseAvg: 21, pos: 'SF' },
  { name: 'Dereck Lively II', team: 'DAL', id: '1641726', baseAvg: 19, pos: 'C' },
  { name: 'Brandin Podziemski', team: 'GSW', id: '1641764', baseAvg: 18, pos: 'SG' },
  { name: 'Rui Hachimura', team: 'LAL', id: '1629060', baseAvg: 17, pos: 'PF' },
  { name: 'Al Horford', team: 'BOS', id: '201143', baseAvg: 19, pos: 'C' },
  { name: 'P.J. Washington', team: 'DAL', id: '1629023', baseAvg: 20, pos: 'PF' },
  { name: 'Malik Monk', team: 'SAC', id: '1628370', baseAvg: 23, pos: 'SG' },
  { name: 'Naz Reid', team: 'MIN', id: '1629675', baseAvg: 21, pos: 'C' }
];

export const generateMockPlayer = (forcedPos = null, excludeIds = []) => {
  let available = PLAYER_POOL.filter(p => !excludeIds.includes(p.id));
  let template = available[Math.floor(Math.random() * available.length)];
  if (!template) template = PLAYER_POOL[0];

  const variance = (Math.random() * 6) - 3; 
  const calculatedCost = (template.baseAvg + variance) / 9.5; 
  const cost = Math.max(0.8, Math.min(6.5, Math.round(calculatedCost * 10) / 10));

  return {
    id: template.id,
    instanceId: `${template.id}-${Date.now()}-${Math.random()}`,
    name: template.name,
    pos: forcedPos || template.pos,
    team: template.team,
    cost: cost, 
    avg: template.baseAvg,
    img: `https://cdn.nba.com/headshots/nba/latest/1040x760/${template.id}.png`
  };
};

export const dealExactBudgetHand = (count, maxBudget, excludeIds = []) => {
  const hand = [];
  const usedIds = [...excludeIds];
  const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
  let currentBudget = 0;

  for (let i = 0; i < count; i++) {
    let player;
    let attempts = 0;
    while (attempts < 100) {
      const pos = positions[i % 5];
      player = generateMockPlayer(pos, usedIds);
      const newTotal = currentBudget + player.cost;
      const remainingSlots = count - 1 - i;
      const minFutureCost = remainingSlots * 0.8;
      if (newTotal + minFutureCost <= maxBudget + 0.5) break; 
      attempts++;
    }
    hand.push(player);
    usedIds.push(player.id);
    currentBudget += player.cost;
  }
  return hand;
};

export const getTeamTheme = (team) => {
  const themes = {
    'LAL': { bg: 'from-purple-900 to-yellow-900', accent: 'text-yellow-400', border: 'border-purple-500' },
    'GSW': { bg: 'from-blue-900 to-yellow-900', accent: 'text-yellow-300', border: 'border-blue-500' },
    'BOS': { bg: 'from-green-900 to-slate-900', accent: 'text-green-400', border: 'border-green-600' },
    'MIA': { bg: 'from-red-950 to-orange-900', accent: 'text-red-500', border: 'border-red-600' },
    'PHI': { bg: 'from-blue-900 to-red-900', accent: 'text-blue-300', border: 'border-blue-600' },
    'DEN': { bg: 'from-slate-900 to-yellow-900', accent: 'text-yellow-500', border: 'border-yellow-600' },
    'NYK': { bg: 'from-orange-900 to-blue-900', accent: 'text-orange-400', border: 'border-orange-500' },
    'DAL': { bg: 'from-blue-950 to-slate-900', accent: 'text-blue-400', border: 'border-blue-500' },
    'MIL': { bg: 'from-green-900 to-neutral-800', accent: 'text-green-200', border: 'border-green-500' },
    'PHX': { bg: 'from-orange-900 to-purple-900', accent: 'text-orange-400', border: 'border-orange-500' },
  };
  return themes[team] || { bg: 'from-slate-800 to-slate-950', accent: 'text-white', border: 'border-slate-600' };
};

// NEW: Strict Text Color Rules
export const getCostTextColor = (cost) => {
    if (cost >= 5.0) return 'text-orange-400 drop-shadow-[0_2px_rgba(0,0,0,0.8)]'; // $5+ Orange
    if (cost >= 4.0) return 'text-purple-400 drop-shadow-[0_2px_rgba(0,0,0,0.8)]'; // $4 Purple
    if (cost >= 3.0) return 'text-blue-400 drop-shadow-[0_2px_rgba(0,0,0,0.8)]';   // $3 Blue
    if (cost >= 2.0) return 'text-green-400 drop-shadow-[0_2px_rgba(0,0,0,0.8)]';  // $2 Green
    return 'text-white drop-shadow-[0_2px_rgba(0,0,0,0.8)]';                        // $1 White
};