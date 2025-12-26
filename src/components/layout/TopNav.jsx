import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBankroll } from '../../context/BankrollContext';

export default function TopNav() {
  const location = useLocation();
  const { bankroll, xp } = useBankroll();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 w-full h-16 z-[9999] bg-slate-950/90 backdrop-blur-md border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between relative">
        
        {/* LEFT: LOGO (Home Link) - Explicit Z-Index */}
        <Link to="/" className="flex items-center gap-2 group z-50 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center text-lg shadow-lg group-hover:scale-105 transition-transform">
            🐶
          </div>
          <span className="text-lg font-black italic tracking-tighter text-white hidden sm:block">
            REPLAY
          </span>
        </Link>

        {/* CENTER: NAVIGATION PILL */}
        {/* CRITICAL FIX: pointer-events-none ensures this wrapper NEVER blocks clicks */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full flex justify-center pointer-events-none">
          {/* pointer-events-auto restores clicking ONLY for the buttons */}
          <nav className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 backdrop-blur-sm shadow-inner pointer-events-auto">
            
            <Link to="/play" className={`px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all ${isActive('/play') ? 'bg-slate-800 text-white shadow-lg border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}>
              <span className="text-sm">🎮</span>
              <span className="text-[10px] font-black uppercase tracking-wider hidden sm:block">Play</span>
            </Link>

            <Link to="/pulse" className={`px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all ${isActive('/pulse') ? 'bg-slate-800 text-white shadow-lg border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}>
              <span className="text-sm">⚡</span>
              <span className="text-[10px] font-black uppercase tracking-wider hidden sm:block">Pulse</span>
            </Link>

            <Link to="/collect" className={`px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all ${isActive('/collect') ? 'bg-slate-800 text-white shadow-lg border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}>
              <span className="text-sm">💎</span>
              <span className="text-[10px] font-black uppercase tracking-wider hidden sm:block">Collect</span>
            </Link>

            <Link to="/sync" className={`px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all ${isActive('/sync') ? 'bg-slate-800 text-white shadow-lg border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}>
              <span className="text-sm">🔗</span>
              <span className="text-[10px] font-black uppercase tracking-wider hidden sm:block">Sync</span>
            </Link>

          </nav>
        </div>

        {/* RIGHT: BANKROLL & XP */}
        <div className="flex items-center gap-3 z-50">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">BANKROLL</span>
            <span className="text-sm font-mono font-bold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
              ${bankroll.toLocaleString()}
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-lg border border-white/10 relative group cursor-default">
            {Math.floor(xp / 1000) + 1}
            <div className="absolute top-10 right-0 bg-black/90 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 pointer-events-none">
              {xp.toLocaleString()} XP
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}