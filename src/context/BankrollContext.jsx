import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
const BankrollContext = createContext();

// 2. Create the Provider
export function BankrollProvider({ children }) {
  // Load from localStorage or default to $1000.00
  const [bankroll, setBankroll] = useState(() => {
    const saved = localStorage.getItem('nba_bankroll');
    return saved ? parseFloat(saved) : 1000.00;
  });

  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('nba_xp');
    return saved ? parseInt(saved) : 0;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('nba_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [claimedRewards, setClaimedRewards] = useState(() => {
    const saved = localStorage.getItem('nba_claimed');
    return saved ? JSON.parse(saved) : [];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('nba_bankroll', bankroll.toFixed(2));
    localStorage.setItem('nba_xp', xp.toString());
    localStorage.setItem('nba_history', JSON.stringify(history));
    localStorage.setItem('nba_claimed', JSON.stringify(claimedRewards));
  }, [bankroll, xp, history, claimedRewards]);

  // Actions
  const updateBankroll = (amount) => {
    setBankroll(prev => Math.max(0, prev + amount));
  };

  const claimReward = (id, amount, type) => {
    if (claimedRewards.includes(id)) return;
    updateBankroll(amount);
    setClaimedRewards(prev => [...prev, id]);
  };

  const recordGame = (win, badgeCount, totalScore, topPlayerScore) => {
    const newEntry = {
      date: new Date().toISOString(),
      result: win ? 'WIN' : 'LOSS',
      score: totalScore,
      topPlayer: topPlayerScore,
      badges: badgeCount
    };
    setHistory(prev => [newEntry, ...prev]);
    
    // XP Calculation: Base 10 + 10 per badge + 50 for win
    let xpGain = 10 + (badgeCount * 10) + (win ? 50 : 0);
    setXp(prev => prev + xpGain);
  };

  return (
    <BankrollContext.Provider value={{ 
      bankroll, 
      xp, 
      history, 
      updateBankroll, 
      recordGame,
      claimReward,
      claimedRewards
    }}>
      {children}
    </BankrollContext.Provider>
  );
}

// 3. Create the Hook
export function useBankroll() {
  const context = useContext(BankrollContext);
  if (context === undefined) {
    throw new Error('useBankroll must be used within a BankrollProvider');
  }
  return context;
}