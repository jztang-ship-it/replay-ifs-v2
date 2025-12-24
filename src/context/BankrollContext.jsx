import React, { createContext, useContext, useState, useEffect } from 'react';

const BankrollContext = createContext();

// --- VIP CONFIGURATION ---
// Added "icon" for visual badging throughout the app
export const VIP_TIERS = [
  { lvl: 0, name: "Spectator", min: 0, color: "text-gray-500", icon: "👁️", perk: "Read Only" },
  { lvl: 1, name: "Prospect", min: 0, color: "text-gray-300", icon: "🧢", perk: "Save Progress" },
  { lvl: 2, name: "Bench Warmer", min: 500, color: "text-gray-300", icon: "🎽", perk: "1x Redraw" },
  { lvl: 3, name: "Rotation", min: 1500, color: "text-blue-300", icon: "🏀", perk: "Unlmtd Chat" },
  { lvl: 4, name: "Sixth Man", min: 5000, color: "text-blue-400", icon: "⚡", perk: "3x Redraws" },
  { lvl: 5, name: "Starter", min: 15000, color: "text-blue-500", icon: "⭐", perk: "Create Threads" },
  { lvl: 6, name: "All-Star", min: 50000, color: "text-yellow-300", icon: "🔥", perk: "1% Rebate" },
  { lvl: 7, name: "Superstar", min: 150000, color: "text-yellow-400", icon: "💎", perk: "3% Rebate" },
  { lvl: 8, name: "Franchise", min: 500000, color: "text-purple-400", icon: "👑", perk: "5% Rebate" },
  { lvl: 9, name: "Champion", min: 1500000, color: "text-purple-500", icon: "💍", perk: "7% Rebate" },
  { lvl: 10, name: "Hall of Fame", min: 5000000, color: "text-red-500", icon: "🐐", perk: "10% Rebate" }
];

export function BankrollProvider({ children }) {
  // 1. IDENTITY & WALLET
  const [isGuest, setIsGuest] = useState(() => !localStorage.getItem('replay_user'));
  
  const [bankroll, setBankroll] = useState(() => {
    if (!localStorage.getItem('replay_user')) return 1000;
    return parseFloat(localStorage.getItem('replay_bankroll')) || 1000;
  });

  const [xp, setXp] = useState(() => {
    if (!localStorage.getItem('replay_user')) return 0;
    return parseInt(localStorage.getItem('replay_xp')) || 0;
  });

  const [vipLevel, setVipLevel] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(null);

  // 2. DAILY ACTIVITY TRACKER (Resets daily in a real app)
  const [dailyStats, setDailyStats] = useState({
    loginClaimed: false,
    posts: 0,
    handsPlayed: 0,
    handsWon: 0,
    redrawsUsed: 0,
    badgesEarned: 0
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    if (!isGuest) {
      localStorage.setItem('replay_bankroll', bankroll);
      localStorage.setItem('replay_xp', xp);
    }
  }, [bankroll, xp, isGuest]);

  // --- VIP CALCULATOR ---
  useEffect(() => {
    if (isGuest) { setVipLevel(0); return; }
    
    let calcLevel = 1; 
    for (let i = 2; i < VIP_TIERS.length; i++) {
        if (xp >= VIP_TIERS[i].min) calcLevel = i;
        else break;
    }

    if (calcLevel > vipLevel && vipLevel !== 0) setShowLevelUp(calcLevel);
    setVipLevel(calcLevel);
  }, [xp, isGuest]);

  // --- ACTIONS ---
  const registerUser = () => {
    setIsGuest(false);
    localStorage.setItem('replay_user', 'true');
    setVipLevel(1);
    alert("Welcome to the League!");
  };

  const updateBankroll = (amount) => setBankroll(prev => Math.max(0, prev + amount));
  const addXp = (amount) => { if (!isGuest) setXp(prev => prev + amount); };

  // --- GAMEPLAY REPORTING ---
  // Called by Game Engine to report results
  const recordGame = (isWin, badgeCount = 0) => {
    setDailyStats(prev => ({
      ...prev,
      handsPlayed: prev.handsPlayed + 1,
      handsWon: isWin ? prev.handsWon + 1 : prev.handsWon,
      badgesEarned: prev.badgesEarned + badgeCount
    }));
    // XP Formula: 10 XP per game, +5 XP for winning
    addXp(10 + (isWin ? 5 : 0));
  };

  const recordPost = () => {
    setDailyStats(prev => ({ ...prev, posts: prev.posts + 1 }));
    addXp(5); // 5 XP per post
  };

  const recordRedraw = () => {
    setDailyStats(prev => ({ ...prev, redraws: prev.redraws + 1 }));
  };

  const claimDailyLogin = () => {
    if (dailyStats.loginClaimed) return;
    updateBankroll(100);
    addXp(100);
    setDailyStats(prev => ({ ...prev, loginClaimed: true }));
  };

  return (
    <BankrollContext.Provider value={{ 
      bankroll, updateBankroll, 
      xp, addXp, 
      vipLevel, showLevelUp, setShowLevelUp, 
      isGuest, registerUser,
      dailyStats, claimDailyLogin,
      recordGame, recordPost, recordRedraw
    }}>
      {children}
    </BankrollContext.Provider>
  );
}

export function useBankroll() {
  return useContext(BankrollContext);
}