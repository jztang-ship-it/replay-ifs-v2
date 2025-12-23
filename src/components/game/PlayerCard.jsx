import React, { useState, useEffect } from 'react';

// Rolling Counter for the Big Green Number
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
  // Border colors based on position/team logic (matching screenshot styles)
  const getBorderColor = () => {
    if (isHeld) return 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]'; // Green when held/winning
    if (!player) return 'border-slate-800';
    // Mapping teams to colors for that "premium" look
    const colors = { GSW: 'border-orange-500', LAL: 'border-purple-500', BOS: 'border-green-600', DAL: 'border-blue-500' };
    return colors[player?.team] || 'border-slate-600';
  };

  // Helper to render a stat block
  const StatBlock = ({ label, value }) => (
    <div className="flex flex-col items-center">
      <span className="text-white font-bold text-[10px] md:text-xs leading-none">{value}</span>
      <span className="text-[8px] text-slate-500 font-bold mt-0.5">{label}</span>
    </div>
  );

  // Use final stats if available, otherwise use player averages/projected
  const stats = finalScore?.rawStats || player?.avgStats || { pts: '-', reb: '-', ast: '-', stl: '-', blk: '-', to: '-' };
  const dateStr = finalScore?.date || "PROJECTED";

  return (
    <div 
      onClick={!isFaceDown ? onToggle : undefined}
      className={`group relative w-full h-full cursor-pointer transition-transform duration-200 ${isHeld ? 'scale-105 -translate-y-1' : 'hover:scale-[1.02]'}`}
      style={{ perspective: '1000px' }} 
    >
      <div 
        className="relative w-full h-full transition-transform duration-500"
        style={{ transformStyle: 'preserve-3d', transform: isFaceDown ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* === FRONT FACE (RICH CONTENT) === */}
        <div 
          className={`absolute inset-0 w-full h-full bg-black rounded-xl border-2 overflow-hidden flex flex-col ${getBorderColor()}`}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {player ? (
            <>
              {/* 1. HEADER: Team & Cost */}
              <div className="flex justify-between items-start p-2 z-20">
                <span className="text-[10px] font-black text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded backdrop-blur-md">{player.team}</span>
                <span className="text-sm font-black text-white drop-shadow-md">${player.cost}</span>
              </div>

              {/* 2. MAIN IMAGE AREA */}
              <div className="absolute top-0 left-0 w-full h-[65%]">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-black"></div>
                {/* Player Image */}
                <img src={player.image} alt={player.name} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-auto h-[90%] object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] z-10" />
                
                {/* BIG GREEN SCORE OVERLAY (Matches Screenshot) */}
                {finalScore && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 pt-10">
                    <div className="text-5xl md:text-6xl font-black text-green-400 tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,1)] scale-y-110">
                      <CardScoreRoller value={finalScore.score} />
                    </div>
                  </div>
                )}
                
                {/* PLAYER NAME (Overlapping bottom of image) */}
                <div className="absolute bottom-2 w-full text-center z-20">
                   <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-wider drop-shadow-md px-1 line-clamp-1">
                     {player.name}
                   </h3>
                </div>
              </div>

              {/* 3. STATS GRID (The "Good Stuff" restored) */}
              <div className="absolute bottom-0 w-full h-[35%] bg-black/80 backdrop-blur-sm flex flex-col pt-1">
                 {/* Row 1 */}
                 <div className="flex justify-around items-center px-2 py-1 border-b border-slate-800/50">
                    <StatBlock label="PTS" value={stats.pts} />
                    <StatBlock label="REB" value={stats.reb} />
                    <StatBlock label="AST" value={stats.ast} />
                 </div>
                 {/* Row 2 */}
                 <div className="flex justify-around items-center px-2 py-1">
                    <StatBlock label="STL" value={stats.stl} />
                    <StatBlock label="BLK" value={stats.blk} />
                    <StatBlock label="TO" value={stats.to} />
                 </div>
                 {/* Footer Date */}
                 <div className="mt-auto pb-1 text-center">
                    <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{dateStr}</span>
                 </div>
              </div>
            </>
          ) : null}
        </div>

        {/* === BACK FACE (LOGO) === */}
        <div 
          className="absolute inset-0 w-full h-full bg-slate-900 rounded-xl border-2 border-slate-700 flex items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="w-16 h-20 border-2 border-slate-600 rounded opacity-20 transform rotate-12"></div>
          <div className="absolute text-slate-500 font-black text-xl tracking-[0.2em]">REPLAY</div>
        </div>
      </div>
    </div>
  );
}