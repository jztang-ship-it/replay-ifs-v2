import React, { useState, useEffect, useRef } from 'react';

const ScoreRoller = ({ value }) => {
  const [display, setDisplay] = useState(() => parseFloat(value) || 0);
  const targetRef = useRef(parseFloat(value) || 0);
  useEffect(() => {
    const end = parseFloat(value) || 0;
    if (Math.abs(targetRef.current - end) < 0.1) { targetRef.current = end; setDisplay(end); return; }
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
    const year = date.getFullYear().toString().slice(-2);
    return `${year} - ${month} ${day}`;
};

const formatMatchup = (matchupString) => {
    if (!matchupString) return 'VS. OPP';
    if (matchupString.includes('@')) {
        const parts = matchupString.split('@');
        return `@ ${parts[1].trim()}`;
    }
    if (matchupString.toLowerCase().includes('vs')) {
        const parts = matchupString.split(/vs\.?/i);
        return `VS. ${parts[1].trim()}`;
    }
    return matchupString; 
};

const getTierStyle = (cost) => {
    const val = parseFloat(cost || 0);
    // Gradient backgrounds for the "Card" feel
    if (val >= 5.0) return { border: 'border-amber-500', bg: 'bg-gradient-to-b from-amber-600 via-amber-800 to-amber-950', text: 'text-amber-400' };
    if (val >= 4.0) return { border: 'border-purple-500', bg: 'bg-gradient-to-b from-purple-600 via-purple-800 to-purple-950', text: 'text-purple-400' };
    if (val >= 2.5) return { border: 'border-blue-500', bg: 'bg-gradient-to-b from-blue-600 via-blue-800 to-blue-950', text: 'text-blue-400' };
    return { border: 'border-slate-600', bg: 'bg-gradient-to-b from-slate-600 via-slate-800 to-slate-950', text: 'text-slate-400' };
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
  
  // --- NAME LOGIC ---
  const firstSpaceIndex = meta.name.indexOf(' ');
  let firstName = '';
  let lastName = meta.name;

  if (firstSpaceIndex !== -1) {
      firstName = meta.name.substring(0, firstSpaceIndex);
      lastName = meta.name.substring(firstSpaceIndex + 1);
  }

  // TRUNCATION: Single dot "." if too long
  if (lastName.length > 9) {
      lastName = lastName.substring(0, 8) + ".";
  }
  
  const nbaImage = player ? `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${meta.id}.png` : null;
  const trueProjection = getTrueProjection(player);
  const displayScore = (showResult && finalScore) ? finalScore.score : trueProjection;
  const totalBonus = finalScore?.badges?.reduce((sum, b) => sum + b.score, 0) || 0;
  
  const scoreColor = (showResult && finalScore && displayScore >= trueProjection * 1.15) ? 'text-green-400' : (showResult && finalScore && displayScore <= trueProjection * 0.85 ? 'text-red-400' : 'text-white');
  const showBack = isFaceDown || manualFlip;

  const ScoreDisplay = ({ score, bonus, colorBase, isRoller }) => (
      <div className={`font-mono font-black leading-none flex items-baseline ${colorBase}`}>
          {isRoller ? <ScoreRoller value={score} /> : score.toFixed(1)}
          {showResult && bonus > 0 && (
              <span className="text-yellow-400 ml-[1px] text-[0.7em]">({bonus})</span>
          )}
      </div>
  );

  return (
    <div onClick={handleClick} className={`relative w-full h-full perspective-1000 cursor-pointer transition-transform duration-100 active:scale-95 transform-gpu ${isHeld ? 'z-10 scale-105' : 'z-0'}`}>
      <div className={`relative w-full h-full transition-all duration-300 transform-style-3d ${showBack ? 'rotate-y-180' : ''}`}>
        
        {/* --- FRONT FACE --- */}
        {player ? (
            <div className={`absolute inset-0 w-full h-full rounded-xl border-[1.5px] ${tier.border} flex flex-col overflow-hidden backface-hidden antialiased shadow-2xl ${tier.bg}`}>
                
                {/* 1. BACKGROUND IMAGE */}
                <div className="absolute inset-0 z-0 flex items-end justify-center">
                     {!imgError && nbaImage ? (
                        <img 
                            src={nbaImage} 
                            // Adjusted to make sure torso is visible but head is clear
                            className="w-[115%] h-auto object-cover translate-y-1 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" 
                            onError={()=>setImgError(true)}
                            loading="eager"
                            alt={meta.name}
                        />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>
                </div>

                {/* 2. OVERLAY CONTENT */}
                <div className="relative z-10 w-full h-full p-1.5 flex flex-col justify-between">
                    
                    {/* TOP ROW: HOLD & COST */}
                    <div className="flex justify-between items-start w-full">
                        {/* HOLD: Top-Left */}
                        {isHeld ? (
                            <div className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg border border-black leading-tight tracking-tight">
                                HOLD
                            </div>
                        ) : <div className="h-4"></div>}

                        {/* COST: Top-Right (Aligned with HOLD) */}
                        <div className="flex items-start">
                             <span className={`font-mono font-black text-sm text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)] subpixel-antialiased`}>
                                ${meta.cost.toFixed(1)}
                             </span>
                        </div>
                    </div>

                    {/* BOTTOM ROW: STATIC LAYOUT */}
                    <div className="flex items-end justify-between w-full pb-0.5">
                        
                        {/* LEFT: NAME (Flexible width, but cut off before hitting score) */}
                        <div className="flex flex-col leading-none drop-shadow-lg z-20 flex-1 overflow-hidden pr-1">
                            <span className="text-[7px] font-bold text-slate-400 tracking-wider mb-px uppercase truncate">{meta.team}</span>
                            
                            {firstName && (
                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wide truncate">
                                    {firstName}
                                </span>
                            )}
                            
                            {/* LAST NAME: Adjusted Size for Harmony */}
                            <span className="text-lg font-black italic text-white uppercase tracking-tighter -ml-px leading-none truncate">
                                {lastName}
                            </span>
                        </div>

                        {/* RIGHT: STATS (Fixed Static Region) */}
                        <div className="flex flex-col items-end gap-px z-20 shrink-0">
                            {/* Badges */}
                            {showResult && finalScore?.badges?.length > 0 && (
                                <div className="flex flex-wrap justify-end gap-0.5 mb-px">
                                    {finalScore.badges.map((b, i) => (
                                        <div key={i} className="bg-black/80 border border-slate-500 rounded-full w-3 h-3 flex items-center justify-center text-[7px]" title={b.label}>
                                            {b.icon} 
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Score Block */}
                            <div className="text-right">
                                <div className={`text-[6px] font-bold uppercase tracking-widest ${showResult ? 'text-slate-400' : 'text-yellow-500'}`}>
                                    {showResult ? 'FP' : 'PROJ'}
                                </div>
                                <div className={`text-lg font-mono font-black tracking-tighter leading-none ${scoreColor}`}>
                                    <ScoreDisplay score={displayScore} bonus={totalBonus} colorBase={scoreColor} isRoller={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
             <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-lg border-2 border-slate-800 flex items-center justify-center backface-hidden">
             </div>
        )}

        {/* --- BACK FACE (Stats) --- */}
        <div className={`absolute inset-0 w-full h-full bg-slate-900 rounded-lg border-2 border-slate-700 flex flex-col overflow-hidden backface-hidden rotate-y-180 p-0.5 antialiased`}>
            {manualFlip && finalScore ? (
                <>
                    <div className="border-b border-slate-800 pb-0.5 mb-0.5 flex justify-between items-center">
                        <div className="text-[8px] text-white font-black uppercase italic truncate w-[75%]">{meta.name}</div>
                        <div className="text-[7px] text-slate-500 font-bold">{meta.team}</div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 mb-0.5">
                        <div className="flex items-center gap-1">
                            <span className="text-[7px] text-slate-400 font-bold uppercase">FP</span>
                            {finalScore.badges && finalScore.badges.length > 0 && (
                                <div className="flex gap-0.5 ml-1">
                                    {finalScore.badges.map((b, i) => (
                                        <span key={i} className="text-[10px]">{b.icon}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="text-sm">
                            <ScoreDisplay score={displayScore} bonus={totalBonus} colorBase={scoreColor} isRoller={false} />
                        </div>
                    </div>
                    <div className="text-center mb-0.5 border-b border-slate-800/50 pb-0.5">
                        <span className="text-[8px] text-slate-400 font-mono font-bold uppercase">
                            {formatGameDate(finalScore.date)} | <span className="text-white">{formatMatchup(finalScore.matchup)}</span>
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-0.5 mt-0.5 h-full">
                        <div className="bg-slate-950 p-0.5 rounded text-center border border-slate-800 flex flex-col justify-center"><div className="text-[5px] text-slate-500 font-bold">PTS</div><div className="text-[8px] text-white font-mono font-bold">{finalScore.stats?.pts || 0}</div></div>
                        <div className="bg-slate-950 p-0.5 rounded text-center border border-slate-800 flex flex-col justify-center"><div className="text-[5px] text-slate-500 font-bold">REB</div><div className="text-[8px] text-white font-mono font-bold">{finalScore.stats?.reb || 0}</div></div>
                        <div className="bg-slate-950 p-0.5 rounded text-center border border-slate-800 flex flex-col justify-center"><div className="text-[5px] text-slate-500 font-bold">AST</div><div className="text-[8px] text-white font-mono font-bold">{finalScore.stats?.ast || 0}</div></div>
                        <div className="bg-slate-950 p-0.5 rounded text-center border border-slate-800 flex flex-col justify-center"><div className="text-[5px] text-slate-500 font-bold">STL</div><div className="text-[8px] text-white font-mono font-bold">{finalScore.stats?.stl || 0}</div></div>
                        <div className="bg-slate-950 p-0.5 rounded text-center border border-slate-800 flex flex-col justify-center"><div className="text-[5px] text-slate-500 font-bold">BLK</div><div className="text-[8px] text-white font-mono font-bold">{finalScore.stats?.blk || 0}</div></div>
                        <div className="bg-slate-950 p-0.5 rounded text-center border border-slate-800 flex flex-col justify-center"><div className="text-[5px] text-slate-500 font-bold">TOV</div><div className="text-[8px] text-red-400 font-mono font-bold">{finalScore.stats?.tov || 0}</div></div>
                    </div>
                </>
            ) : (
                <div className="w-full h-full flex items-center justify-center relative bg-slate-950">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                    <div className="relative z-10 text-center px-1">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 leading-relaxed">
                            SPORTS <span className="text-yellow-400">IS</span> SOCIAL
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}