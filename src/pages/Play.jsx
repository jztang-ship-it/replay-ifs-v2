import React, { useState, useEffect } from 'react'; // Removed unused imports
import { useBankroll } from '../context/BankrollContext';
import { useRoster } from '../context/RosterContext'; // <--- THIS IS THE KEY
import TopNav from '../components/layout/TopNav'; 
import LiveCard from '../components/game/LiveCard'; 
import JackpotBar from '../components/game/JackpotBar';
import { supabase } from '../lib/supabaseClient'; 

// --- ANIMATION COMPONENTS ---
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
  const { bankroll, updateBankroll, recordGame } = useBankroll(); 
  
  // --- INSTANT LOAD: USE CONTEXT, NOT LOCAL FETCH ---
  const { dbPlayers, isRosterLoading } = useRoster(); 
  
  const [hand, setHand] = useState([null, null, null, null, null]);
  const [heldIndices, setHeldIndices] = useState([]); 
  const [results, setResults] = useState({}); 
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [payoutResult, setPayoutResult] = useState(null); 
  const [gamePhase, setGamePhase] = useState('START'); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);
  const [runningScore, setRunningScore] = useState(0);
  const [jackpotContribution, setJackpotContribution] = useState(0);
  const [visibleBudget, setVisibleBudget] = useState(15.0);

  const SALARY_CAP = 15.0;
  const betOpts = [1, 3, 5, 10, 20];
  const getCost = (p) => parseFloat(p?.cost || 0);

  // BUILD HAND ALGORITHM
  const buildSmartHand = (lockedCards = []) => {
    if (dbPlayers.length === 0) return Array(5).fill(null);
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const getHandTotal = (h) => h.reduce((sum, p) => sum + (p ? getCost(p) : 0), 0);
    let currentHand = [...lockedCards];
    
    for (let i = 0; i < 5; i++) {
        if (!currentHand[i]) {
            const available = dbPlayers.filter(p => !currentHand.some(h => h && h.id === p.id));
            const pool = available.length > 0 ? available : dbPlayers;
            currentHand[i] = getRandom(pool.slice(0, 150)); 
        }
    }
    // Budget Logic
    let total = getHandTotal(currentHand);
    let attempts = 0;
    while ((total > SALARY_CAP) && attempts < 200) {
        let maxCost = -1; let swapIdx = -1;
        for(let i=0; i<5; i++) {
            if(!lockedCards[i]) { 
                const c = getCost(currentHand[i]);
                if(c > maxCost) { maxCost = c; swapIdx = i; }
            }
        }
        if(swapIdx !== -1) {
            const currentCost = getCost(currentHand[swapIdx]);
            const cheaperOptions = dbPlayers.filter(p => getCost(p) < currentCost && !currentHand.some(h => h && h.id === p.id));
            if (cheaperOptions.length > 0) currentHand[swapIdx] = getRandom(cheaperOptions);
        }
        total = getHandTotal(currentHand);
        attempts++;
    }
    return currentHand;
  };

  // HANDLERS
  const handleDeal = async () => {
    if (dbPlayers.length === 0) return;
    if(bankroll < 10*betMultiplier) return alert("Insufficient Funds");
    updateBankroll(-(10*betMultiplier));
    setJackpotContribution(10*betMultiplier * 0.05);
    setTimeout(() => setJackpotContribution(0), 100);
    setGamePhase('RESETTING'); setPayoutResult(null); setRunningScore(0); setHeldIndices([]); setResults({}); setVisibleBudget(SALARY_CAP); 
    setTimeout(() => {
        setGamePhase('DEALING'); setSequencerIndex(-1); 
        const newHand = buildSmartHand([undefined,undefined,undefined,undefined,undefined]);
        setHand(newHand);
        setTimeout(() => setSequencerIndex(0), 500);
    }, 600);
  };

  const handleDraw = () => {
    setGamePhase('DRAWING');
    const heldCost = heldIndices.reduce((sum, i) => sum + getCost(hand[i]), 0);
    setVisibleBudget(SALARY_CAP - heldCost);
    setSequencerIndex(-1); 
    const sparse = [undefined,undefined,undefined,undefined,undefined];
    heldIndices.forEach(i => sparse[i] = hand[i]);
    const finalHand = buildSmartHand(sparse);
    setHand(finalHand);
    setRunningScore(0);
    setTimeout(() => fetchRandomStatsAndReveal(finalHand), 800);
  };

  const fetchRandomStatsAndReveal = async (finalHand) => {
      const newResults = {};
      for(let i=0; i<finalHand.length; i++) {
          const p = finalHand[i];
          if(!p) continue;
          const { data } = await supabase.rpc('get_random_log', { target_player_id: p.id });
          let score = 0; let stats = { pts: 0, reb: 0, ast: 0 }; let match = "N/A"; let date = "No Data";
          if (data && data.length > 0) {
              const log = data[0];
              score = (log.pts) + (log.reb * 1.2) + (log.ast * 1.5) + (log.stl * 3) + (log.blk * 3) - (log.turnovers);
              stats = { pts: log.pts, reb: log.reb, ast: log.ast };
              match = log.matchup; date = log.game_date;
          }
          const badges = [];
          if (score > 45) badges.push({icon: '🔥', label: 'Heater'});
          if (score > 60) badges.push({icon: '👑', label: 'King'});
          let doubleDigits = 0;
          if(stats.pts >= 10) doubleDigits++; if(stats.reb >= 10) doubleDigits++; if(stats.ast >= 10) doubleDigits++;
          if(doubleDigits >= 2) badges.push({icon: '✌️', label: 'Dub-Dub'});
          newResults[`${p.id}-${i}`] = { score: parseFloat(score), ...stats, matchup: match, date: date, badges };
      }
      setResults(newResults);
      setGamePhase('REVEALING');
      setSequencerIndex(0);
  };

  const toggleHold = (i) => { 
      if(gamePhase === 'DEALT') {
          const card = hand[i]; const cost = getCost(card);
          if (heldIndices.includes(i)) {
              setHeldIndices(p => p.filter(x => x !== i)); setVisibleBudget(prev => prev + cost);
          } else {
              if (visibleBudget - cost < 0) return; 
              setHeldIndices(p => [...p, i]); setVisibleBudget(prev => prev - cost);
          }
      }
  };

  useEffect(() => {
    if(gamePhase === 'DEALING') {
        if(sequencerIndex >= 0 && sequencerIndex < 5) setTimeout(() => setSequencerIndex(s => s+1), 400); 
        else if (sequencerIndex >= 5) setTimeout(() => setGamePhase('DEALT'), 500);
    }
    if(gamePhase === 'REVEALING') {
        if(sequencerIndex >= 0 && sequencerIndex < 5) {
            const card = hand[sequencerIndex];
            if(card) {
                const key = `${card.id}-${sequencerIndex}`;
                setTimeout(() => {
                    if(results[key]) setRunningScore(s => s + results[key].score);
                    if (!heldIndices.includes(sequencerIndex)) setVisibleBudget(prev => prev - getCost(card));
                }, 400); 
            }
            setTimeout(() => setSequencerIndex(s => s+1), 1000);
        } else if (sequencerIndex >= 5) {
            setTimeout(() => {
                const total = Object.values(results).reduce((a,b) => a+b.score, 0);
                setRunningScore(total);
                let lbl = "LOSS"; let clr = "text-slate-500";
                if (total >= 200) { updateBankroll(Math.floor(10*betMultiplier*100)); lbl="JACKPOT"; clr="text-yellow-400"; }
                else if (total >= 150) { updateBankroll(Math.floor(10*betMultiplier*5)); lbl="BIG WIN"; clr="text-green-400"; }
                else if (total >= 120) { updateBankroll(Math.floor(10*betMultiplier*2)); lbl="WINNER"; clr="text-blue-400"; }
                setPayoutResult({label:lbl, color:clr});
                recordGame(lbl !== "LOSS", 0, total, 0);
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
      if (gamePhase === 'RESETTING') isFaceDown = true; 
      else if (gamePhase === 'DEALING') isFaceDown = i > sequencerIndex;
      else if (gamePhase === 'DRAWING' || gamePhase === 'REVEALING') {
          if (heldIndices.includes(i)) isFaceDown = false; 
          else isFaceDown = i > sequencerIndex; 
      }
      return <LiveCard player={cardData} isHeld={heldIndices.includes(i)} onToggle={()=>toggleHold(i)} finalScore={results[`${cardData.id}-${i}`]} isFaceDown={isFaceDown} showResult={showResult} />;
  };

  // Only show loading if we TRULY have 0 players
  if (isRosterLoading && dbPlayers.length === 0) return <div className="flex items-center justify-center h-screen bg-slate-950 text-blue-500 font-black animate-pulse">LOADING MARKET...</div>;

  return (
    <div className="fixed inset-0 bg-[#050b14] overflow-hidden flex flex-col z-0">
      <TopNav />
      <div className="shrink-0 w-full max-w-4xl mx-auto flex justify-center py-2 relative z-30 mt-16">
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
                    <div className="flex items-center gap-2 z-10">
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-[7px] text-blue-400 font-black">TEAM FP</span>
                            <div className="flex items-center gap-1">
                                <span className={`text-lg font-mono font-black text-white`}>
                                    <ScoreRoller value={runningScore} />
                                </span>
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
                    <button onClick={gamePhase==='DEALT'?handleDraw:(gamePhase==='END'?handleDeal:handleDeal)} disabled={gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING' || gamePhase === 'RESETTING'} className={`flex-1 rounded-lg font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg active:scale-95 ${gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING' || gamePhase==='RESETTING'?'bg-slate-800 text-slate-500':(gamePhase==='END'?'bg-green-600 hover:brightness-110':'bg-blue-600 hover:brightness-110')}`}>{gamePhase==='DEALT'?'DRAW':(gamePhase==='END'?'REPLAY':(gamePhase==='DEALING'?'...':'DEAL'))}</button>
                </div>
            </div>
      </div>
    </div>
  );
}