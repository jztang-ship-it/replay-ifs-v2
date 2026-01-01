import React, { useState, useEffect, useRef } from 'react';

const ScoreRoller = ({ value }) => {
  const [display, setDisplay] = useState(() => parseFloat(value) || 0);
  const targetRef = useRef(parseFloat(value) || 0);
  useEffect(() => {
    const end = parseFloat(value) || 0;
    if (Math.abs(targetRef.current - end) < 0.1) { targetRef.current = end; setDisplay(end); return; }
    // Super fast roller
    const start = display; targetRef.current = end; const duration = 300; let startTime;
    const animate = (time) => { if (!startTime) startTime = time; const progress = Math.min((time - startTime) / duration, 1); const ease = 1 - Math.pow(1 - progress, 4); const current = start + (end - start) * ease; setDisplay(current); if (progress < 1) requestAnimationFrame(animate); else setDisplay(end); };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{display.toFixed(1)}</>;
};

const formatGameDate = (dateString) => {
    if (!dateString || dateString === 'NO DATA') return "TODAY";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TODAY";
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
};

const getTierStyle = (cost) => {
    const val = parseFloat(cost || 0);
    // Removed all glows/shadows for maximum sharpness
    if (val >= 5.0) return { border: 'border-amber-400', text: 'text-amber-400', bg: 'bg-amber-400', grad: 'from-amber-900' };
    if (val >= 4.0) return { border: 'border-purple-400', text: 'text-purple-400', bg: 'bg-purple-400', grad: 'from-purple-900' };
    if (val >= 2.5) return { border: 'border-blue-400', text: 'text-blue-400', bg: 'bg-blue-400', grad: 'from-blue-900' };
    return { border: 'border-slate-600', text: 'text-slate-400', bg: 'bg-slate-500', grad: 'from-slate-800' };
};

const getTrueProjection = (player) => {
    return (player?.cost || 0) * 9.5; 
};

export default function LiveCard(props) {
  const [imgError, setImgError] = useState(false);
  const [manualFlip, setManualFlip] = useState(false); 
  const { player, isHeld, onToggle, finalScore, isFaceDown, showResult } = props;

  useEffect(() => { setManualFlip(false); }, [player?.id]);
  const handleClick = () => { if (showResult && finalScore) setManualFlip(!manualFlip); else onToggle && onToggle(); };

  const meta = player || { cost: 0, name: '', team: '' };
  const tier = getTierStyle(meta.cost);
  
  // FIXED SOURCE: Using the standard 260x190 endpoint which is sharper and more consistent
  const nbaImage = player ? `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${meta.id}.png` : null;
  
  const trueProjection = getTrueProjection(player);
  const displayScore = (showResult && finalScore) ? finalScore.score : trueProjection;
  const scoreColor = (showResult && finalScore && displayScore >= trueProjection * 1.15) ? 'text-green-400' : (showResult && finalScore && displayScore <= trueProjection * 0.85 ? 'text-red-400' : 'text-white');
  const showBack = isFaceDown || manualFlip;

  return (
    <div onClick={handleClick} className={`relative w-full h-full perspective-1000 cursor-pointer transition-transform duration-100 active:scale-95 transform-gpu ${isHeld ? 'z-10 scale-105' : 'z-0'}`}>
      <div className={`relative w-full h-full transition-all duration-300 transform-style-3d ${showBack ? 'rotate-y-180' : ''}`}>
        
        {/* --- FRONT FACE --- */}
        {player ? (
            <div className={`absolute inset-0 w-full h-full bg-slate-900 rounded-lg border-[1.5px] ${tier.border} flex flex-col overflow-hidden backface-hidden antialiased`}>
                <div className={`relative flex-1 w-full bg-gradient-to-b ${tier.grad} to-slate-950 overflow-hidden min-h-0`}>
                    
                    {/* PLAYER IMAGE - Added mix-blend-mode to blend better with dark bg, and optimized contrast */}
                    {!imgError && nbaImage ? (
                        <img 
                            src={nbaImage} 
                            className="absolute inset-0 w-full h-full object-cover object-top z-10 [image-rendering:-webkit-optimize-contrast]" 
                            onError={()=>setImgError(true)}
                            loading="eager"
                        />
                    ) : null}
                    
                    {/* COST BADGE - Sharp, no shadows */}
                    <div className="absolute top-1 right-1 z-20 bg-black/60 rounded px-1 backdrop-blur-[2px]">
                        <span className={`font-mono font-black text-xs ${tier.text}`}>${meta.cost.toFixed(1)}</span>
                    </div>

                    {/* HOLD BADGE - FIXED: Removed blur/pulse/shadow for pure sharpness */}
                    {isHeld && (
                        <div className="absolute top-0.5 left-0.5 z-30">
                            <div className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm border border-black leading-none">
                                HOLD
                            </div>
                        </div>
                    )}
                    
                    {/* BONUS ICONS - Sharp containers */}
                    {showResult && finalScore?.badges?.length > 0 && (
                        <div className="absolute bottom-9 left-1 flex flex-wrap gap-0.5 z-30">
                            {finalScore.badges.map((b, i) => (
                                <div key={i} className="bg-black border border-slate-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] pb-0.5" title={b.label}>
                                    {b.icon} 
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* NAME PLATE - Minimized Gradient (No chin blur) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-1 z-20 pt-4">
                        <span className="text-[7px] text-slate-400 font-bold uppercase leading-none mb-0.5 tracking-tight">{meta.team}</span>
                        <span className="text-[10px] text-white font-black uppercase italic leading-none line-clamp-1 tracking-tight">{meta.name}</span>
                    </div>
                </div>
                
                {/* SCORE FOOTER */}
                <div className="shrink-0 h-[22%] bg-slate-950 border-t border-slate-800 flex flex-col justify-center p-0.5 relative z-30">
                    <div className="flex items-center justify-center gap-1.5 leading-none">
                        <span className={`text-[7px] font-black uppercase tracking-widest ${showResult ? 'text-slate-500' : 'text-yellow-500'}`}>{showResult ? 'FP' : 'PROJ'}</span>
                        <span className={`text-xl font-mono font-black tracking-tighter ${scoreColor}`}><ScoreRoller value={displayScore} /></span>
                    </div>
                </div>
            </div>
        ) : (
             <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-lg border-2 border-slate-800 flex items-center justify-center backface-hidden">
             </div>
        )}

        {/* --- BACK FACE (Stats) --- */}
        <div className={`absolute inset-0 w-full h-full bg-slate-900 rounded-lg border-2 border-slate-700 flex flex-col overflow-hidden backface-hidden rotate-y-180 p-1 antialiased`}>
            {manualFlip && finalScore ? (
                <>
                    <div className="border-b border-slate-800 pb-0.5 mb-0.5 flex justify-between items-center">
                        <div className="text-[8px] text-white font-black uppercase italic truncate w-[75%]">{meta.name}</div>
                        <div className="text-[7px] text-slate-500 font-bold">{meta.team}</div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900 px-1.5 py-1 rounded border border-slate-800 mb-1">
                        <div className="flex items-center gap-1">
                            <span className="text-[7px] text-slate-400 font-bold uppercase">FP</span>
                            <div className={`text-sm font-mono font-black leading-none ${scoreColor}`}>{displayScore.toFixed(1)}</div>
                        </div>
                    </div>
                    <div className="text-center mb-1 border-b border-slate-800/50 pb-0.5">
                        <span className="text-[8px] text-slate-400 font-mono font-bold uppercase">{formatGameDate(finalScore.date)} | <span className="text-white">{finalScore.matchup || 'v OPP'}</span></span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mt-auto">
                        <div className="bg-slate-950 p-1 rounded text-center border border-slate-800"><div className="text-[6px] text-slate-500 font-bold">PTS</div><div className="text-[10px] text-white font-mono font-bold">{finalScore.stats?.pts || 0}</div></div>
                        <div className="bg-slate-950 p-1 rounded text-center border border-slate-800"><div className="text-[6px] text-slate-500 font-bold">REB</div><div className="text-[10px] text-white font-mono font-bold">{finalScore.stats?.reb || 0}</div></div>
                        <div className="bg-slate-950 p-1 rounded text-center border border-slate-800"><div className="text-[6px] text-slate-500 font-bold">AST</div><div className="text-[10px] text-white font-mono font-bold">{finalScore.stats?.ast || 0}</div></div>
                    </div>
                </>
            ) : (
                <div className="w-full h-full flex items-center justify-center relative bg-slate-950">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center animate-pulse">
                        <span className="text-[8px] font-black text-slate-600">REPLAY</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}