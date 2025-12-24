import React, { useState, useEffect } from 'react';

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

export default function PlayerCard({ player, isHeld, onToggle, finalScore, isFaceDown }) {
  const getTierStyles = () => {
    if (!player) return { border: 'border-slate-800', text: 'text-slate-400' };
    if (isHeld) return { border: 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]', text: 'text-yellow-400' };
    const cost = parseFloat(player.cost || 0);
    if (cost >= 5.0) return { border: 'border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]', text: 'text-orange-500' };
    if (cost >= 4.0) return { border: 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]', text: 'text-purple-400' };
    if (cost >= 3.0) return { border: 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]', text: 'text-blue-400' };
    if (cost >= 2.0) return { border: 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]', text: 'text-green-400' };
    return { border: 'border-slate-300', text: 'text-white' };
  };
  const tier = getTierStyles();

  const isProjected = !finalScore;
  const projectedScore = (parseFloat(player?.cost) || 0) * 6.0;
  const displayScore = isProjected ? projectedScore : finalScore.score;
  const displayStats = isProjected ? (player?.avg || { pts: '-', reb: '-', ast: '-', stl: '-', blk: '-', to: '-' }) : finalScore.rawStats;
  const badges = finalScore?.badges || [];
  const bonus = finalScore?.bonus || 0;

  const getScoreStyle = () => {
    if (isProjected) return { display: 'none' };
    const actual = finalScore.score;
    if (actual >= projectedScore * 1.15) return { color: '#4ade80', textShadow: '0 0 10px rgba(74,222,128,0.6)' }; 
    if (actual <= projectedScore * 0.85) return { color: '#ef4444', textShadow: '0 0 10px rgba(239,68,68,0.6)' }; 
    return { color: '#ffffff' }; 
  };
  const scoreStyle = getScoreStyle();

  const StatBlock = ({ label, value }) => (
    <div className="flex flex-col items-center w-8">
      <span className="text-white font-bold text-[10px] md:text-xs leading-none">{value}</span>
      <span className="text-[8px] text-slate-500 font-bold mt-0.5">{label}</span>
    </div>
  );

  return (
    <div onClick={!isFaceDown ? onToggle : undefined} className={`group relative w-full h-full cursor-pointer transition-all duration-200 ${!isFaceDown && !isHeld ? 'hover:-translate-y-1' : ''}`} style={{ perspective: '1000px' }}>
      <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: isFaceDown ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <div className={`absolute inset-0 w-full h-full bg-black rounded-xl border-[3px] overflow-hidden flex flex-col ${tier.border}`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
          {player ? (
            <>
              <div className="flex justify-between items-start p-2 z-20">
                <span className="text-[10px] font-black text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded backdrop-blur-md">{player.team}</span>
                <span className={`text-sm font-black drop-shadow-md ${tier.text}`}>${player.cost}</span>
              </div>

              <div className="relative flex-1 flex flex-col items-center justify-end pb-2">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-black"></div>
                <img src={player.image} alt={player.name} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-auto h-[95%] object-contain drop-shadow-xl z-10" />
                
                {/* BIG SCORE OVERLAY (HIDDEN IF PROJECTED) */}
                {!isProjected && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-6">
                      <div className="text-5xl md:text-6xl font-black tracking-tighter whitespace-nowrap leading-none flex items-center justify-center h-20 w-full" style={scoreStyle}>
                        <CardScoreRoller value={displayScore} />
                      </div>
                      {bonus > 0 && <div className="flex items-center gap-1 mt-[-8px]"><span className="text-xs font-bold text-yellow-400 animate-pulse">(+{bonus})</span></div>}
                      {badges.length > 0 && <div className="flex gap-1 mt-1 bg-black/60 rounded-full px-2 py-0.5 backdrop-blur-sm border border-white/10 shadow-lg">{badges.map((b, i) => <span key={i} className="text-xs">{b}</span>)}</div>}
                  </div>
                )}
                
                <div className="absolute bottom-1 w-full text-center z-20 px-1">
                   <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-wider drop-shadow-md line-clamp-1 truncate px-2">{player.name}</h3>
                </div>
              </div>

              <div className="bg-black/80 backdrop-blur-sm flex flex-col pt-1 border-t border-slate-800/50 shrink-0">
                 <div className="flex justify-around items-center px-2 py-1 border-b border-slate-800/50">
                    <StatBlock label="PTS" value={displayStats.pts} />
                    <StatBlock label="REB" value={displayStats.reb} />
                    <StatBlock label="AST" value={displayStats.ast} />
                 </div>
                 
                 {/* FOOTER ROW */}
                 <div className="py-1 text-center bg-slate-950/50">
                    {isProjected ? (
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">PROJ</span>
                            <span className="text-xs font-mono font-bold text-white">{projectedScore.toFixed(1)}</span>
                        </div>
                    ) : (
                        <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{finalScore.date}</span>
                    )}
                 </div>
              </div>

              {isHeld && (
                <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                  <div className="bg-yellow-500 text-black text-xs font-black px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)] border-2 border-white tracking-[0.2em] uppercase transform scale-110">HOLD</div>
                </div>
              )}
            </>
          ) : null}
        </div>
        <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-xl border-2 border-slate-700 flex items-center justify-center overflow-hidden" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="w-16 h-20 border-2 border-slate-600 rounded opacity-20 transform rotate-12"></div>
          <div className="absolute text-slate-500 font-black text-xl tracking-[0.2em]">REPLAY</div>
        </div>
      </div>
    </div>
  );
}