import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useBankroll } from '../context/BankrollContext';
import LiveCard from '../components/game/LiveCard'; 
import JackpotBar from '../components/game/JackpotBar';
import { getAllPlayers, getPlayerGameLog } from '../data/real_nba_db';
import { calculateScore, BONUS_RULES } from '../utils/ScoringEngine';

const getCost = (p) => parseFloat(p?.cost || p?.price || 0);

const TeamScoreRoller = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => { setDisplay(value); }, [value]);
  return <span>{display.toFixed(1)}</span>;
};

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
  // Initialize with 5 nulls so the grid ALWAYS renders 5 slots
  const [hand, setHand] = useState([null, null, null, null, null]);
  const [heldIndices, setHeldIndices] = useState([]); 
  const [results, setResults] = useState({}); 
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [payoutResult, setPayoutResult] = useState(null); 
  const [gamePhase, setGamePhase] = useState('START'); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);
  const [runningScore, setRunningScore] = useState(0);
  const [jackpotContribution, setJackpotContribution] = useState(0);
  const [gameBadges, setGameBadges] = useState([]); 
  const [showRules, setShowRules] = useState(false);

  const SALARY_CAP = 15.0;
  const betOpts = [1, 3, 5, 10, 20];

  // --- SIMPLE & ROBUST HAND BUILDER ---
  // Guaranteed to return 5 items. Prioritizes filling budget.
  const buildSmartHand = (lockedCards = []) => {
    const allPlayers = getAllPlayers();
    if (!allPlayers.length) return Array(5).fill(null);

    // Sort expensive to cheap to fill budget easily
    const sortedPlayers = [...allPlayers].sort((a,b) => getCost(b) - getCost(a));
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    let currentHand = [...lockedCards];
     
    // 1. Fill holes
    for(let i=0; i<5; i++) {
        if(!currentHand[i]) {
            let pick;
            let attempts = 0;
            // Try to find a valid card
            do {
                pick = getRandom(sortedPlayers.slice(0, 50)); // Pick from top 50 expensive first
                attempts++;
            } while (currentHand.some(p => p && p.id === pick.id) && attempts < 100);
            currentHand[i] = pick;
        }
    }

    // 2. Validate Budget (Simple Swap Down)
    let totalCost = currentHand.reduce((a,b) => a + getCost(b), 0);
    let loops = 0;
    while(totalCost > SALARY_CAP && loops < 100) {
        // Swap expensive card for cheaper one
        const expensiveIdx = currentHand.findIndex((p, i) => !lockedCards[i] && getCost(p) > 3.0);
        if (expensiveIdx !== -1) {
            const cheaper = allPlayers.filter(p => getCost(p) < 2.0 && !currentHand.some(h => h.id === p.id));
            if(cheaper.length) {
                currentHand[expensiveIdx] = getRandom(cheaper);
            }
        }
        totalCost = currentHand.reduce((a,b) => a + getCost(b), 0);
        loops++;
    }

    return currentHand;
  };

  const handleDeal = () => {
    if(bankroll < 10*betMultiplier) return alert("Insufficient Funds");
    updateBankroll(-(10*betMultiplier));
    setJackpotContribution(10*betMultiplier * 0.05);
    setTimeout(() => setJackpotContribution(0), 100);
     
    setGamePhase('DEALING');
    setResults({});
    setPayoutResult(null);
    setRunningScore(0);
    setHeldIndices([]);
    setGameBadges([]);
     
    const newHand = buildSmartHand([undefined,undefined,undefined,undefined,undefined]);
    setHand(newHand);
    setSequencerIndex(0);
  };

  const handleDraw = () => {
    setGamePhase('DRAWING');
    const sparse = [undefined,undefined,undefined,undefined,undefined];
    heldIndices.forEach(i => sparse[i] = hand[i]);
    const finalHand = buildSmartHand(sparse);
    setHand(finalHand);
    setTimeout(() => performReveal(finalHand), 500);
  };

  const performReveal = (finalHand) => {
    const newResults = {};
    const collectedBadges = [];
    finalHand.forEach((p, i) => {
        if(!p) return;
        const stats = getPlayerGameLog(p);
        const calc = calculateScore({...stats, score: p.stats.score});
        const trueAvg = getTrueAvg(p.id);
         
        let status = 'neutral';
        if (calc.score >= trueAvg * 1.15) status = 'green';
        else if (calc.score <= trueAvg * 0.85) status = 'red';
         
        newResults[`${p.id}-${i}`] = { ...calc, status, trueAvg };
        if (calc.badges) collectedBadges.push(...calc.badges);
    });
    setResults(newResults);
    setGameBadges(collectedBadges);
    setRunningScore(0); 
    setGamePhase('REVEALING');
    setSequencerIndex(0);
  };

  const handleReplay = () => { setHand([null,null,null,null,null]); setGamePhase('START'); setRunningScore(0); setPayoutResult(null); };
  const toggleHold = (i) => { if(gamePhase === 'DEALT') setHeldIndices(p => p.includes(i) ? p.filter(x=>x!==i) : [...p,i]); };

  useEffect(() => {
    if(gamePhase === 'DEALING') {
        if(sequencerIndex < 5) setTimeout(() => setSequencerIndex(s => s+1), 100);
        else setTimeout(() => setGamePhase('DEALT'), 200);
    }
    if(gamePhase === 'REVEALING') {
        if(sequencerIndex < 5) {
            const card = hand[sequencerIndex];
            if(card) {
                const key = `${card.id}-${sequencerIndex}`;
                if(results[key]) setTimeout(() => setRunningScore(s => s + results[key].score), 500);
            }
            setTimeout(() => setSequencerIndex(s => s+1), 1000);
        } else {
            setTimeout(() => {
                const total = Object.values(results).reduce((a,b) => a+b.score, 0);
                setRunningScore(total);
                 
                let lbl = "LOSS"; let clr = "text-slate-500";
                if (total >= 154.0) { updateBankroll(Math.floor(10*betMultiplier*100)); lbl="JACKPOT"; clr="text-yellow-400"; }
                else if (total >= 149.5) { updateBankroll(Math.floor(10*betMultiplier*15)); lbl="LEGENDARY"; clr="text-purple-400"; }
                else if (total >= 147.0) { updateBankroll(Math.floor(10*betMultiplier*5)); lbl="BIG WIN"; clr="text-green-400"; }
                else if (total >= 144.5) { updateBankroll(Math.floor(10*betMultiplier*2)); lbl="WINNER"; clr="text-blue-400"; }
                 
                setPayoutResult({label:lbl, color:clr});
                recordGame(lbl !== "LOSS", gameBadges.length, total, 0);
                setGamePhase('END');
            }, 500);
        }
    }
  }, [gamePhase, sequencerIndex]);

  const currentCost = hand.reduce((a,b) => a + (b ? getCost(b) : 0), 0);
  const heldCost = heldIndices.reduce((a,i) => a + (hand[i] ? getCost(hand[i]) : 0), 0);
  let displayBudget = SALARY_CAP;
  if(gamePhase === 'DEALT') displayBudget = SALARY_CAP - heldCost;
  else if(gamePhase !== 'START') displayBudget = SALARY_CAP - currentCost;

  const aggregatedBadges = [];
  const badgeCounts = {};
  gameBadges.forEach(b => {
      if (!badgeCounts[b.label]) {
          badgeCounts[b.label] = { ...b, count: 0 };
          aggregatedBadges.push(badgeCounts[b.label]);
      }
      badgeCounts[b.label].count++;
  });

  const teamProj = hand.reduce((a,b) => a + (b ? getTrueAvg(b.id) : 0), 0);
  let teamColor = "text-white";
  if(gamePhase === 'END') {
      if(runningScore >= teamProj * 1.15) teamColor = "text-green-400";
      else if(runningScore <= teamProj * 0.85) teamColor = "text-red-400";
  }
  let teamBonus = 0;
  if(gamePhase === 'END') teamBonus = runningScore - teamProj;

  // --- RENDER CARD (Safe) ---
  const renderCard = (i) => {
      const cardData = hand[i];
      // Always render a card, even if empty (Face Down)
      // This maintains the GRID structure at all times
      if (!cardData) return <LiveCard isFaceDown={true} />;
      
      const isDealingFaceDown = gamePhase === 'DEALING' && i > sequencerIndex;
      const isDrawingFaceDown = gamePhase === 'DRAWING' && !heldIndices.includes(i);
      const isRevealingFaceDown = gamePhase === 'REVEALING' && i > sequencerIndex;

      return (
        <LiveCard 
            player={cardData} 
            isHeld={heldIndices.includes(i)} 
            onToggle={()=>toggleHold(i)} 
            finalScore={results[`${cardData.id}-${i}`]} 
            isFaceDown={isDealingFaceDown || isDrawingFaceDown || isRevealingFaceDown} 
        />
      );
  };

  return (
    <PageContainer>
      {showRules && <LegendModal onClose={() => setShowRules(false)} />}
      
      {/* MOBILE FIT FIX: h-screen and overflow-hidden added here */}
      <div className="flex flex-col h-screen overflow-hidden w-full max-w-4xl mx-auto relative z-10 pt-2 pb-2">
        <div className="shrink-0 w-full flex justify-center py-1 relative z-30"><JackpotBar addAmount={jackpotContribution}/></div>
        
        {/* GAME BOARD: 2-1-2 LAYOUT (STRICT) */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-20 w-full min-h-0">
           {gamePhase === 'END' && payoutResult && payoutResult.label !== "LOSS" && <WinStamp label={payoutResult.label} color={payoutResult.color} />}
           
           <div className="w-full h-full flex flex-col justify-center gap-1.5 px-2">
              {/* TOP ROW: 2 Cards */}
              <div className="flex justify-center gap-2 h-[32%]">
                 <div className="w-[30%] h-full">{renderCard(0)}</div>
                 <div className="w-[30%] h-full">{renderCard(1)}</div>
              </div>
              
              {/* MIDDLE ROW: 1 Card (Centered) */}
              <div className="flex justify-center h-[32%]">
                 <div className="w-[30%] h-full">{renderCard(2)}</div>
              </div>
              
              {/* BOTTOM ROW: 2 Cards */}
              <div className="flex justify-center gap-2 h-[32%]">
                 <div className="w-[30%] h-full">{renderCard(3)}</div>
                 <div className="w-[30%] h-full">{renderCard(4)}</div>
              </div>
           </div>
        </div>

        {/* CONTROLS */}
        <div className="shrink-0 w-full bg-slate-950/90 border-t border-slate-900 p-2 z-50">
            <div className="max-w-xl mx-auto flex flex-col gap-2">
                <div className="flex items-center justify-between h-10 bg-slate-900 rounded-lg border border-slate-800 px-3 relative overflow-hidden">
                    <div className="flex flex-col leading-tight min-w-[50px] z-10">
                        <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">BUDGET</span>
                        <div className="flex items-baseline gap-1"><span className="font-mono font-black text-sm text-white">${SALARY_CAP.toFixed(1)}</span> <span className={`font-mono font-bold text-[8px] ${displayBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>({displayBudget >= 0 ? '+' : ''}{displayBudget.toFixed(1)})</span></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">{gamePhase === 'DEALT' && <div className="bg-black/60 px-3 py-0.5 rounded-full border border-orange-500/30 animate-pulse"><span className="text-orange-400 text-[8px] font-black uppercase tracking-[0.2em]">Hold & Draw</span></div>}</div>
                    <div className="flex items-center gap-2 z-10">
                        <div className="flex items-center gap-1 mr-1">{aggregatedBadges.map((b, i) => (<div key={i} className="flex items-center gap-0.5 px-1 py-0.5 bg-black/40 rounded border border-white/5"><span className="text-[8px]">{b.icon}</span>{b.count > 1 && <span className="text-[7px] text-yellow-400 font-black">x{b.count}</span>}</div>))}</div>
                        <div className="flex flex-col items-end leading-none"><span className="text-[7px] text-blue-400 font-black">TEAM FP</span><div className="flex items-center gap-1"><span className={`text-lg font-mono font-black ${teamColor}`}><TeamScoreRoller value={runningScore}/></span>{gamePhase === 'END' && teamBonus > 0 && <span className="text-[8px] text-yellow-400 font-bold animate-pulse">(+{teamBonus.toFixed(1)})</span>}</div></div>
                    </div>
                </div>
                <div className="flex gap-2 h-10">
                    <div className="flex bg-slate-900 rounded-lg p-1 gap-1">{betOpts.map(m => <button key={m} onClick={()=>setBetMultiplier(m)} disabled={gamePhase !== 'START' && gamePhase !== 'END' && gamePhase !== 'DEALT'} className={`px-2 rounded text-[9px] font-bold transition-all ${betMultiplier === m ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{m}x</button>)}</div>
                    <button onClick={gamePhase==='DEALT'?handleDraw:(gamePhase==='END'?handleReplay:handleDeal)} disabled={gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING'} className={`flex-1 rounded-lg font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg active:scale-95 ${gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING'?'bg-slate-800 text-slate-500':(gamePhase==='END'?'bg-green-600 hover:brightness-110':'bg-blue-600 hover:brightness-110')}`}>{gamePhase==='DEALT'?'DRAW':(gamePhase==='END'?'REPLAY':(gamePhase==='DEALING'?'...':'DEAL'))}</button>
                </div>
            </div>
        </div>
      </div>
    </PageContainer>
  );
}