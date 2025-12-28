import React, { useState, useMemo, useRef, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useBankroll } from '../context/BankrollContext';

// --- VIP TIERS ---
const VIP_TIERS = [
  { id: 0, name: "GUEST", minXp: 0, color: "text-slate-500", icon: "🎟️", multiplier: 0, benefits: ["No Daily Bonus", "Spectator Mode"] },
  { id: 1, name: "PROSPECT", minXp: 100, color: "text-slate-300", icon: "🧢", multiplier: 1.0, benefits: ["1.0x Daily Bonus", "Unlock Chat"] },
  { id: 2, name: "ROOKIE", minXp: 500, color: "text-green-400", icon: "🌱", multiplier: 1.1, benefits: ["1.1x Daily Bonus", "Unlock $15 Bet"] },
  { id: 3, name: "STARTER", minXp: 1500, color: "text-teal-400", icon: "🎽", multiplier: 1.2, benefits: ["1.2x Daily Bonus", "Play vs Players", "Reply to Comments"] },
  { id: 4, name: "CAPTAIN", minXp: 5000, color: "text-blue-400", icon: "©️", multiplier: 1.3, benefits: ["1.3x Daily Bonus", "Create PvP Challenges"] },
  { id: 5, name: "ALL-STAR", minXp: 15000, color: "text-purple-400", icon: "⭐", multiplier: 1.5, benefits: ["1.5x Daily Bonus", "Post New Threads"] },
  { id: 6, name: "MVP", minXp: 50000, color: "text-pink-400", icon: "🏆", multiplier: 2.0, benefits: ["2.0x Daily Bonus", "5% Loss Rebate"] },
  { id: 7, name: "HALL OF FAME", minXp: 150000, color: "text-orange-400", icon: "🏛️", multiplier: 3.0, benefits: ["3.0x Daily Bonus", "Unlock $50 Bet"] },
  { id: 8, name: "LEGEND", minXp: 500000, color: "text-yellow-400", icon: "👑", multiplier: 5.0, benefits: ["5.0x Daily Bonus", "10% Loss Rebate"] },
  { id: 9, name: "G.O.A.T.", minXp: 1000000, color: "text-red-500", icon: "🐐", multiplier: 10.0, benefits: ["10x Daily Bonus", "Revenue Share"] },
];

// --- SLOT MACHINE ---
const SlotMachineReward = ({ onComplete, isClaimed, multiplier, lastWinAmount }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayValue, setDisplayValue] = useState(50);
  const [finalWin, setFinalWin] = useState(null);
  const spinInterval = useRef(null);

  const handleSpin = () => {
    if (isClaimed || isSpinning || multiplier === 0) return;
    setIsSpinning(true);

    let steps = 0;
    const possibleValues = [50, 100, 300];

    spinInterval.current = setInterval(() => {
      const randomVal = possibleValues[Math.floor(Math.random() * possibleValues.length)];
      setDisplayValue(randomVal);
      steps++;

      if (steps > 20) {
        clearInterval(spinInterval.current);
        const rand = Math.random();
        let baseWin = 50;
        if (rand > 0.90) baseWin = 300;
        else if (rand > 0.60) baseWin = 100;
        
        const totalWin = Math.floor(baseWin * multiplier);
        setDisplayValue(baseWin);
        setFinalWin(totalWin);
        onComplete(totalWin);
        setIsSpinning(false);
      }
    }, 100);
  };

  // 1. Guest View
  if (multiplier === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex justify-between items-center opacity-70">
        <div className="flex items-center gap-4">
          <span className="text-4xl grayscale">🔒</span>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Daily Spin Locked</div>
            <div className="text-sm font-bold text-white">Reach "Prospect" to Unlock</div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Claimed View
  if (isClaimed && !finalWin) {
     return (
       <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-2">
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-4xl grayscale">✅</span>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Daily Reward Claimed</div>
                <div className="text-sm font-black text-green-400">You collected ${lastWinAmount || "???"}</div>
              </div>
            </div>
         </div>
       </div>
     );
  }

  // 3. Just Won View
  if (finalWin) {
    return (
      <div className="bg-gradient-to-b from-yellow-500/20 to-orange-600/20 border border-yellow-500 rounded-xl p-6 text-center animate-bounce-short shadow-[0_0_40px_rgba(234,179,8,0.3)]">
        <div className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-1">JACKPOT HIT!</div>
        <div className="flex items-baseline justify-center gap-2 mb-2">
           <span className="text-4xl font-black text-white drop-shadow-md">{displayValue}</span>
           <span className="text-sm font-bold text-yellow-400">x {multiplier.toFixed(1)}</span>
        </div>
        <div className="text-2xl font-black text-white bg-black/40 rounded-lg py-2 border border-white/10">
          = ${finalWin.toLocaleString()}
        </div>
      </div>
    );
  }

  // 4. Ready to Spin
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
      
      <div className="p-6 flex flex-col items-center justify-center min-h-[160px] relative z-10">
        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
          Multiplier: <span className="text-white">{multiplier.toFixed(1)}x</span>
        </div>
        <div className="bg-black border-4 border-slate-700 rounded-lg px-8 py-4 mb-4 shadow-inner relative overflow-hidden">
          <div className="text-5xl font-mono font-black text-white tracking-widest relative z-10">
            {isSpinning ? displayValue : "777"}
          </div>
        </div>
        <button 
          onClick={handleSpin}
          disabled={isSpinning}
          className={`w-full py-3 rounded-lg font-black uppercase tracking-[0.2em] transition-all shadow-lg ${
            isSpinning 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white hover:scale-[1.02] shadow-red-900/50'
          }`}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN TO WIN'}
        </button>
      </div>
    </div>
  );
};

