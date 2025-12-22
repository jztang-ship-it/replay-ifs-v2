import React, { useState, useEffect } from 'react';
import { useBankroll } from '../context/BankrollContext';
import { dealExactBudgetHand } from '../engine/dealer';
import { getHistoricalPerformance } from '../engine/historicalRNG';
import PlayerCard from '../components/game/PlayerCard';
import MoneyRain from '../components/effects/MoneyRain';
import JackpotBar from '../components/game/JackpotBar';
import BadgeLegend from '../components/game/BadgeLegend'; 
import { GAME_CONFIG } from '../utils/constants';
import { getGameConfig } from '../utils/gameConfig'; 

const HudRollingNumber = ({ value }) => {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    let start = display;
    const end = value;
    if (start === end) return;
    const duration = 800;
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(start + (end - start) * ease));
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplay(end);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{display.toLocaleString()}</>;
};

export default function Play() {
  const { bankroll, updateBankroll } = useBankroll(); 
  const config = getGameConfig(); 

  const [hand, setHand] = useState([]);
  const [heldIndices, setHeldIndices] = useState([]); 
  const [results, setResults] = useState({}); 
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [payoutResult, setPayoutResult] = useState(null); 
  const [showEffects, setShowEffects] = useState(false);
  const [cardRotations, setCardRotations] = useState(new Array(config.rosterSize).fill(1)); 
  const [gamePhase, setGamePhase] = useState('START'); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);
  const [runningScore, setRunningScore] = useState(0);
  const [jackpotContribution, setJackpotContribution] = useState(0);

  const totalSalary = hand.reduce((sum, p) => sum + (p.cost || 0), 0);
  const heldCost = hand.filter((_, i) => heldIndices.includes(i)).reduce((sum, p) => sum + p.cost, 0);
  const remainingCap = config.salaryCap - heldCost; 

  const handleInitialDeal = () => {
    const totalBet = (GAME_CONFIG?.BASE_BET || 10) * betMultiplier;
    if (bankroll < totalBet) { alert("Insufficient Funds!"); return; }

    updateBankroll(-totalBet); 
    setJackpotContribution(totalBet * 0.05);
    setTimeout(() => setJackpotContribution(0), 100);

    setPayoutResult(null);
    setShowEffects(false);
    setRunningScore(0);
    
    const newCards = dealExactBudgetHand(config.rosterSize, config.salaryCap, []);
    setHand(newCards);
    setHeldIndices([]); 
    
    const newResults = {};
    newCards.forEach((player, index) => {
      newResults[`${player.id}-${index}`] = getHistoricalPerformance(player);
    });
    setResults(newResults);

    setSequencerIndex(0);
    setGamePhase('DEALING'); 
  };

  const handleReplay = () => { setGamePhase('RESETTING'); };
  
  const toggleHold = (index) => {
    if (gamePhase !== 'DEALT') return;
    if (heldIndices.includes(index)) {
      setHeldIndices(heldIndices.filter(i => i !== index));
    } else {
      setHeldIndices([...heldIndices, index]);
    }
  };

  const handleDrawRequest = () => { setGamePhase('DISCARDING'); };
  
  const performDataSwap = () => {
    const heldCards = heldIndices.map(i => hand[i]);
    const heldIdsList = heldCards.map(c => c.id);
    const slotsNeeded = config.rosterSize - heldCards.length;
    const currentHeldCost = heldCards.reduce((sum, c) => sum + c.cost, 0);
    const remainingBudget = Math.round((config.salaryCap - currentHeldCost) * 10) / 10;
    
    const replacements = dealExactBudgetHand(slotsNeeded, remainingBudget, heldIdsList);
    
    let rIdx = 0;
    const finalHand = hand.map((card, index) => {
      if (heldIndices.includes(index)) return card;
      return replacements[rIdx++];
    });
    
    setHand(finalHand);

    const nextResults = {};
    finalHand.forEach((player, index) => {
       const key = `${player.id}-${index}`;
       if (heldIndices.includes(index)) nextResults[key] = results[key];
       else nextResults[key] = getHistoricalPerformance(player);
    });
    setResults(nextResults);
    
    setRunningScore(0);
    setGamePhase('REVEALING');
    setSequencerIndex(0);
  };

  useEffect(() => {
    let timer;
    if (gamePhase === 'DEALING') {
      if (sequencerIndex < config.rosterSize) {
        timer = setTimeout(() => {
          setCardRotations(prev => { const n=[...prev]; n[sequencerIndex]+=1; return n; });
          setSequencerIndex(p => p+1);
        }, 150);
      } else { timer = setTimeout(() => setGamePhase('DEALT'), 500); }
    }

    if (gamePhase === 'DISCARDING') {
      setCardRotations(prev => prev.map((rot, i) => heldIndices.includes(i) ? rot : rot + 1));
      timer = setTimeout(() => setGamePhase('DRAWING'), 800);
    }
    
    if (gamePhase === 'DRAWING') { performDataSwap(); }

    if (gamePhase === 'REVEALING') {
      if (sequencerIndex < config.rosterSize) {
        timer = setTimeout(() => {
          setCardRotations(prev => { 
            const n = [...prev]; 
            if (!heldIndices.includes(sequencerIndex)) { n[sequencerIndex] += 1; }
            return n; 
          });

          const player = hand[sequencerIndex];
          const key = `${player.id}-${sequencerIndex}`;
          const res = results[key];
          if (res && res.score) {
             setRunningScore(prev => Math.round((prev + res.score) * 10) / 10);
          }

          setSequencerIndex(p => p+1);
        }, 600);
      } else { 
          timer = setTimeout(() => setGamePhase('END'), 1000); 
      }
    }

    if (gamePhase === 'RESETTING') {
      setCardRotations(prev => prev.map(rot => (rot % 2 === 0 ? rot + 1 : rot)));
      timer = setTimeout(() => handleInitialDeal(), 800);
    }

    if (gamePhase === 'END') {
      let total = 0;
      hand.forEach((player, index) => {
        const res = results[`${player.id}-${index}`];
        if (res && res.score) total += parseFloat(res.score);
      });
      total = Math.round(total * 10) / 10;
      calculatePayout(total);
    }

    return () => clearTimeout(timer);
  }, [gamePhase, sequencerIndex]);

  const calculatePayout = (score) => {
    const tiers = GAME_CONFIG?.PAYOUT_TIERS || [];
    const tier = [...tiers].sort((a,b) => b.min - a.min).find(t => score >= t.min);
    const activeTier = tier || { label: 'LOSS', min: 0, multiplier: 0, color: 'text-slate-500', emoji: '😢' };
    const baseBet = GAME_CONFIG?.BASE_BET || 10;
    
    let finalWinAmount = baseBet * betMultiplier * activeTier.multiplier;
    let label = activeTier.label;

    if (score >= 250) {
        finalWinAmount += 12000; 
        label = "JACKPOT!!";
    } else if (score >= 220) {
        finalWinAmount += 1200; 
        label = "MINI POT!";
    }
    
    setPayoutResult({ 
      label: label, 
      amount: finalWinAmount, 
      color: activeTier.color, 
      emoji: '',
      multiplier: activeTier.multiplier 
    });
    
    setShowEffects(true);
    if (finalWinAmount > 0) updateBankroll(finalWinAmount);
  };

  const getVisibleResult = (index) => {
     if (gamePhase === 'END') return results[`${hand[index]?.id}-${index}`];
     if (gamePhase === 'REVEALING' && index < sequencerIndex) return results[`${hand[index]?.id}-${index}`];
     return null;
  };
  const getIsRolling = (index) => {
    if (gamePhase === 'REVEALING' && index === sequencerIndex) return true;
    return false;
  };

  return (
    <div className="absolute inset-0 bg-slate-950 font-sans overflow-hidden flex flex-col justify-between pb-2">
      {showEffects && payoutResult && <MoneyRain tierLabel={payoutResult.label} />}
      
      <JackpotBar addAmount={jackpotContribution} />

      {/* 1. CARDS AREA - Reduced padding */}
      <div className="w-full flex flex-col items-center justify-start pt-36 z-10 pointer-events-none flex-1 relative">
        
        {/* CARDS */}
        <div className="flex justify-center items-center gap-4 max-w-7xl w-full px-4 pointer-events-auto mb-2">
          {hand.length === 0 ? Array.from({length: config.rosterSize}).map((_,i)=><PlayerCard key={i} rotation={1} player={{}}/>) : 
            hand.map((p,i) => (
              <PlayerCard 
                key={`${p.id}-${i}`} 
                player={p} 
                isHeld={heldIndices.includes(i)} 
                onToggle={()=>toggleHold(i)} 
                finalScore={getVisibleResult(i)} 
                rotation={cardRotations[i]} 
                isRolling={getIsRolling(i)} 
              />
            ))
          }
        </div>

        {/* BADGE LEGEND */}
        {hand.length > 0 && (
          <div className="pointer-events-auto mb-2 scale-90 origin-top">
            <BadgeLegend />
          </div>
        )}

        {/* SALARY CAP INFO - TIGHT GAP */}
        {hand.length > 0 && (
          <div className="flex items-center gap-8 bg-slate-900/60 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md animate-in fade-in zoom-in duration-500 pointer-events-auto scale-90 origin-top">
             <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Team Salary</span>
                <span className="text-white font-mono font-bold text-lg">${totalSalary.toFixed(1)}</span>
             </div>
             <div className="h-6 w-[1px] bg-white/10"></div>
             <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Room Left</span>
                <span className={`font-mono font-bold text-lg ${remainingCap < 3.0 ? 'text-red-400' : 'text-green-400'}`}>
                   ${remainingCap.toFixed(1)}
                </span>
             </div>
             <div className="h-6 w-[1px] bg-white/10"></div>
             <div className="flex flex-col items-center opacity-50">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Max Cap</span>
                <span className="text-white font-mono font-bold text-lg">${config.salaryCap.toFixed(1)}</span>
             </div>
          </div>
        )}

      </div>

      {/* 2. FOOTER CONTROLS - TIGHTEST LAYOUT YET */}
      <div className="w-full bg-slate-950 border-t border-slate-900 pb-2 pt-1 flex flex-col items-center z-50 relative">
         
         {/* DASHBOARD STACK */}
         <div className="mb-1 flex items-end justify-center w-full h-16">
            <div className={`transition-all duration-300 flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl border border-white/5 
                ${(gamePhase === 'REVEALING' || gamePhase === 'END') && runningScore > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                ${payoutResult ? 'px-8 py-1 bg-slate-800/80 border-white/20' : 'px-8 py-2'}
            `}>
                 {/* RESULT SECTION WITH AMOUNT */}
                 {gamePhase === 'END' && payoutResult && (
                    <div className="animate-[slideDown_0.3s_ease-out] flex items-center gap-3 border-b border-white/10 pb-1 mb-1 w-full justify-center">
                       <div className={`text-lg font-black ${payoutResult.color} uppercase tracking-tighter leading-none`}>
                          {payoutResult.label}
                       </div>
                       <div className="text-white font-mono font-bold text-sm tracking-widest">
                          {payoutResult.amount > 0 ? `WON $${payoutResult.amount}` : `-$${(GAME_CONFIG?.BASE_BET || 10) * betMultiplier}`}
                       </div>
                    </div>
                 )}

                 {/* TOTAL FP */}
                 <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-white tabular-nums tracking-tighter leading-none">
                        <HudRollingNumber value={runningScore} />
                    </span>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">TOTAL</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">FP</span>
                    </div>
                 </div>
            </div>
         </div>

         {/* BANKROLL ROW */}
         <div className="flex items-center justify-between w-full max-w-2xl px-8 mb-1">
            <div className="flex flex-col items-start">
               <span className="text-[8px] text-slate-400 font-bold tracking-widest uppercase">My Balance</span>
               <span className={`font-mono font-black text-lg ${bankroll < 100 ? 'text-red-500' : 'text-green-400'}`}>
                 $<HudRollingNumber value={bankroll} />
               </span>
            </div>

            <div className="flex gap-1 scale-90">
                {[1, 3, 5, 10, 20].map(m => (
                <button
                   key={m}
                   disabled={gamePhase === 'DEALING' || gamePhase === 'REVEALING' || gamePhase === 'DISCARDING'}
                   onClick={() => setBetMultiplier(m)}
                   className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      betMultiplier === m ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed'
                   }`}
                >
                   {m}x
                </button>
                ))}
            </div>

            <div className="flex flex-col items-end">
               <span className="text-[8px] text-slate-400 font-bold tracking-widest uppercase">Total Bet</span>
               <span className="text-white font-mono font-black text-lg">
                 ${(GAME_CONFIG?.BASE_BET || 10) * betMultiplier}
               </span>
            </div>
         </div>

         {/* BUTTONS */}
         <div className="h-10 flex items-center w-full max-w-md px-4">
           {hand.length===0 && <button onClick={handleInitialDeal} className="w-full py-2 bg-green-600 text-white font-black rounded-full shadow-lg hover:scale-105 transition-transform text-sm tracking-widest">DEAL</button>}
           {gamePhase==='DEALT' && <button onClick={handleDrawRequest} className="w-full py-2 bg-blue-600 text-white font-black rounded-full shadow-lg hover:scale-105 transition-transform text-sm tracking-widest">DRAW</button>}
           {gamePhase==='END' && <button onClick={handleReplay} className="w-full py-2 bg-green-600 text-white font-black rounded-full shadow-lg hover:scale-105 transition-transform text-sm tracking-widest">REPLAY</button>}
         </div>
      </div>
    </div>
  );
}