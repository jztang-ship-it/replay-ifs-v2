import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBankroll } from '../../context/BankrollContext';
import BankrollDisplay from '../game/BankrollDisplay';

export default function TopNav() {
  const { bankroll } = useBankroll();
  const location = useLocation();

  // 1. Updated Tab List (Centering handled by CSS below)
  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'PLAY', path: '/play' },
    { name: 'PULSE', path: '/pulse' },
    { name: 'COLLECT', path: '/collect' }
  ];

  return (
    <nav className="shrink-0 h-16 bg-slate-950 border-b border-white/10 flex items-center justify-between px-4 relative z-50">
      
      {/* LEFT: LOGO (Big & Clickable) */}
      <div className="flex items-center">
        <Link to="/" className="hover:opacity-80 transition-opacity">
           <img src="/assets/Beta-logo.png" alt="NBA Replay Beta" className="h-12 w-auto object-contain" />
        </Link>
      </div>

      {/* CENTER: NAVIGATION TABS (Absolutely Centered) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-1.5 rounded text-[10px] font-black tracking-[0.2em] transition-all border ${
                isActive 
                  ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]' 
                  : 'text-slate-500 border-transparent hover:text-white hover:border-white/20'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* RIGHT: VIP, BANKROLL, PROFILE */}
      <div className="flex items-center gap-3">
        {/* VIP Placeholder */}
        <div className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-purple-900 to-slate-900 px-2 py-1 rounded-full border border-purple-500/50">
             <span className="text-[8px] text-purple-300 font-black uppercase">VIP</span>
             <span className="text-xs text-white font-bold leading-none">1</span>
        </div>

        {/* Bankroll */}
        <BankrollDisplay amount={bankroll} />

        {/* Profile Icon Placeholder */}
        <button className="w-9 h-9 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center text-xl hover:bg-slate-700 transition-colors relative overflow-hidden group">
             <span className="group-hover:scale-110 transition-transform">👤</span>
        </button>
      </div>
    </nav>
  );
}