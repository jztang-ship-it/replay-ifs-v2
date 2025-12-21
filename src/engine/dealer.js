import { GAME_CONFIG } from '../utils/constants';

const PLAYERS_DB = [
  // TIER 5 ($5)
  { id: 'lbj', name: 'LeBron James', team: 'LAL', pos: 'SF', cost: 5, avg: 52.4, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png' },
  { id: 'giannis', name: 'Giannis Antetokounmpo', team: 'MIL', pos: 'PF', cost: 5, avg: 54.1, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png' },
  { id: 'luka', name: 'Luka Doncic', team: 'DAL', pos: 'PG', cost: 5, avg: 56.8, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png' },
  { id: 'jokic', name: 'Nikola Jokic', team: 'DEN', pos: 'C', cost: 5, avg: 58.2, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png' },
  { id: 'embiid', name: 'Joel Embiid', team: 'PHI', pos: 'C', cost: 5, avg: 53.0, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png' },

  // TIER 4 ($4)
  { id: 'tatum', name: 'Jayson Tatum', team: 'BOS', pos: 'SF', cost: 4, avg: 48.5, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png' },
  { id: 'curry', name: 'Stephen Curry', team: 'GSW', pos: 'PG', cost: 4, avg: 49.3, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png' },
  { id: 'ad', name: 'Anthony Davis', team: 'LAL', pos: 'C', cost: 4, avg: 46.5, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png' },
  { id: 'dame', name: 'Damian Lillard', team: 'MIL', pos: 'PG', cost: 4, avg: 42.1, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png' },
  { id: 'booker', name: 'Devin Booker', team: 'PHX', pos: 'SG', cost: 4, avg: 41.3, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1626164.png' },
  
  // TIER 3 ($3)
  { id: 'edwards', name: 'Anthony Edwards', team: 'MIN', pos: 'SG', cost: 3, avg: 41.5, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1630162.png' },
  { id: 'brunson', name: 'Jalen Brunson', team: 'NYK', pos: 'PG', cost: 3, avg: 39.5, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628973.png' },
  { id: 'wemby', name: 'Victor Wembanyama', team: 'SAS', pos: 'C', cost: 3, avg: 45.0, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1641705.png' },
  { id: 'chet', name: 'Chet Holmgren', team: 'OKC', pos: 'C', cost: 3, avg: 29.5, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1631096.png' },

  // TIER 2 ($2)
  { id: 'mpj', name: 'M. Porter Jr.', team: 'DEN', pos: 'SF', cost: 2, avg: 24.5, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629008.png' },
  { id: 'ag', name: 'Aaron Gordon', team: 'DEN', pos: 'PF', cost: 2, avg: 22.1, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203932.png' },
  { id: 'reaves', name: 'Austin Reaves', team: 'LAL', pos: 'SG', cost: 2, avg: 20.4, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1630559.png' },
  
  // TIER 1 ($1)
  { id: 'kcp', name: 'K. Caldwell-Pope', team: 'DEN', pos: 'SG', cost: 1, avg: 15.2, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203484.png' },
  { id: 'rui', name: 'Rui Hachimura', team: 'LAL', pos: 'PF', cost: 1, avg: 14.8, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629060.png' },
  { id: 'caruso', name: 'Alex Caruso', team: 'CHI', pos: 'SG', cost: 1, avg: 17.5, img: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1627936.png' },
];

export const getTierColor = (cost) => {
  if (cost === 5) return 'from-yellow-600 to-yellow-800'; 
  if (cost === 4) return 'from-purple-600 to-purple-800'; 
  if (cost === 3) return 'from-blue-600 to-blue-800';     
  return 'from-slate-600 to-slate-800';                  
};

export const dealExactBudgetHand = (handSize, targetBudget, excludeIds = []) => {
  let attempts = 0;
  const pool = PLAYERS_DB.filter(p => !excludeIds.includes(p.id));

  // Try for a perfect match first
  while (attempts < 1000) {
    attempts++;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const hand = shuffled.slice(0, handSize);
    const totalCost = hand.reduce((sum, p) => sum + p.cost, 0);

    // EXACT MATCH PREFERRED
    if (totalCost === targetBudget) {
      return hand;
    }
    
    // Fallback: If we can't find exact, allow being UNDER by $1, but NEVER over
    if (attempts > 800 && totalCost <= targetBudget && totalCost >= targetBudget - 1) {
       return hand;
    }
  }

  // Emergency Fallback: Just return cheapest available to ensure we don't crash or break budget
  return pool.sort((a,b) => a.cost - b.cost).slice(0, handSize);
};