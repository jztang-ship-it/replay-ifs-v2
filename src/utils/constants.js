export const GAME_CONFIG = {
  HAND_SIZE: 5,
  SALARY_CAP: 15, // UPDATED: Hard Cap at $15
  BASE_BET: 10,
  BET_MULTIPLIERS: [1, 3, 5, 10, 20],
  
  PAYOUT_TIERS: [
    { min: 250, multiplier: 10, label: 'JACKPOT', color: 'text-yellow-400', emoji: '👑' },
    { min: 200, multiplier: 5, label: 'MEGA WIN', color: 'text-purple-400', emoji: '🔥' },
    { min: 150, multiplier: 2, label: 'BIG WIN', color: 'text-blue-400', emoji: '🚀' },
    { min: 120, multiplier: 1.5, label: 'WIN', color: 'text-green-400', emoji: '✅' },
    { min: 100, multiplier: 1, label: 'PUSH', color: 'text-white', emoji: '😐' },
  ]
};