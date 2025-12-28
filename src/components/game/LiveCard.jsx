import React from 'react';

const CardBack = () => (
    <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl backface-hidden rotate-y-180">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50"></div>
            <span className="text-3xl md:text-4xl font-black italic text-slate-800 drop-shadow-sm transform -rotate-12 select-none">REPLAY</span>
        </div>
    </div>
);

export default function LiveCard({ player, isHeld, onToggle, finalScore, isFaceDown = false }) {
  if (isFaceDown || !player) {
      return (
          <div className="relative w-full h-full perspective-1000 group">
             <div className="relative w-full h-full transition-all duration-500 transform-style-3d rotate-y-180">
                 <CardBack />
             </div>
          </div>
      );
  }

  const { meta, stats, score } = finalScore || { meta: player, stats: player.avg_stats || {}, score: 0 };
  const safeStats = {
      pts: stats.pts || '-', reb: stats.reb || '-', ast: stats.ast || '-',
      stl: stats.stl || '-', blk: stats.blk || '-', to: stats.to || '-'
  };

  const isWin = score > (player.cost * 4); 

  return (
    <div 
      onClick={onToggle}
      className={`relative w-full h-full perspective-1000 cursor-pointer transition-transform duration-200 active:scale-95 ${isHeld ? 'z-10' : 'z-0'}`}
    >
      <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFaceDown ? 'rotate-y-180' : 'rotate-y-0'}`}>
        
        {/* FRONT */}
        <div className={`absolute inset-0 w-full h-full bg-slate-900 rounded-xl border ${isHeld ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'border-slate-800'} flex flex-col overflow-hidden backface-hidden`}>
            
            {/* 1. IMAGE CONTAINER - Flex-1 ensures it fills available space */}
            <div className="relative flex-1 bg-gradient-to-b from-slate-800 to-slate-900 w-full overflow-hidden">
                <img 
                    src={meta.image_url} 
                    alt={meta.name} 
                    className="absolute w-[125%] max-w-none left-1/2 -translate-x-1/2 top-0 object-cover object-top"
                />
                
                {/* Cost Badge */}
                <div className="absolute top-1 right-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-white font-mono font-black text-[10px] md:text-xs shadow-lg border border-white/10 z-20">
                    ${meta.cost.toFixed(2)}
                </div>

                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent flex flex-col justify-end p-2 md:p-3 pb-1 md:pb-2">
                    <span className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5 md:mb-1 line-clamp-1">{meta.team}</span>
                    <span className="text-xs md:text-sm text-white font-black uppercase italic tracking-tighter leading-none line-clamp-1 drop-shadow-md">{meta.name}</span>
                </div>
                
                {/* Hold Badge */}
                {isHeld && (
                    <div className="absolute bottom-1 right-1 bg-yellow-400 text-black text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-lg animate-pulse z-30">
                        HOLD
                    </div>
                )}
            </div>

            {/* 2. DATA FOOTER */}
            {/* On Mobile: Only shows FP Score. On Desktop: Shows Stats + FP */}
            <div className="h-auto bg-slate-950 border-t border-slate-800 flex flex-col justify-center p-1.5 md:p-2 relative z-10 shrink-0">
                
                {/* Stats Grid (Desktop Only) */}
                <div className="hidden md:grid grid-cols-3 gap-y-1 gap-x-2 mb-1">
                    {/* ... (same stats markup as before) ... */}
                </div>

                {/* FP Score (Always Visible) */}
                <div className="flex items-center justify-center bg-slate-900/50 rounded border border-white/5 py-1 md:py-1.5 w-full">
                    <span className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase mr-1.5 md:mr-2">FP</span>
                    <span className={`text-base md:text-xl font-mono font-black tracking-tighter ${finalScore ? (isWin ? 'text-green-400' : 'text-red-400') : 'text-slate-600'}`}>
                        {finalScore ? score.toFixed(1) : '---'}
                    </span>
                </div>
            </div>

        </div>

        {/* BACK */}
        <CardBack />

      </div>
    </div>
  );
}