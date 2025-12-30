import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import localLogo from '../../assets/logo.png'; 
import { useBankroll } from '../../context/BankrollContext'; 

export default function TopNav() {
  const { bankroll } = useBankroll() || { bankroll: 0 };
  const location = useLocation();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const displayBankroll = typeof bankroll === 'number' ? bankroll : 0;

  const getTabClass = (path) => {
    const isActive = location.pathname === path;
    const base = "px-3 md:px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap";
    return isActive 
      ? `${base} bg-blue-600 text-white shadow-lg shadow-blue-500/20` 
      : `${base} text-slate-500 hover:text-white hover:bg-slate-800`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-center z-[999] shadow-md">
        
        {/* 1. LEFT: LOGO (Pinned Left) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
            <button 
                onClick={() => navigate('/')} 
                className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-500 transition-all active:scale-95 overflow-hidden shadow-lg"
            >
                {!imgError ? (
                    <img 
                        src={localLogo} 
                        className="h-full w-full object-contain" 
                        alt="Home"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="bg-white w-full h-full flex items-center justify-center">
                        <span className="text-[8px] font-black text-black">LOGO</span>
                    </div>
                )}
            </button>
        </div>
        
        {/* 2. CENTER: TABS */}
        <div className="relative z-10 bg-slate-900 rounded-full p-1 gap-1 border border-slate-800 flex shadow-lg">
            <button onClick={() => navigate('/play')} className={getTabClass('/play')}>PLAY</button>
            <button onClick={() => navigate('/pulse')} className={getTabClass('/pulse')}>PULSE</button>
            <button onClick={() => navigate('/collect')} className={getTabClass('/collect')}>COLLECT</button>
        </div>

        {/* 3. RIGHT: PROFILE (Vertical "Ankle" Stack) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
            <button 
                onClick={() => navigate('/profile')}
                className="flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg hover:bg-slate-900 transition-all active:scale-95 cursor-pointer"
            >
                {/* AVATAR ON TOP */}
                <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shadow-inner ring-1 ring-black/50">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                </div>

                {/* BALANCE AT THE ANKLE */}
                <span className="text-[9px] md:text-[10px] text-green-400 font-mono font-black leading-none bg-slate-950/80 px-1 rounded-sm">
                    ${displayBankroll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </button>
        </div>
    </div>
  );
}