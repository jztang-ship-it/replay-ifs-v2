import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useBankroll } from '../context/BankrollContext';
import LiveCard from '../components/game/LiveCard'; 
import JackpotBar from '../components/game/JackpotBar';
import { getAllPlayers, getPlayerGameLog } from '../data/real_nba_db';

// --- HELPER: SAFE COST ---
const getCost = (p) => {
    if (!p) return 0;
    const val = p.cost || p.price || 0;
    return parseFloat(val);
};

// --- HELPER: TEAM SCORE ROLLER ---
const TeamScoreRoller = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = display;
    const end = value;
    if (start === end) return;
    const duration = 600; 
    let startTime;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * ease);
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplay(end);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span>{display.toFixed(1)}</span>;
};

const WinText = ({ label, color }) => (
  <div className="flex flex-col items-center animate-bounce-short">
    <span className={`text-3xl md:text-5xl font-black italic uppercase drop-shadow-2xl ${color} stroke-black tracking-tighter`}>{label}</span>
  </div>
);

export default function Play() {
  const { bankroll, updateBankroll, recordGame } = useBankroll(); 
  const [hand, setHand] = useState([]);
  const [heldIndices, setHeldIndices] = useState([]); 
  const [results, setResults] = useState({}); 
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [payoutResult, setPayoutResult] = useState(null); 
  const [showEffects, setShowEffects] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [gamePhase, setGamePhase] = useState('START'); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);
  const [runningScore, setRunningScore] = useState(0);
  const [jackpotContribution, setJackpotContribution] = useState(0);

  const SALARY_CAP = 15.0;
   
  const badgeList = [
    { label: "FIRE", emoji: "🔥" }, { label: "TRIP", emoji: "👑" }, { label: "DBL", emoji: "✌️" },
    { label: "5x5", emoji: "🖐️" }, { label: "QUAD", emoji: "🦕" }, { label: "LOCK", emoji: "🔒" }
  ];

  const buildSmartHand = (lockedCards = []) => {
    const allPlayers = getAllPlayers();
    const sortedPlayers = [...allPlayers].sort((a, b) => getCost(a) - getCost(b));
    const minCost = getCost(sortedPlayers[0]) || 0.5;
    const getCurrentTotal = (h) => h.reduce((sum, p) => sum + getCost(p), 0);

    const tryFill = (minTarget) => {
        for (let attempt = 0; attempt < 20; attempt++) {
            let currentHand = [...lockedCards];
            let currentTotal = getCurrentTotal(currentHand);
            let success = true;

            for (let i = 0; i < 5; i++) {
                if (currentHand[i]) continue;
                let slotsRemaining = 5 - i - 1;
                let budgetRemaining = SALARY_CAP - currentTotal;
                let maxSpend = budgetRemaining - (slotsRemaining * minCost);
                let candidates = allPlayers.filter(p => 
                    getCost(p) <= maxSpend && 
                    !currentHand.some(h => h && h.id === p.id)
                );
                if (candidates.length === 0) { success = false; break; }
                candidates.sort((a, b) => getCost(b) - getCost(a));
                let topCandidates = candidates.slice(0, Math.max(1, Math.floor(candidates.length * 0.5)));
                let pick = topCandidates[Math.floor(Math.random() * topCandidates.length)];
                currentHand[i] = pick;
                currentTotal += getCost(pick);
            }
            if (success && currentTotal <= SALARY_CAP) {
                if (!minTarget || currentTotal >= minTarget) return currentHand;
            }
        }
        return null;
    };

    let result = tryFill(13.5);
    if (result) return result;
    result = tryFill(10.0);
    if (result) return result;
    result = tryFill(0);
    if (result) return result;

    let panicHand = [...lockedCards];
    for(let i=0; i<5; i++) {
        if(!panicHand[i]) {
            let usedIds = panicHand.map(p => p?.id);
            let cheapest = sortedPlayers.find(p => !usedIds.includes(p.id));
            panicHand[i] = cheapest || sortedPlayers[0];
        }
    }
    return panicHand;
  };

  const handleDeal = () => {
    const totalBet = 10 * betMultiplier;
    if (bankroll < totalBet) { alert("Insufficient Funds"); return; }
    updateBankroll(-totalBet);
    setJackpotContribution(totalBet * 0.05); 
    setTimeout(() => setJackpotContribution(0), 100);
    setPayoutResult(null); setShowEffects(false); setRunningScore(0); setResults({}); setHeldIndices([]);
    const handResult = buildSmartHand([undefined, undefined, undefined, undefined, undefined]);
    setHand(handResult);
    setGamePhase('DEALING');
    setSequencerIndex(0);
  };

  const handleDraw = () => {
    setGamePhase('DRAWING');
    setSequencerIndex(0);
    const sparseHand = [undefined, undefined, undefined, undefined, undefined];
    heldIndices.forEach(idx => { sparseHand[idx] = hand[idx]; });
    const nextHand = buildSmartHand(sparseHand);
    setHand(nextHand);
    setTimeout(() => performReveal(nextHand), 500);
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
       if (sequencerIndex < 5) t = setTimeout(() => setSequencerIndex(p => p+1), 100);
       else t = setTimeout(() => setGamePhase('DEALT'), 200);
    }
    if (gamePhase === 'REVEALING') {
       if (sequencerIndex < 5) {
          const key = `${hand[sequencerIndex].id}-${sequencerIndex}`;
          if (results[key]) {
            setTimeout(() => {
                setRunningScore(prev => prev + results[key].score);
            }, 600);
          }
          t = setTimeout(() => setSequencerIndex(p => p+1), 1200);
       } else { 
          t = setTimeout(() => { 
             const finalTotal = Object.values(results).reduce((a, b) => a + b.score, 0);
             setRunningScore(finalTotal);
             const topScore = Math.max(...Object.values(results).map(r => r.score));
             let mult = 0; let lbl = "LOSS"; let clr = "text-slate-500";
             if (finalTotal >= 280) { mult=100; lbl="JACKPOT"; clr="text-yellow-400"; }
             else if (finalTotal >= 250) { mult=15; lbl="LEGENDARY"; clr="text-purple-400"; }
             else if (finalTotal >= 220) { mult=5; lbl="BIG WIN"; clr="text-green-400"; }
             else if (finalTotal >= 190) { mult=2; lbl="WINNER"; clr="text-blue-400"; }
             if (mult > 0) { updateBankroll(Math.floor(10 * betMultiplier * mult)); setShowEffects(true); }
             setPayoutResult({label:lbl, color:clr});
             const totalBadges = Object.values(results).reduce((acc, r) => acc + (r.badges ? r.badges.length : 0), 0);
             recordGame(mult > 0, totalBadges, finalTotal, topScore);
             setGamePhase('END'); 
          }, 800); 
       }
    }
    return () => clearTimeout(t);
  }, [gamePhase, sequencerIndex]);

  const handleReplay = () => { setHand([]); setGamePhase('START'); setRunningScore(0); setPayoutResult(null); };
  const toggleHold = (i) => { if (gamePhase === 'DEALT') setHeldIndices(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]); };
  const getRes = (i) => (gamePhase === 'END' || (gamePhase === 'REVEALING' && i <= sequencerIndex)) ? results[`${hand[i]?.id}-${i}`] : null;
  const isFaceDown = (i) => (gamePhase === 'START') || (gamePhase === 'DEALING' && i > sequencerIndex) || (gamePhase === 'DRAWING' && !heldIndices.includes(i)) || (gamePhase === 'REVEALING' && i > sequencerIndex && !heldIndices.includes(i));
  
  const totalHandCost = hand.reduce((acc, p) => acc + getCost(p), 0);
  const heldCost = heldIndices.reduce((acc, idx) => acc + getCost(hand[idx]), 0);
  let displayRemaining = SALARY_CAP;
  if (gamePhase === 'DEALT') {
      displayRemaining = SALARY_CAP - heldCost;
  } else if (gamePhase === 'REVEALING' || gamePhase === 'END' || gamePhase === 'DRAWING') {
      displayRemaining = SALARY_CAP - totalHandCost;
  }

  const betOpts = [1, 3, 5, 10, 20];

  return (
    <PageContainer>
      <div className="flex flex-col h-full w-full max-w-7xl mx-auto relative z-10">
        <div className="shrink-0 w-full flex justify-center py-2 relative z-30">
          <JackpotBar addAmount={jackpotContribution} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-start md:justify-center relative z-20 min-h-0 w-full overflow-y-auto custom-scrollbar pt-2">
           <div className="w-full h-auto md:h-full md:max-h-[65vh] flex flex-wrap justify-center gap-2 px-2 md:grid md:grid-cols-5 md:gap-3 md:px-3 pb-20 md:pb-2">
              {hand.length === 0 ? 
                 Array.from({length:5}).map((_,i) => (
                    <div key={i} className="w-[45%] md:w-full aspect-[3/4] md:aspect-auto md:h-full">
                        <LiveCard isFaceDown={true}/>
                    </div>
                 )) 
              : 
                 hand.map((p,i) => (
                    <div key={i} className="w-[45%] md:w-full aspect-[3/4] md:aspect-auto md:h-full">
                        <LiveCard player={p} isHeld={heldIndices.includes(i)} onToggle={() => toggleHold(i)} finalScore={getRes(i)} isFaceDown={isFaceDown(i)} />
                    </div>
                 ))
              }
           </div>
        </div>
        <div className="shrink-0 w-full bg-slate-950 border-t border-slate-900 p-3 md:p-4 pb-6 md:pb-8 z-50 shadow-[0_-5px_25px_rgba(0,0,0,0.5)]">
            <div className="max-w-xl mx-auto flex flex-col gap-3">
            <div className="flex items-center justify-between h-14 md:h-16 bg-slate-900 rounded-xl border border-slate-800 px-3 relative overflow-hidden">
                <div className="flex flex-col leading-tight min-w-[70px] md:min-w-[80px] z-10">
                    <span className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest">BUDGET</span>
                    <div className="flex items-baseline gap-1">
                        <span className="font-mono font-black text-sm md:text-lg text-white">${SALARY_CAP.toFixed(1)}</span>
                        <span className={`font-mono font-bold text-[9px] md:text-[10px] ${displayRemaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            ({displayRemaining >= 0 ? '+' : ''}{displayRemaining.toFixed(1)})
                        </span>
                    </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    {gamePhase === 'DEALT' && <div className="bg-black/60 px-3 md:px-4 py-1 rounded-full border border-orange-500/30 animate-pulse"><span className="text-orange-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Hold and Draw</span></div>}
                    {gamePhase === 'END' && payoutResult && <WinText label={payoutResult.label} color={payoutResult.color} />}
                </div>
                <div className="flex items-center gap-2 md:gap-3 z-10">
                    <div className="flex flex-col items-end leading-none">
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-[8px] md:text-[9px] text-blue-400 font-black uppercase tracking-widest">TEAM FP</span>
                            <button onClick={() => setShowRules(true)} className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[8px] text-slate-400 hover:text-white hover:border-slate-400">?</button>
                        </div>
                        <span className="text-xl md:text-2xl font-mono font-black text-white"><TeamScoreRoller value={runningScore} /></span>
                    </div>
                    <div className="hidden md:grid grid-cols-3 gap-x-1.5 gap-y-0.5 bg-black/30 p-1 rounded border border-white/5">
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
                <div className="flex gap-1.5">{betOpts.map(m => (<button key={m} onClick={() => setBetMultiplier(m)} disabled={gamePhase !== 'START' && gamePhase !== 'END' && gamePhase !== 'DEALT'} className={`px-2 md:px-3 py-1.5 rounded-md text-[9px] md:text-[10px] font-bold transition-all ${betMultiplier === m ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{m===20?'MAX':`${m}x`}</button>))}</div>
                <div className="text-right"><span className="text-[8px] md:text-[9px] text-slate-500 uppercase font-bold block">Total Bet</span><span className="text-white font-mono font-bold text-xs md:text-sm">${10 * betMultiplier}</span></div>
            </div>
            <div className="flex gap-2">
                <button onClick={gamePhase==='DEALT'?handleDraw:(gamePhase==='END'?handleReplay:handleDeal)} disabled={gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING'} className={`py-3 md:py-4 text-white font-black rounded-xl shadow-lg transition-all text-xs md:text-sm tracking-[0.2em] uppercase flex-1 ${gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING'?'bg-slate-800 text-slate-500':(gamePhase==='END'?'bg-green-600 hover:brightness-110':'bg-blue-600 hover:brightness-110')} active:scale-95`}>
                    {gamePhase==='DEALT'?'DRAW':(gamePhase==='END'?'REPLAY':(gamePhase==='DEALING'?'DEALING...':'DEAL'))}
                </button>
            </div>
            </div>
        </div>
      </div>
    </PageContainer>
  );
}