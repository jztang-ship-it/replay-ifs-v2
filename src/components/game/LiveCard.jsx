import React from 'react';

// Card Back Component
const CardBack = () => (
    <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl backface-hidden rotate-y-180">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50"></div>
            <span className="text-xl md:text-4xl font-black italic text-slate-800 drop-shadow-sm transform -rotate-12 select-none">REPLAY</span>
        </div>
    </div>
);

// --- TIER COLOR LOGIC ---
const getTierStyle = (cost) => {
    if (cost >= 13) return { border: 'border-amber-400', text: 'text-amber-400', bg: 'bg-amber-400' }; // Legendary
    if (cost >= 10) return { border: 'border-purple-400', text: 'text-purple-400', bg: 'bg-purple-400' }; // Epic
    if (cost >= 7)  return { border: 'border-blue-400', text: 'text-blue-400', bg: 'bg-blue-400' };   // Rare
    return { border: 'border-slate-600', text: 'text-slate-400', bg: 'bg-slate-500' };         // Common
};

export default function LiveCard({ player, isHeld, onToggle, finalScore, isFaceDown = false }) {
  // 1. Ghost Check
  if (!player || !player.id) {
      return (
          <div className="relative w-full h-full perspective-1000 group">
             <div className="relative w-full h-full transition-all duration-500 transform-style-3d rotate-y-180">
                 <CardBack />
             </div>
          </div>
      );
  }

  // 2. Data Setup
  const isResultPhase = !!finalScore;
  const meta = (finalScore && finalScore.meta) ? finalScore.meta : player;
  const stats = (finalScore && finalScore.stats) ? finalScore.stats : (player.avg_stats || {});
  
  // Safe Cost & Tier
  const safeCost = meta.cost !== undefined ? meta.cost : 0;
  const tier = getTierStyle(safeCost);

  // Score Logic: Use 'score' if result exists, otherwise 'avg_fp' for projection
  const displayScore = isResultPhase ? (finalScore.score || 0) : (player.avg_fp || 0);
  
  // Safe Stats
  const safeStats = {
      pts: stats.pts || '-', reb: stats.reb || '-', ast: stats.ast || '-',
      stl: stats.stl || '-', blk: stats.blk || '-', to: stats.to || '-'
  };

  const isWin = isResultPhase && displayScore > (safeCost * 4); 

  // FALLBACK IMAGE
  const fallbackImage = "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png";

  return (
    <div 
      onClick={onToggle}
      className={`relative w-full h-full perspective-1000 cursor-pointer transition-transform duration-200 active:scale-95 ${isHeld ? 'z-10' : 'z-0'}`}
    >
      <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFaceDown ? 'rotate-y-180' : 'rotate-y-0'}`}>
        
        {/* FRONT OF CARD */}
        {/* BORDER LOGIC: Use Tier Border, or Yellow if Held */}
        <div className={`absolute inset-0 w-full h-full bg-slate-900 rounded-xl border-2 ${isHeld ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : tier.border} flex flex-col overflow-hidden backface-hidden`}>
            
            {/* IMAGE AREA */}
            <div className="relative h-[65%] w-full bg-gradient-to-b from-slate-800 to-slate-950 overflow-hidden">
                <img 
                    src={meta.image_url} 
                    alt={meta.name} 
                    className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300"
                    onError={(e) => {
                        if (e.target.src !== fallbackImage) {
                            e.target.src = fallbackImage;
                        }
                    }}
                />
                
                {/* Cost Badge (Color Coded) */}
                <div className="absolute top-1 right-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 z-20 flex items-center gap-1 shadow-lg">
                    <div className={`w-1.5 h-1.5 rounded-full ${tier.bg} animate-pulse`}></div>
                    <span className={`font-mono font-black text-[10px] md:text-xs ${tier.text}`}>
                        ${safeCost.toFixed(1)}
                    </span>
                </div>

                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent flex flex-col justify-end p-2 md:p-3 pb-1 md:pb-2">
                    <span className="text-[9px] md:text-xs text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5 md:mb-1 line-clamp-1">{meta.team || "NBA"}</span>
                    <span className="text-[11px] md:text-sm text-white font-black uppercase italic tracking-tighter leading-none line-clamp-1 drop-shadow-md">{meta.name || "Unknown"}</span>
                </div>
                
                {/* Hold Badge */}
                {isHeld && (
                    <div className="absolute bottom-1 right-1 bg-yellow-400 text-black text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-lg animate-pulse z-30">
                        HOLD
                    </div>
                )}
            </div>

            {/* DATA FOOTER */}
            <div className="h-[35%] bg-slate-950 border-t border-slate-800 flex flex-col justify-center p-1 relative z-10 shrink-0">
                
                {/* Desktop Stats (Hidden on Mobile) */}
                <div className="hidden md:grid grid-cols-3 gap-y-0.5 gap-x-1 mb-0.5">
                    <div className="flex flex-col items-center"><span className="text-[9px] font-bold text-white leading-none">{safeStats.pts}</span><span className="text-[5px] text-slate-500 font-black uppercase">PTS</span></div>
                    <div className="flex flex-col items-center"><span className="text-[9px] font-bold text-white leading-none">{safeStats.reb}</span><span className="text-[5px] text-slate-500 font-black uppercase">REB</span></div>
                    <div className="flex flex-col items-center"><span className="text-[9px] font-bold text-white leading-none">{safeStats.ast}</span><span className="text-[5px] text-slate-500 font-black uppercase">AST</span></div>
                </div>

                {/* FP SCORE (Visible Always) */}
                <div className="flex items-center justify-center bg-slate-900/50 rounded border border-white/5 py-0.5 md:py-1 w-full h-full max-h-[35px] md:max-h-none">
                    <span className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase mr-1.5 md:mr-2 tracking-widest">
                        {isResultPhase ? 'FP' : 'PROJ'}
                    </span>
                    <span className={`text-base md:text-xl font-mono font-black tracking-tighter ${
                        isResultPhase 
                            ? (isWin ? 'text-green-400' : 'text-red-400') 
                            : 'text-slate-300'
                    }`}>
                        {displayScore.toFixed(1)}
                    </span>
                </div>
            </div>

        </div>

        {/* BACK OF CARD */}
        <CardBack />

      </div>
    </div>
  );
}