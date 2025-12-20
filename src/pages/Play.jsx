import React, { useState, useEffect } from 'react';
import { dealExactBudgetHand } from '../engine/dealer';
import { getHistoricalPerformance } from '../engine/historicalRNG';
import PlayerCard from '../components/game/PlayerCard';
import MoneyRain from '../components/effects/MoneyRain';
import { GAME_CONFIG } from '../utils/constants';
import { useCountUp } from '../hooks/useCountUp';

export default function Play() {
  const [hand, setHand] = useState([]);
  const [heldIndices, setHeldIndices] = useState([]); 
  const [results, setResults] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  
  // --- MONEY & BETTING STATE ---
  const [bankroll, setBankroll] = useState(GAME_CONFIG.STARTING_BANKROLL);
  const [betMultiplier, setBetMultiplier] = useState(1); // 1, 3, 5, 10, 20
  const [currentBetAmount, setCurrentBetAmount] = useState(0); 
  const [payoutResult, setPayoutResult] = useState(null); 
  const [showEffects, setShowEffects] = useState(false);

  const displayBankroll = useCountUp(bankroll, 1000, true);

  const [cardRotations, setCardRotations] = useState(new Array(GAME_CONFIG.HAND_SIZE).fill(1)); 
  const [gamePhase, setGamePhase] = useState('START'); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);

  // --- SEQUENCERS ---
  useEffect(() => {
    if (gamePhase === 'DEALING') {
      if (sequencerIndex < GAME_CONFIG.HAND_SIZE) {
        const timer = setTimeout(() => {
          setCardRotations(prev => {
            const next = [...prev];
            next[sequencerIndex] += 1;
            return next;
          });
          setSequencerIndex(prev => prev + 1);
        }, 150);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setGamePhase('DEALT'), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [gamePhase, sequencerIndex]);

  useEffect(() => {
    if (gamePhase === 'DISCARDING') {
      setCardRotations(prev => prev.map((rot, i) => heldIndices.includes(i) ? rot : rot + 1));
      const timer = setTimeout(() => setGamePhase('DRAWING'), 800);
      return () => clearTimeout(timer);
    }
    if (gamePhase === 'DRAWING') {
      performDataSwap();
      setGamePhase('REVEALING');
      setSequencerIndex(0);
    }
    if (gamePhase === 'REVEALING') {
      if (sequencerIndex < GAME_CONFIG.HAND_SIZE) {
        const timer = setTimeout(() => {
          setCardRotations(prev => {
            const next = [...prev];
            if (!heldIndices.includes(sequencerIndex)) next[sequencerIndex] += 1;
            return next;
          });
          setSequencerIndex(prev => prev + 1);
        }, 600);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setGamePhase('END'), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [gamePhase, sequencerIndex]);

  useEffect(() => {
    if (gamePhase === 'RESETTING') {
      setCardRotations(prev => prev.map(rot => (rot % 2 === 0 ? rot + 1 : rot)));
      const timer = setTimeout(() => handleInitialDeal(), 800);
      return () => clearTimeout(timer);
    }
  }, [gamePhase]);

  // --- PAYOUT LOGIC ---
  useEffect(() => {
    if (gamePhase === 'END') {
      const sequenceTimer = setTimeout(() => {
        const totalScore = Object.values(results).reduce((sum, r) => sum + parseFloat(r.score), 0);
        calculatePayout(totalScore);
      }, 2000); 
      return () => clearTimeout(sequenceTimer);
    }
  }, [gamePhase]);

  const calculatePayout = (score) => {
    const tiers = GAME_CONFIG.PAYOUT_TIERS || [];
    const tier = [...tiers].sort((a,b) => b.min - a.min).find(t => score >= t.min);
    const activeTier = tier || { label: 'BETTER LUCK NEXT TIME', min: 0, multiplier: 0, color: 'text-red-500', emoji: '😢' };
    
    // Calculate Win based on the bet active when hand started
    const winAmount = currentBetAmount * activeTier.multiplier;

    setPayoutResult({
      label: activeTier.label,
      description: activeTier.description,
      amount: winAmount,
      color: activeTier.color,
      emoji: activeTier.emoji
    });

    setShowEffects(true);

    if (winAmount > 0) {
      setTimeout(() => {
        setBankroll(prev => prev + winAmount);
      }, 1000); 
    }
  };

  // --- ACTIONS ---
  const handleInitialDeal = () => {
    const totalBet = GAME_CONFIG.BASE_BET * betMultiplier;
    
    if (bankroll < totalBet) {
      setErrorMsg("INSUFFICIENT FUNDS");
      return;
    }

    setBankroll(prev => prev - totalBet);
    setCurrentBetAmount(totalBet); // Lock in the bet for this hand
    setPayoutResult(null);
    setShowEffects(false);
    
    const newCards = dealExactBudgetHand(GAME_CONFIG.HAND_SIZE, GAME_CONFIG.SALARY_CAP, []);
    setHand(newCards);
    setHeldIndices([]); 
    setResults({}); 
    setSequencerIndex(0);
    setGamePhase('DEALING'); 
    setErrorMsg(null);
  };

  const handleReplay = () => { setGamePhase('RESETTING'); };
  
  const toggleHold = (index) => {
    if (gamePhase !== 'DEALT') return;
    setErrorMsg(null);
    if (heldIndices.includes(index)) {
      setHeldIndices(heldIndices.filter(i => i !== index));
      return;
    }
    const newHeldIndices = [...heldIndices, index];
    const cost = newHeldIndices.reduce((sum, i) => sum + hand[i].cost, 0);
    const rem = GAME_CONFIG.SALARY_CAP - cost;
    const empty = GAME_CONFIG.HAND_SIZE - newHeldIndices.length;
    if (rem < empty * 1) { setErrorMsg("Not enough budget."); return; }
    if (rem > empty * 5) { setErrorMsg("Too much budget."); return; }
    setHeldIndices(newHeldIndices);
  };
  const handleDrawRequest = () => { setGamePhase('DISCARDING'); };
  
  const performDataSwap = () => {
    const heldCards = heldIndices.map(i => hand[i]);
    const heldIdsList = heldCards.map(c => c.id);
    const slots = GAME_CONFIG.HAND_SIZE - heldCards.length;
    const rem = GAME_CONFIG.SALARY_CAP - heldCards.reduce((sum, c) => sum + c.cost, 0);
    const replacements = dealExactBudgetHand(slots, rem, heldIdsList);
    let rIdx = 0;
    const finalHand = hand.map((card, index) => heldIndices.includes(index) ? card : replacements[rIdx++]);
    setHand(finalHand);
    const newResults = {};
    finalHand.forEach((player, i) => {
      const rawPerf = getHistoricalPerformance(player);
      newResults[`${player.id}-${i}`] = { ...rawPerf, date: `${rawPerf.date}, 2023` };
    });
    setResults(newResults);
  };

  const currentHeldCost = heldIndices.reduce((sum, i) => sum + (hand[i]?.cost || 0), 0);
  const rawTotalScore = Object.values(results).reduce((sum, r) => sum + parseFloat(r.score), 0);
  const animatedTotalScore = useCountUp(rawTotalScore, 2000, gamePhase === 'END');

  const getVisibleResult = (index) => {
     if (gamePhase === 'END' || gamePhase === 'RESETTING') return results[`${hand[index]?.id}-${index}`];
     if (gamePhase === 'REVEALING') return results[`${hand[index]?.id}-${index}`];
     return null;
  };
  const getIsRolling = (index) => {
    if (gamePhase === 'END' || gamePhase === 'RESETTING') return true;
    if (gamePhase === 'REVEALING') return index < sequencerIndex;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-slate-950 font-sans overflow-hidden">
      
      {showEffects && payoutResult && <MoneyRain tierLabel={payoutResult.label} />}

      {/* 1. HEADER */}
      <div className="fixed top-0 left-0 w-full h-[60px] flex items-center justify-between px-4 bg-slate-950 border-b border-slate-800 z-50 shadow-md">
        <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 tracking-tighter italic">
          IFS
        </h1>
        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-bold tracking-widest">BANK</span>
                <span className={`text-lg font-mono font-black ${bankroll < 100 ? 'text-red-500' : 'text-green-400'}`}>
                    ${displayBankroll}
                </span>
            </div>
             <div className="flex flex-col items-end border-l border-slate-700 pl-4">
                <span className="text-[10px] text-slate-400 font-bold tracking-widest">BET</span>
                <span className="text-lg font-mono font-black text-white">
                    {/* Show ACTIVE bet during hand, or SELECTED bet before hand */}
                    ${gamePhase === 'START' || gamePhase === 'END' ? GAME_CONFIG.BASE_BET * betMultiplier : currentBetAmount}
                </span>
            </div>
        </div>
      </div>

      {/* 2. CARD ARENA */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[55%] w-full max-w-6xl flex justify-center items-center gap-2 p-2 z-10">
        
        {/* RESULT OVERLAY */}
        {gamePhase === 'END' && payoutResult && (
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center justify-center pointer-events-none w-full animate-in zoom-in duration-300">
              <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-white/20 p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center">
                  <div className="text-6xl mb-2">{payoutResult.emoji}</div>
                  <div className={`text-4xl font-black italic mb-1 ${payoutResult.color} drop-shadow-md uppercase tracking-tight`}>
                      {payoutResult.label}
                  </div>
                  <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">
                      {payoutResult.description}
                  </div>
                  <div className="text-white text-5xl font-mono font-black bg-black/30 px-6 py-2 rounded-xl border border-white/10">
                      {payoutResult.amount > 0 ? `+$${payoutResult.amount}` : `-$${currentBetAmount}`}
                  </div>
              </div>
           </div>
        )}

        {hand.length === 0 ? (
           Array.from({ length: GAME_CONFIG.HAND_SIZE }).map((_, index) => (
             <PlayerCard key={index} rotation={1} player={{}} />
           ))
        ) : (
          hand.map((player, index) => {
            const isHeld = heldIndices.includes(index);
            return (
              <PlayerCard
                key={index} 
                player={player}
                isHeld={isHeld}
                onToggle={() => toggleHold(index)}
                finalScore={getVisibleResult(index)}
                rotation={cardRotations[index]}
                isRolling={getIsRolling(index)}
              />
            );
          })
        )}
      </div>

      {/* 3. FOOTER STACK */}
      <div className="fixed bottom-0 left-0 w-full z-20 bg-slate-950 border-t border-slate-900 shadow-2xl">
        
        {/* A. SCOREBOARD */}
        <div className={`h-12 w-full bg-slate-900 flex flex-col items-center justify-center transition-all duration-500 ${gamePhase === 'END' ? 'opacity-100' : 'opacity-0'}`}>
           <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-white drop-shadow-lg leading-none">
                    {animatedTotalScore}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest pt-2">FP</span>
           </div>
        </div>

        {/* B. CONTROL DECK */}
        <div className="w-full flex flex-col items-center justify-center pt-2 pb-12 bg-slate-950 relative">
          
          {/* BET SELECTOR (Only visible when not playing) */}
          {(hand.length === 0 || gamePhase === 'END') && (
            <div className="flex gap-2 mb-3">
              {GAME_CONFIG.BET_MULTIPLIERS.map(m => (
                <button
                  key={m}
                  onClick={() => setBetMultiplier(m)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    betMultiplier === m 
                      ? 'bg-blue-600 text-white shadow-lg scale-110' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {m}x
                </button>
              ))}
            </div>
          )}

          {/* STATUS OVERLAY (Only visible during play) */}
          {(gamePhase === 'DEALT' || gamePhase === 'DRAWING') && (
            <div className="absolute top-[-30px] flex gap-4 text-[10px] bg-slate-800 text-white px-4 py-1.5 rounded-full font-bold shadow-lg border border-slate-700">
               <span className="text-slate-300">HELD: <span className="text-white">${currentHeldCost}</span></span>
               <span className="text-green-400">MAX: ${GAME_CONFIG.SALARY_CAP}</span>
               {errorMsg && <span className="text-red-500 ml-2 animate-pulse">{errorMsg}</span>}
             </div>
          )}

          {/* MAIN ACTION BUTTONS */}
          {hand.length === 0 && (
            <button onClick={handleInitialDeal} className="w-72 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-black rounded-full text-xl shadow-lg active:scale-95 transition-all uppercase tracking-wide border-b-4 border-green-800 active:border-b-0 active:translate-y-1">
              DEAL HAND (-${GAME_CONFIG.BASE_BET * betMultiplier})
            </button>
          )}

          {gamePhase === 'DEALT' && (
            <button onClick={handleDrawRequest} className="w-72 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black rounded-full text-xl shadow-lg active:scale-95 transition-all uppercase tracking-wide border-b-4 border-blue-800 active:border-b-0 active:translate-y-1">
              DRAW
            </button>
          )}

          {gamePhase === 'END' && (
              <button onClick={handleReplay} className="w-72 py-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-black rounded-full text-xl shadow-lg active:scale-95 transition-all uppercase tracking-wide border-b-4 border-slate-900 active:border-b-0 active:translate-y-1">
              REPLAY 🔄
            </button>
          )}
        </div>
      </div>
    </div>
  );
}