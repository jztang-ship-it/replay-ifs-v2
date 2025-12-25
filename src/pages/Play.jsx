import React, { useState, useEffect, useRef } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useBankroll } from '../context/BankrollContext';
import LiveCard from '../components/game/LiveCard'; 
import MoneyRain from '../components/effects/MoneyRain';
import JackpotBar from '../components/game/JackpotBar';
// REMOVED: BadgeLegend import (Moved inside footer)
import PayoutInfo from '../components/game/PayoutInfo'; 
import { fetchDraftPool, getPlayerGameLog } from '../data/real_nba_db';

const TeamScoreRoller = ({ value }) => {
  const [display, setDisplay] = useState(0);
  const startVal = useRef(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); startVal.current = 0; return; }
    const start = startVal.current;
    const end = value;
    if (start === end) return;
    const duration = 1500;
    let startTime;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * ease);
      if (progress < 1) requestAnimationFrame(animate); else startVal.current = end;
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span>{display.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>;
};

const XpFloater = ({ amount }) => (
  <div className="fixed top-20 right-4 pointer-events-none z-[110] animate-bounce-up">
    <span className="text-xs font-black text-blue-400 drop-shadow-md bg-slate-900/90 px-2 py-1 rounded border border-blue-500/30">+{amount} XP</span>
  </div>
);

const WinText = ({ label, color }) => {
  const safeColor = color || "text-white"; 
  const bgClass = safeColor.includes('text-') ? safeColor.replace('text-', 'bg-') : 'bg-white';
  const isLoss = label === 'LOSS';
  
  return (
    <div className="relative flex flex-col items-center justify-center z-50">
      {!isLoss && (
        <div className={`absolute inset-0 blur-xl opacity-50 ${bgClass} opacity-50 animate-pulse scale-150 rounded-full`}></div>
      )}
      <span className={`relative text-3xl font-black italic tracking-tighter uppercase drop-shadow-lg ${safeColor} ${!isLoss ? 'animate-bounce scale-110' : ''}`}>
        {label}{!isLoss && " !!!"}
      </span>
      {!isLoss && (
        <span className="relative text-[10px] text-white tracking-[0.5em] font-bold uppercase opacity-90 mt-1 animate-pulse">
          PAYOUT WINNER
        </span>
      )}
    </div>
  );
};

