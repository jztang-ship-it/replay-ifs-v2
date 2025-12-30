import React from 'react';
import logo from '../../assets/logo.png'; 

// --- HELPER: DATE FORMAT ---
const formatGameDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    let suffix = "th";
    if (day % 10 === 1 && day !== 11) suffix = "st";
    else if (day % 10 === 2 && day !== 12) suffix = "nd";
    else if (day % 10 === 3 && day !== 13) suffix = "rd";
    return `${day} ${month} - ${day}${suffix}`;
};

// --- COMPONENT: DEFAULT BACK (Logo) ---
export const CardBackDefault = () => (
    <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl backface-hidden rotate-y-180">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center relative gap-1 p-2">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50"></div>
            <img src={logo} alt="Replay Logo" className="w-20 h-20 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] relative z-10 opacity-90" />
        </div>
    </div>
);

// --- COMPONENT: STATS BACK (Game Log) ---
export const CardBackStats = ({ meta, stats, score, bonus, badges, scoreColor, rawProj }) => {
    const formattedDate = formatGameDate(stats.date);
    const opponent = stats.matchup || "v OPP"; 

    return (
        <div className="absolute inset-0 w-full h-full bg-slate-950 rounded-lg border-2 border-slate-700 flex flex-col overflow-hidden backface-hidden rotate-y-180 p-1 relative shadow-2xl">
            {/* Header */}
            <div className="border-b border-slate-800 pb-0.5 mb-0.5 flex justify-between items-center">
                <div className="text-[8px] text-white font-black uppercase italic truncate w-[70%]">{meta.name}</div>
                <div className="text-[7px] text-slate-500 font-bold">{meta.team}</div>
            </div>

            {/* Score & Badges */}
            <div className="flex justify-between items-center bg-slate-900/50 px-1 py-0.5 rounded border border-white/5 mb-0.5">
                <div className="flex items-center gap-1">
                    <span className="text-[7px] text-slate-400 font-bold uppercase">FP</span>
                    <div className={`text-sm font-mono font-black leading-none ${scoreColor}`}>
                        {score.toFixed(1)}
                        {bonus > 0 && <span className="text-[8px] text-yellow-400 ml-0.5 font-bold">(+{bonus.toFixed(1)})</span>}
                    </div>
                </div>
                <div className="flex gap-0.5">
                    {badges.map((b,i) => <span key={i} className="text-[8px]">{b.icon}</span>)}
                </div>
            </div>

            {/* Game Info */}
            <div className="text-center mb-0.5 border-b border-slate-800/50 pb-0.5">
                <span className="text-[7px] text-slate-400 font-mono font-bold uppercase tracking-tight">
                    {formattedDate} <span className="text-slate-600">|</span> {opponent}
                </span>
                {/* Debug Line removed for prod look, but logic is secure now */}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-0.5 mt-auto">
                <div className="bg-slate-900 p-0.5 rounded text-center"><div className="text-[6px] text-slate-500 font-bold">PTS</div><div className="text-[9px] text-white font-mono font-bold">{stats.pts}</div></div>
                <div className="bg-slate-900 p-0.5 rounded text-center"><div className="text-[6px] text-slate-500 font-bold">REB</div><div className="text-[9px] text-white font-mono font-bold">{stats.reb}</div></div>
                <div className="bg-slate-900 p-0.5 rounded text-center"><div className="text-[6px] text-slate-500 font-bold">AST</div><div className="text-[9px] text-white font-mono font-bold">{stats.ast}</div></div>
                <div className="bg-slate-900 p-0.5 rounded text-center"><div className="text-[6px] text-slate-500 font-bold">STL</div><div className="text-[9px] text-white font-mono font-bold">{stats.stl}</div></div>
                <div className="bg-slate-900 p-0.5 rounded text-center"><div className="text-[6px] text-slate-500 font-bold">BLK</div><div className="text-[9px] text-white font-mono font-bold">{stats.blk}</div></div>
                <div className="bg-slate-900 p-0.5 rounded text-center"><div className="text-[6px] text-slate-500 font-bold">TO</div><div className="text-[9px] text-white font-mono font-bold">{stats.to}</div></div>
            </div>
        </div>
    );
};