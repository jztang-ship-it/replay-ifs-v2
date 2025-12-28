import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBankroll } from '../../context/BankrollContext';

// Simple Profile Icon SVG component
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 text-slate-300 hover:text-white transition-colors">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1 .437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.602-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
);

export default function TopNav() {
  const location = useLocation();
  // Get live balance. If context is missing, default to 0 to prevent crash.
  const { bankroll } = useBankroll() || { bankroll: 0 }; 

  const isActive = (path) => location.pathname === path ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white';

  return (
    // Increased header height slightly to accommodate bigger logo
    <header className="shrink-0 h-16 md:h-20 bg-slate-950 border-b border-slate-900 flex items-center justify-between px-4 relative z-50">
      
      {/* 1. CLICKABLE, BIGGER LOGO Area */}
      <div className="flex-1 flex justify-start">
        <Link to="/" className="flex items-center">
            {/* Sized up the image container. 'object-contain' ensures the whole dog shows. */}
            <div className="h-12 w-12 md:h-16 md:w-16 relative">
                <img 
                    src="/images/logo-frenchie.png" 
                    alt="Replay Logo" 
                    className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]"
                />
            </div>
        </Link>
      </div>

      {/* MIDDLE NAV (Hidden on small mobile, visible on slightly larger screens) */}
      <nav className="hidden sm:flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg absolute left-1/2 -translate-x-1/2">
        <Link to="/" className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${isActive('/')}`}>Home</Link>
        <Link to="/play" className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${isActive('/play')}`}>Play</Link>
        <Link to="/pulse" className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${isActive('/pulse')}`}>Pulse</Link>
        <Link to="/collect" className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${isActive('/collect')}`}>Collect</Link>
      </nav>

      {/* RIGHT SIDE: BANKROLL & PROFILE ICON */}
      <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
        
        {/* Bankroll Balance Display */}
        <div className="flex flex-col items-end leading-none">
            <span className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest">Bankroll</span>
            <span className="font-mono font-black text-sm md:text-lg text-green-400">
                ${bankroll.toFixed(2)}
            </span>
        </div>

        {/* Profile Icon Link */}
        <Link to="/profile" className="p-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all">
            <ProfileIcon />
        </Link>
      </div>

    </header>
  );
}