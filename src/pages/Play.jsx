import React, { useState, useEffect } from 'react';
import { dealExactBudgetHand } from '../engine/dealer';
import { getHistoricalPerformance } from '../engine/historicalRNG';
import PlayerCard from '../components/game/PlayerCard';
import MoneyRain from '../components/effects/MoneyRain';
import { GAME_CONFIG } from '../utils/constants';

// SIMPLIFIED ROLLING NUMBER FOR HUD
const HudRollingNumber = ({ value }) => {
  const [display, setDisplay] = useState(value);
  
  useEffect(() => {
    let start = display;
    const end = value;
    if (start === end) return;
    
    // Quick 500ms roll
    const duration = 500;
    let startTime = null;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setDisplay(Math.floor(start + (end - start) * progress));
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplay(end);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{display.toLocaleString()}</>;
};

export default function Play({ userBankroll, onBankrollUpdate }) {
  const [hand, setHand] = useState([]);
  const [heldIndices, setHeldIndices] = useState([]); 
  const [results, setResults] = useState({}); 
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [currentBetAmount, setCurrentBetAmount] = useState(0); 
  const [payoutResult, setPayoutResult] = useState(null); 
  const [showEffects, setShowEffects] = useState(false);
  const [cardRotations, setCardRotations] = useState(new Array(5).fill(1)); 
  const [gamePhase, setGamePhase] = useState('START'); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);

  // --- ACTIONS ---
  const handleInitialDeal = () => {
    const totalBet = (GAME_CONFIG?.BASE_BET || 10) * betMultiplier;
    onBankrollUpdate(-totalBet); 
    setCurrentBetAmount(totalBet); 
    setPayoutResult(null);
    setShowEffects(false);
    
    const newCards = dealExactBudgetHand(5, 15, []);
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
    const replacements = dealExactBudgetHand(slotsNeeded, 15 - currentHeldCost, heldIdsList);
    
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
    setGamePhase('REVEALING');
    setSequencerIndex(0);
  };

  const calculateTotalScore = () => {
    if (!hand.length) return 0;
    if (gamePhase !== 'END') return 0; 
    let total = 0;
    hand.forEach((player, index) => {
      const res = results[`${player.id}-${index}`];
      if (res && res.score) total += parseFloat(res.score);
    });
    return Math.round(total * 10) / 10;
  };

  const rawTotalScore = calculateTotalScore();

  // --- SEQUENCER ---
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
          setCardRotations(prev => { 
            const n = [...prev]; 
            if (!heldIndices.includes(sequencerIndex)) n[sequencerIndex] += 1; 
            return n; 
          });
          setSequencerIndex(p => p+1);
        }, 600);
      } else { timer = setTimeout(() => setGamePhase('END'), 500); }
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
      timer = setTimeout(() => calculatePayout(total), 500);
    }
    return () => clearTimeout(timer);
  }, [gamePhase, sequencerIndex]);

  const calculatePayout = (score) => {
    const tiers = GAME_CONFIG?.PAYOUT_TIERS || [];
    const tier = [...tiers].sort((a,b) => b.min - a.min).find(t => score >= t.min);
    const activeTier = tier || { label: 'LOSS', min: 0, multiplier: 0, color: 'text-slate-500', emoji: '😢' };
    const winAmount = currentBetAmount * activeTier.multiplier;
    
    setPayoutResult({ 
      label: activeTier.label, 
      amount: winAmount, 
      color: activeTier.color, 
      emoji: activeTier.emoji,
      multiplier: activeTier.multiplier 
    });
    
    setShowEffects(true);
    if (winAmount > 0) onBankrollUpdate(winAmount); 
  };

  const getVisibleResult = (index) => {
     if (gamePhase === 'END') return results[`${hand[index]?.id}-${index}`];
     if (gamePhase === 'REVEALING' && index < sequencerIndex) return results[`${hand[index]?.id}-${index}`];
     return null;
  };
  const getIsRolling = (index) => {
    if (gamePhase === 'END') return false;
    if (gamePhase === 'REVEALING' && index >= sequencerIndex) return true;
    return false;
  };

  return (
    <div className="absolute inset-0 bg-slate-950 font-sans overflow-hidden flex flex-col justify-between">
      {showEffects && payoutResult && <MoneyRain tierLabel={payoutResult.label} />}
      
      {/* HUD HEADER */}
      <div className="fixed top-0 right-0 z-[110] h-20 flex items-center pr-6 gap-6 pointer-events-none">
         <div className="flex flex-col items-end">
           <span className="text-[9px] text-slate-400 font-bold tracking-widest">BANK</span>
           <span className={`font-mono font-black text-lg ${userBankroll < 100 ? 'text-red-500' : 'text-green-400'}`}>
             {/* Key ensures re-render on value change */}
             $<HudRollingNumber key={userBankroll} value={userBankroll} />
           </span>
         </div>
         <div className="flex flex-col items-end border-l border-white/10 pl-4">
           <span className="text-[9px] text-slate-400 font-bold tracking-widest">BET</span>
           <span className="text-white font-mono font-black text-lg">
             ${gamePhase === 'START' || gamePhase === 'END' ? (GAME_CONFIG?.BASE_BET || 10) * betMultiplier : currentBetAmount}
           </span>
         </div>
      </div>

      {/* CARDS: MOVED DOWN to pt-36 */}
      <div className="w-full flex justify-center items-start pt-36 z-10 pointer-events-none flex-1">
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

      {/* FOOTER CONTROLS - COMPRESSED AND TIGHT */}
      <div className="w-full bg-slate-950 border-t border-slate-900 pb-8 pt-4 flex flex-col items-center z-50">
         
         {/* RESULT / SCORE BOX */}
         <div className="mb-4 h-16 flex items-center justify-center">
            {gamePhase === 'END' && payoutResult ? (
              <div className="bg-slate-900/90 backdrop-blur-xl px-6 py-2 rounded-2xl border border-white/20 shadow-2xl animate-in zoom-in flex items-center gap-6">
                 <div className="flex flex-col items-center">
                    <span className="text-3xl">{payoutResult.emoji}</span>
                 </div>
                 <div className="flex flex-col items-start border-l border-white/10 pl-4">
                    <div className={`text-xl font-black ${payoutResult.color} uppercase leading-none mb-1`}>
                       {payoutResult.label} <span className="text-white/50 text-sm">({payoutResult.multiplier}x)</span>
                    </div>
                    <div className="text-white font-mono font-bold text-xs">
                       {payoutResult.amount > 0 ? `WON $${payoutResult.amount}` : `LOST $${currentBetAmount}`}
                    </div>
                 </div>
                 {/* COMBINED TOTAL FP */}
                 <div className="flex flex-col items-end border-l border-white/10 pl-4">
                     <span className="text-4xl font-black text-white leading-none">{rawTotalScore}</span>
                     <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Total FP</span>
                 </div>
              </div>
            ) : (
               <div className={`transition-opacity duration-300 ${rawTotalScore > 0 ? 'opacity-100' : 'opacity-0'} flex items-center gap-2 bg-slate-900/50 px-4 py-1 rounded-full border border-white/5`}>
                 <span className="text-3xl font-black text-white">{rawTotalScore}</span>
                 <span className="text-[10px] text-slate-400 font-bold">FP</span>
               </div>
            )}
         </div>
         
         {/* MULTIPLIERS */}
         <div className="flex gap-2 mb-3">
            {[1, 3, 5, 10, 20].map(m => (
            <button
               key={m}
               disabled={gamePhase !== 'START' && gamePhase !== 'END' && hand.length > 0}
               onClick={() => setBetMultiplier(m)}
               className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  betMultiplier === m ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-50'
               }`}
            >
               {m}x
            </button>
            ))}
         </div>

         {/* MAIN BUTTON */}
         <div className="h-14 flex items-center">
           {hand.length===0 && <button onClick={handleInitialDeal} className="px-12 py-4 bg-green-600 text-white font-black rounded-full shadow-lg hover:scale-105 transition-transform text-lg tracking-widest">DEAL</button>}
           {gamePhase==='DEALT' && <button onClick={handleDrawRequest} className="px-12 py-4 bg-blue-600 text-white font-black rounded-full shadow-lg hover:scale-105 transition-transform text-lg tracking-widest">DRAW</button>}
           {gamePhase==='END' && <button onClick={handleReplay} className="px-12 py-4 bg-slate-700 text-white font-black rounded-full shadow-lg hover:scale-105 transition-transform text-lg tracking-widest">REPLAY</button>}
         </div>
      </div>
    </div>
  );
}