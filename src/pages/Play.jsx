import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import LiveCard from '../components/game/LiveCard';
import JackpotBar from '../components/game/JackpotBar';
import { useBankroll } from '../context/BankrollContext';
import { useRoster } from '../context/RosterContext';

// --- NEW IMPORTS (Replaces dealer/mockAPI) ---
import { dealRealHand, fetchPlayablePool } from '../engine/RealDealer';
import { fetchRealGameLog } from '../data/real_nba_db';
import { calculateScore } from '../utils/GameMath';

// --- ANIMATION COMPONENTS (KEPT EXACTLY THE SAME) ---
const ScoreRoller = ({ value, colorClass = '' }) => {
  const [display, setDisplay] = useState(0);
  const target = parseFloat(value) || 0;
  useEffect(() => {
    let start = display; let startTime; const duration = 500;
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

const WinStamp = ({ label, color }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className={`transform -rotate-12 border-4 ${color ? color.replace('text-', 'border-') : 'border-white'} rounded-xl p-4 bg-black/80 backdrop-blur-sm shadow-2xl animate-bounce-short`}>
        <span className={`text-5xl md:text-7xl font-black italic uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] ${color} tracking-tighter`}>{label}</span>
      </div>
  </div>
);

export default function Play() {
  const { bankroll, updateBankroll, addHistory } = useBankroll(); 
  
  // We use local state for the hand (Context was causing issues)
  const [hand, setHand] = useState([null, null, null, null, null]);
  const [gamePhase, setGamePhase] = useState('START'); 
  const [heldIndices, setHeldIndices] = useState([]); 
  const [finalScores, setFinalScores] = useState({}); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [payoutResult, setPayoutResult] = useState(null); 
  const [runningScore, setRunningScore] = useState(0);
  const [jackpotContribution, setJackpotContribution] = useState(0);
  const [visibleBudget, setVisibleBudget] = useState(15.0);

  const SALARY_CAP = 15.0;
  const BASE_BET = 5; 
  const betOpts = [1, 2, 5, 10]; 
  const getCost = (p) => parseFloat(p?.cost || 0);

  // --- UPDATED DEAL HANDLER ---
  const handleDeal = async () => {
    const betAmount = BASE_BET * betMultiplier;
    if(bankroll < betAmount) return alert("Insufficient Funds");
    
    updateBankroll(-betAmount);
    setJackpotContribution(betAmount * 0.05);
    setTimeout(() => setJackpotContribution(0), 100);
    
    setGamePhase('DEALING'); 
    setPayoutResult(null); 
    setRunningScore(0); 
    setHeldIndices([]); 
    setFinalScores({}); 
    setVisibleBudget(SALARY_CAP); 
    setSequencerIndex(-1);
    setHand([null, null, null, null, null]);

    // CALL REAL DEALER
    const newHand = await dealRealHand();
    
    if (newHand) {
        setHand(newHand);
        setTimeout(() => setSequencerIndex(0), 500);
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
              setHeldIndices(p => p.filter(x => x !== i)); setVisibleBudget(prev => prev + cost);
          } else {
              setHeldIndices(p => [...p, i]); setVisibleBudget(prev => prev - cost);
          }
      }
  };

  // --- UPDATED DRAW HANDLER ---
  const handleDraw = async () => {
    setGamePhase('DRAWING');
    setSequencerIndex(-1); 
    
    // 1. Re-Deal Unheld Cards
    let currentHand = [...hand];
    const unheldIndices = [0, 1, 2, 3, 4].filter(i => !heldIndices.includes(i));
    
    if (unheldIndices.length > 0) {
        const usedBudget = heldIndices.reduce((sum, idx) => sum + (currentHand[idx]?.cost || 0), 0);
        const pool = await fetchPlayablePool();
        const budgetPerCard = (SALARY_CAP - usedBudget) / unheldIndices.length;

        for (let i of unheldIndices) {
            const candidates = pool.filter(p => (p.cost || 0) <= budgetPerCard + 1.5);
            const pick = candidates.length > 0 
                ? candidates[Math.floor(Math.random() * candidates.length)] 
                : pool[0]; 
            currentHand[i] = { ...pick, instanceId: `${pick.id}-${Date.now()}-${i}` };
        }
    }
    setHand(currentHand);

    // 2. Fetch Real Scores
    const newResults = {};
    for (let i = 0; i < 5; i++) {
        const player = currentHand[i];
        const log = await fetchRealGameLog(player.id);
        const math = calculateScore(log);
        newResults[`${player.id}-${i}`] = { 
            score: math.score, 
            stats: math.rawStats, 
            badges: math.bonuses,
            date: log.game_date,
            matchup: log.matchup || 'v OPP'
        };
    }
    
    setFinalScores(newResults);
    setGamePhase('REVEALING');
    setTimeout(() => setSequencerIndex(0), 500);
  };

  // --- SEQUENCER (Animations) ---
  useEffect(() => {
    if(gamePhase === 'DEALING') {
        if(sequencerIndex >= 0 && sequencerIndex < 5) setTimeout(() => setSequencerIndex(s => s+1), 400); 
        else if (sequencerIndex >= 5) setTimeout(() => setGamePhase('DEALT'), 500);
    }
    if(gamePhase === 'REVEALING') {
        if(sequencerIndex >= 0 && sequencerIndex < 5) {
            const card = hand[sequencerIndex];
            const key = `${card.id}-${sequencerIndex}`;
            setTimeout(() => {
                if(finalScores[key]) setRunningScore(s => s + finalScores[key].score);
            }, 400); 
            setTimeout(() => setSequencerIndex(s => s+1), 1000);
        } else if (sequencerIndex >= 5) {
            // End Game Logic
            setTimeout(() => {
                const total = Object.values(finalScores).reduce((a,b) => a+b.score, 0);
                const betAmount = BASE_BET * betMultiplier;
                let lbl = "LOSS"; let clr = "text-slate-500"; let win = 0;
                
                if (total >= 220) { win = betAmount*10; lbl="JACKPOT"; clr="text-yellow-400"; }
                else if (total >= 180) { win = betAmount*3; lbl="BIG WIN"; clr="text-green-400"; }
                else if (total >= 150) { win = betAmount*1; lbl="WINNER"; clr="text-blue-400"; }
                
                if (win > 0) updateBankroll(win);
                setPayoutResult({label:lbl, color:clr});
                
                if (addHistory) addHistory({ result: lbl, score: total, payout: win, date: new Date().toISOString() });
                setGamePhase('END');
            }, 800);
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
          if (heldIndices.includes(i)) isFaceDown = false; 
          else isFaceDown = i > sequencerIndex; 
      }
      return <LiveCard player={cardData} isHeld={heldIndices.includes(i)} onToggle={()=>toggleHold(i)} finalScore={finalScores[`${cardData.id}-${i}`]} isFaceDown={isFaceDown} showResult={showResult} />;
  };

  return (
    <PageContainer>
      <div className="fixed inset-0 bg-[#050b14] overflow-hidden flex flex-col z-0">
        
        {/* HEADER */}
        <div className="flex justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md relative z-40 mt-16">
             <div>
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Balance</div>
                 <div className="text-xl font-mono font-black text-green-400 drop-shadow-md">${(bankroll || 0).toFixed(2)}</div>
             </div>
             <div className="flex flex-col items-center">
                 <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Cap Space</div>
                 <div className={`text-lg font-mono font-black ${visibleBudget < 0 ? 'text-red-500' : 'text-white'}`}>${visibleBudget.toFixed(1)}</div>
             </div>
             <div className="text-right">
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Target</div>
                 <div className="text-xl font-mono font-black text-white drop-shadow-md">180<span className="text-xs text-slate-600">FP</span></div>
             </div>
        </div>

        {/* JACKPOT */}
        <div className="shrink-0 py-2 relative z-30">
            <JackpotBar addAmount={jackpotContribution} />
        </div>

        {/* GAME AREA */}
        <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center relative z-20 min-h-0">
            {gamePhase === 'END' && payoutResult && payoutResult.label !== "LOSS" && <WinStamp label={payoutResult.label} color={payoutResult.color} />}
            <div className="w-full h-full flex flex-col justify-center gap-2 px-2 py-2">
               <div className="flex justify-center gap-2 h-[30%]">
                  <div className="w-[30%] h-full">{renderCard(0)}</div>
                  <div className="w-[30%] h-full">{renderCard(1)}</div>
               </div>
               <div className="flex justify-center h-[30%]">
                  <div className="w-[30%] h-full">{renderCard(2)}</div>
               </div>
               <div className="flex justify-center gap-2 h-[30%]">
                  <div className="w-[30%] h-full">{renderCard(3)}</div>
                  <div className="w-[30%] h-full">{renderCard(4)}</div>
               </div>
            </div>
        </div>

        {/* CONTROLS */}
        <div className="shrink-0 w-full bg-slate-950/90 border-t border-slate-900 p-2 pb-6 z-50">
             <div className="max-w-xl mx-auto flex flex-col gap-2">
                 <div className="flex items-center justify-between h-10 bg-slate-900 rounded-lg border border-slate-800 px-3">
                    <div className="flex bg-slate-900 rounded-lg p-1 gap-1">
                        {betOpts.map(m => (
                            <button key={m} onClick={()=>setBetMultiplier(m)} disabled={gamePhase !== 'START' && gamePhase !== 'END' && gamePhase !== 'DEALT'} className={`px-2 rounded text-[9px] font-bold transition-all ${betMultiplier === m ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{m}x</button>
                        ))}
                    </div>
                    <div className="text-right">
                         <span className="text-[7px] text-blue-400 font-black uppercase tracking-widest mr-2">TOTAL FP</span>
                         <span className="text-xl font-mono font-black text-white leading-none"><ScoreRoller value={runningScore} /></span>
                    </div>
                 </div>
                 <button onClick={gamePhase==='DEALT'?handleDraw:(gamePhase==='END'?handleDeal:handleDeal)} disabled={gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING'} className={`w-full py-4 rounded-xl font-black text-xl uppercase tracking-widest shadow-xl transition-all active:scale-95 ${gamePhase==='DEALT'?'bg-green-600 text-white':'bg-blue-600 text-white'}`}>
                    {gamePhase==='DEALT'?'DRAW & SCORE':(gamePhase==='DEALING'?'DEALING...':(gamePhase==='REVEALING'?'SCORING...':`DEAL • $${(BASE_BET * betMultiplier)}`))}
                 </button>
             </div>
        </div>

      </div>
    </PageContainer>
  );
}