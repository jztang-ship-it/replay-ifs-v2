import React, { useState, useEffect, useRef } from 'react';
import { useBankroll } from '../context/BankrollContext';
import TopNav from '../components/layout/TopNav'; 
import LiveCard from '../components/game/LiveCard'; 
import JackpotBar from '../components/game/JackpotBar';
import { getAllPlayers, getPlayerGameLog } from '../data/real_nba_db';

// --- ROLLER ---
const ScoreRoller = ({ value, colorClass = '' }) => {
  const [display, setDisplay] = useState(() => parseFloat(value) || 0);
  const targetRef = useRef(parseFloat(value) || 0);
  useEffect(() => {
    const end = parseFloat(value) || 0;
    if (Math.abs(targetRef.current - end) < 0.1) { targetRef.current = end; setDisplay(end); return; }
    const start = display; targetRef.current = end; const duration = 600; let startTime;
    const animate = (time) => { 
        if (!startTime) startTime = time; 
        const progress = Math.min((time - startTime) / duration, 1); 
        const ease = 1 - Math.pow(1 - progress, 4); 
        const current = start + (end - start) * ease; 
        setDisplay(current); 
        if (progress < 1) requestAnimationFrame(animate); else setDisplay(end); 
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span className={colorClass}>{display.toFixed(1)}</span>;
};

const getCost = (p) => parseFloat(p?.cost || p?.price || 0);
const getTrueAvg = (pid) => {
    const db = getAllPlayers();
    const p = db.find(x => x.id === pid);
    return p?.stats?.score || 20;
};

const WinStamp = ({ label, color }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className={`transform -rotate-12 border-4 ${color.replace('text-', 'border-')} rounded-xl p-4 bg-black/80 backdrop-blur-sm shadow-2xl animate-bounce-short`}>
        <span className={`text-5xl md:text-7xl font-black italic uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] ${color} tracking-tighter`}>{label}</span>
      </div>
  </div>
);

const LegendModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center" onClick={onClose}>
    <div className="bg-slate-900 p-4 rounded text-white" onClick={e=>e.stopPropagation()}>Badges Info <button onClick={onClose}>Close</button></div>
  </div>
);

export default function Play() {
  const { bankroll, updateBankroll, recordGame } = useBankroll(); 
  const [hand, setHand] = useState([null, null, null, null, null]);
  const [heldIndices, setHeldIndices] = useState([]); 
  const [results, setResults] = useState({}); 
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [payoutResult, setPayoutResult] = useState(null); 
  
  const [gamePhase, setGamePhase] = useState('START'); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);
  const [runningScore, setRunningScore] = useState(0);
  const [jackpotContribution, setJackpotContribution] = useState(0);
  const [showRules, setShowRules] = useState(false);

  const [visibleBudget, setVisibleBudget] = useState(15.0);

  const SALARY_CAP = 15.0;
  const betOpts = [1, 3, 5, 10, 20];

  const buildSmartHand = (lockedCards = []) => {
    const allPlayers = getAllPlayers();
    if (!allPlayers.length) return Array(5).fill(null);
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const getHandTotal = (h) => h.reduce((sum, p) => sum + (p ? getCost(p) : 0), 0);

    let currentHand = [...lockedCards];
    let attempts = 0;
    for (let i = 0; i < 5; i++) {
        if (!currentHand[i]) {
            const available = allPlayers.filter(p => !currentHand.some(h => h && h.id === p.id));
            currentHand[i] = getRandom(available.slice(0, 100)); 
        }
    }
    let total = getHandTotal(currentHand);
    while ((total < 14.5 || total > 15.0) && attempts < 500) {
        const swapIdx = Math.floor(Math.random() * 5);
        if (lockedCards[swapIdx]) { attempts++; continue; }
        const cardToRemove = currentHand[swapIdx];
        const currentCardCost = getCost(cardToRemove);
        let candidates = [];
        if (total > 15.0) candidates = allPlayers.filter(p => getCost(p) < currentCardCost && !currentHand.some(h => h.id === p.id));
        else candidates = allPlayers.filter(p => getCost(p) > currentCardCost && !currentHand.some(h => h.id === p.id));
        if (candidates.length > 0) currentHand[swapIdx] = getRandom(candidates);
        total = getHandTotal(currentHand);
        attempts++;
    }
    return currentHand;
  };

  const handleDeal = () => {
    if(bankroll < 10*betMultiplier) return alert("Insufficient Funds");
    updateBankroll(-(10*betMultiplier));
    setJackpotContribution(10*betMultiplier * 0.05);
    setTimeout(() => setJackpotContribution(0), 100);
     
    // 1. PHASE 1: FORCE FLIP TO BACK
    setGamePhase('RESETTING');
    setPayoutResult(null);
    setRunningScore(0);
    setHeldIndices([]);
    setResults({});
    setVisibleBudget(15.0); 

    // 2. WAIT FOR FLIP TO FINISH (600ms)
    // Then swap data while card is still facing back
    setTimeout(() => {
        setGamePhase('DEALING');
        setSequencerIndex(-1); // Keep them locked Face Down
        
        const newHand = buildSmartHand([undefined,undefined,undefined,undefined,undefined]);
        setHand(newHand);
        
        // 3. START REVEAL SEQUENCE (Flip Front 1 by 1)
        setTimeout(() => setSequencerIndex(0), 500);
    }, 600);
  };

  const handleDraw = () => {
    setGamePhase('DRAWING');
    
    // Budget starts at 15 minus cost of held cards
    const heldCost = heldIndices.reduce((sum, i) => sum + getCost(hand[i]), 0);
    setVisibleBudget(SALARY_CAP - heldCost);

    setSequencerIndex(-1); // Lock Unheld to Back

    const sparse = [undefined,undefined,undefined,undefined,undefined];
    heldIndices.forEach(i => sparse[i] = hand[i]);
    const finalHand = buildSmartHand(sparse);
    setHand(finalHand);
    
    setRunningScore(0);

    // Wait for flip down, then start Reveal
    setTimeout(() => performReveal(finalHand), 800);
  };

  const performReveal = (finalHand) => {
    const newResults = {};
    finalHand.forEach((p, i) => {
        if(!p) return;
        const stats = getPlayerGameLog(p);
        const calc = { ...stats, score: stats.score }; 
        const trueAvg = getTrueAvg(p.id);
        const badges = []; 
        if(calc.score > 40) badges.push({icon: '🔥', label: 'Hot'});
        if(calc.score > 50) badges.push({icon: '👑', label: 'King'});
        calc.badges = badges;

        let status = 'neutral';
        if (calc.score >= trueAvg * 1.15) status = 'green';
        else if (calc.score <= trueAvg * 0.85) status = 'red';
         
        newResults[`${p.id}-${i}`] = { ...calc, status, trueAvg };
    });
    setResults(newResults);
    setGamePhase('REVEALING');
    setSequencerIndex(0);
  };

  const handleReplay = handleDeal; 
  
  const toggleHold = (i) => { 
      if(gamePhase === 'DEALT') {
          const card = hand[i];
          const cost = getCost(card);
          const isCurrentlyHeld = heldIndices.includes(i);
          if (isCurrentlyHeld) {
              setHeldIndices(p => p.filter(x => x !== i));
              setVisibleBudget(prev => prev + cost);
          } else {
              setHeldIndices(p => [...p, i]);
              setVisibleBudget(prev => prev - cost);
          }
      }
  };

  useEffect(() => {
    if(gamePhase === 'DEALING') {
        if(sequencerIndex >= 0 && sequencerIndex < 5) {
             setTimeout(() => setSequencerIndex(s => s+1), 600); 
        } else if (sequencerIndex >= 5) {
             setTimeout(() => setGamePhase('DEALT'), 500);
        }
    }

    if(gamePhase === 'REVEALING') {
        if(sequencerIndex >= 0 && sequencerIndex < 5) {
            const card = hand[sequencerIndex];
            if(card) {
                const key = `${card.id}-${sequencerIndex}`;
                // WAIT 400ms after Sequencer triggers to update Math
                setTimeout(() => {
                    if(results[key]) {
                        setRunningScore(s => s + results[key].score);
                    }
                    if (!heldIndices.includes(sequencerIndex)) {
                        setVisibleBudget(prev => prev - getCost(card));
                    }
                }, 400); 
            }
            setTimeout(() => setSequencerIndex(s => s+1), 1000);
        } else if (sequencerIndex >= 5) {
            setTimeout(() => {
                const total = Object.values(results).reduce((a,b) => a+b.score, 0);
                setRunningScore(total);
                
                let lbl = "LOSS"; let clr = "text-slate-500";
                if (total >= 250) { updateBankroll(Math.floor(10*betMultiplier*100)); lbl="JACKPOT"; clr="text-yellow-400"; }
                else if (total >= 220) { updateBankroll(Math.floor(10*betMultiplier*2)); lbl="WINNER"; clr="text-blue-400"; }
                 
                setPayoutResult({label:lbl, color:clr});
                recordGame(lbl !== "LOSS", 0, total, 0);
                setGamePhase('END');
            }, 800);
        }
    }
  }, [gamePhase, sequencerIndex]);

  // --- DERIVED STATE ---
  const aggregatedBadges = [];
  const badgeCounts = {};
  
  const revealLimit = (gamePhase === 'REVEALING') ? sequencerIndex : (gamePhase === 'END' ? 5 : 0);
  
  hand.forEach((card, i) => {
      // 1-5 SEQUENCE CHECK:
      if (i < revealLimit && card) {
          const res = results[`${card.id}-${i}`];
          if (res && res.badges) {
              res.badges.forEach(b => {
                  if (!badgeCounts[b.label]) {
                      badgeCounts[b.label] = { ...b, count: 0 };
                      aggregatedBadges.push(badgeCounts[b.label]);
                  }
                  badgeCounts[b.label].count++;
              });
          }
      }
  });

  const teamProj = hand.reduce((a,b) => a + (b ? getTrueAvg(b.id) : 0), 0);
  let teamColor = "text-white";
  if(gamePhase === 'END') {
      if(runningScore >= teamProj * 1.15) teamColor = "text-green-400";
      else if(runningScore <= teamProj * 0.85) teamColor = "text-red-400";
  }
  let teamBonus = 0;
  if(gamePhase === 'END') teamBonus = runningScore - teamProj;

  // --- RENDER CARD ---
  const renderCard = (i) => {
      const cardData = hand[i];
      // IF PHASE IS START OR HAND IS EMPTY, FORCE LOGO BACK
      if (gamePhase === 'START' || !cardData) return <LiveCard isFaceDown={true} />;
      
      let isFaceDown = false;
      const showResult = (gamePhase === 'REVEALING' && sequencerIndex >= i) || gamePhase === 'END';

      // FORCE BACK DURING RESET
      if (gamePhase === 'RESETTING') {
          isFaceDown = true; 
      }
      else if (gamePhase === 'DEALING') {
          isFaceDown = i > sequencerIndex;
      }
      else if (gamePhase === 'DRAWING' || gamePhase === 'REVEALING') {
          if (heldIndices.includes(i)) {
              isFaceDown = false; 
          } else {
              isFaceDown = i > sequencerIndex; 
          }
      }

      return (
        <LiveCard 
            player={cardData} 
            isHeld={heldIndices.includes(i)} 
            onToggle={()=>toggleHold(i)} 
            finalScore={results[`${cardData.id}-${i}`]} 
            isFaceDown={isFaceDown}
            showResult={showResult} 
        />
      );
  };

  return (
    <div className="fixed inset-0 bg-[#050b14] overflow-hidden flex flex-col z-0">
      
      {showRules && <LegendModal onClose={() => setShowRules(false)} />}
      
      <TopNav />

      <div className="shrink-0 w-full max-w-4xl mx-auto flex justify-center py-2 relative z-30">
        <JackpotBar addAmount={jackpotContribution}/>
      </div>
        
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

      <div className="shrink-0 w-full bg-slate-950/90 border-t border-slate-900 p-2 pb-6 z-50">
            <div className="max-w-xl mx-auto flex flex-col gap-2">
                <div className="flex items-center justify-between h-10 bg-slate-900 rounded-lg border border-slate-800 px-3 relative overflow-hidden">
                    <div className="flex flex-col leading-tight min-w-[50px] z-10">
                        <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">BUDGET</span>
                        <div className="flex items-baseline gap-1">
                            <span className="font-mono font-black text-sm text-white">${SALARY_CAP.toFixed(1)}</span> 
                            <span className="font-mono font-bold text-[8px] text-slate-400 mx-1">(</span>
                            <ScoreRoller value={visibleBudget} colorClass="font-mono font-bold text-[8px] text-slate-400" />
                            <span className="font-mono font-bold text-[8px] text-slate-400 mx-1">)</span>
                        </div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        {gamePhase === 'DEALT' && <div className="bg-black/60 px-3 py-0.5 rounded-full border border-orange-500/30 animate-pulse"><span className="text-orange-400 text-[8px] font-black uppercase tracking-[0.2em]">Hold & Draw</span></div>}
                    </div>
                    
                    <div className="flex items-center gap-2 z-10">
                        <div className="flex items-center gap-1 mr-1">
                            {aggregatedBadges.map((b, i) => (
                                <div key={i} className="flex items-center gap-0.5 px-1 py-0.5 bg-black/40 rounded border border-white/5 animate-bounce-short">
                                    <span className="text-[8px]">{b.icon}</span>
                                    {b.count > 1 && <span className="text-[7px] text-yellow-400 font-black">x{b.count}</span>}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-[7px] text-blue-400 font-black">TEAM FP</span>
                            <div className="flex items-center gap-1">
                                <span className={`text-lg font-mono font-black ${teamColor}`}>
                                    <ScoreRoller value={runningScore} />
                                </span>
                                {gamePhase === 'END' && teamBonus > 0 && <span className="text-[8px] text-yellow-400 font-bold animate-pulse">(+{teamBonus.toFixed(1)})</span>}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2 h-10">
                    <div className="flex bg-slate-900 rounded-lg p-1 gap-1">
                        {betOpts.map(m => (
                            <button key={m} onClick={()=>setBetMultiplier(m)} disabled={gamePhase !== 'START' && gamePhase !== 'END' && gamePhase !== 'DEALT'} className={`px-2 rounded text-[9px] font-bold transition-all ${betMultiplier === m ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{m}x</button>
                        ))}
                    </div>
                    <button 
                        onClick={gamePhase==='DEALT'?handleDraw:(gamePhase==='END'?handleReplay:handleDeal)} 
                        disabled={gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING' || gamePhase === 'RESETTING'} 
                        className={`flex-1 rounded-lg font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg active:scale-95 ${gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING' || gamePhase==='RESETTING'?'bg-slate-800 text-slate-500':(gamePhase==='END'?'bg-green-600 hover:brightness-110':'bg-blue-600 hover:brightness-110')}`}
                    >
                        {gamePhase==='DEALT'?'DRAW':(gamePhase==='END'?'REPLAY':(gamePhase==='DEALING'?'...':'DEAL'))}
                    </button>
                </div>
            </div>
      </div>
    </div>
  );
}