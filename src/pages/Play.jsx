import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useBankroll, VIP_TIERS } from '../context/BankrollContext';
import PlayerCard from '../components/game/PlayerCard';
import MoneyRain from '../components/effects/MoneyRain';
import JackpotBar from '../components/game/JackpotBar';
import BadgeLegend from '../components/game/BadgeLegend';
import { fetchDraftPool, getPlayerGameLog } from '../data/real_nba_db';

const RollingNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => { setDisplay(value); }, [value]);
  return <span>{display.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>;
};

// --- XP FLOATER (Moved Down, Smaller) ---
const XpFloater = ({ amount }) => (
  <div className="fixed top-20 right-4 pointer-events-none z-[110] animate-bounce-up">
    <span className="text-xs font-black text-blue-400 drop-shadow-md bg-slate-900/90 px-2 py-1 rounded border border-blue-500/30">
      +{amount} XP
    </span>
  </div>
);

const TIER_REDRAWS = [0, 0, 1, 2, 3, 5, 10, 99, 99, 99, 99];

export default function Play() {
  const { 
    bankroll, updateBankroll, 
    recordGame, recordRedraw, 
    vipLevel, dailyStats 
  } = useBankroll(); 
  
  const [hand, setHand] = useState([]);
  const [heldIndices, setHeldIndices] = useState([]); 
  const [results, setResults] = useState({}); 
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [payoutResult, setPayoutResult] = useState(null); 
  const [showEffects, setShowEffects] = useState(false);
  const [xpEarned, setXpEarned] = useState(null);
  
  const [gamePhase, setGamePhase] = useState('START'); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);
  const [runningScore, setRunningScore] = useState(0);
  const [jackpotContribution, setJackpotContribution] = useState(0);
  
  const SALARY_CAP = 15.0;

  const usedSalary = gamePhase === 'DEALT' 
    ? hand.reduce((acc, p, i) => heldIndices.includes(i) ? acc + p.cost : acc, 0)
    : hand.reduce((acc, p) => acc + p.cost, 0);
  const remainingCap = SALARY_CAP - usedSalary;

  // --- XP TIMER EFFECT ---
  useEffect(() => {
    if (xpEarned) {
      const timer = setTimeout(() => setXpEarned(null), 1000); // Disappear after 1s
      return () => clearTimeout(timer);
    }
  }, [xpEarned]);

  const handleDeal = () => {
    const totalBet = 10 * betMultiplier;
    if (bankroll < totalBet) { alert("Insufficient Funds!"); return; }

    updateBankroll(-totalBet);
    setJackpotContribution(totalBet * 0.05); setTimeout(() => setJackpotContribution(0), 100);
    setPayoutResult(null); setShowEffects(false); setXpEarned(null); setRunningScore(0); setResults({}); setHeldIndices([]);
    
    const newHand = fetchDraftPool(5, [], SALARY_CAP);
    enforceCap(newHand, [], SALARY_CAP);

    setHand(newHand);
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
    enforceCap(nextHand, heldIndices, SALARY_CAP);
    setHand(nextHand);
    setTimeout(() => performReveal(nextHand), 500);
  };

  const handleScout = () => {
    const limit = TIER_REDRAWS[vipLevel] || 0;
    if (dailyStats.redraws >= limit) {
        alert(`Daily Scout limit reached!`);
        return;
    }
    recordRedraw();
    setHeldIndices([]); 
    const newHand = fetchDraftPool(5, [], SALARY_CAP);
    enforceCap(newHand, [], SALARY_CAP);
    setHand(newHand);
  };

  const enforceCap = (cards, lockedIndices, max) => {
    let total = cards.reduce((sum, c) => sum + c.cost, 0);
    let attempts = 0;
    while (total > max && attempts < 50) {
      let expensiveIdx = -1;
      let maxCost = -1;
      cards.forEach((c, i) => {
        if (!lockedIndices.includes(i) && c.cost > maxCost) {
          maxCost = c.cost;
          expensiveIdx = i;
        }
      });
      if (expensiveIdx !== -1) {
        const currentName = cards[expensiveIdx].name;
        const allNames = cards.map(c => c.name);
        const pool = fetchDraftPool(1, allNames, maxCost - 0.1);
        if (pool.length > 0) cards[expensiveIdx] = pool[0];
      }
      total = cards.reduce((sum, c) => sum + c.cost, 0);
      attempts++;
    }
  };

  const performReveal = (finalHand) => {
    const newResults = {};
    finalHand.forEach((player, index) => {
       const key = `${player.id}-${index}`;
       newResults[key] = getPlayerGameLog(player);
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
             if (finalTotal >= 250) { mult=20; lbl="JACKPOT"; clr="text-yellow-400"; }
             else if (finalTotal >= 220) { mult=10; lbl="LEGENDARY"; clr="text-yellow-200"; }
             else if (finalTotal >= 200) { mult=5; lbl="BIG WIN"; clr="text-green-400"; }
             else if (finalTotal >= 180) { mult=3; lbl="WINNER"; clr="text-blue-400"; }
             else if (finalTotal >= 150) { mult=0.5; lbl="SAVER"; clr="text-blue-200"; }
             
             if (mult > 0) { 
                 updateBankroll(Math.floor(10 * betMultiplier * mult)); 
                 setShowEffects(true); 
             }
             setPayoutResult({label:lbl, color:clr});
             const totalBadges = Object.values(results).reduce((acc, r) => acc + (r.badges ? r.badges.length : 0), 0);
             const isWin = mult > 0;
             recordGame(isWin, totalBadges);
             setXpEarned(10 + (isWin ? 5 : 0));
             setGamePhase('END'); 
          }, 800); 
       }
    }
    return () => clearTimeout(t);
  }, [gamePhase, sequencerIndex]);

  // UI HELPERS
  const handleReplay = () => { setHand([]); setGamePhase('START'); setRunningScore(0); setPayoutResult(null); setXpEarned(null); };
  const toggleHold = (i) => { if (gamePhase === 'DEALT') setHeldIndices(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]); };
  const getRes = (i) => (gamePhase === 'END' || (gamePhase === 'REVEALING' && i <= sequencerIndex)) ? results[`${hand[i]?.id}-${i}`] : null;
  const isFaceDown = (i) => (gamePhase === 'START') || (gamePhase === 'DEALING' && i > sequencerIndex) || (gamePhase === 'DRAWING' && !heldIndices.includes(i)) || (gamePhase === 'REVEALING' && i > sequencerIndex && !heldIndices.includes(i));
  const betOpts = [1, 3, 5, 10, 20];
  const scoutLimit = TIER_REDRAWS[vipLevel] || 0;
  const scoutUsed = dailyStats.redraws || 0;
  const canScout = scoutUsed < scoutLimit;

  return (
    <PageContainer>
      {showEffects && payoutResult && <MoneyRain tierLabel={payoutResult.label} />}
      {xpEarned && <XpFloater amount={xpEarned} />}
      
      <div className="flex flex-col h-full w-full max-w-7xl mx-auto px-2 pb-44 relative z-10">
        <div className="shrink-0 w-full flex justify-center mt-4 mb-4 relative z-30"><JackpotBar addAmount={jackpotContribution} /></div>
        <div className="flex-1 flex flex-col items-center justify-start min-h-0 relative z-20">
           
           {/* TALLER CARDS: Changed aspect-[3/4] to aspect-[3/5] */}
           <div className="w-full grid grid-cols-5 gap-2">
              {hand.length === 0 ? Array.from({length:5}).map((_,i)=><div key={i} className="aspect-[3/5]"><PlayerCard isFaceDown={true}/></div>) : 
                 hand.map((p,i) => (<div key={`${p.id}-${i}`} className="aspect-[3/5]"><PlayerCard player={p} isHeld={heldIndices.includes(i)} onToggle={() => toggleHold(i)} finalScore={getRes(i)} isFaceDown={isFaceDown(i)} /></div>))
              }
           </div>
           
           {hand.length > 0 && <div className="mt-4"><BadgeLegend /></div>}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-slate-950 border-t border-slate-900 p-4 pb-8 z-50 shadow-2xl">
        <div className="max-w-xl mx-auto flex flex-col gap-3">
           <div className="flex items-center justify-between h-12 bg-slate-900 rounded-xl border border-slate-800 px-3 relative">
             <div className="flex items-center gap-4">
               <div className="flex flex-col leading-none"><span className="text-[9px] text-slate-500 font-bold uppercase">Cap</span><span className="text-white font-mono font-bold text-xs">$15.0</span></div>
               <div className="w-px h-6 bg-slate-700"></div>
               <div className="flex flex-col leading-none"><span className="text-[9px] text-slate-500 font-bold uppercase">Used</span><span className={`font-mono font-bold text-xs ${usedSalary > 15 ? 'text-red-500' : 'text-white'}`}>{usedSalary.toFixed(1)}</span></div>
               <div className="w-px h-6 bg-slate-700"></div>
               <div className="flex flex-col leading-none"><span className="text-[9px] text-slate-500 font-bold uppercase">Rem</span><span className={`font-mono font-bold text-xs ${remainingCap < 0 ? 'text-red-500' : 'text-green-400'}`}>{Math.max(0, remainingCap).toFixed(1)}</span></div>
             </div>
             <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">{gamePhase === 'DEALT' && <span className="text-orange-400 text-[10px] font-bold animate-pulse">HOLD CARDS</span>}{gamePhase === 'END' && payoutResult && <span className={`text-[10px] font-black uppercase ${payoutResult.color} animate-bounce`}>{payoutResult.label}</span>}</div>
             <div className="flex flex-col items-end leading-none pl-3 border-l border-slate-800 relative">
                <span className="text-[9px] text-orange-400 font-black uppercase tracking-wider">TEAM FP</span>
                <span className="text-2xl font-mono font-black text-white"><RollingNumber value={runningScore} /></span>
             </div>
           </div>
           
           <div className="flex justify-between items-center px-1">
              <div className="flex gap-1.5">{betOpts.map(m => (<button key={m} onClick={() => setBetMultiplier(m)} disabled={gamePhase !== 'START' && gamePhase !== 'END' && gamePhase !== 'DEALT'} className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${betMultiplier === m ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{m===20?'MAX':`${m}x`}</button>))}</div>
              <div className="text-right"><span className="text-[9px] text-slate-500 uppercase font-bold block">Total Bet</span><span className="text-white font-mono font-bold text-sm">${10 * betMultiplier}</span></div>
           </div>
           
           <div className="flex gap-2">
               {gamePhase === 'DEALT' && (
                   <button onClick={handleScout} disabled={!canScout} className={`flex-1 py-3.5 font-bold rounded-xl shadow-lg uppercase text-xs tracking-wider flex flex-col items-center justify-center leading-none ${canScout ? 'bg-blue-600 text-white hover:brightness-110' : 'bg-slate-800 text-slate-500'}`}>
                       <span>SCOUT</span>
                       <span className="text-[9px] opacity-70 mt-0.5">{scoutUsed}/{scoutLimit} Daily</span>
                   </button>
               )}
               <button onClick={gamePhase==='DEALT'?handleDraw:(gamePhase==='END'?handleReplay:handleDeal)} disabled={gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING'} className={`py-3.5 text-white font-black rounded-xl shadow-lg transition-all text-sm tracking-widest uppercase flex-1 ${gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING'?'bg-slate-800 text-slate-500':'bg-green-600 hover:brightness-110'}`}>
                 {gamePhase==='DEALT'?'DRAW':(gamePhase==='END'?'REPLAY':(gamePhase==='DEALING'?'PROCESSING...':'DEAL'))}
               </button>
           </div>
        </div>
      </div>
    </PageContainer>
  );
}