export default function Collect() {
  const { xp, history, claimReward, claimedRewards } = useBankroll();
  const safeHistory = useMemo(() => history || [], [history]);
  const safeClaimed = useMemo(() => claimedRewards || [], [claimedRewards]);
  
  const [view, setView] = useState('TASKS'); // Renamed from REWARDS
  const [lastWin, setLastWin] = useState(null); 

  // --- XP MATH ---
  const currentTierIndex = VIP_TIERS.findLastIndex(t => xp >= t.minXp);
  const currentTier = VIP_TIERS[currentTierIndex] || VIP_TIERS[0];
  const nextTier = VIP_TIERS[currentTierIndex + 1] || currentTier;
  const xpNeeded = nextTier.minXp - currentTier.minXp;
  const xpGained = xp - currentTier.minXp;
  const progressPercent = xpNeeded > 0 ? Math.min(100, Math.max(0, (xpGained / xpNeeded) * 100)) : 100;

  // --- DATA PROCESSING ---
  const gamesPlayed = safeHistory.length;
  const wins = safeHistory.filter(h => h.result === 'WIN').length;
  let currentWinStreak = 0;
  let maxWinStreak = 0;
  for (let i = 0; i < safeHistory.length; i++) {
    if (safeHistory[i].result === 'WIN') {
      currentWinStreak++;
      if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
    } else {
      currentWinStreak = 0;
    }
  }

  // --- MISSION CHAINS (Grouped by Type) ---
  const allMissions = [
    // CHAIN: PLAYING HANDS
    { id: 'd_play_3', group: 'play', step: 1, title: "Warm Up", desc: "Play 3 hands", icon: "🏀", reward: 50, current: gamesPlayed, target: 3 },
    { id: 'd_play_6', group: 'play', step: 2, title: "Rotation", desc: "Play 6 hands", icon: "🏀", reward: 100, current: gamesPlayed, target: 6 },
    { id: 'd_play_10', group: 'play', step: 3, title: "Starter", desc: "Play 10 hands", icon: "🏀", reward: 200, current: gamesPlayed, target: 10 },
    { id: 'd_play_20', group: 'play', step: 4, title: "Grinder", desc: "Play 20 hands", icon: "😤", reward: 500, current: gamesPlayed, target: 20 },

    // CHAIN: WINNING HANDS
    { id: 'd_win_1', group: 'win', step: 1, title: "First W", desc: "Win 1 hand", icon: "🏆", reward: 50, current: wins, target: 1 },
    { id: 'd_win_3', group: 'win', step: 2, title: "Shooter", desc: "Win 3 hands", icon: "🏆", reward: 150, current: wins, target: 3 },
    { id: 'd_win_5', group: 'win', step: 3, title: "Closer", desc: "Win 5 hands", icon: "🏆", reward: 300, current: wins, target: 5 },
    { id: 'd_win_10', group: 'win', step: 4, title: "Winner", desc: "Win 10 hands", icon: "👑", reward: 750, current: wins, target: 10 },

    // CHAIN: WIN STREAK
    { id: 'b_streak_3', group: 'streak', step: 1, title: "On Fire", desc: "Win 3 in a row", icon: "🔥", reward: 250, current: maxWinStreak, target: 3 },
    { id: 'b_streak_5', group: 'streak', step: 2, title: "Unstoppable", desc: "Win 5 in a row", icon: "🔥🔥", reward: 1000, current: maxWinStreak, target: 5 },

    // SINGLE: HIGH SCORE
    { id: 'b_high_220', group: 'score', step: 1, title: "Dream Team", desc: "Score 220+ FP", icon: "📈", reward: 500, current: safeHistory.some(h => h.score >= 220) ? 1 : 0, target: 1 },
    
    // SINGLE: TOP PLAYER
    { id: 'b_player_100', group: 'player', step: 1, title: "God Mode", desc: "Player w/ 100+ FP", icon: "👽", reward: 1000, current: safeHistory.some(h => h.topPlayer >= 100) ? 1 : 0, target: 1 },
  ];

  // --- FILTER LOGIC: SHOW ONLY ACTIVE TASK PER GROUP ---
  const activeTasks = useMemo(() => {
    const groups = {};
    
    // 1. Sort missions by step order
    allMissions.sort((a, b) => a.step - b.step);

    // 2. Find the first unclaimed task in each group
    allMissions.forEach(task => {
      const isClaimed = safeClaimed.includes(task.id);
      
      // If we haven't found an active task for this group yet
      if (!groups[task.group]) {
        if (!isClaimed) {
          // This is the next goal
          groups[task.group] = task;
        } else {
          // This task is done & claimed. 
          // If it's the last one in the chain, we might want to show it as "Completed"
          // For now, we just skip it to find the next one.
        }
      }
    });

    // 3. Convert back to array
    return Object.values(groups);
  }, [allMissions, safeClaimed]);

  return (
    <PageContainer>
      <div className="flex flex-col min-h-screen px-4 pt-4 pb-32 max-w-xl mx-auto w-full relative z-0">
        
        {/* TOP TOGGLE */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 mb-6 backdrop-blur-md sticky top-0 z-30 shadow-xl">
          <button onClick={() => setView('TASKS')} className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === 'TASKS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>💰 Daily Tasks</button>
          <button onClick={() => setView('CAREER')} className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === 'CAREER' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>🏆 My Career</button>
        </div>

        {/* --- REWARDS TAB --- */}
        {view === 'TASKS' && (
          <div className="animate-fade-in-up space-y-8">
            {/* SPIN */}
            <div>
              <div className="flex justify-between items-end mb-2 px-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Daily Spin</span>
                <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Base: 50 • 100 • 300</span>
              </div>
              <SlotMachineReward 
                isClaimed={safeClaimed.includes('daily_slot')}
                multiplier={currentTier.multiplier}
                lastWinAmount={lastWin}
                onComplete={(amt) => { setLastWin(amt); claimReward('daily_slot', amt, 'CASH'); }}
              />
            </div>

            {/* MISSIONS (Filtered List) */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-1 border-t border-slate-800 pt-6">
                <span className="text-lg">⚡</span>
                <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">Active Missions</h3>
              </div>
              
              <div className="space-y-2">
                {activeTasks.length > 0 ? activeTasks.map(task => {
                  const isComplete = task.current >= task.target;
                  return (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl animate-fade-in-right">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${isComplete ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-600'}`}>{isComplete ? '✔' : task.icon}</div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase">{task.title}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{task.desc}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-mono text-slate-500">{Math.min(task.current, task.target)}/{task.target}</span>
                        <button onClick={() => claimReward(task.id, task.reward, 'CASH')} disabled={!isComplete} className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${isComplete ? 'bg-white text-black hover:scale-105 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-slate-800 text-slate-600 opacity-50'}`}>+${task.reward}</button>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8 text-slate-500 text-xs font-bold uppercase">All missions completed!</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- CAREER TAB --- */}
        {view === 'CAREER' && (
          <div className="animate-fade-in-up">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-20 text-8xl grayscale select-none">{currentTier.icon}</div>
               <div className="relative z-10">
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Status</div>
                 <h2 className={`text-4xl font-black italic tracking-tighter uppercase ${currentTier.color} mb-4`}>{currentTier.name}</h2>
                 <div className="relative w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden mb-2">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-400" style={{ width: `${progressPercent}%` }}></div>
                 </div>
                 <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
                    <span>{xp.toLocaleString()} XP</span>
                    <span>{nextTier.minXp.toLocaleString()} XP</span>
                 </div>
               </div>
            </div>

            <div className="space-y-4">
              {VIP_TIERS.map((tier) => {
                const isCurrent = currentTier.id === tier.id;
                const isUnlocked = xp >= tier.minXp;
                
                return (
                  <div key={tier.id} className={`relative p-4 rounded-xl border transition-all ${isCurrent ? 'bg-slate-800 border-blue-500 shadow-lg' : 'bg-slate-900/50 border-slate-800'}`}>
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center min-w-[60px]">
                        <span className={`text-2xl mb-1 ${!isUnlocked ? 'grayscale opacity-50' : ''}`}>{tier.icon}</span>
                        <span className={`text-[10px] font-black uppercase ${isCurrent ? 'text-white' : tier.color}`}>{tier.name}</span>
                        <span className="text-[8px] font-mono text-slate-500">{tier.minXp > 0 ? `${tier.minXp/1000}k XP` : '0 XP'}</span>
                      </div>
                      <div className="flex-1 border-l border-slate-700/50 pl-4">
                         {isCurrent && <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">★ Active Benefits</div>}
                         <ul className="space-y-1.5">
                           {tier.benefits.map((benefit, i) => (
                             <li key={i} className={`text-xs flex items-center gap-2 ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                               <span className={`w-1 h-1 rounded-full ${isCurrent ? 'bg-blue-400' : 'bg-slate-600'}`}></span>
                               {benefit}
                             </li>
                           ))}
                         </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}