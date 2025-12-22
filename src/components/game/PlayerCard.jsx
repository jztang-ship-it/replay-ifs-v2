import React, { useEffect, useState } from 'react';
import { getTeamTheme, getCostTextColor, getCostBorderColor, getPerformanceColor } from '../../engine/dealer';
import { getGameConfig } from '../../utils/gameConfig';
import { getBadgeEmoji } from '../../utils/badges';

const RollingNumber = ({ value, duration = 1000, delay = 0 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (start === end) return;
    let startTime = null;
    let timerId;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(easeOut * end));
      if (progress < 1) timerId = requestAnimationFrame(animate);
      else setDisplay(end);
    };
    const timeoutId = setTimeout(() => { timerId = requestAnimationFrame(animate); }, delay);
    return () => { cancelAnimationFrame(timerId); clearTimeout(timeoutId); };
  }, [value, duration, delay]);
  return <>{display}</>;
};

export default function PlayerCard({ player, isHeld, onToggle, finalScore, rotation, isRolling }) {
  const theme = getTeamTheme(player.team || 'NBA');
  const costColor = getCostTextColor(player.cost); 
  const borderColor = getCostBorderColor(player.cost);
  const config = getGameConfig();
  const statsLayout = config.statsMap;
  const scoreColor = finalScore ? getPerformanceColor(finalScore.score, player.avg) : 'text-white';
  const isMonsterGame = finalScore && finalScore.score >= 40;
  
  const style = {
    transform: `rotateY(${180 + (rotation * 180)}deg)`,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
  };

  const renderStatsGrid = (statsObj) => (
    <div className={`grid ${statsLayout.length > 4 ? 'grid-cols-3' : 'grid-cols-4'} gap-y-0.5 gap-x-1 text-[8px] font-mono text-slate-400 text-center leading-tight`}>
    {statsLayout.map((stat) => (
        <div key={stat.key}>
        <span className={`${stat.color} font-bold`}>
            {Math.round(statsObj?.[stat.key] || 0)}
        </span> {stat.label}
        </div>
    ))}
    </div>
  );

  return (
    // REDUCED HEIGHT: h-[20rem] / h-80
    <div 
      className={`relative w-48 h-[20rem] md:w-52 md:h-80 perspective-1000 cursor-pointer group transition-all duration-300 ${isHeld ? 'z-20' : 'hover:scale-105 z-10'}`} 
      onClick={onToggle}
    >
      <div className="relative w-full h-full duration-500" style={style}>
        
        {/* FRONT FACE */}
        <div className={`absolute w-full h-full bg-gradient-to-br ${theme.bg} rounded-2xl border-[3px] 
             ${isMonsterGame ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]' : borderColor} 
             backface-hidden flex flex-col shadow-2xl overflow-hidden`} 
             style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
          
          {/* Header */}
          <div className="w-full flex justify-between items-start z-20 p-3 pb-0 relative">
             <div className="text-[10px] font-black text-white/80 bg-black/40 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">{player.pos}</div>
             <div className={`text-2xl font-black ${costColor}`}>
                ${player.cost?.toFixed(1)}
             </div>
          </div>
          
          <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[90px] font-black text-white/5 select-none pointer-events-none z-0 tracking-tighter leading-none">
            {player.team}
          </div>

          {/* IMAGE */}
          <div className="absolute top-12 w-full h-[55%] z-10 flex items-end justify-center pointer-events-none">
             {player.img ? (
               <img 
                 src={player.img} 
                 alt={player.name}
                 className="h-full w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105 origin-bottom"
                 onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
               />
             ) : ( <div className="hidden"></div> )}
             <div className="hidden h-full w-full items-center justify-center text-6xl opacity-20 grayscale">🏀</div>
          </div>

          {/* NAME BAR - Adjusted position for shorter card */}
          <div className="absolute bottom-36 w-full z-20">
             <div className="bg-slate-950/70 backdrop-blur-md py-1 border-y border-white/5">
                <div className="text-sm font-black text-white text-center truncate px-2 tracking-tight leading-none drop-shadow-sm">{player.name}</div>
             </div>
          </div>

          {/* DATA CONTAINER */}
          <div className="absolute bottom-0 w-full h-36 bg-black/80 backdrop-blur-md z-20 border-t border-white/10 flex flex-col rounded-b-xl overflow-hidden">
             
             {isRolling ? (
               <div className="h-full flex items-center justify-center">
                 <span className={`text-lg ${theme.accent} animate-pulse font-mono tracking-widest`}>•••</span>
               </div>
             ) : finalScore ? (
               <>
                 {/* 1. Labels/Badges */}
                 <div className="h-8 flex items-center justify-center gap-2 pt-1 relative z-10">
                    {finalScore.bonuses && finalScore.bonuses.length > 0 ? (
                        finalScore.bonuses.map((badge, i) => (
                            <span key={i} className="text-2xl animate-in zoom-in drop-shadow-md leading-none" title={badge}>
                                {getBadgeEmoji(badge)}
                            </span>
                        ))
                    ) : (
                        <span className="text-[8px] text-white/30 italic font-bold uppercase tracking-wider">Final Result</span>
                    )}
                 </div>
                 
                 {/* 2. Score */}
                 <div className="h-14 flex items-center justify-center z-20 relative">
                    <span className={`text-4xl font-black leading-none ${scoreColor} filter drop-shadow-lg`}>
                      <RollingNumber value={finalScore.score} duration={1200} />
                    </span>
                    {finalScore.totalBonus > 0 && (
                      <span className="text-lg font-black text-yellow-400 ml-0.5 -mt-4 animate-in fade-in slide-in-from-bottom-2">
                        (+{finalScore.totalBonus})
                      </span>
                    )}
                 </div>
                 
                 {/* 3. Stats */}
                 <div className="h-14 flex items-end justify-center pb-2 px-2 z-10 relative">
                    {renderStatsGrid(finalScore.stats)}
                 </div>
               </>
             ) : (
               <>
                 <div className="h-8 flex items-center justify-center pt-1">
                    <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">SEASON AVG</span>
                 </div>
                 <div className="h-14 flex items-center justify-center">
                    <span className="text-3xl font-black text-slate-200">{player.avg} <span className="text-[10px] text-slate-500">FP</span></span>
                 </div>
                 <div className="h-14 flex items-end justify-center pb-2 px-2 opacity-80">
                    {player.avgStats && renderStatsGrid(player.avgStats)}
                 </div>
               </>
             )}
          </div>

          {/* HOLD OVERLAY - REMOVED BLUR, JUST TINT */}
          {isHeld && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-black/60">
              <div className="bg-blue-600 text-white text-lg font-black px-6 py-2 rounded-full border-2 border-white/20 shadow-2xl animate-in zoom-in duration-200 tracking-widest">
                HOLD
              </div>
            </div>
          )}
        </div>

        {/* BACK FACE */}
        <div className="absolute w-full h-full bg-slate-950 rounded-2xl border-[3px] border-slate-800 backface-hidden flex flex-col items-center justify-center p-6"
             style={{ backfaceVisibility: 'hidden' }}>
           <img src="/assets/Beta-logo.png" alt="IFS" className="w-20 h-20 object-contain opacity-50 grayscale" />
           <div className="mt-4 text-[10px] font-bold tracking-[0.3em] text-slate-600 uppercase">REPLAY</div>
        </div>

      </div>
    </div>
  );
}