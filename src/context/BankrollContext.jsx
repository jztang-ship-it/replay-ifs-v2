import React, { createContext, useContext, useState, useEffect } from 'react';

const BankrollContext = createContext();

export const useBankroll = () => useContext(BankrollContext);

export const BankrollProvider = ({ children }) => {
  // 1. Initialize from LocalStorage or Default $1000
  const [bankroll, setBankroll] = useState(() => {
    const saved = localStorage.getItem('ifs_bankroll');
    return saved ? parseInt(saved, 10) : 1000;
  });

  // 2. Save to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ifs_bankroll', bankroll);
  }, [bankroll]);

  // 3. The "Transaction" Function
  // Use this for EVERYTHING: Betting (-), Winning (+), Daily Rewards (+), VIP (+)
  const updateBankroll = (amount) => {
    setBankroll(prev => prev + amount);
  };

  return (
    <BankrollContext.Provider value={{ bankroll, updateBankroll }}>
      {children}
    </BankrollContext.Provider>
  );
};