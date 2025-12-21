import React, { useEffect, useState } from 'react';
import { getTierColor } from '../../engine/dealer';

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
  const tierColor = getTierColor(player.cost || 0);
  
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
      className={`relative w-52 h-80 perspective-1000 cursor-pointer group transition-all duration-300`} 
      onClick={onToggle}
    >
      <div className="relative w-full h-full duration-500" style={style}>
        
        {/* --- FRONT FACE --- */}
        <div className="absolute w-full h-full bg-slate-900 rounded-2xl border-[3px] border-slate-700 backface-hidden flex flex-col items-center p-2 shadow-2xl overflow-hidden" 
             style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
          
          <div className={`absolute inset-0 opacity-40 bg-gradient-to-br ${tierColor}`}></div>
          
          {/* HEADER: Compressed margin to give image room */}
          <div className="w-full flex justify-between items-start z-10 mb-0">
             <div className="text-[10px] font-black text-slate-300 bg-slate-950/60 px-2 py-0.5 rounded border border-white/5">{player.pos}</div>
             <div className="text-base font-black text-green-400 drop-shadow-md">${player.cost}</div>
          </div>

          {/* IMAGE FIX: 
              1. Height set to 85% (keeps head inside box).
              2. Scale-110 (makes it look big without changing layout flow).
              3. Object-bottom (anchors feet). 
          */}
          <div className="z-10 w-full flex-1 flex items-end justify-center relative overflow-hidden">
             {player.img ? (
               <img 
                 src={player.img} 
                 alt={player.name}
                 className="h-[85%] w-auto object-contain object-bottom drop-shadow-2xl scale-125 transform translate-y-2 group-hover:scale-135 transition-transform duration-300"
                 onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
               />
             ) : ( <div className="text-6xl self-center">🏀</div> )}
             <div className="text-6xl absolute hidden self-center">🏀</div>
          </div>

          {/* NAME PLATE */}
          <div className="text-center z-10 w-full px-1 mb-2 leading-none relative">
             <div className="absolute inset-0 bg-slate-900/40 blur-md -z-10 rounded-full"></div>
             <div className="text-[9px] font-black uppercase text-slate-300 tracking-wider mb-0.5">{player.team}</div>
             <div className="text-sm font-bold text-white truncate px-2">{player.name}</div>
          </div>

          {/* STATS BOX */}
          <div className="w-full h-24 bg-slate-950/90 rounded-xl p-2 z-10 border border-white/10 flex flex-col justify-center shadow-inner relative">
             {isRolling ? (
               <div className="text-center">
                 <span className="text-lg text-yellow-500 animate-pulse font-mono tracking-widest">•••</span>
               </div>
             ) : finalScore ? (
               <>
                 <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1">
                   <span className="text-[9px] text-slate-400">{formatDate(finalScore.date)}</span>
                   <span className="text-[9px] text-slate-400">vs <span className="text-white font-bold">{finalScore.opp}</span></span>
                 </div>
                 
                 <div className="text-center mb-1">
                    <span className={`text-3xl font-black leading-none ${finalScore.score >= 45 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'text-white'}`}>
                      <RollingNumber value={finalScore.score} duration={1200} />
                    </span>
                 </div>
                 
                 {finalScore.stats && (
                    <div className="grid grid-cols-3 gap-y-1 gap-x-1 text-[8px] font-mono text-slate-400 leading-tight">
                      <div className="text-center"><span className="text-white font-bold"><RollingNumber value={finalScore.stats.pts} delay={100} /></span> P</div>
                      <div className="text-center"><span className="text-white font-bold"><RollingNumber value={finalScore.stats.reb} delay={200} /></span> R</div>
                      <div className="text-center"><span className="text-white font-bold"><RollingNumber value={finalScore.stats.ast} delay={300} /></span> A</div>
                      <div className="text-center"><span className="text-slate-300"><RollingNumber value={finalScore.stats.stl} delay={400} /></span> S</div>
                      <div className="text-center"><span className="text-slate-300"><RollingNumber value={finalScore.stats.blk} delay={500} /></span> B</div>
                      <div className="text-center"><span className="text-red-400"><RollingNumber value={finalScore.stats.to} delay={600} /></span> T</div>
                    </div>
                 )}
               </>
             ) : (
               <div className="text-center flex flex-col items-center justify-center h-full">
                 <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider mb-1">PROJECTED</span>
                 <span className="text-xl font-bold text-slate-200">{player.avg}</span>
               </div>
             )}
          </div>

          {/* HOLD INDICATOR */}
          {isHeld && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="bg-blue-600/90 backdrop-blur-sm text-white text-xl font-black px-6 py-2 rounded-full border-2 border-white/20 shadow-2xl animate-in zoom-in duration-200 tracking-widest">
                HOLD
              </div>
            </div>
          )}
        </div>

        {/* --- BACK FACE --- */}
        <div className="absolute w-full h-full bg-slate-950 rounded-2xl border-[3px] border-slate-800 backface-hidden flex flex-col items-center justify-center p-6"
             style={{ backfaceVisibility: 'hidden' }}>
           <img src="/assets/Beta-logo.png" alt="IFS" className="w-24 h-24 object-contain opacity-80" onError={(e)=>{e.target.style.display='none';}}/>
           <div className="mt-4 text-[10px] font-bold tracking-[0.3em] text-slate-600 uppercase">REPLAY</div>
        </div>

      </div>
    </div>
  );
}