export default function Play() {
  const { bankroll, updateBankroll, recordGame } = useBankroll(); 
  
  const [hand, setHand] = useState([]);
  const [heldIndices, setHeldIndices] = useState([]); 
  const [results, setResults] = useState({}); 
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [payoutResult, setPayoutResult] = useState(null); 
  const [showEffects, setShowEffects] = useState(false);
  const [xpEarned, setXpEarned] = useState(null);
  const [showRules, setShowRules] = useState(false);

  const [gamePhase, setGamePhase] = useState('START'); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);
  const [runningScore, setRunningScore] = useState(0);
  const [jackpotContribution, setJackpotContribution] = useState(0);
  
  const SALARY_CAP = 15.0;
  const EASY_MODE = true; 
  const MIN_TARGET = 14.8; 

  const usedSalary = gamePhase === 'DEALT' 
    ? hand.reduce((acc, p, i) => heldIndices.includes(i) ? acc + p.cost : acc, 0)
    : hand.reduce((acc, p) => acc + p.cost, 0);
  const remainingCap = SALARY_CAP - usedSalary;

  // --- COMPACT BADGE LIST FOR FOOTER ---
  // Format: 3 Columns x 2 Rows
  const badgeList = [
    { label: "FIRE", emoji: "🔥" }, { label: "TRIP", emoji: "👑" }, { label: "DBL", emoji: "✌️" },
    { label: "5x5", emoji: "🖐️" }, { label: "QUAD", emoji: "🦕" }, { label: "LOCK", emoji: "🔒" }
  ];

  useEffect(() => {
    if (xpEarned) {
      const timer = setTimeout(() => setXpEarned(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [xpEarned]);

  const handleDeal = () => {
    if (bankroll < 10) updateBankroll(1000); 
    const totalBet = 10 * betMultiplier;
    if ((bankroll < 10 ? 1000 : bankroll) < totalBet) { alert("Insufficient Funds!"); return; }

    updateBankroll(-totalBet);
    setJackpotContribution(totalBet * 0.05); setTimeout(() => setJackpotContribution(0), 100);
    setPayoutResult(null); setShowEffects(false); setXpEarned(null); setRunningScore(0); setResults({}); setHeldIndices([]);
    
    const pool = fetchDraftPool(60, [], 15.0); 
    let initialHand = [];
    
    // Star-First Dealing
    const stars = pool.filter(p => p.cost >= 4.50);
    const star = stars.length > 0 ? stars[Math.floor(Math.random() * stars.length)] : pool.sort((a,b)=>b.cost-a.cost)[0];
    initialHand.push(star);

    const whiteTier = pool.filter(p => p.cost < 2.00 && p.id !== star.id);
    for(let i=0; i<4; i++) {
        initialHand.push(whiteTier[i] || pool.find(p => !initialHand.includes(p) && p.id !== star.id));
    }

    optimizeTeam(initialHand, [], SALARY_CAP);
    setHand(initialHand);
    setGamePhase('DEALING');
    setSequencerIndex(0);
  };

  const handleDraw = () => {
    setGamePhase('DRAWING');
    setSequencerIndex(0);
    const keptCards = heldIndices.map(i => hand[i]);
    const heldNames = keptCards.map(c => c.name);
    const slotsNeeded = 5 - heldIndices.length;
    
    const replacements = fetchDraftPool(slotsNeeded, heldNames, SALARY_CAP); 
    
    let nextHand = [...hand];
    let repIdx = 0;
    for (let i = 0; i < 5; i++) {
        if (!heldIndices.includes(i)) {
            nextHand[i] = replacements[repIdx] || hand[i];
            repIdx++;
        }
    }
    optimizeTeam(nextHand, heldIndices, SALARY_CAP);
    setHand(nextHand);
    setTimeout(() => performReveal(nextHand), 500);
  };

  const optimizeTeam = (cards, lockedIndices, maxCap) => {
    let attempts = 0;
    const MAX_ATTEMPTS = 150;
    const getTotal = () => cards.reduce((sum, c) => sum + c.cost, 0);
    let total = getTotal();

    while (attempts < MAX_ATTEMPTS) {
        total = getTotal();
        if (total <= maxCap && total >= MIN_TARGET) break;

        if (total > maxCap) {
            let expensiveIdx = -1; let maxCost = -1;
            cards.forEach((c, i) => {
                if (lockedIndices.includes(i)) return;
                if (c.cost > maxCost) { maxCost = c.cost; expensiveIdx = i; }
            });
            if (expensiveIdx !== -1) {
                const overflow = total - maxCap;
                const targetCost = cards[expensiveIdx].cost - overflow - 0.1;
                const pool = fetchDraftPool(1, cards.map(c => c.name), Math.max(0.5, targetCost));
                if (pool.length > 0) cards[expensiveIdx] = pool[0];
            }
        } 
        else if (total < MIN_TARGET) {
            let cheapIdx = -1; let minCost = 999;
            cards.forEach((c, i) => {
                if (!lockedIndices.includes(i) && c.cost < minCost) { minCost = c.cost; cheapIdx = i; }
            });
            if (cheapIdx !== -1) {
                const currentCost = cards[cheapIdx].cost;
                const roomAvailable = maxCap - total;
                const targetMax = currentCost + roomAvailable;
                const pool = fetchDraftPool(1, cards.map(c => c.name), targetMax);
                if (pool.length > 0) {
                    const candidate = pool[0];
                    const potentialTotal = total - currentCost + candidate.cost;
                    if (candidate.cost > currentCost && potentialTotal <= maxCap + 0.001) {
                        cards[cheapIdx] = candidate;
                    }
                }
            }
        }
        attempts++;
    }

    let safetyAttempts = 0;
    while (getTotal() > maxCap && safetyAttempts < 50) {
        let expensiveIdx = -1; let maxCost = -1;
        cards.forEach((c, i) => {
             if (!lockedIndices.includes(i) && c.cost > maxCost) { maxCost = c.cost; expensiveIdx = i; }
        });
        if (expensiveIdx !== -1) {
             const pool = fetchDraftPool(1, cards.map(c => c.name), cards[expensiveIdx].cost - 0.2);
             if(pool.length > 0) cards[expensiveIdx] = pool[0];
        }
        safetyAttempts++;
    }
  };

  const performReveal = (finalHand) => {
    const newResults = {};
    finalHand.forEach((player, index) => {
       const key = `${player.id}-${index}`;
       let log = getPlayerGameLog(player);
       if (EASY_MODE) {
           const projected = (player.cost || 0) * 10;
           if (log.score < projected * 0.9) {
               const retryLog = getPlayerGameLog(player);
               if (retryLog.score > log.score) {
                   log = retryLog;
               }
           }
       }
       newResults[key] = log;
    });
    setResults(newResults);
    setRunningScore(0);
    setGamePhase('REVEALING');
    setSequencerIndex(0);
  };

  useEffect(() => {
    let t;
    if (gamePhase === 'DEALING') {
       if (sequencerIndex < 5) t = setTimeout(() => setSequencerIndex(p => p+1), 150);
       else t = setTimeout(() => setGamePhase('DEALT'), 300);
    }
    if (gamePhase === 'REVEALING') {
       if (sequencerIndex < 5) {
          const key = `${hand[sequencerIndex].id}-${sequencerIndex}`;
          if (results[key]) setRunningScore(p => p + results[key].score);
          t = setTimeout(() => setSequencerIndex(p => p+1), 1000);
       } else { 
          t = setTimeout(() => { 
             const finalTotal = Object.values(results).reduce((a, b) => a + b.score, 0);
             let mult = 0; let lbl = "LOSS"; let clr = "text-slate-500";
             if (finalTotal >= 280) { mult=100; lbl="JACKPOT"; clr="text-yellow-400"; }
             else if (finalTotal >= 250) { mult=15; lbl="LEGENDARY"; clr="text-purple-400"; }
             else if (finalTotal >= 220) { mult=5; lbl="BIG WIN"; clr="text-green-400"; }
             else if (finalTotal >= 190) { mult=2; lbl="WINNER"; clr="text-blue-400"; }
             else if (finalTotal >= 165) { mult=0.5; lbl="SAVER"; clr="text-slate-400"; }
             
             if (mult > 0) { updateBankroll(Math.floor(10 * betMultiplier * mult)); setShowEffects(true); }
             setPayoutResult({label:lbl, color:clr});
             const totalBadges = Object.values(results).reduce((acc, r) => acc + (r.badges ? r.badges.length : 0), 0);
             recordGame(mult > 0, totalBadges);
             setXpEarned(10 + (mult > 0 ? 5 : 0));
             setGamePhase('END'); 
          }, 800); 
       }
    }
    return () => clearTimeout(t);
  }, [gamePhase, sequencerIndex]);

  const handleReplay = () => { setHand([]); setGamePhase('START'); setRunningScore(0); setPayoutResult(null); setXpEarned(null); };
  const toggleHold = (i) => { if (gamePhase === 'DEALT') setHeldIndices(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]); };
  const getRes = (i) => (gamePhase === 'END' || (gamePhase === 'REVEALING' && i <= sequencerIndex)) ? results[`${hand[i]?.id}-${i}`] : null;
  const isFaceDown = (i) => (gamePhase === 'START') || (gamePhase === 'DEALING' && i > sequencerIndex) || (gamePhase === 'DRAWING' && !heldIndices.includes(i)) || (gamePhase === 'REVEALING' && i > sequencerIndex && !heldIndices.includes(i));
  const betOpts = [1, 3, 5, 10, 20];

  return (
    <PageContainer>
      {showEffects && payoutResult && <MoneyRain tierLabel={payoutResult.label} />}
      {xpEarned && <XpFloater amount={xpEarned} />}
      {showRules && <PayoutInfo onClose={() => setShowRules(false)} />}
      
      <div className="flex flex-col h-full w-full max-w-7xl mx-auto px-2 pb-64 relative z-10">
        <div className="shrink-0 w-full flex justify-center mt-4 mb-4 relative z-30"><JackpotBar addAmount={jackpotContribution} /></div>
        <div className="flex-1 flex flex-col items-center justify-start min-h-0 relative z-20">
           <div className="w-full grid grid-cols-5 gap-2">
              {hand.length === 0 ? 
                 Array.from({length:5}).map((_,i) => <div key={i} className="aspect-[3/5]"><LiveCard isFaceDown={true}/></div>) 
              : 
                 hand.map((p,i) => <div key={`${p.id}-${i}`} className="aspect-[3/5]"><LiveCard player={p} isHeld={heldIndices.includes(i)} onToggle={() => toggleHold(i)} finalScore={getRes(i)} isFaceDown={isFaceDown(i)} /></div>)
              }
           </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-slate-950 border-t border-slate-900 p-4 pb-8 z-50 shadow-2xl">
        <div className="max-w-xl mx-auto flex flex-col gap-3">
           
           {/* --- FOOTER BAR WITH LEGEND --- */}
           <div className="flex items-center justify-between h-16 bg-slate-900 rounded-xl border border-slate-800 px-2 relative overflow-hidden">
             
             {/* LEFT: BUDGET */}
             <div className="flex flex-col leading-tight min-w-[70px]">
               <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">BUDGET</span>
               <div className="flex items-baseline gap-1">
                 <span className={`font-mono font-bold text-base ${usedSalary > 15 ? 'text-red-500' : 'text-white'}`}>${usedSalary.toFixed(1)}</span>
                 <span className={`font-mono font-bold text-[10px] ${remainingCap < 0 ? 'text-red-500' : 'text-green-500'}`}>(${Math.max(0, remainingCap).toFixed(1)})</span>
               </div>
             </div>

             {/* CENTER: ACTION / WIN (Reduced width to fit legend) */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full flex items-center justify-center w-full max-w-[140px]">
                {gamePhase === 'DEALT' && (
                  <span className="text-orange-400 text-[9px] font-black uppercase tracking-[0.1em] animate-pulse whitespace-nowrap bg-black/60 px-2 py-1 rounded-full border border-orange-500/30">
                    HOLD AND DRAW
                  </span>
                )}
                {gamePhase === 'END' && payoutResult && (
                   <WinText label={payoutResult.label} color={payoutResult.color} />
                )}
             </div>

             {/* RIGHT: TEAM FP + LEGEND */}
             <div className="flex items-center gap-2 border-l border-slate-800/50 pl-2">
                
                {/* Score */}
                <div className="flex flex-col items-end leading-tight">
                    <div className="flex items-center gap-1">
                        <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest">TEAM FP</span>
                        <button onClick={() => setShowRules(true)} className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[8px] text-slate-400 hover:text-white hover:border-slate-400">?</button>
                    </div>
                    <span className="text-xl font-mono font-black text-white"><TeamScoreRoller value={runningScore} /></span>
                </div>

                {/* LEGEND GRID (3x2) */}
                <div className="grid grid-cols-3 gap-x-1.5 gap-y-0.5 bg-black/30 p-1 rounded border border-white/5">
                    {badgeList.map((b, i) => (
                        <div key={i} className="flex items-center gap-0.5" title={b.label}>
                            <span className="text-[10px]">{b.emoji}</span>
                            <span className="text-[6px] text-slate-400 font-bold uppercase tracking-tight">{b.label}</span>
                        </div>
                    ))}
                </div>

             </div>
           </div>
           
           <div className="flex justify-between items-center px-1">
              <div className="flex gap-1.5">{betOpts.map(m => (<button key={m} onClick={() => setBetMultiplier(m)} disabled={gamePhase !== 'START' && gamePhase !== 'END' && gamePhase !== 'DEALT'} className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${betMultiplier === m ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{m===20?'MAX':`${m}x`}</button>))}</div>
              <div className="text-right"><span className="text-[9px] text-slate-500 uppercase font-bold block">Total Bet</span><span className="text-white font-mono font-bold text-sm">${10 * betMultiplier}</span></div>
           </div>
           
           <div className="flex gap-2">
               <button onClick={gamePhase==='DEALT'?handleDraw:(gamePhase==='END'?handleReplay:handleDeal)} disabled={gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING'} className={`py-3.5 text-white font-black rounded-xl shadow-lg transition-all text-sm tracking-widest uppercase flex-1 ${gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING'?'bg-slate-800 text-slate-500':'bg-green-600 hover:brightness-110'}`}>
                 {gamePhase==='DEALT'?'DRAW':(gamePhase==='END'?'REPLAY':(gamePhase==='DEALING'?'PROCESSING...':'DEAL'))}
               </button>
           </div>
        </div>
      </div>
    </PageContainer>
  );
}