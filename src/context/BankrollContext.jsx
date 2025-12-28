import React, { createContext, useContext, useState, useEffect } from 'react';

const BankrollContext = createContext();

export const useBankroll = () => useContext(BankrollContext);

export const BankrollProvider = ({ children }) => {
  // Load from localStorage or default to initial values
  const [bankroll, setBankroll] = useState(() => {
    const saved = localStorage.getItem('replay_bankroll');
    return saved ? parseInt(saved, 10) : 1000;
  });

  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('replay_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('replay_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [claimedRewards, setClaimedRewards] = useState(() => {
    const saved = localStorage.getItem('replay_claimed_rewards');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => { localStorage.setItem('replay_bankroll', bankroll); }, [bankroll]);
  useEffect(() => { localStorage.setItem('replay_xp', xp); }, [xp]);
  useEffect(() => { localStorage.setItem('replay_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('replay_claimed_rewards', JSON.stringify(claimedRewards)); }, [claimedRewards]);

  // Actions
  const updateBankroll = (amount) => {
    setBankroll(prev => prev + amount);
  };

  // UPDATED RECORD GAME: Now saves Score details for missions
  const recordGame = (isWin, badgeCount, totalScore, topPlayerScore) => {
    const newGame = {
      id: Date.now(),
      result: isWin ? 'WIN' : 'LOSS',
      badges: badgeCount,
      score: totalScore || 0, // Save Team FP
      topPlayer: topPlayerScore || 0, // Save best player FP
      timestamp: new Date().toISOString()
    };
    
    // Add to history
    setHistory(prev => [newGame, ...prev].slice(0, 50)); // Keep last 50 games
    
    // Award XP
    let xpGained = 10; // Base XP for playing
    if (isWin) xpGained += 50;
    if (badgeCount > 0) xpGained += (badgeCount * 20);
    setXp(prev => prev + xpGained);
  };

  const claimReward = (taskId, rewardAmount, type) => {
    if (claimedRewards.includes(taskId)) return;

    setClaimedRewards(prev => [...prev, taskId]);
    updateBankroll(rewardAmount);
    setXp(prev => prev + 10);
  };

  const value = {
    bankroll,
    updateBankroll,
    xp,
    history,
    recordGame,
    claimedRewards,
    claimReward 
  };

  return (
    <BankrollContext.Provider value={value}>
      {children}
    </BankrollContext.Provider>
  );
};