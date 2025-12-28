import React, { useState } from 'react';

// --- CARD BACK WITH FRENCHIE LOGO ---
const CardBack = () => (
    <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl backface-hidden rotate-y-180">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
        
        {/* Gradient & Glow */}
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center relative gap-3 p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50"></div>
            
            {/* 3. LOGO ON CARD BACK */}
            <img 
                src="/images/logo-frenchie.png" 
                alt="Replay Logo" 
                className="w-20 h-20 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] relative z-10 opacity-90"
            />
            
            {/* CAPTION */}
            <span className="text-xs md:text-sm font-black italic uppercase text-slate-500 drop-shadow-sm tracking-[0.2em] relative z-10 text-center leading-tight">
                sports IS social
            </span>
        </div>
    </div>
);

// TIER LOGIC
const getTierStyle = (cost) => {
    const val = parseFloat(cost || 0);
    if (val >= 5.0) return { border: 'border-amber-400', text: 'text-amber-400', bg: 'bg-amber-400', grad: 'from-amber-900' };
    if (val >= 4.0) return { border: 'border-purple-400', text: 'text-purple-400', bg: 'bg-purple-400', grad: 'from-purple-900' };
    if (val >= 2.5) return { border: 'border-blue-400', text: 'text-blue-400', bg: 'bg-blue-400', grad: 'from-blue-900' };
    return { border: 'border-slate-600', text: 'text-slate-400', bg: 'bg-slate-500', grad: 'from-slate-800' };
};

export default function LiveCard(props) {
  const [imgError, setImgError] = useState(false);

  // UNWRAP
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

  // DATA
  const isResultPhase = !!finalScore;
  const meta = (finalScore && finalScore.meta) ? finalScore.meta : player;
  const safeCost = meta.cost !== undefined ? meta.cost : (meta.price || 0);
  const tier = getTierStyle(safeCost);
  const rawProj = meta.avg || meta.avg_fp || meta.fp || meta.projected || 0;
  const displayScore = isResultPhase ? (finalScore.score || 0) : rawProj;
  const isWin = isResultPhase && displayScore > (safeCost * 4); 

  // URL CONSTRUCTOR
  let finalImage = meta.image_url ? meta.image_url.replace("http://", "https://") : "";
  if (!finalImage && meta.id) {
      finalImage = `https://cdn.nba.com/headshots/nba/latest/1040x760/${meta.id}.png`;
  }
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "??";

  return (
    <div 
      onClick={onToggle}
      className={`relative w-full h-full perspective-1000 cursor-pointer transition-transform duration-200 active:scale-95 ${isHeld ? 'z-10' : 'z-0'}`}
    >
      <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFaceDown ? 'rotate-y-180' : 'rotate-y-0'}`}>
        
        {/* TAILWIND SAFELIST */}
        <div className="hidden border-amber-400 text-amber-400 bg-amber-400 from-amber-900 border-purple-400 text-purple-400 bg-purple-400 from-purple-900 border-blue-400 text-blue-400 bg-blue-400 from-blue-900 border-slate-600 text-slate-400 bg-slate-500 from-slate-800"></div>

        {/* FRONT */}
        <div className={`absolute inset-0 w-full h-full bg-slate-900 rounded-xl border-2 ${isHeld ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : tier.border} flex flex-col overflow-hidden backface-hidden`}>
            
            {/* IMAGE AREA */}
            <div className={`relative flex-1 w-full bg-gradient-to-b ${tier.grad} to-slate-950 overflow-hidden min-h-0`}>
                {!imgError && finalImage ? (
                    <img 
                        src={finalImage} 
                        alt={meta.name} 
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover object-top z-10 transition-opacity duration-300"
                        onError={() => setImgError(true)}
                    />
                ) : (
                   <div className="absolute inset-0 flex items-center justify-center z-0">
                        <span className="text-5xl md:text-6xl font-black text-white/20 tracking-tighter select-none scale-150 transform -rotate-12">
                            {getInitials(meta.name)}
                        </span>
                    </div>
                )}
                
                <div className="absolute top-1 right-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 z-20 flex items-center gap-1 shadow-lg">
                    <div className={`w-1.5 h-1.5 rounded-full ${tier.bg} animate-pulse`}></div>
                    <span className={`font-mono font-black text-[10px] md:text-xs ${tier.text}`}>${safeCost.toFixed(1)}</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent flex flex-col justify-end p-2 md:p-3 pb-1 md:pb-2 z-20">
                    <span className="text-[9px] md:text-xs text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5 md:mb-1 line-clamp-1">{meta.team || "NBA"}</span>
                    <span className="text-[11px] md:text-sm text-white font-black uppercase italic tracking-tighter leading-none line-clamp-1 drop-shadow-md">{meta.name || "Unknown"}</span>
                </div>
                
                {isHeld && (
                    <div className="absolute bottom-1 right-1 bg-yellow-400 text-black text-[8px] md:text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-lg animate-pulse z-30">HOLD</div>
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