import React, { useEffect, useState } from 'react';
import { getTeamTheme, getCostTextColor } from '../../engine/dealer';

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

    const timeoutId = setTimeout(() => {
      timerId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      cancelAnimationFrame(timerId);
      clearTimeout(timeoutId);
    };
  }, [value, duration, delay]);

  return <>{display}</>;
};

export default function PlayerCard({ player, isHeld, onToggle, finalScore, rotation, isRolling }) {
  const theme = getTeamTheme(player.team || 'NBA');
  const costColor = getCostTextColor(player.cost); // NEW: Get Color
  
  const isMonsterGame = finalScore && finalScore.score >= 40;
  
  const style = {
    transform: `rotateY(${180 + (rotation * 180)}deg)`,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  return (
    <div 
      className={`relative w-48 h-72 md:w-52 md:h-80 perspective-1000 cursor-pointer group transition-all duration-300 ${isHeld ? 'scale-105 z-20' : 'hover:scale-105 z-10'}`} 
      onClick={onToggle}
    >
      <div className="relative w-full h-full duration-500" style={style}>
        
        {/* --- FRONT FACE --- */}
        <div className={`absolute w-full h-full bg-gradient-to-br ${theme.bg} rounded-2xl border-[3px] 
             ${isMonsterGame ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]' : theme.border} 
             backface-hidden flex flex-col items-center shadow-2xl overflow-hidden`} 
             style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
          
          <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[90px] font-black text-white/5 select-none pointer-events-none z-0 tracking-tighter leading-none">
            {player.team}
          </div>
          
          <div className="w-full flex justify-between items-start z-20 p-3 pb-0">
             <div className="text-[10px] font-black text-white/80 bg-black/40 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">{player.pos}</div>
             {/* APPLIED TEXT COLOR HERE */}
             <div className={`text-2xl font-black ${costColor}`}>
                ${player.cost?.toFixed(1)}
             </div>
          </div>

          <div className="absolute bottom-20 w-full h-[65%] z-10 flex items-end justify-center pointer-events-none">
             {player.img ? (
               <img 
                 src={player.img} 
                 alt={player.name}
                 className="h-full w-auto object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-110 origin-bottom"
                 onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
               />
             ) : ( <div className="hidden"></div> )}
             <div className="hidden h-full w-full items-center justify-center text-6xl opacity-20 grayscale">🏀</div>
          </div>

          <div className="absolute bottom-28 w-full text-center z-20 px-1">
             <div className="text-sm font-bold text-white truncate px-2 drop-shadow-md">{player.name}</div>
             <div className="text-[9px] font-black uppercase text-white/50 tracking-wider">{player.team}</div>
          </div>

          <div className="absolute bottom-0 w-full h-28 bg-black/80 backdrop-blur-md z-20 border-t border-white/10 flex flex-col justify-center rounded-b-xl px-2">
             {isRolling ? (
               <div className="text-center">
                 <span className={`text-lg ${theme.accent} animate-pulse font-mono tracking-widest`}>•••</span>
               </div>
             ) : finalScore ? (
               <>
                 <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1">
                   <span className="text-[9px] text-slate-400">{formatDate(finalScore.date)}</span>
                   <span className="text-[9px] text-slate-400">vs <span className="text-white font-bold">{finalScore.opp}</span></span>
                 </div>
                 
                 <div className="text-center mb-1">
                    <span className={`text-3xl font-black leading-none ${isMonsterGame ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse' : 'text-white'}`}>
                      <RollingNumber value={finalScore.score} duration={1200} />
                    </span>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-y-0.5 gap-x-1 text-[8px] font-mono text-slate-400 text-center leading-tight">
                    <div><span className="text-white font-bold">{Math.round(finalScore.stats?.pts)}</span> P</div>
                    <div><span className="text-white font-bold">{Math.round(finalScore.stats?.reb)}</span> R</div>
                    <div><span className="text-white font-bold">{Math.round(finalScore.stats?.ast)}</span> A</div>
                    <div><span className="text-slate-300">{Math.round(finalScore.stats?.stl)}</span> S</div>
                    <div><span className="text-slate-300">{Math.round(finalScore.stats?.blk)}</span> B</div>
                    <div><span className="text-red-400">{Math.round(finalScore.stats?.to)}</span> T</div>
                 </div>
               </>
             ) : (
               <div className="text-center flex flex-col items-center justify-center h-full pb-2">
                 <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">PROJECTED</span>
                 <span className="text-xl font-bold text-slate-200">{player.avg} <span className="text-[9px] text-slate-500">FP</span></span>
               </div>
             )}
          </div>

          {isHeld && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none bg-black/20">
              <div className="bg-blue-600 text-white text-lg font-black px-6 py-2 rounded-full border-2 border-white/20 shadow-2xl animate-in zoom-in duration-200 tracking-widest">
                HOLD
              </div>
            </div>
          )}
        </div>

        {/* --- BACK FACE --- */}
        <div className="absolute w-full h-full bg-slate-950 rounded-2xl border-[3px] border-slate-800 backface-hidden flex flex-col items-center justify-center p-6"
             style={{ backfaceVisibility: 'hidden' }}>
           <img src="/assets/Beta-logo.png" alt="IFS" className="w-20 h-20 object-contain opacity-50 grayscale" />
           <div className="mt-4 text-[10px] font-bold tracking-[0.3em] text-slate-600 uppercase">REPLAY</div>
        </div>

      </div>
    </div>
  );
}