import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBankroll } from '../../context/BankrollContext';

export default function TopNav() {
  const { bankroll } = useBankroll();
  const location = useLocation();
  
  // Navigation Tabs (Renamed Market -> Stats)
  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'PLAY', path: '/play' },
    { label: 'PULSE', path: '/pulse' },
    { label: 'COLLECT', path: '/collect' },
    { label: 'STATS', path: '/stats' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center pointer-events-none">
      
      {/* LEFT: Clickable Universal Logo */}
      <div className="pointer-events-auto hover:opacity-80 transition-opacity">
        <Link to="/" className="flex items-center gap-3">
          {/* Dog Logo */}
          <img src="/assets/Beta-logo.png" alt="Replay Logo" className="w-12 h-12 object-contain" />
          
          {/* Text: REPLAY / SPORTS - SOCIAL */}
          <div className="flex flex-col justify-center">
            <span className="text-white font-black text-xl leading-none tracking-tighter">REPLAY</span>
            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">SPORTS • SOCIAL</span>
          </div>
        </Link>
      </div>

      {/* CENTER: Navigation Tabs */}
      {/* Hidden on mobile (md:flex), visible on desktop */}
      <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-2 py-2 rounded-full border border-white/10 hidden md:flex gap-1 shadow-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label} 
              to={item.path}
              className={`px-6 py-2 rounded-full text-xs font-black tracking-widest transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* RIGHT: Bankroll Display */}
      {/* We keep this here for consistency, even if Play page has its own footer HUD */}
      <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 flex items-center gap-4 shadow-xl">
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-slate-400 font-bold tracking-widest">BALANCE</span>
          <span className={`font-mono font-black text-sm ${bankroll < 100 ? 'text-red-400' : 'text-green-400'}`}>
            ${bankroll.toLocaleString()}
          </span>
        </div>
        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-xs border border-white/5">
          👤
        </div>
      </div>

    </div>
  );
}