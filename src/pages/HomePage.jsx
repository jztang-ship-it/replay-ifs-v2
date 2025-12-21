import React from 'react';
import { calculateVipStatus } from '../utils/storage';

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ onInstantPlay, user }) => {
  const isGuest = user?.isGuest;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20">
      <div className="mt-16 mb-12 text-center px-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <h1 className="text-4xl md:text-6xl font-light text-white tracking-wide leading-tight">
          World's first <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Instant Fantasy</span> Social site
        </h1>
        <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">
          Draft live. Win instantly. Join the fastest growing sports community.
        </p>
        
        {isGuest && (
          <div className="mt-4 p-2 bg-blue-900/30 border border-blue-500/30 rounded-lg inline-block text-sm text-blue-200">
            Currently playing as Guest. <span className="font-bold text-white">${user.bankroll}</span> available.
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="bg-slate-900/50 border border-slate-800 p-8 border-l-4 border-l-blue-500 hover:bg-slate-900 transition-colors">
          <div className="text-blue-500 text-3xl mb-4">⚡</div>
          <h3 className="text-xl font-bold text-white mb-2">Instant Play</h3>
          <p className="text-slate-400">Zero wait time. Draft your lineup and get results immediately.</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-8 border-l-4 border-l-green-500 hover:bg-slate-900 transition-colors">
          <div className="text-green-500 text-3xl mb-4">🤝</div>
          <h3 className="text-xl font-bold text-white mb-2">Settle the Score</h3>
          <p className="text-slate-400">Settle sports arguments with friends instantly using real data.</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-8 border-l-4 border-l-purple-500 hover:bg-slate-900 transition-colors">
          <div className="text-purple-500 text-3xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-white mb-2">Social Hub</h3>
          <p className="text-slate-400">Connect with a global community of sports fans in real-time.</p>
        </div>
      </div>

      <div className="w-full bg-slate-900 border-t border-slate-800 py-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-3xl h-64 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center bg-slate-950/50">
          <span className="text-5xl mb-4">🎥</span>
          <span className="text-slate-500 font-bold uppercase tracking-widest">Interactive Preview</span>
        </div>
        <button onClick={onInstantPlay} className="mt-12 bg-white text-slate-950 px-12 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl uppercase tracking-widest">
          {isGuest ? "RESUME GAME ▶" : "START PLAYING NOW 🚀"}
        </button>
      </div>
    </div>
  );
};

// --- USER DASHBOARD COMPONENT ---
const UserDashboard = ({ user, vip, onNavigate }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-xl border-b border-slate-800">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-black italic tracking-tight mb-1">Welcome back, {user.username}</h2>
          <div className={`text-[10px] font-bold tracking-widest ${vip.color} mb-6`}>{vip.icon} {vip.label} MEMBER</div>
          
          <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
               <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Current Balance</div>
               <div className="text-4xl font-mono font-black text-white mt-1">${user.bankroll.toLocaleString()}</div>
            </div>
            <button onClick={() => onNavigate('PLAY')} className="bg-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-500 shadow-lg active:scale-95 transition-all">
              PLAY NOW
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
         <button onClick={() => onNavigate('PLAY')} className="col-span-2 h-40 bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl border border-blue-500/30 flex items-center justify-center font-black text-3xl italic hover:border-blue-500 transition-colors">
            ENTER GAME 🃏
         </button>
         <button onClick={() => onNavigate('STATS')} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:bg-slate-800">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold">My Stats</div>
         </button>
         <button onClick={() => onNavigate('PULSE')} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:bg-slate-800">
            <div className="text-3xl mb-2">🔥</div>
            <div className="font-bold">Daily Pulse</div>
         </button>
      </div>
    </div>
  );
};

export default function HomePage({ user, onNavigate, onInstantPlay }) {
  // Only show dashboard if Registered.
  const isRegistered = user && !user.isGuest;
  const vip = user ? calculateVipStatus(user.vipPoints) : null;
  
  return isRegistered 
    ? <UserDashboard user={user} vip={vip} onNavigate={onNavigate} /> 
    : <LandingPage user={user} onInstantPlay={onInstantPlay} />;
}