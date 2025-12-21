import React from 'react';

export default function TopNav({ user, onNavigate, onTriggerSave }) {
  const isGuestSession = user?.isGuest;
  const isRegistered = user && !user.isGuest;

  return (
    <nav className="w-full h-20 border-b border-white/10 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-[100]">
      
      {/* LEFT: Branding */}
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => onNavigate('HOME')}
      >
        {/* LOGO FIX: Direct path to public/assets folder */}
        <img 
          src="/assets/Beta-logo.png" 
          alt="Replay Logo" 
          className="h-10 w-10 object-contain group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          onError={(e) => { 
            // Fallback to Emoji if image fails
            e.target.style.display = 'none'; 
            e.target.nextSibling.style.display = 'block';
          }} 
        />
        {/* Fallback Emoji (Hidden by default) */}
        <div className="text-3xl hidden">🐶</div>

        <div className="flex flex-col">
          <span className="text-xl font-black italic tracking-tighter text-white group-hover:text-blue-400 transition-colors">
            REPLAY
          </span>
          <span className="text-[8px] font-bold tracking-[0.4em] text-slate-500 uppercase">
            Sports Social
          </span>
        </div>
      </div>

      {/* MIDDLE: Functional Tabs */}
      <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest text-slate-400">
        <button onClick={() => onNavigate('PLAY')} className="hover:text-white hover:text-blue-400 transition-colors uppercase py-2 border-b-2 border-transparent hover:border-blue-400">Play</button>
        <button onClick={() => onNavigate('PULSE')} className="hover:text-white transition-colors uppercase py-2 border-b-2 border-transparent hover:border-white">Pulse</button>
        <button onClick={() => onNavigate('STATS')} className="hover:text-white transition-colors uppercase py-2 border-b-2 border-transparent hover:border-white">Stats</button>
        <button onClick={() => onNavigate('COLLECT')} className="hover:text-white transition-colors uppercase py-2 border-b-2 border-transparent hover:border-white">Collect</button>
      </div>

      {/* RIGHT: Dynamic Action Area */}
      <div>
        {isRegistered ? (
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <div className="text-[10px] text-slate-400 font-bold uppercase">{user.username}</div>
               <div className="text-green-400 font-mono font-bold text-xs">${user.bankroll.toLocaleString()}</div>
             </div>
             <div className="h-8 w-8 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center text-lg">
               {user.avatar}
             </div>
          </div>
        ) : isGuestSession ? (
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end mr-2">
               <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Guest Funds</span>
               <span className="text-green-400 font-mono font-black text-sm leading-none">${user.bankroll.toLocaleString()}</span>
             </div>
             <button onClick={onTriggerSave} className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-4 py-2 rounded-full border border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)] animate-pulse">
              SAVE PROGRESS
            </button>
          </div>
        ) : (
          <button onClick={() => onNavigate('LOGIN')} className="text-xs font-bold bg-white text-slate-950 px-6 py-2 rounded-full hover:scale-105 transition-all uppercase tracking-wide shadow-lg">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}