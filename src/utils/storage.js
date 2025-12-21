// UPDATED TO V2 TO FORCE A RESET
const STORAGE_KEY = 'IFS_USER_DATA_V2';

const DEFAULT_USER = {
  username: 'John Tang',
  vipLevel: 'BRONZE',
  vipPoints: 0,
  bankroll: 1000,
  gamesPlayed: 0,
  biggestWin: 0,
  avatar: '🐶', // Beta is here!
};

export const loadUserData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_USER, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load save data', e);
  }
  return DEFAULT_USER;
};

export const saveUserData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
};

export const calculateVipStatus = (points) => {
  if (points >= 10000) return { label: 'DIAMOND', color: 'text-cyan-400', icon: '💎' };
  if (points >= 5000) return { label: 'PLATINUM', color: 'text-slate-300', icon: '💿' };
  if (points >= 1000) return { label: 'GOLD', color: 'text-yellow-400', icon: '👑' };
  return { label: 'BRONZE', color: 'text-orange-400', icon: '🥉' };
};