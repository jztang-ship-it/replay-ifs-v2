import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// MAKE SURE THIS PATH IS CORRECT. 
// If your file is in src/assets/logo.png, this is right.
import localLogo from '../../assets/logo.png'; 
import { useBankroll } from '../../context/BankrollContext'; 

export default function TopNav() {
  const { bankroll } = useBankroll();
  const location = useLocation();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // Helper to determine active state
  const isActive = (path) => location.pathname === path;

  const getTabClass = (path) => {
    const activeStyle = "bg-blue-600 text-white shadow-lg shadow-blue-500/20";
    const inactiveStyle = "text-slate-500 hover:text-white hover:bg-slate-800";
    const baseStyle = "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all transform active:scale-95";
    return `${baseStyle} ${isActive(path) ? activeStyle : inactiveStyle}`;
  };

  return (
    <div className="shrink-0 h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 z-50 shadow-md">
        
        {/* 1. LOGO (HOME) - With Fallback */}
        <button 
            onClick={() => navigate('/')} 
            className="flex items-center justify-center w-10 h-10 hover:opacity-80 active:scale-95 transition-all bg-slate-900 rounded-full border border-slate-800"
            aria-label="Go Home"
        >
            {!imgError ? (
                <img 
                    src={localLogo} 
                    className="h-8 w-8 object-contain" 
                    alt="Home"
                    onError={(e) => {
                        console.error("Logo failed to load at path: ../../assets/logo.png");
                        setImgError(true);
                    }}
                />
            ) : (
                /* FALLBACK IF LOGO IS MISSING */
                <span className="text-[8px] font-black text-white">HOME</span>
            )}
        </button>
        
        {/* 2. CENTER TABS */}
        <div className="flex bg-slate-900 rounded-full p-1 gap-1 border border-slate-800">
            <button onClick={() => navigate('/play')} className={getTabClass('/play')}>PLAY</button>
            <button onClick={() => navigate('/pulse')} className={getTabClass('/pulse')}>PULSE</button>
            <button onClick={() => navigate('/collect')} className={getTabClass('/collect')}>COLLECT</button>
        </div>

        {/* 3. PROFILE / BALANCE */}
        <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-900 p-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-800 active:scale-95"
        >
            <div className="flex flex-col items-end leading-none">
                <span className="text-[8px] text-slate-400 font-bold uppercase mb-0.5">Balance</span>
                <span className="text-sm text-green-400 font-mono font-black">${bankroll.toLocaleString()}</span>
            </div>
            <div className="h-8 w-8 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
            </div>
        </button>
    </div>
  );
}