import React, { useState, useEffect } from 'react';

// Rolling Score Counter
const CardScoreRoller = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    if (end === 0) return;
    const duration = 1000; 
    let startTime;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * ease);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span>{display.toFixed(1)}</span>;
};

export default function LiveCard({ player, isHeld, onToggle, finalScore, isFaceDown }) {
  
  // 1. TIER STYLES (Border Colors)
  const getTierStyles = () => {
    if (!player) return { border: 'border-slate-800', text: 'text-slate-400' };
    if (isHeld) return { border: 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]', text: 'text-yellow-400' };
    
    const cost = parseFloat(player.cost || 0);
    if (cost >= 5.0) return { border: 'border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]', text: 'text-orange-500' };
    if (cost >= 4.0) return { border: 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]', text: 'text-purple-400' };
    if (cost >= 3.0) return { border: 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]', text: 'text-blue-400' };
    if (cost >= 2.0) return { border: 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]', text: 'text-green-400' };
    
    return { border: 'border-slate-500', text: 'text-white' };
  };
  const tier = getTierStyles();

  // 2. DATA PREP
  const isProjected = !finalScore;
  const projectedScore = (parseFloat(player?.cost) || 0) * 10.0;
  const displayStats = isProjected ? (player?.avg || {}) : finalScore.rawStats;
  const badges = finalScore?.badges || []; 
  const bonus = finalScore?.bonus || 0;

  // 3. COLOR LOGIC
  const getFpColor = () => {
    if (isProjected) return 'text-slate-300';
    const actual = finalScore.score;
    if (actual >= projectedScore * 1.15) return 'text-green-400 font-black drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]';
    if (actual <= projectedScore * 0.85) return 'text-red-500 font-black drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]';
    return 'text-white font-bold';
  };
  const fpColorClass = getFpColor();

  const StatItem = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center h-full">
      <span className="text-[10px] text-white font-bold leading-none">{value !== undefined ? value : '-'}</span>
      <span className="text-[6px] text-slate-500 font-bold uppercase scale-75 origin-top">{label}</span>
    </div>
  );

  return (
    <div onClick={!isFaceDown ? onToggle : undefined} className={`group relative w-full h-full cursor-pointer transition-all duration-200 ${!isFaceDown && !isHeld ? 'hover:-translate-y-1' : ''}`} style={{ perspective: '1000px' }}>
      <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: isFaceDown ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        
        {/* FRONT */}
        <div className={`absolute inset-0 w-full h-full bg-slate-950 rounded-xl border-[2px] overflow-hidden flex flex-col ${tier.border}`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
          {player ? (
            <>
              {/* IMAGE (Full Bleed - No Top Border) */}
              <div className="relative flex-1 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-black z-0"></div>
                
                {/* Image Scaled to 115% to kill empty space */}
                <img 
                  src={player.image} 
                  alt={player.name}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[115%] object-contain object-top z-10 drop-shadow-2xl"
                />

                {/* Name Overlay */}
                <div className="absolute bottom-0 w-full text-center z-20 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-1">
                   <h3 className="text-[9px] font-black text-white uppercase tracking-wider line-clamp-1 px-1 drop-shadow-md">{player.name}</h3>
                </div>

                {/* Salary Badge */}
                <div className="absolute top-1 right-1 z-30">
                    <div className={`text-[9px] font-black ${tier.text} bg-black/80 px-1.5 py-0.5 rounded border border-white/10 shadow-lg`}>
                        ${player.cost}
                    </div>
                </div>
              </div>

              {/* FOOTER (5 Rows) */}
              <div className="bg-black border-t border-slate-800 p-0.5 shrink-0 z-30 relative flex flex-col gap-[1px]">
                 
                 {/* Row 1: Badges */}
                 <div className="h-4 flex items-center justify-center gap-1 bg-slate-900/50 rounded-sm">
                    {badges.length > 0 ? (
                        badges.map((b, i) => <span key={i} className="text-xs animate-pulse">{b}</span>)
                    ) : (
                        <span className="text-[6px] text-slate-700 font-bold uppercase tracking-widest">- NO ICONS -</span>
                    )}
                 </div>

                 {/* Row 2: Date */}
                 <div className="text-center bg-slate-900/30">
                    {isProjected ? (
                        <span className="text-[6px] text-slate-500 font-bold uppercase tracking-widest">SEASON AVG</span>
                    ) : (
                        <span className="text-[6px] text-orange-400 font-bold uppercase tracking-widest">{finalScore.date}</span>
                    )}
                 </div>

                 {/* Row 3: Offense */}
                 <div className="grid grid-cols-3 gap-0.5 bg-slate-900/30 rounded-sm py-0.5">
                    <StatItem label="PTS" value={displayStats.pts} />
                    <StatItem label="REB" value={displayStats.reb} />
                    <StatItem label="AST" value={displayStats.ast} />
                 </div>

                 {/* Row 4: Defense */}
                 <div className="grid grid-cols-3 gap-0.5 bg-slate-900/30 rounded-sm py-0.5">
                    <StatItem label="STL" value={displayStats.stl} />
                    <StatItem label="BLK" value={displayStats.blk} />
                    <StatItem label="TO" value={displayStats.to} />
                 </div>

                 {/* Row 5: Score */}
                 <div className="bg-slate-800 rounded mx-0.5 py-0.5 mt-0.5 text-center border border-slate-700 flex items-center justify-center gap-1">
                    <span className="text-[7px] text-slate-400 font-bold uppercase">
                        {isProjected ? 'PROJ' : 'FP'}
                    </span>
                    <span className={`text-[10px] font-mono ${isProjected ? 'text-white' : fpColorClass}`}>
                        {isProjected ? projectedScore.toFixed(1) : (
                            <>
                                <CardScoreRoller value={finalScore.score} />
                                {bonus > 0 && <span className="text-[8px] text-yellow-400 ml-0.5">({bonus})</span>}
                            </>
                        )}
                    </span>
                 </div>
              </div>

              {/* Hold Overlay */}
              {isHeld && (
                <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                  <div className="bg-yellow-500/90 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)] border-2 border-white tracking-widest uppercase transform scale-110 backdrop-blur-sm">
                      HOLD
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* BACK */}
        <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-xl border-2 border-slate-700 flex items-center justify-center overflow-hidden" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="absolute text-slate-700 font-black text-lg tracking-[0.2em] opacity-30 rotate-45">REPLAY</div>
        </div>
      </div>
    </div>
  );
}