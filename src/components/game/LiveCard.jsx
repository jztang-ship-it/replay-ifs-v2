import React, { useState, useEffect, useRef } from 'react';
import logo from '../../assets/logo.png'; 
import { getAllPlayers } from '../../data/real_nba_db';

// --- INTERNAL HELPERS ---
const ScoreRoller = ({ value }) => {
  const [display, setDisplay] = useState(() => parseFloat(value) || 0);
  const targetRef = useRef(parseFloat(value) || 0);
  useEffect(() => {
    const end = parseFloat(value) || 0;
    if (Math.abs(targetRef.current - end) < 0.1) { targetRef.current = end; setDisplay(end); return; }
    const start = display; targetRef.current = end; const duration = 400; let startTime;
    const animate = (time) => { if (!startTime) startTime = time; const progress = Math.min((time - startTime) / duration, 1); const ease = 1 - Math.pow(1 - progress, 3); const current = start + (end - start) * ease; setDisplay(current); if (progress < 1) requestAnimationFrame(animate); else setDisplay(end); };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{display.toFixed(1)}</>;
};

const formatGameDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
};

const getTierStyle = (cost) => {
    const val = parseFloat(cost || 0);
    if (val >= 5.0) return { border: 'border-amber-400', text: 'text-amber-400', bg: 'bg-amber-400', grad: 'from-amber-900' };
    if (val >= 4.0) return { border: 'border-purple-400', text: 'text-purple-400', bg: 'bg-purple-400', grad: 'from-purple-900' };
    if (val >= 2.5) return { border: 'border-blue-400', text: 'text-blue-400', bg: 'bg-blue-400', grad: 'from-blue-900' };
    return { border: 'border-slate-600', text: 'text-slate-400', bg: 'bg-slate-500', grad: 'from-slate-800' };
};

const getTrueProjection = (playerId) => {
    const masterDB = getAllPlayers();
    const found = masterDB.find(p => p.id === playerId);
    return found?.stats?.score || 20.0;
};

// --- MAIN COMPONENT ---
export default function LiveCard(props) {
  const [imgError, setImgError] = useState(false);
  const [flipped, setFlipped] = useState(false); 
  const { player, isHeld, onToggle, finalScore, isFaceDown } = props;

  // 1. HOOKS FIRST (Prevents Crash)
  useEffect(() => { setFlipped(false); }, [player?.id]);

  // 2. SAFETY RETURN
  if (!player || (!player.id && !player.name)) {
      return (
        <div className="relative w-full h-full perspective-1000">
            <div className="relative w-full h-full transition-all duration-500 transform-style-3d rotate-y-180">
                <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl backface-hidden rotate-y-180">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
                    <img src={logo} alt="Logo" className="w-20 h-20 object-contain opacity-50" />
                </div>
            </div>
        </div>
      );
  }

  const handleClick = () => { if (finalScore) setFlipped(!flipped); else onToggle(); };

  const meta = player;
  const safeCost = meta.cost || meta.price || 0;
  const tier = getTierStyle(safeCost);
  const nbaImage = `https://cdn.nba.com/headshots/nba/latest/1040x760/${meta.id}.png`;

  // Color Logic (Strict Math)
  const trueProjection = getTrueProjection(meta.id); 
  const displayScore = finalScore ? finalScore.score : trueProjection;
  const bonusAmt = finalScore ? (finalScore.score - trueProjection) : 0;
  
  let scoreColor = 'text-white';
  if (finalScore) {
      if (displayScore >= trueProjection * 1.15) scoreColor = 'text-green-400';
      else if (displayScore <= trueProjection * 0.85) scoreColor = 'text-red-400';
  }

  return (
    <div onClick={handleClick} className={`relative w-full h-full perspective-1000 cursor-pointer transition-transform duration-200 active:scale-95 ${isHeld ? 'z-10' : 'z-0'}`}>
      <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFaceDown || flipped ? 'rotate-y-180' : ''}`}>
        
        {/* FRONT SIDE */}
        <div className={`absolute inset-0 w-full h-full bg-slate-900 rounded-lg border ${tier.border} flex flex-col overflow-hidden backface-hidden`}>
            <div className={`relative flex-1 w-full bg-gradient-to-b ${tier.grad} to-slate-950 overflow-hidden min-h-0`}>
                {!imgError ? <img src={nbaImage} className="absolute inset-0 w-full h-full object-cover object-top z-10" onError={()=>setImgError(true)}/> : <div className="absolute inset-0 flex items-center justify-center text-white/20 font-black text-3xl">{meta.name.slice(0,2)}</div>}
                <div className="absolute top-0.5 right-0.5 z-20"><span className={`font-mono font-black text-[10px] ${tier.text}`}>${safeCost.toFixed(1)}</span></div>
                {isHeld && <div className="absolute top-0.5 left-0.5 bg-yellow-400 text-black text-[7px] font-black px-1 py-0.5 rounded z-30">HOLD</div>}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent flex flex-col justify-end p-1.5 z-20">
                    <span className="text-[8px] text-slate-400 font-bold uppercase line-clamp-1">{meta.team}</span>
                    <span className="text-[10px] text-white font-black uppercase italic line-clamp-1">{meta.name}</span>
                </div>
            </div>
            <div className="shrink-0 h-[22%] bg-slate-950 border-t border-slate-800 flex flex-col justify-center p-0.5">
                <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded border border-white/5 w-full h-full">
                    <div className="flex items-center gap-1 leading-none">
                        <span className={`text-[7px] font-black uppercase ${finalScore ? 'text-slate-400' : 'text-yellow-500'}`}>{finalScore ? 'FP' : 'PROJ'}</span>
                        <span className={`text-sm font-mono font-black tracking-tighter ${scoreColor}`}><ScoreRoller value={displayScore} /></span>
                    </div>
                </div>
            </div>
        </div>

        {/* BACK SIDE (Game Log) */}
        <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-lg border border-slate-700 flex flex-col overflow-hidden backface-hidden rotate-y-180 p-1 relative shadow-2xl">
            {finalScore ? (
                <>
                    <div className="border-b border-slate-800 pb-0.5 mb-0.5 flex justify-between items-center">
                        <div className="text-[8px] text-white font-black uppercase italic truncate w-[70%]">{meta.name}</div>
                        <div className="text-[7px] text-slate-500 font-bold">{meta.team}</div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/50 px-1 py-0.5 rounded border border-white/5 mb-0.5">
                        <div className="flex items-center gap-1">
                            <span className="text-[7px] text-slate-400 font-bold uppercase">FP</span>
                            <div className={`text-sm font-mono font-black leading-none ${scoreColor}`}>
                                {displayScore.toFixed(1)}
                                {bonusAmt > 0 && <span className="text-[8px] text-yellow-400 ml-0.5 font-bold">(+{bonusAmt.toFixed(1)})</span>}
                            </div>
                        </div>
                        <div className="flex gap-0.5">{finalScore.badges?.map((b,i)=><span key={i} className="text-[8px]">{b.icon}</span>)}</div>
                    </div>
                    <div className="text-center mb-0.5 border-b border-slate-800/50 pb-0.5">
                        <span className="text-[7px] text-slate-400 font-mono font-bold uppercase tracking-tight">{formatGameDate(finalScore.date)} <span className="text-slate-600">|</span> {finalScore.matchup}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-0.5 mt-auto">
                        <div className="bg-slate-900 p-0.5 rounded text-center"><div className="text-[6px] text-slate-500 font-bold">PTS</div><div className="text-[9px] text-white font-mono font-bold">{finalScore.pts}</div></div>
                        <div className="bg-slate-900 p-0.5 rounded text-center"><div className="text-[6px] text-slate-500 font-bold">REB</div><div className="text-[9px] text-white font-mono font-bold">{finalScore.reb}</div></div>
                        <div className="bg-slate-900 p-0.5 rounded text-center"><div className="text-[6px] text-slate-500 font-bold">AST</div><div className="text-[9px] text-white font-mono font-bold">{finalScore.ast}</div></div>
                        <div className="bg-slate-900 p-0.5 rounded text-center"><div className="text-[6px] text-slate-500 font-bold">STL</div><div className="text-[9px] text-white font-mono font-bold">{finalScore.stl}</div></div>
                        <div className="bg-slate-900 p-0.5 rounded text-center"><div className="text-[6px] text-slate-500 font-bold">BLK</div><div className="text-[9px] text-white font-mono font-bold">{finalScore.blk}</div></div>
                        <div className="bg-slate-900 p-0.5 rounded text-center"><div className="text-[6px] text-slate-500 font-bold">TO</div><div className="text-[9px] text-white font-mono font-bold">{finalScore.to}</div></div>
                    </div>
                </>
            ) : (
                /* DEFAULT BACK LOGO */
                <div className="w-full h-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
                    <img src={logo} alt="Logo" className="w-20 h-20 object-contain opacity-50" />
                </div>
            )}
        </div>

      </div>
    </div>
  );
}