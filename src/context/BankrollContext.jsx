import React, { createContext, useContext, useState, useEffect } from 'react';

const BankrollContext = createContext();

export const BankrollProvider = ({ children }) => {
  // --- INITIAL STATE (Load from LocalStorage or Defaults) ---
  const [bankroll, setBankroll] = useState(() => {
    const saved = localStorage.getItem('replay_bankroll');
    return saved !== null ? parseFloat(saved) : 1000.00;
  });

  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('replay_xp');
    return saved !== null ? parseInt(saved) : 0;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('replay_history');
    return saved !== null ? JSON.parse(saved) : [];
  });

  const [claimedRewards, setClaimedRewards] = useState(() => {
    const saved = localStorage.getItem('replay_claimed_rewards');
    return saved !== null ? JSON.parse(saved) : [];
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('replay_bankroll', bankroll.toString());
  }, [bankroll]);

  useEffect(() => {
    localStorage.setItem('replay_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('replay_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('replay_claimed_rewards', JSON.stringify(claimedRewards));
  }, [claimedRewards]);

  // --- ACTIONS ---

  // 1. Update Bankroll (Used for Bets and Game Wins)
  const updateBankroll = (amount) => {
    setBankroll(prev => prev + amount);
  };

  // 2. Add Game to History (Used in Play.jsx to feed Profile.jsx)
  const addHistory = (gameResult) => {
    // gameResult should be { result: 'WIN'|'LOSS', score: 245.2, date: ISOString, topPlayer: 102 }
    setHistory(prev => [...prev, gameResult]);
    
    // Automatic XP Gain: 10 XP per game played, +20 for a win
    let xpGain = 10;
    if (gameResult.result === 'WIN') xpGain += 20;
    setXp(prev => prev + xpGain);
  };

  // 3. Claim Rewards (Used in Collect.jsx for Missions/Slots)
  const claimReward = (rewardId, amount, type = 'CASH') => {
    if (claimedRewards.includes(rewardId)) return;

    if (type === 'CASH') {
      setBankroll(prev => prev + amount);
    } else if (type === 'XP') {
      setXp(prev => prev + amount);
    }

    setClaimedRewards(prev => [...prev, rewardId]);
  };

  // 4. Reset Account (For Testing)
  const resetAccount = () => {
    setBankroll(1000.00);
    setXp(0);
    setHistory([]);
    setClaimedRewards([]);
  };

  return (
    <BankrollContext.Provider value={{ 
      bankroll, 
      updateBankroll, 
      xp, 
      setXp,
      history, 
      addHistory,
      claimedRewards,
      claimReward,
      resetAccount
    }}>
      {children}
    </BankrollContext.Provider>
  );
};

export const useBankroll = () => {
  const context = useContext(BankrollContext);
  if (!context) {
    throw new Error('useBankroll must be used within a BankrollProvider');
  }
  return context;
};