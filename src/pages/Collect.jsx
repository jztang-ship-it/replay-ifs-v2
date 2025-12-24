import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useBankroll, VIP_TIERS } from '../context/BankrollContext';

// --- COMPONENTS ---
const ProgressBar = ({ current, target, color = "bg-blue-500" }) => {
  const pct = Math.min(100, (current / target) * 100);
  return (
    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }}></div>
    </div>
  );
};

export default function Collect() {
  const { 
    bankroll, updateBankroll, xp, addXp, 
    vipLevel, isGuest, registerUser, 
    showLevelUp, setShowLevelUp,
    dailyStats, claimDailyLogin 
  } = useBankroll();

  const [activeTab, setActiveTab] = useState('MISSIONS'); 
  const [claimedMissions, setClaimedMissions] = useState([]); // Track claimed IDs locally

  // --- MISSION DEFINITIONS ---
  // These read directly from 'dailyStats' to check progress
  const MISSIONS = [
    { 
      id: "m_login", 
      title: "Daily Check-In", 
      desc: "Log in to Replay", 
      icon: "📅", 
      reward: 100, xp: 100,
      current: dailyStats.loginClaimed ? 1 : 0, 
      target: 1,
      action: claimDailyLogin 
    },
    { 
      id: "m_warmup", 
      title: "Warm Up", 
      desc: "Play 5 Hands", 
      icon: "🃏", 
      reward: 50, xp: 25,
      current: dailyStats.handsPlayed, 
      target: 5 
    },
    { 
      id: "m_social", 
      title: "The Voice", 
      desc: "Post 3 Comments", 
      icon: "🗣️", 
      reward: 50, xp: 25,
      current: dailyStats.posts, 
      target: 3 
    },
    { 
      id: "m_winner", 
      title: "Winner's Circle", 
      desc: "Win 3 Hands", 
      icon: "🏆", 
      reward: 100, xp: 50,
      current: dailyStats.handsWon, 
      target: 3 
    }
  ];

  // --- HELPERS ---
  const handleClaim = (mission) => {
    if (claimedMissions.includes(mission.id)) return;
    
    // Execute reward
    updateBankroll(mission.reward);
    addXp(mission.xp);
    
    // If it's the login mission, trigger the context action
    if (mission.action) mission.action();
    
    // Mark locally as claimed
    setClaimedMissions(prev => [...prev, mission.id]);
  };

  // --- RENDER ---
  const currentTier = VIP_TIERS.find(t => t.lvl === vipLevel) || VIP_TIERS[0];
  const nextTier = VIP_TIERS.find(t => t.lvl === vipLevel + 1);
  const xpProgress = nextTier ? Math.min(100, ((xp - currentTier.min) / (nextTier.min - currentTier.min)) * 100) : 100;

  return (
    <PageContainer>
      {/* Level Up Overlay */}
      {showLevelUp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="text-center p-8 border-2 border-yellow-500 rounded-2xl bg-slate-900">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-black text-yellow-400 italic mb-2">{VIP_TIERS[showLevelUp].name}</h1>
            <p className="text-white text-sm">You unlocked: <span className="font-bold">{VIP_TIERS[showLevelUp].perk}</span></p>
            <button onClick={() => setShowLevelUp(null)} className="mt-6 bg-yellow-500 text-black font-bold px-8 py-3 rounded-full">CONTINUE</button>
          </div>
        </div>
      )}

      <div className="p-4 flex-1 overflow-y-auto pb-24">
        {isGuest && (
            <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-xl mb-4 flex justify-between items-center">
              <div className="text-red-200 text-xs">
                <span className="font-bold block text-red-100 mb-1">⚠️ SPECTATOR MODE</span>
                Progress resets on refresh.
              </div>
              <button onClick={registerUser} className="bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded uppercase animate-pulse">Register</button>
            </div>
        )}

        {/* HEADER STATS */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h2 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Current Status</h2>
                    <h1 className={`text-3xl font-black italic uppercase ${currentTier.color} flex items-center gap-2`}>
                        {currentTier.name} <span className="text-2xl">{currentTier.icon}</span>
                    </h1>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-white">{vipLevel}</span>
                    <span className="block text-[10px] text-gray-500 font-bold">LEVEL</span>
                </div>
            </div>
            
            {/* XP Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-2 relative z-10">
                <div className={`h-full ${currentTier.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${xpProgress}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase relative z-10">
                <span>{xp.toLocaleString()} SP</span>
                <span>{nextTier ? `Next: ${nextTier.min.toLocaleString()}` : 'MAX'}</span>
            </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-gray-800 mb-4">
          {['DAILY GOALS', 'VIP LADDER'].map(tab => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 pb-3 text-xs font-bold tracking-widest ${activeTab === tab ? 'text-white border-b-2 border-orange-500' : 'text-gray-600'}`}>{tab}</button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="space-y-3">
            {activeTab === 'DAILY GOALS' && MISSIONS.map((m) => {
                const isCompleted = m.current >= m.target;
                const isClaimed = claimedMissions.includes(m.id) || (m.id === 'm_login' && dailyStats.loginClaimed);
                
                return (
                    <div key={m.id} className={`p-4 rounded-xl flex justify-between items-center border border-gray-800 bg-gray-900/50 ${isClaimed ? 'opacity-40' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className="text-2xl w-10 text-center">{m.icon}</div>
                            <div>
                                <h4 className="text-sm font-bold text-white">{m.title}</h4>
                                <div className="flex gap-2 text-[10px] font-bold mt-0.5">
                                    <span className="text-orange-400">+{m.reward} 🪙</span>
                                    <span className="text-blue-400">+{m.xp} SP</span>
                                </div>
                                {!isClaimed && <ProgressBar current={m.current} target={m.target} />}
                            </div>
                        </div>
                        
                        <div className="text-right">
                            {isClaimed ? (
                                <span className="text-gray-500 text-[10px] font-bold">DONE</span>
                            ) : isCompleted ? (
                                <button onClick={() => handleClaim(m)} className="bg-green-600 text-white text-[10px] font-bold px-4 py-2 rounded animate-pulse shadow-lg">CLAIM</button>
                            ) : (
                                <span className="text-gray-500 text-[10px] font-mono">{m.current}/{m.target}</span>
                            )}
                        </div>
                    </div>
                );
            })}

            {activeTab === 'VIP LADDER' && VIP_TIERS.map((t) => (
              <div key={t.lvl} className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${vipLevel === t.lvl ? 'bg-slate-800 border-orange-500/50 shadow-lg scale-[1.02]' : 'bg-black border-slate-800 opacity-60'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${vipLevel >= t.lvl ? 'bg-green-900 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                   {vipLevel > t.lvl ? '✓' : t.lvl}
                </div>
                <div className="flex-1">
                   <h3 className={`font-bold text-sm uppercase ${t.color}`}>{t.name} {t.icon}</h3>
                   <p className="text-[10px] text-gray-500">{t.perk}</p>
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-mono text-gray-600">{t.min.toLocaleString()} SP</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </PageContainer>
  );
}