import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBankroll } from '../../context/BankrollContext';

// NOTE: We temporarily removed the logo import to force the build to pass
// import logo from '../../assets/logo.png'; 

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-slate-300 hover:text-white transition-colors">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1 .437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.602-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
);

export default function TopNav() {
  const location = useLocation();
  const context = useBankroll(); 
  const bankroll = context ? context.bankroll : 0;
  const isActive = (path) => location.pathname === path ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white';

  return (
    <header className="shrink-0 h-20 bg-slate-950 border-b border-slate-900 flex items-center justify-between px-4 relative z-50">
      
      {/* 1. TEMPORARY TEXT LOGO (To prove the update works) */}
      <div className="flex-1 flex justify-start">
        <Link to="/" className="flex items-center group">
            <div className="h-16 w-16 flex items-center justify-center bg-slate-900 rounded-full border border-slate-800">
                <span className="font-black text-[10px] text-white">REPLAY</span>
            </div>
        </Link>
      </div>

      <nav className="hidden sm:flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg absolute left-1/2 -translate-x-1/2">
        <Link to="/" className={`px-4 py-2 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${isActive('/')}`}>Home</Link>
        <Link to="/play" className={`px-4 py-2 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${isActive('/play')}`}>Play</Link>
        <Link to="/pulse" className={`px-4 py-2 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${isActive('/pulse')}`}>Pulse</Link>
        <Link to="/collect" className={`px-4 py-2 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${isActive('/collect')}`}>Collect</Link>
      </nav>

      {/* 2. THE PROFILE SECTION (This is what we want to see!) */}
      <div className="flex-1 flex items-center justify-end gap-4">
        <div className="flex flex-col items-end leading-none">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Bankroll</span>
            <span className="font-mono font-black text-lg text-green-400">${bankroll.toFixed(2)}</span>
        </div>
        <Link to="/profile" className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all shadow-lg">
            <ProfileIcon />
        </Link>
      </div>

    </header>
  );
}