const STORAGE_KEY = 'IFS_USER_DATA_V2';

// FIX: Default is now null (Guest), not a specific person
const DEFAULT_USER = null;

export const loadUserData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load save data', e);
  }
  return DEFAULT_USER; // This will now return null if storage is empty
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