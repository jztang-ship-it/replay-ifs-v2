import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import LiveCard from '../components/game/LiveCard';
import { useBankroll } from '../context/BankrollContext';
import { useRoster } from '../context/RosterContext';

import { dealRealHand, replaceLineup, fetchPlayablePool } from '../engine/RealDealer'; 
import { fetchRealGameLog } from '../data/real_nba_db';
import { calculateScore } from '../utils/GameMath';

// --- 📊 SYSTEM CHECK ---
const SystemCheck = () => {
    useEffect(() => {
        const checkDB = async () => {
            console.clear(); 
            const pool = await fetchPlayablePool();
            if (!pool || pool.length === 0) console.warn("❌ [CRITICAL] POOL IS EMPTY!");
            else console.log(`✅ Loaded ${pool.length} Active Players`);
        };
        checkDB();
    }, []);
    return null;
};

// --- ANIMATION COMPONENTS ---
const ScoreRoller = ({ value, colorClass = '' }) => {
  const [display, setDisplay] = useState(0);
  const target = parseFloat(value) || 0;
  useEffect(() => {
    let start = display; let startTime; const duration = 300; 
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

// --- LEGEND MODAL (Updated with Verified Lines) ---
const LegendModal = ({ onClose }) => {
    const [tab, setTab] = useState('ODDS');
    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="flex border-b border-slate-800">
                    <button onClick={()=>setTab('ODDS')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest ${tab==='ODDS' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Payouts</button>
                    <button onClick={()=>setTab('BONUS')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest ${tab==='BONUS' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Bonuses</button>
                </div>
                
                <div className="p-4 overflow-y-auto">
                    {tab === 'ODDS' ? (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                <span className="font-bold text-purple-400">215+</span>
                                <span className="font-black text-white text-lg">30x <span className="text-xs font-normal text-slate-400">JACKPOT</span></span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <span className="font-bold text-yellow-500">195+</span>
                                <span className="font-black text-white text-lg">10x</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                <span className="font-bold text-orange-500">175+</span>
                                <span className="font-black text-white text-lg">5x</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <span className="font-bold text-green-500">155+</span>
                                <span className="font-black text-white text-lg">1.5x</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <span className="font-bold text-blue-500">130+</span>
                                <span className="font-black text-white text-lg">0.5x <span className="text-xs font-normal text-slate-400">(Safety)</span></span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 text-xs">
                           <div className="grid grid-cols-2 gap-2 text-slate-400">
                                <div>PTS: 1.0</div>
                                <div>REB: 1.25</div>
                                <div>AST: 1.5</div>
                                <div>STL: 2.0</div>
                                <div>BLK: 2.0</div>
                                <div>TOV: -0.5</div>
                           </div>
                           <div className="border-t border-slate-800 pt-2">
                                <h3 className="text-white font-bold mb-1 uppercase">Bonuses</h3>
                                <div className="space-y-1 text-slate-400">
                                    <div className="flex justify-between"><span>👑 Triple-Double</span><span className="text-white">+8</span></div>
                                    <div className="flex justify-between"><span>⚡ 50+ Pts</span><span className="text-white">+10</span></div>
                                    <div className="flex justify-between"><span>🔥 40+ Pts</span><span className="text-white">+5</span></div>
                                </div>
                           </div>
                        </div>
                    )}
                </div>
                <button onClick={onClose} className="p-3 bg-slate-950 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors border-t border-slate-800">Close</button>
            </div>
        </div>
    );
};

export default function Play() {
  const { bankroll, updateBankroll, addHistory } = useBankroll(); 
  
  const [hand, setHand] = useState([null, null, null, null, null]);
  const [gamePhase, setGamePhase] = useState('START'); 
  const [heldIndices, setHeldIndices] = useState([]); 
  const [finalScores, setFinalScores] = useState({}); 
  const [sequencerIndex, setSequencerIndex] = useState(-1);
  const [betMultiplier, setBetMultiplier] = useState(1);
  const [payoutResult, setPayoutResult] = useState(null); 
  const [runningScore, setRunningScore] = useState(0);
  const [visibleBudget, setVisibleBudget] = useState(15.0);
  const [showLegend, setShowLegend] = useState(false); 
  const [activeBadges, setActiveBadges] = useState([]); 

  const SALARY_CAP = 15.0;
  const BASE_BET = 5; 
  const betOpts = [1, 2, 5, 10]; 
  const getCost = (p) => parseFloat(p?.cost || 0);

  // --- DEAL HANDLER ---
  const handleDeal = async () => {
    const betAmount = BASE_BET * betMultiplier;
    if(bankroll < betAmount) return alert("Insufficient Funds");
    
    updateBankroll(-betAmount);
    
    setGamePhase('DEALING'); 
    setPayoutResult(null); 
    setRunningScore(0); 
    setHeldIndices([]); 
    setFinalScores({}); 
    setActiveBadges([]); 
    setVisibleBudget(SALARY_CAP); 
    setSequencerIndex(-1);
    setHand([null, null, null, null, null]);

    const newHand = await dealRealHand();
    
    if (newHand) {
        setHand(newHand);
        setTimeout(() => setSequencerIndex(0), 200); 
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
              setHeldIndices(p => p.filter(x => x !== i)); 
              setVisibleBudget(prev => prev + cost); 
          } else {
              setHeldIndices(p => [...p, i]); 
              setVisibleBudget(prev => prev - cost); 
          }
      }
  };

  // --- DRAW HANDLER ---
  const handleDraw = async () => {
    setGamePhase('DRAWING');
    setSequencerIndex(-1); 
    setActiveBadges([]); 
    
    // 1. Convert indices to objects for the dealer
    const heldCards = heldIndices.map(i => hand[i]);
    
    // 2. Dealer fills the gaps using STRICT logic
    let newHand = await replaceLineup(hand, heldCards);

    if (!newHand) {
        console.error("Dealer failed. Reverting.");
        newHand = [...hand]; 
    }
    
    setHand(newHand);

    // 3. Compute Scores
    const newResults = {};
    for (let i = 0; i < 5; i++) {
        const player = newHand[i];
        if (!player) continue;

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
    setTimeout(() => setSequencerIndex(0), 200);
  };

  // --- SEQUENCER (Updated Payout Logic) ---
  useEffect(() => {
    if(gamePhase === 'DEALING') {
        if(sequencerIndex >= 0 && sequencerIndex < 5) setTimeout(() => setSequencerIndex(s => s+1), 200);
        else if (sequencerIndex >= 5) setTimeout(() => setGamePhase('DEALT'), 200);
    }
    if(gamePhase === 'REVEALING') {
        if(sequencerIndex >= 0 && sequencerIndex < 5) {
            const card = hand[sequencerIndex];
            const key = `${card.id}-${sequencerIndex}`;
            
            if (!heldIndices.includes(sequencerIndex)) {
                setVisibleBudget(prev => prev - getCost(card));
            }

            setTimeout(() => {
                if(finalScores[key]) {
                    setRunningScore(s => s + finalScores[key].score);
                    if (finalScores[key].badges && finalScores[key].badges.length > 0) {
                        setActiveBadges(prev => [...prev, ...finalScores[key].badges]);
                    }
                }
            }, 200);

            setTimeout(() => setSequencerIndex(s => s+1), 600);
        } else if (sequencerIndex >= 5) {
            setTimeout(() => {
                const total = Object.values(finalScores).reduce((a,b) => a+b.score, 0);
                const betAmount = BASE_BET * betMultiplier;
                
                let lbl = "LOSS"; let clr = "text-slate-500"; let win = 0;
                
                // --- VERIFIED PAYOUT LINES ---
                if (total >= 215) { 
                    win = betAmount * 30; 
                    lbl = "JACKPOT"; 
                    clr = "text-purple-400"; 
                } else if (total >= 195) { 
                    win = betAmount * 10; 
                    lbl = "MEGA WIN"; 
                    clr = "text-yellow-400"; 
                } else if (total >= 175) { 
                    win = betAmount * 5; 
                    lbl = "BIG WIN"; 
                    clr = "text-orange-400"; 
                } else if (total >= 155) { 
                    win = betAmount * 1.5; 
                    lbl = "WINNER"; 
                    clr = "text-green-400"; 
                } else if (total >= 130) { 
                    win = betAmount * 0.5; 
                    lbl = "SAFETY"; 
                    clr = "text-blue-400"; 
                }
                
                if (win > 0) updateBankroll(win);
                setPayoutResult({label:lbl, color:clr});
                
                if (addHistory) addHistory({ result: lbl, score: total, payout: win, date: new Date().toISOString() });
                setGamePhase('END');
            }, 400);
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
      <SystemCheck />
      {showLegend && <LegendModal onClose={() => setShowLegend(false)} />}
      
      <div className="fixed inset-0 bg-[#050b14] overflow-hidden flex flex-col z-0 pt-14">
        
        {/* --- JACKPOT BAR --- */}
        <div className="shrink-0 w-full bg-slate-900 border-b border-white/5 px-4 py-2 flex items-center relative z-40 shadow-xl h-16">
             <div className="flex-1"></div>
             <div className="flex flex-col items-center justify-center">
                 <div className="text-[9px] text-purple-500 font-bold uppercase tracking-widest leading-none mb-0.5 glow-sm">Grand Jackpot (30x)</div>
                 <div className="text-2xl font-black text-white leading-none drop-shadow-[0_2px_4px_rgba(168,85,247,0.5)]">
                    $12,453.88
                 </div>
             </div>
             <div className="flex-1 flex flex-col items-end justify-center gap-0.5">
                 <div className="text-[8px] text-slate-400 font-bold">195+ = <span className="text-yellow-400 font-black">10x</span></div>
                 <div className="text-[8px] text-slate-400 font-bold">215+ = <span className="text-purple-400 font-black">30x</span></div>
             </div>
        </div>

        {/* --- MAIN CARD AREA --- */}
        <div className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center justify-center relative z-20 min-h-0 p-2">
            {gamePhase === 'END' && payoutResult && payoutResult.label !== "LOSS" && <WinStamp label={payoutResult.label} color={payoutResult.color} />}
            <div className="w-full h-full flex flex-col justify-between">
               <div className="flex justify-center gap-3 h-[32%]">
                  <div className="w-[45%] h-full">{renderCard(0)}</div>
                  <div className="w-[45%] h-full">{renderCard(1)}</div>
               </div>
               <div className="flex justify-center h-[32%]">
                  <div className="w-[45%] h-full">{renderCard(2)}</div>
               </div>
               <div className="flex justify-center gap-3 h-[32%]">
                  <div className="w-[45%] h-full">{renderCard(3)}</div>
                  <div className="w-[45%] h-full">{renderCard(4)}</div>
               </div>
            </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="shrink-0 w-full bg-slate-950/95 border-t border-slate-900 p-3 pb-6 z-50">
             <div className="max-w-lg mx-auto flex flex-col gap-2">
                 <div className="flex justify-between items-end px-1">
                     <div>
                         <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Budget</div>
                         <div className="flex items-baseline gap-1 text-white font-mono font-black">
                             <span className="text-xl">$15.0</span>
                             <span className={`text-lg ${visibleBudget < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                                 ({visibleBudget.toFixed(1)})
                             </span>
                         </div>
                     </div>
                     <div className="text-right">
                         <div className="text-[9px] text-blue-500 font-bold uppercase tracking-widest mb-0.5 flex items-center justify-end gap-1">
                             Total FP
                             <button onClick={() => setShowLegend(true)} className="w-3 h-3 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 text-[8px] border border-slate-700">?</button>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                                {activeBadges.map((b, i) => (
                                    <span key={i} className="text-[10px] animate-pop">{b.icon}</span>
                                ))}
                            </div>
                            <div className="text-2xl font-mono font-black text-white leading-none"><ScoreRoller value={runningScore} /></div>
                         </div>
                     </div>
                 </div>

                 <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex bg-slate-900 rounded-lg p-1 gap-1 border border-slate-800">
                        {betOpts.map(m => (
                            <button key={m} onClick={()=>setBetMultiplier(m)} disabled={gamePhase !== 'START' && gamePhase !== 'END' && gamePhase !== 'DEALT'} className={`px-2.5 py-2 rounded text-[10px] font-bold transition-all ${betMultiplier === m ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{m}x</button>
                        ))}
                    </div>

                    <div className="flex flex-col items-center justify-center px-2">
                        <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">BET</span>
                        <span className="text-lg font-mono font-black text-white">${BASE_BET * betMultiplier}</span>
                    </div>

                    <button onClick={gamePhase==='DEALT'?handleDraw:(gamePhase==='END'?handleDeal:handleDeal)} disabled={gamePhase==='DEALING'||gamePhase==='DRAWING'||gamePhase==='REVEALING'} className={`flex-1 h-12 rounded-xl font-black text-lg uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center max-w-[120px] ${gamePhase==='DEALT'?'bg-green-600 text-white hover:bg-green-500':'bg-blue-600 text-white hover:bg-blue-500'}`}>
                        {gamePhase==='DEALT'?'DRAW':(gamePhase==='DEALING'?'...':(gamePhase==='REVEALING'?'...': 'REPLAY'))}
                    </button>
                 </div>
             </div>
        </div>
      </div>
    </PageContainer>
  );
}