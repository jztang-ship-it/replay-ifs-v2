import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useBankroll } from '../context/BankrollContext';

const VIP_LEVELS = [
  { id: 1, name: "ROOKIE", minXp: 0, benefit: "Daily Missions", color: "text-slate-400" },
  { id: 2, name: "PROSPECT", minXp: 500, benefit: "+$100 Rank Bonus", color: "text-green-400" },
  { id: 3, name: "PRO", minXp: 2000, benefit: "+5% XP Boost", color: "text-blue-400" },
  { id: 4, name: "VETERAN", minXp: 7500, benefit: "Access High-Roller Tasks", color: "text-purple-400" },
  { id: 5, name: "ALL-STAR", minXp: 20000, benefit: "1.1x Win Multiplier", color: "text-orange-400" },
  { id: 6, name: "MVP", minXp: 50000, benefit: "Daily Loss Rebate (5%)", color: "text-yellow-400" },
  { id: 7, name: "LEGEND", minXp: 100000, benefit: "Revenue Share Pool", color: "text-red-500" }
];

const TaskCard = ({ task, onClaim, isClaimed }) => {
  const progressPercent = Math.min(100, (task.current / task.target) * 100);
  const isComplete = task.current >= task.target;

  return (
    <div className={`relative overflow-hidden rounded-xl border p-3 transition-all ${isComplete ? 'bg-slate-800/90 border-blue-500/50 shadow-lg shadow-blue-900/20' : 'bg-slate-900/50 border-slate-800'}`}>
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
      <div className="flex justify-between items-center relative z-10">
        <div className="flex gap-3 items-center">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-inner ${isComplete ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
            {task.icon}
          </div>
          <div>
            <h3 className={`text-[10px] font-black uppercase tracking-wider ${isComplete ? 'text-white' : 'text-slate-400'}`}>{task.title}</h3>
            <p className="text-[9px] text-slate-500 font-medium line-clamp-1">{task.desc}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[9px] font-mono ${isComplete ? 'text-green-400' : 'text-slate-500'}`}>
                {Math.min(task.current, task.target)} / {task.target}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-black text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
            +${task.reward}
          </span>
          {isClaimed ? (
            <div className="flex items-center gap-1 text-green-400 mt-1">
              <span className="text-xs">✔</span>
              <span className="text-[8px] font-black uppercase tracking-widest">Done</span>
            </div>
          ) : (
            <button 
              onClick={() => onClaim(task)}
              disabled={!isComplete}
              className={`px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer relative z-50 ${
                isComplete 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg animate-pulse' 
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              {isComplete ? 'CLAIM' : 'LOCKED'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Collect() {
  const { history, xp, claimReward, claimedRewards } = useBankroll();
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('DAILY');

  // FIX: useMemo prevents the "Infinite Loop" by stabilizing the array reference
  const safeHistory = useMemo(() => history || [], [history]);
  const safeClaimed = useMemo(() => claimedRewards || [], [claimedRewards]);

  let currentIndex = 0;
  for (let i = VIP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= VIP_LEVELS[i].minXp) { currentIndex = i; break; }
  }

  useEffect(() => {
    const wins = safeHistory.filter(h => h.result === 'WIN').length;
    const totalGames = safeHistory.length;
    
    const badgeCounts = { '🔥': 0, '👑': 0, '✌️': 0, '🖐️': 0, '🦕': 0, '🔒': 0 };
    safeHistory.forEach(game => {
      if(game.badges > 0) badgeCounts['🔥']++;
      if(game.badges > 1) badgeCounts['✌️']++;
      if(game.badges > 2) badgeCounts['👑']++;
      if(game.badges > 3) badgeCounts['🔒']++;
    });
    
    const uniqueIcons = Object.values(badgeCounts).filter(c => c > 0).length;
    const social = { loginStreak: 2, daysLogged: 4, articlesRead: 1, comments: 2, posts: 1, replies: 0, chatEntries: 4, chatMsgs: 2 };

    const allTasks = [
      { id: 'd_login', category: 'DAILY', title: "Check In", desc: "Log in today.", icon: "📅", reward: 50, current: 1, target: 1 },
      { id: 'd_streak_2', category: 'DAILY', title: "Double Down", desc: "Login 2 days in a row.", icon: "🔥", reward: 100, current: social.loginStreak, target: 2 },
      { id: 'd_play_1', category: 'DAILY', title: "First Tip", desc: "Play 1 hand today.", icon: "🏀", reward: 25, current: totalGames, target: 1 },
      { id: 'd_play_5', category: 'DAILY', title: "Rotation Player", desc: "Play 5 hands.", icon: "🏀", reward: 100, current: totalGames, target: 5 },
      { id: 'd_win_3', category: 'DAILY', title: "Winning Streak", desc: "Win 3 hands.", icon: "🏆", reward: 200, current: wins, target: 3 },
      
      { id: 's_underdog', category: 'SKILL', title: "The Underdog", desc: "Win with < $12 Payroll.", icon: "📉", reward: 300, current: 0, target: 1 },
      { id: 's_sniper', category: 'SKILL', title: "Sniper", desc: "Win 3 hands in 5 mins.", icon: "⚡", reward: 500, current: 0, target: 1 },
      
      { id: 'i_fire', category: 'ICONS', title: "Catch Fire", desc: "Get 'On Fire' Icon.", icon: "🔥", reward: 50, current: badgeCounts['🔥'], target: 1 },
      { id: 'i_trip', category: 'ICONS', title: "Triple Threat", desc: "Get 'Trip Dbl' Icon.", icon: "👑", reward: 150, current: badgeCounts['👑'], target: 1 },
      { id: 'w_col_2', category: 'ICONS', title: "Collector I", desc: "Hit 2/6 Unique Icons.", icon: "🧩", reward: 200, current: uniqueIcons, target: 2 },
      
      { id: 'p_read_1', category: 'PULSE', title: "Student", desc: "Read 1 Article.", icon: "📰", reward: 25, current: social.articlesRead, target: 1 },
      { id: 'c_enter_1', category: 'PULSE', title: "Lurker", desc: "Enter Game Chat.", icon: "🚪", reward: 25, current: social.chatEntries, target: 1 },
    ];
    setTasks(allTasks);
  }, [safeHistory, xp]);

  const handleClaim = (task) => { claimReward(task.id, task.reward, 'CASH'); };
  
  const filteredTasks = activeTab === 'DAILY' ? tasks.filter(t => t.category === 'DAILY') : 
                        activeTab === 'SKILL' ? tasks.filter(t => t.category === 'SKILL') : 
                        activeTab === 'ICONS' ? tasks.filter(t => t.category === 'ICONS') : 
                        tasks.filter(t => t.category === 'PULSE');

  return (
    <PageContainer>
      <div className="flex flex-col min-h-screen px-4 pt-6 pb-32 max-w-xl mx-auto w-full relative z-0">
        <div className="flex flex-col mb-4">
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Collect Rewards</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Complete missions • Earn Cash</p>
        </div>

        {/* LADDER */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-6 relative">
           <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Career Ladder</h3>
           <div className="space-y-3 relative">
             <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-800 z-0"></div>
             {VIP_LEVELS.map((level, i) => {
               const isCurrent = i === currentIndex;
               const isUnlocked = i <= currentIndex;
               const isNext = i === currentIndex + 1;
               if (i > currentIndex + 2) return null;
               return (
                 <div key={level.id} className={`relative z-10 flex items-center gap-3 p-3 rounded-lg border transition-all ${isCurrent ? 'bg-slate-800 border-blue-500/50 shadow-lg scale-[1.02]' : isNext ? 'bg-slate-900/50 border-slate-700' : isUnlocked ? 'bg-slate-900/20 border-transparent opacity-50' : 'bg-transparent border-transparent opacity-30'}`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 shrink-0 ${isCurrent ? 'bg-blue-600 text-white border-white' : isUnlocked ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-slate-900 text-slate-700 border-slate-800'}`}>{isUnlocked ? level.id : '🔒'}</div>
                   <div className="flex-1">
                     <div className="flex justify-between items-center"><span className={`text-[10px] font-black uppercase tracking-wider ${isCurrent ? 'text-white' : level.color}`}>{level.name}</span><span className="text-[9px] font-mono text-slate-500">{level.minXp.toLocaleString()} XP</span></div>
                     <div className={`text-[10px] ${isCurrent ? 'text-white' : 'text-slate-500'}`}>{level.benefit}</div>
                   </div>
                 </div>
               );
             })}
           </div>
        </div>

        {/* TABS (Non-Sticky to fix Z-Index Trap) */}
        <div className="flex p-1 bg-slate-900 rounded-lg mb-4 border border-slate-800 overflow-x-auto">
          {['DAILY', 'SKILL', 'ICONS', 'PULSE'].map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 px-2 text-[9px] font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>{tab}</button>))}
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-2">
          {filteredTasks.map(task => (<TaskCard key={task.id} task={task} onClaim={handleClaim} isClaimed={safeClaimed.includes(task.id)} />))}
          {filteredTasks.length === 0 && <div className="text-center py-12 text-slate-600 text-xs font-bold uppercase tracking-widest border border-dashed border-slate-800 rounded-xl">No active tasks.</div>}
        </div>
      </div>
    </PageContainer>
  );
}