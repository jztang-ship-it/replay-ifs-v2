// src/pages/Collect.jsx
import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';

export default function Collect() {
  const [activeTab, setActiveTab] = useState('MISSIONS'); 
  const userLevel = 1; // Testing as "Prospect"

  // --- MISSION DATA (Short Term Loops) ---
  const missions = [
    { id: 1, title: "The Daily Check-In", desc: "Log in to Replay", status: "COMPLETED", icon: "📅", reward: 100 },
    { id: 2, title: "Voice of the People", desc: "Post 3 comments in Pulse", status: "ACTIVE", icon: "🗣️", reward: 50, note: "Unlocks at Level 1" },
    { id: 3, title: "The Long Shot", desc: "Win a Parlay with +500 odds", status: "ACTIVE", icon: "🚀", reward: 500, note: "High Risk" },
    { id: 4, title: "Membership Bonus", desc: "Subscribe to Replay+ Monthly", status: "LOCKED", icon: "💳", reward: 2000, note: "Instant Promotion" }
  ];

  // --- THE 11-TIER HIERARCHY (Long Term Loops) ---
  const vipLevels = [
    {
      level: 0,
      name: "Spectator",
      color: "text-gray-500",
      benefits: ["✅ Read News", "✅ Bet (Restricted)"],
      req: "Create Account"
    },
    {
      level: 1,
      name: "Prospect",
      color: "text-gray-300",
      benefits: ["🔓 Chat Access", "💰 10% Login Bonus"],
      req: "Log in 3 days OR Buy Starter Pack"
    },
    {
      level: 2,
      name: "Bench Warmer",
      color: "text-gray-300",
      benefits: ["🔓 Custom Avatar", "💰 15% Login Bonus"],
      req: "100 SP (Status Points)"
    },
    {
      level: 3,
      name: "Rotation Player",
      color: "text-blue-300",
      benefits: ["🔓 Reaction Emojis", "💰 20% Login Bonus"],
      req: "500 SP"
    },
    {
      level: 4,
      name: "Sixth Man",
      color: "text-blue-400",
      benefits: ["🔓 1 Free Tourney Ticket/mo", "💰 25% Login Bonus"],
      req: "1,000 SP (Instant with Replay+ Silver)"
    },
    {
      level: 5,
      name: "Starter",
      color: "text-blue-500",
      benefits: ["🔓 Private Room Access", "💰 30% Login Bonus"],
      req: "2,500 SP"
    },
    {
      level: 6,
      name: "All-Star",
      color: "text-yellow-300",
      benefits: ["🔥 'On Fire' Chat Effect", "💰 50% Login Bonus", "📞 Priority Support"],
      req: "10,000 SP (Instant with Replay+ Gold)"
    },
    {
      level: 7,
      name: "Superstar",
      color: "text-yellow-400",
      benefits: ["🔓 Verified Checkmark", "💰 75% Login Bonus", "🎁 Monthly Merch Drop"],
      req: "50,000 SP"
    },
    // --- THE ELITE TIER (Money + Activity Required) ---
    {
      level: 8,
      name: "Franchise Player",
      color: "text-purple-400",
      benefits: ["👑 Create Public Guilds", "💰 100% Login Bonus", "🛡️ Ban Immunity (1x)"],
      req: "100k SP + 30 Days Active Streak"
    },
    {
      level: 9,
      name: "Champion",
      color: "text-purple-500",
      benefits: ["👑 Global Leaderboard Badge", "💰 150% Login Bonus", "🎟️ Real NBA Tickets Raffle"],
      req: "500k SP + Won 1 Tournament"
    },
    {
      level: 10,
      name: "Hall of Famer",
      color: "text-red-500 animate-pulse",
      benefits: ["👑 'The G.O.A.T.' Profile Skin", "💰 200% Login Bonus", "🤝 Direct Line to Founder"],
      req: "1M SP + Invited by Devs"
    }
  ];

  return (
    <PageContainer>
      
      {/* 1. DAILY LOGIN CARD (unchanged) */}
      <div className="p-4 shrink-0">
        <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden border border-orange-500/30">
          <div className="absolute -right-4 -top-4 text-9xl opacity-10 rotate-12">🪙</div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold font-mono uppercase tracking-widest mb-1 text-orange-200">Daily Login</h2>
            <div className="flex items-center gap-2 mb-6">
               <span className="text-white/90 text-sm font-bold bg-black/20 px-2 py-1 rounded">🔥 Streak: 3 Days</span>
               <span className="text-orange-200 text-xs">+10% Bonus Active</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-5xl font-black tracking-tighter block leading-none">110</span>
                <span className="text-xs font-bold tracking-widest opacity-80 ml-1">COINS</span>
              </div>
              <button className="bg-white text-orange-700 font-black text-sm px-6 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-wide">
                Claim Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB SELECTION */}
      <div className="flex px-4 border-b border-gray-800 mb-4 shrink-0 overflow-x-auto">
        {['MISSIONS', 'VIP LADDER'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`pb-3 px-4 text-xs font-bold tracking-widest transition-all whitespace-nowrap ${
               activeTab === tab 
               ? 'text-white border-b-2 border-orange-500' 
               : 'text-gray-500 hover:text-gray-300'
             }`}
           >
             {tab}
           </button>
        ))}
      </div>

      {/* 3. SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-3">
        
        {/* MISSIONS TAB */}
        {activeTab === 'MISSIONS' && missions.map((mission) => (
          <div key={mission.id} className={`p-4 rounded-xl flex justify-between items-center border relative overflow-hidden ${mission.status === 'COMPLETED' ? 'bg-gray-800/40 border-green-900/30' : 'bg-gray-800/40 border-gray-700'} ${mission.status === 'LOCKED' ? 'opacity-50' : ''}`}>
            {mission.status === 'COMPLETED' && <div className="absolute inset-0 bg-green-500/5 pointer-events-none"></div>}
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${mission.status === 'COMPLETED' ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-200'}`}>
                 {mission.icon}
              </div>
              <div>
                <h4 className={`font-bold text-sm ${mission.status === 'COMPLETED' ? 'line-through text-white/50' : 'text-white'}`}>{mission.title}</h4>
                <p className="text-gray-400 text-[10px] font-bold tracking-wider mt-0.5">{mission.desc}</p>
                {mission.note && <p className="text-orange-400 text-[9px] mt-1">{mission.note}</p>}
              </div>
            </div>
            <div className="text-right z-10">
              {mission.status === 'COMPLETED' ? (
                <button className="bg-green-600 text-white text-[10px] font-bold px-4 py-2 rounded animate-pulse">CLAIM</button>
              ) : (
                <div className="flex flex-col items-end">
                  <span className="text-orange-400 font-bold text-xs mb-1">+{mission.reward} 🪙</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* VIP LADDER TAB (The 11 Levels) */}
        {activeTab === 'VIP LADDER' && (
          <div className="space-y-0 pt-2 pb-10">
            {vipLevels.map((lvl) => (
              <div key={lvl.level} className="flex gap-4 group">
                
                {/* Timeline Visuals */}
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 z-10 transition-colors ${
                    userLevel >= lvl.level ? 'bg-orange-500 border-orange-500' : 'bg-gray-900 border-gray-600'
                  }`}></div>
                  <div className={`w-0.5 flex-1 ${userLevel >= lvl.level ? 'bg-orange-500' : 'bg-gray-800'}`}></div>
                </div>

                {/* Level Card */}
                <div className={`flex-1 mb-6 transition-all ${userLevel === lvl.level ? 'bg-gray-800 p-4 rounded-lg border border-orange-500/50 shadow-lg scale-100' : 'opacity-60 scale-95'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${lvl.color}`}>
                      {lvl.name} <span className="text-[10px] opacity-50 ml-1">LVL {lvl.level}</span>
                    </h3>
                    {userLevel === lvl.level && <span className="text-[9px] bg-orange-500 text-black font-bold px-2 py-0.5 rounded">CURRENT</span>}
                  </div>
                  
                  {/* Requirement Label */}
                  <p className="text-gray-500 text-[9px] mb-2 uppercase font-bold tracking-widest border-b border-gray-700/50 pb-2">
                    To Unlock: <span className="text-gray-300">{lvl.req}</span>
                  </p>
                  
                  {/* Benefits List */}
                  <ul className="space-y-1">
                    {lvl.benefits.map((benefit, i) => (
                      <li key={i} className="text-gray-300 text-xs font-medium flex items-start gap-1">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </PageContainer>
  );
}