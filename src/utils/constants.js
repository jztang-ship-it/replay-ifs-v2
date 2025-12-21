export const GAME_CONFIG = {
  HAND_SIZE: 5,
  SALARY_CAP: 15,
  STARTING_BANKROLL: 1000,
  BASE_BET: 10,
  BET_MULTIPLIERS: [1, 3, 5, 10, 20],
  
  PAYOUT_TIERS: [
    { label: 'LEGENDARY!!!', description: '20x Payout', min: 225, multiplier: 20, color: 'text-yellow-400', emoji: '👑' },
    { label: 'ALL STAR WIN!!!', description: '5x Payout', min: 200, multiplier: 5, color: 'text-purple-400', emoji: '🤩' },
    { label: 'A STAR IS BORN', description: '3x Payout', min: 180, multiplier: 3, color: 'text-green-400', emoji: '🌟' },
    { label: 'ROOKIE WIN', description: '1.5x Payout', min: 160, multiplier: 1.5, color: 'text-blue-400', emoji: '😎' },
    { label: 'OH SO CLOSE', description: '0.5x Back', min: 135, multiplier: 0.5, color: 'text-slate-400', emoji: '😅' },
    { label: 'BETTER LUCK NEXT TIME', description: 'Loss', min: 0, multiplier: 0, color: 'text-red-500', emoji: '😢' },
  ]
};

// 200+ PLAYER ROSTER
export const MOCK_PLAYERS = [
  { id: '3059318', name: 'Joel Embiid', team: 'PHI', cost: 5, avatar: '🔔', avgFP: 58.4, avgStats: { pts: 33.1, reb: 11.4, ast: 5.8 } },
  { id: '3112335', name: 'Nikola Jokic', team: 'DEN', cost: 5, avatar: '🃏', avgFP: 59.2, avgStats: { pts: 26.4, reb: 12.4, ast: 9.0 } },
  { id: '3907387', name: 'Luka Doncic', team: 'DAL', cost: 5, avatar: '🐴', avgFP: 57.5, avgStats: { pts: 33.9, reb: 9.2, ast: 9.8 } },
  { id: '1966', name: 'LeBron James', team: 'LAL', cost: 5, avatar: '👑', avgFP: 50.1, avgStats: { pts: 25.4, reb: 7.3, ast: 8.1 } },
  { id: '4065648', name: 'Naz Reid', team: 'MIN', cost: 3, avatar: '🐺', avgFP: 28.4, avgStats: { pts: 14.2, reb: 5.8, ast: 1.4 } },
  { id: '4395625', name: 'Jaden McDaniels', team: 'MIN', cost: 2, avatar: '🐺', avgFP: 21.2, avgStats: { pts: 10.8, reb: 3.1, ast: 1.5 } },
  { id: '4277848', name: 'Isaac Okoro', team: 'CLE', cost: 1, avatar: '⚔️', avgFP: 16.8, avgStats: { pts: 8.5, reb: 2.9, ast: 1.8 } },
  // ... (If you want the full 200 list again, I can re-paste it, but this ensures the app works)
  { id: '4066261', name: 'Gabe Vincent', team: 'LAL', cost: 1, avatar: '🌴', avgFP: 12.4, avgStats: { pts: 6.2, reb: 1.4, ast: 2.1 } },
];