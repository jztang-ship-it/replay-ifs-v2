import React, { useState, useEffect } from 'react';
import { useCountUp } from '../../hooks/useCountUp';

export default function PlayerCard({ player, isHeld, onToggle, finalScore, rotation, isRolling }) {
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [player.id]);

  const hasResult = !!finalScore;

  const rollingPts = useCountUp(finalScore?.stats?.pts || 0, 1000, isRolling);
  const rollingReb = useCountUp(finalScore?.stats?.reb || 0, 1000, isRolling);
  const rollingAst = useCountUp(finalScore?.stats?.ast || 0, 1000, isRolling);
  const rollingStl = useCountUp(finalScore?.stats?.stl || 0, 1000, isRolling);
  const rollingBlk = useCountUp(finalScore?.stats?.blk || 0, 1000, isRolling);
  const rollingTo = useCountUp(finalScore?.stats?.to || 0, 1000, isRolling);
  const animatedScore = useCountUp(finalScore?.score || 0, 1500, isRolling);

  const getBorderColor = () => {
    const cost = player.cost || 2;
    if (cost === 5) return 'border-yellow-500';
    if (cost === 4) return 'border-purple-500';
    if (cost === 3) return 'border-blue-500';
    if (cost === 1) return 'border-gray-500';
    return 'border-green-500'; 
  };

  const imageUrl = `https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${player.id}.png&w=350&h=254`;
  const isClickable = (rotation % 2 === 0) && !hasResult;
  const dScore = isRolling ? animatedScore : 0;

  // RESIZE: Changed h-[340px] -> h-[290px] and w-36 -> w-32
  return (
    <div 
      onClick={() => { if (isClickable && onToggle) onToggle(); }}
      className="relative w-32 h-[290px] cursor-pointer perspective-1000 group select-none"
    >
      <div 
        className="relative w-full h-full transition-transform duration-700 transform-style-3d"
        style={{ transform: `rotateY(${rotation * 180}deg)` }}
      >
        {/* FRONT FACE */}
        <div className={`absolute w-full h-full backface-hidden bg-slate-800 rounded-xl border-2 flex flex-col items-center p-1.5 shadow-lg overflow-hidden ${getBorderColor()}
          ${isHeld ? 'scale-105 z-10' : 'opacity-90 hover:opacity-100 hover:scale-105'}
        `}>
          {player.id && (
            <>
              {player.cost && (
                <div className="absolute top-0 right-0 w-7 h-7 bg-slate-950 border-l border-b border-slate-700 rounded-bl-xl flex items-center justify-center font-bold text-yellow-400 z-10 text-xs">
                  ${player.cost}
                </div>
              )}
              
              {isHeld && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black font-black text-[9px] px-2 py-0.5 rounded shadow-lg border border-white z-20">
                  HOLD
                </div>
              )}

              {/* RESIZE: Image container reduced from h-28 -> h-20 */}
              <div className="w-full h-20 mt-3 relative flex items-center justify-center z-0">
                 {!imgError ? (
                   <img src={imageUrl} alt={player.name} referrerPolicy="no-referrer" className="w-full h-full object-cover object-top scale-125 drop-shadow-2xl" onError={() => setImgError(true)} />
                 ) : <span className="text-4xl animate-pulse">{player.avatar}</span>}
              </div>

              <div className="text-center w-full z-10 bg-slate-800/80 backdrop-blur-sm p-0.5 border-b border-slate-700 mb-1">
                <h3 className="text-[10px] font-bold text-white leading-tight truncate">{player.name}</h3>
                <p className="text-[8px] text-slate-400">{player.team}</p>
              </div>

              <div className="w-full flex-1 flex flex-col justify-between">
                {!hasResult ? (
                  <>
                    <div className="px-2 py-0.5 bg-slate-950 rounded mb-0.5 text-center">
                      <span className="text-[8px] font-bold text-slate-600 tracking-widest">SEASON AVG</span>
                    </div>
                    {/* RESIZE: Text sizes reduced slightly */}
                    <div className="grid grid-cols-3 gap-0.5 text-center bg-slate-800/50 p-0.5 rounded">
                      <div><p className="text-[6px] text-slate-600">PTS</p><p className="text-[10px] font-bold text-slate-500">{player.avgStats?.pts}</p></div>
                      <div><p className="text-[6px] text-slate-600">REB</p><p className="text-[10px] font-bold text-slate-500">{player.avgStats?.reb}</p></div>
                      <div><p className="text-[6px] text-slate-600">AST</p><p className="text-[10px] font-bold text-slate-500">{player.avgStats?.ast}</p></div>
                      <div><p className="text-[6px] text-slate-600">STL</p><p className="text-[10px] font-bold text-slate-500">{player.avgStats?.stl}</p></div>
                      <div><p className="text-[6px] text-slate-600">BLK</p><p className="text-[10px] font-bold text-slate-500">{player.avgStats?.blk}</p></div>
                      <div><p className="text-[6px] text-slate-600">TO</p><p className="text-[10px] font-bold text-slate-500">{player.avgStats?.to}</p></div>
                    </div>
                    <div className="mt-auto rounded p-0.5 text-center bg-slate-900">
                      <p className="text-[7px] uppercase tracking-widest text-slate-600">AVG FP</p>
                      <p className="text-base font-black text-slate-500">{player.avgFP}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center px-1 py-0.5 bg-slate-950 rounded mb-0.5">
                      <span className="text-[8px] text-slate-400">{finalScore.date}</span>
                      <span className="text-[8px] font-bold text-slate-200">vs {finalScore.opponent}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-0.5 text-center bg-slate-800/50 p-0.5 rounded">
                      <div><p className="text-[6px] text-slate-400">PTS</p><p className="text-[10px] font-bold text-white">{isRolling ? rollingPts : 0}</p></div>
                      <div><p className="text-[6px] text-slate-400">REB</p><p className="text-[10px] font-bold text-white">{isRolling ? rollingReb : 0}</p></div>
                      <div><p className="text-[6px] text-slate-400">AST</p><p className="text-[10px] font-bold text-white">{isRolling ? rollingAst : 0}</p></div>
                      <div><p className="text-[6px] text-slate-400">STL</p><p className="text-[10px] font-bold text-white">{isRolling ? rollingStl : 0}</p></div>
                      <div><p className="text-[6px] text-slate-400">BLK</p><p className="text-[10px] font-bold text-white">{isRolling ? rollingBlk : 0}</p></div>
                      <div><p className="text-[6px] text-slate-400">TO</p><p className="text-[10px] font-bold text-red-400">{isRolling ? rollingTo : 0}</p></div>
                    </div>
                    <div className="mt-auto rounded p-0.5 text-center bg-slate-950 border border-slate-700">
                      <p className="text-[7px] uppercase tracking-widest text-slate-400">FP SCORE</p>
                      <p className={`text-xl font-black ${finalScore.isBoom ? 'text-green-400' : finalScore.isBust ? 'text-red-500' : 'text-white'}`}>
                        {dScore}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* BACK FACE */}
        <div 
          className="absolute top-0 left-0 w-full h-full backface-hidden card-back-bg rounded-xl border-2 border-slate-900 shadow-2xl z-50 overflow-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
        </div>
      </div>
    </div>
  );
}