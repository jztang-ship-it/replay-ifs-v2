import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import LiveCard from '../components/game/LiveCard';
import { useBankroll } from '../context/BankrollContext';

import { dealRealHand, replaceLineup, fetchPlayablePool } from '../engine/RealDealer'; 
import { fetchRealGameLog } from '../data/real_nba_db';
import { calculateScore } from '../utils/GameMath';

const SystemCheck = () => {
    useEffect(() => {
        const checkDB = async () => {
            console.clear(); 
            const pool = await fetchPlayablePool();
            if (!pool || pool.length === 0) console.warn("❌ [CRITICAL] POOL IS EMPTY!");
            else console.log(`✅ Loaded ${pool.length} Active Players`);
        };
        checkDB();
    }, []);
    return null;
};

const ScoreRoller = ({ value, colorClass = '' }) => {
  const [display, setDisplay] = useState(0);
  const target = parseFloat(value) || 0;
  useEffect(() => {
    let start = display; let startTime; const duration = 300; 
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); 
      const current = start + (target - start) * ease;
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate); else setDisplay(target);
    };
    requestAnimationFrame(animate);
  }, [target]); 
  return <span className={colorClass}>{display.toFixed(1)}</span>;
};

const FooterWinStamp = ({ label, color }) => (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className={`transform -rotate-6 border-2 ${color ? color.replace('text-', 'border-') : 'border-white'} rounded-lg px-3 py-1 bg-black/90 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] animate-bounce-short whitespace-nowrap`}>
        <span className={`text-2xl font-black italic uppercase drop-shadow-md ${color} tracking-tighter`}>{label}</span>
      </div>
  </div>
);

