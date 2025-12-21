import React, { useState, useEffect } from 'react';
import { calculateVipStatus } from '../utils/storage';

// Temporary Mock Leaderboard
const MOCK_LEADERBOARD = [
  { user: 'CryptoKing', win: 5000, game: 'Legendary' },
  { user: 'Baller_99', win: 1200, game: 'All-Star' },
  { user: 'HoopsFan', win: 850, game: 'A Star Is Born' },
];

export default function Home({ user, onNavigate }) {
  const vip = calculateVipStatus(user.vipPoints);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Auto-scroll ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % MOCK_LEADERBOARD.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentWinner = MOCK_LEADERBOARD[tickerIndex];

  return (
    <div className="flex flex-col h-screen bg-slate-950 font-sans overflow-hidden text-white">
      
      {/* HEADER */}
      <div className="relative h-1/3 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center border-b border-slate-800 p-6">
        <div className="w-20 h-20 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center text-4xl shadow-xl mb-3 relative">
          {user.avatar} 
          <div className="absolute -bottom-2 -right-2 bg-slate-900 text-xs px-2 py-0.5 rounded-full border border-slate-700 font-bold">
            Lvl {Math.floor(user.vipPoints / 100) + 1}
          </div>
        </div>
        
        <h2 className="text-xl font-black italic tracking-tight">{user.username}</h2>
        <div className={`text-xs font-bold tracking-widest ${vip.color} flex items-center gap-1 mb-4`}>
          {vip.icon} {vip.label} MEMBER
        </div>

        <div className="bg-slate-900/80 px-8 py-3 rounded-2xl border border-white/5 shadow-2xl flex flex-col items-center">
          <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">Total Balance</span>
          <span className="text-3xl font-mono font-black tracking-tight">${user.bankroll.toLocaleString()}</span>
        </div>
      </div>

      {/* TICKER */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden relative">
        <div className="absolute left-4 text-[10px] text-green-500 font-bold animate-pulse">● LIVE</div>
        <div key={tickerIndex} className="animate-in slide-in-from-bottom duration-500 flex items-center gap-2 text-xs">
          <span className="text-slate-400">{currentWinner.user} just won</span>
          <span className="text-green-400 font-bold">${currentWinner.win}</span>
        </div>
      </div>

      {/* NAV BUTTONS */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-3 overflow-y-auto pb-20">
        <button 
          onClick={() => onNavigate('PLAY')}
          className="col-span-2 h-32 bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl border border-blue-500/30 shadow-lg relative overflow-hidden group active:scale-95 transition-all"
        >
          <div className="absolute top-0 right-0 p-3 opacity-20 text-6xl">🃏</div>
          <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-start">
            <span className="text-blue-400 text-xs font-bold tracking-widest mb-1">MAIN EVENT</span>
            <span className="text-white text-2xl font-black italic">PLAY NOW</span>
          </div>
        </button>
      </div>
    </div>
  );
}