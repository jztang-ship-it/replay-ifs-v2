import React, { useState } from 'react';

const CardBack = () => (
    <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl backface-hidden rotate-y-180">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center relative">
            <span className="text-xl md:text-4xl font-black italic text-slate-800 drop-shadow-sm transform -rotate-12 select-none">REPLAY</span>
        </div>
    </div>
);

// TIER COLORS
const getTierStyle = (cost) => {
    if (cost >= 13) return { border: 'border-amber-400', text: 'text-amber-400', bg: 'bg-amber-400', grad: 'from-amber-900 to-slate-900' };
    if (cost >= 10) return { border: 'border-purple-400', text: 'text-purple-400', bg: 'bg-purple-400', grad: 'from-purple-900 to-slate-900' };
    if (cost >= 7)  return { border: 'border-blue-400', text: 'text-blue-400', bg: 'bg-blue-400', grad: 'from-blue-900 to-slate-900' };
    return { border: 'border-slate-600', text: 'text-slate-400', bg: 'bg-slate-500', grad: 'from-slate-800 to-slate-900' };
};

export default function LiveCard(props) {
  // IMAGE STATE
  const [imgError, setImgError] = useState(false);

  // UNWRAP LOGIC
  let player = props.player;
  if (player && player.player) player = player.player; 
  if (player && player.meta) player = player.meta;

  const { isHeld, onToggle, finalScore, isFaceDown = false } = props;

  // GHOST CHECK
  if (!player || (!player.id && !player.name)) {
      return (
          <div className="relative w-full h-full perspective-1000 group">
             <div className="relative w-full h-full transition-all duration-500 transform-style-3d rotate-y-180"><CardBack /></div>
          </div>
      );
  }

  // DATA SETUP
  const isResultPhase = !!finalScore;
  const meta = (finalScore && finalScore.meta) ? finalScore.meta : player;
  
  const safeCost = meta.cost !== undefined ? meta.cost : (meta.price || 0);
  const tier = getTierStyle(safeCost);

  // --- THE FIX IS HERE ---
  // Added 'meta.avg' to the front of the line!
  const rawProj = meta.avg || meta.avg_fp || meta.fp || meta.projected || 0;
  
  const displayScore = isResultPhase ? (finalScore.score || 0) : rawProj;
  const isWin = isResultPhase && displayScore > (safeCost * 4); 

  const getInitials = (name) => {
      if (!name) return "??";
      return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div 
      onClick={onToggle}
      className={`relative w-full h-full perspective-1000 cursor-pointer transition-transform duration-200 active:scale-95 ${isHeld ? 'z-10' : 'z-0'}`}
    >
      <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFaceDown ? 'rotate-y-180' : 'rotate-y-0'}`}>
        
        {/* FRONT */}
        <div className={`absolute inset-0 w-full h-full bg-slate-900 rounded-xl border-2 ${isHeld ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : tier.border} flex flex-col overflow-hidden backface-hidden`}>
            
            {/* IMAGE AREA */}
            <div className={`relative flex-1 w-full bg-gradient-to-b ${tier.grad} overflow-hidden min-h-0`}>
                
                {/* LAYER 1: Initials */}
                <div className="absolute inset-0 flex items-center justify-center z-0">
                    <span className="text-5xl md:text-6xl font-black text-white/20 tracking-tighter select-none scale-150 transform -rotate-12">
                        {getInitials(meta.name)}
                    </span>
                </div>

                {/* LAYER 2: Real Image */}
                {!imgError && (
                    <img 
                        src={meta.image_url} 
                        alt={meta.name} 
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover object-top z-10 transition-opacity duration-300"
                        onError={() => setImgError(true)}
                    />
                )}
                
                {/* Cost Badge */}
                <div className="absolute top-1 right-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 z-20 flex items-center gap-1 shadow-lg">
                    <div className={`w-1.5 h-1.5 rounded-full ${tier.bg} animate-pulse`}></div>
                    <span className={`font-mono font-black text-[10px] md:text-xs ${tier.text}`}>
                        ${safeCost.toFixed(1)}
                    </span>
                </div>

                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent flex flex-col justify-end p-2 md:p-3 pb-1 md:pb-2 z-20">
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
            <div className="shrink-0 h-[35%] min-h-[40px] bg-slate-950 border-t border-slate-800 flex flex-col justify-center p-1 relative z-10">
                <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded border border-white/5 py-1 w-full h-full overflow-hidden">
                    
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isResultPhase ? 'text-slate-400' : 'text-yellow-500'}`}>
                            {isResultPhase ? 'FP' : 'PROJ'}
                        </span>
                        <span className={`text-lg md:text-xl font-mono font-black tracking-tighter ${
                            isResultPhase 
                                ? (isWin ? 'text-green-400' : 'text-red-400') 
                                : 'text-white' 
                        }`}>
                            {displayScore.toFixed(1)}
                        </span>
                    </div>

                </div>
            </div>

        </div>
        <CardBack />
      </div>
    </div>
  );
}