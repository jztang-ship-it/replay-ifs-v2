// src/pages/Play.jsx
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useBankroll } from '../context/BankrollContext';
import { dealExactBudgetHand } from '../engine/dealer'; 
import PlayerCard from '../components/game/PlayerCard';
import MoneyRain from '../components/effects/MoneyRain';
import JackpotBar from '../components/game/JackpotBar';
import BadgeLegend from '../components/game/BadgeLegend';
import { GAME_CONFIG } from '../utils/constants';
import { getGameConfig } from '../utils/gameConfig';

// --- HELPER: Rolling Number for Team FP ---
const RollingNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTimestamp = null;
    const startVal = displayValue; 
    const endVal = parseFloat(value) || 0;
    
    if (startVal === endVal) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * easeOut;
      setDisplayValue(current);

      if (progress < 1) window.requestAnimationFrame(step);
      else setDisplayValue(endVal);
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return <span>{displayValue.toFixed(1)}</span>;
};

// --- STAT ENGINE ---
const generateGameResult = (player) => {
  if (!player) return { score: 0, rawStats: {}, stats: "N/A", badges: [], statLine: "N/A" };
  
  const baseScore = (player.cost || 1) * 5.5; 
  const variance = (Math.random() * 20) - 5; 
  let score = Math.max(0, Math.round((baseScore + variance) * 10) / 10);

  // Generate realistic stats based on score
  let rem = score;
  const pts = Math.floor(rem * 0.55); rem -= pts;
  const reb = Math.floor(rem / 1.2); 
  const ast = Math.floor(rem * 2); 
  
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const mStr = months[Math.floor(Math.random() * months.length)];
  const dStr = Math.floor(Math.random() * 28) + 1;

  return {
    score: score,
    rawStats: { pts, reb, ast, stl: Math.floor(Math.random()*2), blk: Math.floor(Math.random()*2), to: Math.floor(Math.random()*3) }, 
    date: `${mStr} ${dStr}, 23 vs ${["LAL","GSW","BOS","MIA","NYK"][Math.floor(Math.random()*5)]}`
  };
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
  const [gamePhase, setGamePhase] = useState('START'); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);
  const [runningScore, setRunningScore] = useState(0);
  const [jackpotContribution, setJackpotContribution] = useState(0);

  const totalSalary = hand.reduce((sum, p) => sum + (p.cost || 0), 0);
  const remainingCap = config.salaryCap - totalSalary; 

  // --- ACTIONS ---

  // 1. DEAL
  const handleInitialDeal = () => {
    const totalBet = (GAME_CONFIG?.BASE_BET || 10) * betMultiplier;
    if (bankroll < totalBet) { alert("Insufficient Funds!"); return; }

    updateBankroll(-totalBet); 
    setJackpotContribution(totalBet * 0.05); // Feed Jackpot
    setTimeout(() => setJackpotContribution(0), 100);

    setPayoutResult(null);
    setShowEffects(false);
    setRunningScore(0);
    setResults({});
    setHeldIndices([]); 
    
    let rawCards = [];
    try { rawCards = dealExactBudgetHand(config.rosterSize || 5, config.salaryCap, []) || []; } 
    catch (e) {}

    while (rawCards.length < 5) {
      rawCards.push({ id: `bench-${Math.random()}`, name: "Bench Player", cost: 1.0, team: "FA", img: "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png" });
    }
    
    // Add default image fallback
    const cleanCards = rawCards.map(p => ({ 
        ...p, 
        image: p.img || "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png" 
    }));
    
    setHand(cleanCards);
    setGamePhase('DEALING'); 
    setSequencerIndex(0);
  };

  // 2. REPLAY (Reset Hand)
  const handleReplay = () => { 
      setHand([]); 
      setGamePhase('START'); 
      setRunningScore(0);
      setPayoutResult(null);
  };
  
  // 3. TOGGLE HOLD
  const toggleHold = (index) => {
    if (gamePhase !== 'DEALT') return;
    if (heldIndices.includes(index)) {
      setHeldIndices(heldIndices.filter(i => i !== index));
    } else {
      setHeldIndices([...heldIndices, index]);
    }
  };

  // 4. DRAW
  const handleDrawRequest = () => { setGamePhase('DRAWING'); setSequencerIndex(0); };
  
  const performDataSwap = () => {
    const heldCards = heldIndices.map(i => hand[i]);
    const heldIdsList = heldCards.map(c => c.id);
    const slotsNeeded = hand.length - heldCards.length;
    const currentHeldCost = heldCards.reduce((sum, c) => sum + c.cost, 0);
    const remainingBudget = Math.round((config.salaryCap - currentHeldCost) * 10) / 10;
    
    let rawReplacements = [];
    try { rawReplacements = dealExactBudgetHand(slotsNeeded, remainingBudget, heldIdsList) || []; } 
    catch (error) {}
    
    while (rawReplacements.length < slotsNeeded) {
       rawReplacements.push({ id: `undrafted-${Date.now()}-${Math.random()}`, name: "Rookie FA", team: "FA", cost: 1.0, img: "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png" });
    }

    const cleanReplacements = rawReplacements.map(p => ({ ...p, image: p.img || "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png" }));
    let rIdx = 0;
    const finalHand = hand.map((card, index) => {
      if (heldIndices.includes(index)) return card;
      return cleanReplacements[rIdx++];
    });
    setHand(finalHand);

    // Calculate results immediately but don't show
    const newResults = {};
    finalHand.forEach((player, index) => {
       const key = `${player.id}-${index}`;
       newResults[key] = generateGameResult(player);
    });
    setResults(newResults);
    
    setRunningScore(0); // Reset visual score for the reveal drama
    setGamePhase('REVEALING');
    setSequencerIndex(0);
  };

  const calculatePayout = (score) => {
    const baseBet = GAME_CONFIG?.BASE_BET || 10;
    let multiplier = 0;
    let label = "LOSS";
    let color = "text-slate-500";
    
    if (score >= 250) { multiplier = 500; label = "GRAND JACKPOT!!"; color = "text-yellow-400"; }
    else if (score >= 220) { multiplier = 100; label = "MINI JACKPOT!"; color = "text-yellow-200"; }
    else if (score >= 200) { multiplier = 10; label = "BIG WIN"; color = "text-green-400"; }
    else if (score >= 180) { multiplier = 2; label = "WINNER"; color = "text-blue-400"; }
    else if (score >= 150) { multiplier = 0.5; label = "SAVER"; color = "text-slate-400"; }

    const finalWinAmount = Math.floor(baseBet * betMultiplier * multiplier);
    setPayoutResult({ label, amount: finalWinAmount, color, multiplier });
    if (finalWinAmount > 0) { setShowEffects(true); updateBankroll(finalWinAmount); }
  };

  // --- ANIMATION SEQUENCER ---
  useEffect(() => {
    let timer;
    
    // Dealing Animation (Flip Cards 1 by 1)
    if (gamePhase === 'DEALING') {
       if (sequencerIndex < 5) {
          timer = setTimeout(() => setSequencerIndex(p => p + 1), 150);
       } else { timer = setTimeout(() => setGamePhase('DEALT'), 300); }
    }
    
    // Drawing (Wait -> Swap)
    if (gamePhase === 'DRAWING') {
       timer = setTimeout(() => performDataSwap(), 500);
    }
    
    // Revealing (Flip -> Score -> Next)
    if (gamePhase === 'REVEALING') {
       if (sequencerIndex < 5) {
          const player = hand[sequencerIndex];
          const key = `${player.id}-${sequencerIndex}`;
          const res = results[key];
          if (res) setRunningScore(prev => prev + res.score);

          timer = setTimeout(() => setSequencerIndex(p => p + 1), 1000); // 1s delay per card
       } else {
          timer = setTimeout(() => {
             calculatePayout(runningScore);
             setGamePhase('END');
          }, 800);
       }
    }
    return () => clearTimeout(timer);
  }, [gamePhase, sequencerIndex, hand, results]);

  // --- RENDER HELPERS ---
  const getVisibleResult = (index) => {
     if (gamePhase === 'END') return results[`${hand[index]?.id}-${index}`];
     if (gamePhase === 'REVEALING' && index <= sequencerIndex) return results[`${hand[index]?.id}-${index}`];
     return null;
  };
  
  const isCardFaceDown = (index) => {
      if (gamePhase === 'START') return true;
      if (gamePhase === 'DEALING' && index >= sequencerIndex) return true; 
      if (gamePhase === 'DRAWING' && !heldIndices.includes(index)) return true; 
      if (gamePhase === 'REVEALING') {
          if (heldIndices.includes(index)) return false; 
          if (index > sequencerIndex) return true; 
          return false;
      }
      if (gamePhase === 'END') return false;
      return false;
  };

  const shouldShowResult = (index) => {
      if (gamePhase === 'END') return true;
      if (gamePhase === 'REVEALING' && index <= sequencerIndex) return true;
      return false;
  }

  // --- BUTTON LOGIC ---
  const getMainButtonAction = () => {
    if (gamePhase === 'START' || hand.length === 0) return handleInitialDeal;
    if (gamePhase === 'DEALT') return handleDrawRequest;
    if (gamePhase === 'END') return handleReplay;
    return null; // Disabled state
  };

  const getMainButtonLabel = () => {
    if (gamePhase === 'DEALT') return 'DRAW';
    if (gamePhase === 'END') return 'REPLAY';
    if (gamePhase === 'DEALING' || gamePhase === 'DRAWING' || gamePhase === 'REVEALING') return 'PROCESSING...';
    return 'DEAL';
  };

  return (
    <PageContainer>
      {showEffects && payoutResult && <MoneyRain tierLabel={payoutResult.label} />}
      
      <div className="flex flex-col h-full w-full max-w-7xl mx-auto px-2 pb-44 relative z-10">
        
        {/* JACKPOT BAR */}
        <div className="shrink-0 w-full flex justify-center mt-4 mb-4 relative z-30">
           <JackpotBar addAmount={jackpotContribution} />
        </div>

        {/* CARDS */}
        <div className="flex-1 flex flex-col items-center justify-start min-h-0 relative z-20">
           <div className="w-full grid grid-cols-5 gap-2">
              {hand.length === 0 ? (
                 Array.from({length: 5}).map((_,i) => (
                    <div key={i} className="aspect-[3/4] w-full">
                       <PlayerCard key={i} isFaceDown={true} />
                    </div>
                 ))
              ) : (
                 hand.map((p,i) => (
                    <div key={`${p.id}-${i}`} className="aspect-[3/4] w-full">
                        <PlayerCard 
                          player={p} 
                          isHeld={heldIndices.includes(i)} 
                          onToggle={() => toggleHold(i)} 
                          finalScore={getVisibleResult(i)} 
                          isFaceDown={isCardFaceDown(i)}
                          showResult={shouldShowResult(i)}
                        />
                    </div>
                 ))
              )}
           </div>
           
           {/* LEGEND */}
           {hand.length > 0 && <div className="mt-4"><BadgeLegend /></div>}
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-950 border-t border-slate-900 p-4 pb-8 z-50 shadow-2xl">
        <div className="max-w-xl mx-auto flex flex-col gap-3">
           
           {/* INFO BAR */}
           <div className="flex items-center justify-between h-12 bg-slate-900 rounded-xl border border-slate-800 px-3 relative">
             <div className="flex items-center gap-2 md:gap-4">
               <div className="flex flex-col leading-none">
                 <span className="text-[9px] text-slate-500 font-bold uppercase">Cap</span>
                 <span className="text-white font-mono font-bold text-xs">$15.0</span>
               </div>
               <div className="w-px h-6 bg-slate-700"></div>
               <div className="flex flex-col leading-none">
                 <span className="text-[9px] text-slate-500 font-bold uppercase">Used</span>
                 <span className="text-white font-mono font-bold text-xs">${totalSalary.toFixed(1)}</span>
               </div>
               <div className="w-px h-6 bg-slate-700"></div>
               <div className="flex flex-col leading-none">
                 <span className="text-[9px] text-slate-500 font-bold uppercase">Rem</span>
                 <span className={`font-mono font-bold text-xs ${remainingCap < 2 ? 'text-red-400' : 'text-green-400'}`}>
                   ${remainingCap.toFixed(1)}
                 </span>
               </div>
             </div>

             <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
                {gamePhase === 'DEALT' && <span className="text-orange-400 text-[10px] font-bold animate-pulse">HOLD CARDS</span>}
                {gamePhase === 'END' && payoutResult && (
                  <span className={`text-[10px] font-black uppercase ${payoutResult.color} animate-bounce`}>{payoutResult.label}</span>
                )}
             </div>

             <div className="flex flex-col items-end leading-none pl-3 border-l border-slate-800">
                <span className="text-[9px] text-orange-400 font-black uppercase tracking-wider">TEAM FP</span>
                <span className="text-2xl font-mono font-black text-white">
                   <RollingNumber value={runningScore} duration={1000} />
                </span>
             </div>
           </div>

           {/* CONTROLS */}
           <div className="flex justify-between items-center px-1">
              <div className="flex gap-2">
                 {[1, 5, 10].map(m => (
                    <button key={m} onClick={() => setBetMultiplier(m)} 
                       disabled={gamePhase !== 'START' && gamePhase !== 'END' && gamePhase !== 'DEALT'}
                       className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${betMultiplier === m ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>
                       {m}x
                    </button>
                 ))}
              </div>
              <div className="text-right">
                 <span className="text-[9px] text-slate-500 uppercase font-bold block">Total Bet</span>
                 <span className="text-white font-mono font-bold text-sm">${(GAME_CONFIG?.BASE_BET || 10) * betMultiplier}</span>
              </div>
           </div>

           {/* MAIN BUTTON */}
           <button 
             onClick={getMainButtonAction()} 
             disabled={!getMainButtonAction()}
             className={`w-full py-3.5 text-white font-black rounded-xl shadow-lg transition-all text-sm tracking-widest uppercase
               ${!getMainButtonAction() ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 
                 (gamePhase === 'DEALT' ? 'bg-blue-600 hover:brightness-110' : 'bg-green-600 hover:brightness-110')
               }
             `}
           >
             {getMainButtonLabel()}
           </button>
        </div>
      </div>
    </PageContainer>
  );
}