const LegendModal = ({ onClose }) => {
    const [tab, setTab] = useState('ODDS');
    
    const TierRow = ({ score, name, payout, color, bg }) => (
        <div className={`flex items-center justify-between p-2 rounded-lg border ${bg} mb-2`}>
            <div className={`w-12 font-bold ${color}`}>{score}</div>
            <div className={`flex-1 text-center font-black text-white text-lg tracking-wider`}>{name}</div>
            <div className="w-16 text-right font-black text-white">{payout}</div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="flex border-b border-slate-800">
                    <button onClick={()=>setTab('ODDS')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest ${tab==='ODDS' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Payouts</button>
                    <button onClick={()=>setTab('RULES')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest ${tab==='RULES' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Rules</button>
                </div>
                
                <div className="p-4 overflow-y-auto custom-scrollbar">
                    {tab === 'ODDS' ? (
                        <div>
                            <TierRow score="250+" name="JACKPOT" payout="100%" color="text-fuchsia-400" bg="bg-fuchsia-500/10 border-fuchsia-500/20" />
                            <TierRow score="225+" name="MINI JACKPOT" payout="10%" color="text-pink-400" bg="bg-pink-500/10 border-pink-500/20" />
                            <TierRow score="215+" name="DYNASTY" payout="30x" color="text-purple-400" bg="bg-purple-500/10 border-purple-500/20" />
                            <TierRow score="195+" name="MVP" payout="10x" color="text-yellow-400" bg="bg-yellow-500/10 border-yellow-500/20" />
                            <TierRow score="175+" name="ALL-STAR" payout="5x" color="text-orange-400" bg="bg-orange-500/10 border-orange-500/20" />
                            <TierRow score="155+" name="STARTER" payout="1.5x" color="text-green-400" bg="bg-green-500/10 border-green-500/20" />
                            <TierRow score="130+" name="ROOKIE" payout="0.5x" color="text-blue-400" bg="bg-blue-500/10 border-blue-500/20" />
                        </div>
                    ) : (
                        <div className="space-y-4 text-xs">
                           <div className="grid grid-cols-2 gap-2 text-slate-400 border-b border-slate-800 pb-3">
                                <div>PTS: 1.0</div>
                                <div>REB: 1.25</div>
                                <div>AST: 1.5</div>
                                <div>STL: 2.0</div>
                                <div>BLK: 2.0</div>
                                <div>TOV: -0.5</div>
                           </div>
                           <div>
                                <h3 className="text-white font-bold mb-1 uppercase text-[10px] tracking-wider text-yellow-500">Scoring</h3>
                                <div className="space-y-1 text-slate-400">
                                    <div className="flex justify-between"><span>⚡ GOD MODE (50+)</span><span className="text-white font-bold">+10</span></div>
                                    <div className="flex justify-between"><span>🔥 FIRE (40+)</span><span className="text-white font-bold">+5</span></div>
                                    <div className="flex justify-between"><span>🏀 BUCKET (30+)</span><span className="text-white font-bold">+2</span></div>
                                </div>
                           </div>
                           <div>
                                <h3 className="text-white font-bold mb-1 uppercase text-[10px] tracking-wider text-blue-400">Glass & Dish</h3>
                                <div className="space-y-1 text-slate-400">
                                    <div className="flex justify-between"><span>🦍 BEAST (15 Reb)</span><span className="text-white font-bold">+5</span></div>
                                    <div className="flex justify-between"><span>🧲 GLASS (12 Reb)</span><span className="text-white font-bold">+3</span></div>
                                    <div className="flex justify-between"><span>🪄 WIZARD (15 Ast)</span><span className="text-white font-bold">+5</span></div>
                                    <div className="flex justify-between"><span>🧠 DIME (12 Ast)</span><span className="text-white font-bold">+3</span></div>
                                </div>
                           </div>
                           <div>
                                <h3 className="text-white font-bold mb-1 uppercase text-[10px] tracking-wider text-red-400">Lockdown</h3>
                                <div className="space-y-1 text-slate-400">
                                    <div className="flex justify-between"><span>🧤 THIEF (5 Stl)</span><span className="text-white font-bold">+4</span></div>
                                    <div className="flex justify-between"><span>🚫 SWAT (5 Blk)</span><span className="text-white font-bold">+4</span></div>
                                    <div className="flex justify-between"><span>🔒 LOCK (6+ Stl/Blk)</span><span className="text-white font-bold">+4</span></div>
                                </div>
                           </div>
                           <div>
                                <h3 className="text-white font-bold mb-1 uppercase text-[10px] tracking-wider text-purple-400">Milestones</h3>
                                <div className="space-y-1 text-slate-400">
                                    <div className="flex justify-between"><span>🦕 QUAD-DBL</span><span className="text-white font-bold">+50</span></div>
                                    <div className="flex justify-between"><span>🖐️ 5x5</span><span className="text-white font-bold">+15</span></div>
                                    <div className="flex justify-between"><span>👑 TRIPLE-DBL</span><span className="text-white font-bold">+8</span></div>
                                    <div className="flex justify-between"><span>✌️ DOUBLE-DBL</span><span className="text-white font-bold">+2</span></div>
                                </div>
                           </div>
                        </div>
                    )}
                </div>
                <button onClick={onClose} className="p-3 bg-slate-950 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors border-t border-slate-800">Close</button>
            </div>
        </div>
    );
};

export default function Play() {
  const { bankroll, updateBankroll, addHistory } = useBankroll(); 
  const [hand, setHand] = useState([null, null, null, null, null]);
  const [gamePhase, setGamePhase] = useState('START'); 
  const [heldIndices, setHeldIndices] = useState([]); 
  const [finalScores, setFinalScores] = useState({}); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [payoutResult, setPayoutResult] = useState(null); 
  const [runningScore, setRunningScore] = useState(0);
  const [runningBonus, setRunningBonus] = useState(0);
  const [visibleBudget, setVisibleBudget] = useState(15.0);
  const [showLegend, setShowLegend] = useState(false); 
  const [activeBadges, setActiveBadges] = useState([]); 

  const SALARY_CAP = 15.0;
  const BASE_BET = 10; 
  const betOpts = [1, 2, 5, 10]; 
  const getCost = (p) => parseFloat(p?.cost || 0);

  // --- HELPER FOR BUDGET DISPLAY ---
  // Fixes floating point errors (e.g. -0.0000000001 becoming -0.0 in red)
  const formatBudget = (val) => {
    if (Math.abs(val) < 0.05) return "0.0"; // Treat close-to-zero as zero
    return val.toFixed(1);
  };
  const isOverBudget = visibleBudget < -0.05; // Only show red if significantly negative

  const handleDeal = async () => {
    const betAmount = BASE_BET * betMultiplier;
    if(bankroll < betAmount) return alert("Insufficient Funds");
    updateBankroll(-betAmount);
    setGamePhase('DEALING'); 
    setPayoutResult(null); 
    setRunningScore(0);
    setRunningBonus(0);
    setHeldIndices([]); 
    setFinalScores({}); 
    setActiveBadges([]); 
    setVisibleBudget(SALARY_CAP); 
    setSequencerIndex(-1);
    setHand([null, null, null, null, null]);
    const newHand = await dealRealHand();
    if (newHand) {
        setHand(newHand);
        setTimeout(() => setSequencerIndex(0), 100); 
    } else {
        alert("Market Closed (Database Empty). Refunded.");
        updateBankroll(betAmount);
        setGamePhase('START');
    }
  };

  const toggleHold = (i) => { 
      if(gamePhase === 'DEALT') {
          const card = hand[i]; const cost = getCost(card);
          if (heldIndices.includes(i)) {
              setHeldIndices(p => p.filter(x => x !== i)); 
              setVisibleBudget(prev => prev + cost); 
          } else {
              setHeldIndices(p => [...p, i]); 
              setVisibleBudget(prev => prev - cost); 
          }
      }
  };

  const handleDraw = async () => {
    setGamePhase('DRAWING');
    setSequencerIndex(-1); 
    setActiveBadges([]); 
    let newHand = await replaceLineup(hand, heldIndices);
    if (!newHand) { console.error("Dealer failed. Reverting."); newHand = [...hand]; }
    setHand(newHand);

    // --- UPDATED: PARALLEL FETCHING FOR SPEED ---
    // Instead of waiting one-by-one, we fetch all 5 at once
    const promises = newHand.map(async (player, i) => {
        if (!player) return null;
        const log = await fetchRealGameLog(player.id);
        const math = calculateScore(log);
        return { 
            key: `${player.id}-${i}`, 
            data: {
                score: math.score, 
                stats: math.rawStats, 
                badges: math.bonuses,
                date: log.game_date,
                matchup: log.matchup || 'v OPP'
            }
        };
    });

    const results = await Promise.all(promises);
    const newResults = {};
    results.forEach(res => {
        if (res) newResults[res.key] = res.data;
    });

    setFinalScores(newResults);
    setGamePhase('REVEALING');
    setTimeout(() => setSequencerIndex(0), 50); // Fast start
  };

  useEffect(() => {
    if(gamePhase === 'DEALING') {
        if(sequencerIndex >= 0 && sequencerIndex < 5) setTimeout(() => setSequencerIndex(s => s+1), 100);
        else if (sequencerIndex >= 5) setTimeout(() => setGamePhase('DEALT'), 200);
    }
    if(gamePhase === 'REVEALING') {
        if(sequencerIndex >= 0 && sequencerIndex < 5) {
            const card = hand[sequencerIndex];
            const key = `${card.id}-${sequencerIndex}`;
            if (!heldIndices.includes(sequencerIndex)) { setVisibleBudget(prev => prev - getCost(card)); }
            
            setTimeout(() => {
                if(finalScores[key]) {
                    setRunningScore(s => s + finalScores[key].score);
                    const cardBonus = finalScores[key].badges?.reduce((sum, b) => sum + b.score, 0) || 0;
                    setRunningBonus(b => b + cardBonus);
                    if (finalScores[key].badges && finalScores[key].badges.length > 0) {
                        setActiveBadges(prev => [...prev, ...finalScores[key].badges]);
                    }
                }
            }, 50);

            // Fast Reveal Sequence (200ms)
            setTimeout(() => setSequencerIndex(s => s+1), 200);

        } else if (sequencerIndex >= 5) {
            setTimeout(() => {
                const total = Object.values(finalScores).reduce((a,b) => a+b.score, 0);
                const betAmount = BASE_BET * betMultiplier;
                
                let lbl = "LOSS"; let clr = "text-slate-500"; let win = 0;
                
                if (total >= 250) { win = 12453.88; lbl = "JACKPOT"; clr = "text-fuchsia-500"; } 
                else if (total >= 225) { win = 1245.38; lbl = "MINI JACKPOT"; clr = "text-pink-500"; } 
                else if (total >= 215) { win = betAmount * 30; lbl = "DYNASTY"; clr = "text-purple-400"; }
                else if (total >= 195) { win = betAmount * 10; lbl = "MVP"; clr = "text-yellow-400"; }
                else if (total >= 175) { win = betAmount * 5; lbl = "ALL-STAR"; clr = "text-orange-400"; }
                else if (total >= 155) { win = betAmount * 1.5; lbl = "STARTER"; clr = "text-green-400"; }
                else if (total >= 130) { win = betAmount * 0.5; lbl = "ROOKIE"; clr = "text-blue-400"; }
                
                if (win > 0) updateBankroll(win);
                setPayoutResult({label:lbl, color:clr});
                if (addHistory) addHistory({ result: lbl, score: total, payout: win, date: new Date().toISOString() });
                setGamePhase('END');
            }, 300); 
        }
    }
  }, [gamePhase, sequencerIndex]);

  const renderCard = (i) => {
      const cardData = hand[i];
      if (gamePhase === 'START' || !cardData) return <LiveCard isFaceDown={true} />;
      let isFaceDown = false;
      const showResult = (gamePhase === 'REVEALING' && sequencerIndex >= i) || gamePhase === 'END';
      if (gamePhase === 'DEALING') isFaceDown = i > sequencerIndex;
      else if (gamePhase === 'DRAWING' || gamePhase === 'REVEALING') {
          if (heldIndices.includes(i)) isFaceDown = false; else isFaceDown = i > sequencerIndex; 
      }
      return <LiveCard player={cardData} isHeld={heldIndices.includes(i)} onToggle={()=>toggleHold(i)} finalScore={finalScores[`${cardData.id}-${i}`]} isFaceDown={isFaceDown} showResult={showResult} />;
  };

  return (
    <PageContainer>
      <SystemCheck />
      {showLegend && <LegendModal onClose={() => setShowLegend(false)} />}
      <div className="fixed inset-0 bg-[#050b14] overflow-hidden flex flex-col z-0 pt-14">
        {/* HEADER */}
        <div className="shrink-0 w-full bg-slate-900 border-b border-white/5 px-4 py-2 flex items-center relative z-40 shadow-xl h-16">
             <div className="flex-1"></div>
             <div className="flex flex-col items-center justify-center">
                 <div className="text-[9px] text-purple-500 font-bold uppercase tracking-widest leading-none mb-0.5 glow-sm">JACKPOT</div>
                 <div className="text-2xl font-black text-white leading-none drop-shadow-[0_2px_4px_rgba(168,85,247,0.5)]">$12,453.88</div>
             </div>
             <div className="flex-1 flex flex-col items-end justify-center gap-0.5">
                 <div className="text-[8px] text-slate-400 font-bold">225+ = <span className="text-pink-400 font-black">10%</span></div>
                 <div className="text-[8px] text-slate-400 font-bold">250+ = <span className="text-fuchsia-400 font-black">100%</span></div>
             </div>
        </div>
        
        {/* CARDS */}
        <div className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center justify-center relative z-20 min-h-0 p-2">
            <div className="w-full h-full flex flex-col justify-between">
               <div className="flex justify-center gap-3 h-[32%]"><div className="w-[45%] h-full">{renderCard(0)}</div><div className="w-[45%] h-full">{renderCard(1)}</div></div>
               <div className="flex justify-center h-[32%]"><div className="w-[45%] h-full">{renderCard(2)}</div></div>
               <div className="flex justify-center gap-3 h-[32%]"><div className="w-[45%] h-full">{renderCard(3)}</div><div className="w-[45%] h-full">{renderCard(4)}</div></div>
            </div>
        </div>
        
        {/* FOOTER */}
        <div className="shrink-0 w-full bg-slate-950/95 border-t border-slate-900 p-3 pb-6 z-50">
             <div className="max-w-lg mx-auto flex flex-col gap-2">
                 <div className="flex justify-between items-end px-1 relative">
                     {/* BUDGET LEFT */}
                     <div>
                         <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Budget</div>
                         <div className="flex items-baseline gap-1 text-white font-mono font-black">
                            <span className="text-xl">$15.0</span>
                            {/* UPDATED BUDGET LOGIC */}
                            <span className={`text-lg ${isOverBudget ? 'text-red-500' : 'text-slate-500'}`}>
                                ({formatBudget(visibleBudget)})
                            </span>
                         </div>
                     </div>
                     
                     {/* WIN SIGN (CENTERED) */}
                     {gamePhase === 'END' && payoutResult && payoutResult.label !== "LOSS" && (
                         <FooterWinStamp label={payoutResult.label} color={payoutResult.color} />
                     )}

                     {/* FP RIGHT */}
                     <div className="text-right">
                         <div className="text-[9px] text-blue-500 font-bold uppercase tracking-widest mb-0.5 flex items-center justify-end gap-1">Total FP<button onClick={() => setShowLegend(true)} className="w-3 h-3 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 text-[8px] border border-slate-700">?</button></div>
                         <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">{activeBadges.map((b, i) => (<span key={i} className="text-[10px] animate-pop">{b.icon}</span>))}</div>
                            <div className="text-2xl font-mono font-black text-white leading-none flex items-baseline">
                                 <ScoreRoller value={runningScore} />
                                 {runningBonus > 0 && (<span className="text-yellow-400 ml-1 text-lg">({runningBonus})</span>)}
                            </div>
                         </div>
                     </div>
                 </div>
                 
                 <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex bg-slate-900 rounded-lg p-1 gap-1 border border-slate-800">
                        {betOpts.map(m => (
                            <button key={m} onClick={()=>setBetMultiplier(m)} disabled={gamePhase !== 'START' && gamePhase !== 'END' && gamePhase !== 'DEALT'} className={`px-2.5 py-2 rounded text-[10px] font-bold transition-all ${betMultiplier === m ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                                {m === 1 ? 'MIN' : `${m}x`}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col items-center justify-center px-2"><span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">BET</span><span className="text-lg font-mono font-black text-white">${BASE_BET * betMultiplier}</span></div>
                    <button onClick={gamePhase==='DEALT'?handleDraw:(gamePhase==='END'?handleDeal:handleDeal)} disabled={gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING'} className={`flex-1 h-12 rounded-xl font-black text-lg uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center max-w-[120px] ${gamePhase==='DEALT'?'bg-green-600 text-white hover:bg-green-500':'bg-blue-600 text-white hover:bg-blue-500'}`}>{gamePhase==='DEALT'?'DRAW':(gamePhase==='DEALING'?'...':(gamePhase==='REVEALING'?'...': 'REPLAY'))}</button>
                 </div>
             </div>
        </div>
      </div>
    </PageContainer>
  );
}