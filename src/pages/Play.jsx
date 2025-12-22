import React, { useState, useEffect } from 'react';
import { useBankroll } from '../context/BankrollContext';
import { dealExactBudgetHand } from '../engine/dealer';
import { getHistoricalPerformance } from '../engine/historicalRNG';
import PlayerCard from '../components/game/PlayerCard';
import MoneyRain from '../components/effects/MoneyRain';
import { GAME_CONFIG } from '../utils/constants';

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
  const [hand, setHand] = useState([]);
  const [heldIndices, setHeldIndices] = useState([]); 
  const [results, setResults] = useState({}); 
  
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [payoutResult, setPayoutResult] = useState(null); 
  const [showEffects, setShowEffects] = useState(false);
  const [cardRotations, setCardRotations] = useState(new Array(5).fill(1)); 
  const [gamePhase, setGamePhase] = useState('START'); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);
  const [runningScore, setRunningScore] = useState(0);

  const handleInitialDeal = () => {
    const totalBet = (GAME_CONFIG?.BASE_BET || 10) * betMultiplier;
    if (bankroll < totalBet) { alert("Insufficient Funds!"); return; }

    updateBankroll(-totalBet); 
    setPayoutResult(null);
    setShowEffects(false);
    setRunningScore(0);
    
    const newCards = dealExactBudgetHand(5, 15.0, []);
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
    const slotsNeeded = 5 - heldCards.length;
    const currentHeldCost = heldCards.reduce((sum, c) => sum + c.cost, 0);
    const remainingBudget = Math.round((15.0 - currentHeldCost) * 10) / 10;
    
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
      if (sequencerIndex < 5) {
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
      if (sequencerIndex < 5) {
        timer = setTimeout(() => {
          // A. Flip Card - ONLY IF NOT HELD
          setCardRotations(prev => { 
            const n = [...prev]; 
            // FIX: If index is held, do NOT increment rotation (it stays face up)
            if (!heldIndices.includes(sequencerIndex)) {
                n[sequencerIndex] += 1; 
            }
            return n; 
          });

          // B. Add Score
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
    const finalWinAmount = baseBet * betMultiplier * activeTier.multiplier;
    
    setPayoutResult({ 
      label: activeTier.label, 
      amount: finalWinAmount, 
      color: activeTier.color, 
      emoji: activeTier.emoji,
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
    <div className="absolute inset-0 bg-slate-950 font-sans overflow-hidden flex flex-col justify-between">
      {showEffects && payoutResult && <MoneyRain tierLabel={payoutResult.label} />}
      
      {/* 1. CARDS AREA */}
      <div className="w-full flex justify-center items-center pt-20 pb-20 z-10 pointer-events-none flex-1">
        <div className="flex justify-center items-center gap-4 max-w-7xl w-full px-4 pointer-events-auto">
          {hand.length === 0 ? Array.from({length:5}).map((_,i)=><PlayerCard key={i} rotation={1} player={{}}/>) : 
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
      </div>

      {/* 2. FOOTER CONTROLS - REFACTORED FOR SEPARATION */}
      <div className="w-full bg-slate-950 border-t border-slate-900 pb-8 pt-4 flex flex-col items-center z-50 relative">
         
         {/* A. FLOATING RESULT POPUP (ABOVE THE BOX) */}
         {/* Positioned absolutely to sit between cards and footer */}
         {gamePhase === 'END' && payoutResult && (
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-50 animate-[bounceIn_0.6s_cubic-bezier(0.2,0.8,0.2,1)]">
              <div className="bg-slate-900/95 backdrop-blur-xl px-10 py-4 rounded-2xl border-2 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-1">
                 <div className={`text-4xl font-black ${payoutResult.color} uppercase tracking-tighter drop-shadow-lg flex items-center gap-3`}>
                    <span className="text-5xl">{payoutResult.emoji}</span> {payoutResult.label}
                 </div>
                 <div className="text-white font-mono font-bold text-xl tracking-widest">
                    {payoutResult.amount > 0 ? `WON $${payoutResult.amount}` : `LOST $${(GAME_CONFIG?.BASE_BET || 10) * betMultiplier}`}
                 </div>
              </div>
            </div>
         )}

         {/* B. PERMANENT SCORE BAR (Always visible at bottom) */}
         <div className="mb-2 h-16 flex items-center justify-center w-full">
            <div className={`transition-all duration-300 flex items-center gap-4 bg-slate-900/50 px-8 py-2 rounded-full border border-white/5 ${(gamePhase === 'REVEALING' || gamePhase === 'END') && runningScore > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                 <span className="text-6xl font-black text-white tabular-nums tracking-tighter leading-none">
                    <HudRollingNumber value={runningScore} />
                 </span>
                 <div className="flex flex-col items-start leading-none">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">TOTAL</span>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">FP</span>
                 </div>
            </div>
         </div>

         {/* BANKROLL ROW */}
         <div className="flex items-center justify-between w-full max-w-2xl px-8 mb-4">
            <div className="flex flex-col items-start">
               <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">My Balance</span>
               <span className={`font-mono font-black text-2xl ${bankroll < 100 ? 'text-red-500' : 'text-green-400'}`}>
                 $<HudRollingNumber value={bankroll} />
               </span>
            </div>

            <div className="flex gap-1">
                {[1, 3, 5, 10, 20].map(m => (
                <button
                   key={m}
                   disabled={gamePhase === 'DEALING' || gamePhase === 'REVEALING' || gamePhase === 'DISCARDING'}
                   onClick={() => setBetMultiplier(m)}
                   className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      betMultiplier === m ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed'
                   }`}
                >
                   {m}x
                </button>
                ))}
            </div>

            <div className="flex flex-col items-end">
               <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Total Bet</span>
               <span className="text-white font-mono font-black text-2xl">
                 ${(GAME_CONFIG?.BASE_BET || 10) * betMultiplier}
               </span>
            </div>
         </div>

         {/* MAIN BUTTON */}
         <div className="h-14 flex items-center w-full max-w-md px-4">
           {hand.length===0 && <button onClick={handleInitialDeal} className="w-full py-4 bg-green-600 text-white font-black rounded-full shadow-lg hover:scale-105 transition-transform text-lg tracking-widest">DEAL</button>}
           {gamePhase==='DEALT' && <button onClick={handleDrawRequest} className="w-full py-4 bg-blue-600 text-white font-black rounded-full shadow-lg hover:scale-105 transition-transform text-lg tracking-widest">DRAW</button>}
           {gamePhase==='END' && <button onClick={handleReplay} className="w-full py-4 bg-green-600 text-white font-black rounded-full shadow-lg hover:scale-105 transition-transform text-lg tracking-widest">REPLAY</button>}
         </div>
      </div>
    </div>
  );
}