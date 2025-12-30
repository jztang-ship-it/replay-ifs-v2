import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBankroll } from '../../context/BankrollContext';
import logo from '../../assets/logo.png'; 

export default function TopNav() {
  const { bankroll } = useBankroll();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-6 shadow-2xl z-[100]">
      
      {/* LEFT: LOGO */}
      <Link to="/" className="flex items-center gap-2 w-1/4 hover:opacity-80 transition-opacity cursor-pointer relative z-[101]">
        <img src={logo} alt="REPLAY" className="h-14 w-14 md:h-16 md:w-16 object-contain -ml-2" />
      </Link>

      {/* CENTER: TABS (Z-INDEX 102 ensures it sits ON TOP of any overlap) */}
      <div className="flex justify-center w-2/4 relative z-[102]">
        <div className="flex items-center bg-slate-900/80 rounded-full p-1 border border-white/10 pointer-events-auto shadow-lg">
            <Link to="/play" className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-widest transition-all ${isActive('/play') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>PLAY</Link>
            <Link to="/pulse" className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-widest transition-all ${isActive('/pulse') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>PULSE</Link>
            <Link to="/collect" className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-widest transition-all ${isActive('/collect') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>COLLECT</Link>
        </div>
      </div>

      {/* RIGHT: BALANCE & PROFILE */}
      <div className="flex items-center justify-end gap-3 w-1/4 relative z-[101]">
        <div className="relative inline-block">
            <Link to="/profile" className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center relative hover:border-white/20 transition-all z-10 block cursor-pointer">
                <span className="text-xl">👤</span>
            </Link>
            
            {/* ANKLE BALANCE */}
            <div className="absolute -bottom-2 -right-4 bg-slate-900 border border-slate-700 rounded-full px-2 py-0.5 flex items-center shadow-lg z-20 pointer-events-none">
                <span className="text-[8px] text-green-400 font-black mr-1">$</span>
                <span className="text-[10px] font-mono font-black text-white">{bankroll.toLocaleString()}</span>
            </div>
        </div>
      </div>
    </div>
  );
}