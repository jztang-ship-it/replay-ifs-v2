import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { getAllPlayers, getPlayerGameLog } from '../data/real_nba_db';
import { calculateScore } from '../utils/ScoringEngine';

export default function Simulate() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [debugLog, setDebugLog] = useState(""); // NEW: To see the raw data

  const SALARY_CAP = 15.0; 
  const getCost = (p) => parseFloat(p.cost || p.price || 0);

  const buildHand = (allPlayers) => {
    // Standard sorting by cost
    const sortedPlayers = [...allPlayers].sort((a, b) => getCost(a) - getCost(b));
    const minCost = getCost(sortedPlayers[0]) || 0.5;

    for (let attempt = 0; attempt < 50; attempt++) {
        let hand = [];
        let totalCost = 0;
        let success = true;

        for (let i = 0; i < 5; i++) {
            let slotsRemaining = 5 - i - 1;
            let budgetRemaining = SALARY_CAP - totalCost;
            let maxSpend = budgetRemaining - (slotsRemaining * minCost);

            let candidates = allPlayers.filter(p => getCost(p) <= maxSpend && !hand.includes(p));
            if (candidates.length === 0) { success = false; break; }

            // Smart Pick: Top 25% of available
            candidates.sort((a, b) => getCost(b) - getCost(a));
            let topSlice = Math.max(1, Math.floor(candidates.length * 0.25));
            let topCandidates = candidates.slice(0, topSlice);
            let pick = topCandidates[Math.floor(Math.random() * topCandidates.length)];

            hand.push(pick);
            totalCost += getCost(pick);
        }
        if (success && totalCost <= SALARY_CAP) return hand;
    }
    return null; 
  };

  const runSimulation = () => {
    setRunning(true);
    setDebugLog(""); // Clear logs
    
    setTimeout(() => {
        const allPlayers = getAllPlayers();
        const iterations = 10000;
        const scores = [];
        let fails = 0;
        let badgeCount = 0; 
        
        // DEBUG: Capture the first hand to check data integrity
        let sampleHandLog = [];

        for(let i=0; i<iterations; i++) {
            const hand = buildHand(allPlayers);
            if(!hand) { fails++; continue; }
            
            const totalScore = hand.reduce((acc, player) => {
                const rawStats = getPlayerGameLog(player);
                const boosted = calculateScore(rawStats);
                
                // DEBUG: Log the first hand only
                if (i === 0) {
                    sampleHandLog.push(`${player.name} ($${player.cost}): Pts=${rawStats.pts}, Reb=${rawStats.reb}, Ast=${rawStats.ast} -> Badges: ${boosted.badges.map(b=>b.label).join(',') || 'None'}`);
                }

                if(boosted.badges.length > 0) badgeCount++;
                return acc + boosted.score;
            }, 0);
            scores.push(totalScore);
        }

        scores.sort((a,b) => a - b);
        const avg = scores.reduce((a,b) => a+b, 0) / scores.length;
        const p90 = scores[Math.floor(scores.length * 0.90)];
        const p75 = scores[Math.floor(scores.length * 0.75)];
        const median = scores[Math.floor(scores.length / 2)];

        setDebugLog(sampleHandLog.join('\n')); // Show the user what happened
        setResults({ iterations, fails, min: scores[0], max: scores[scores.length-1], avg, median, p90, p75, badgeCount });
        setRunning(false);
    }, 100);
  };

  return (
    <PageContainer>
      <div className="p-8 text-white max-w-2xl mx-auto">
        <h1 className="text-3xl font-black italic uppercase mb-4 text-yellow-400">Monte Carlo Simulation</h1>
        
        <button onClick={runSimulation} disabled={running} className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-black uppercase tracking-widest rounded-xl mb-4 transition-all">
            {running ? 'Running...' : 'Run Simulation (10k Hands)'}
        </button>

        {/* DATA INSPECTOR */}
        {debugLog && (
            <div className="mb-4 p-4 bg-slate-800 rounded font-mono text-xs text-green-400 overflow-x-auto border border-green-900">
                <div className="text-white uppercase font-bold mb-2">Data Inspector (First Hand):</div>
                <pre>{debugLog}</pre>
            </div>
        )}

        {results && (
            <div className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase">Average Score</div>
                        <div className="text-2xl font-mono font-black text-white">{results.avg.toFixed(1)}</div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase">Max Score</div>
                        <div className="text-2xl font-mono font-black text-green-400">{results.max.toFixed(1)}</div>
                    </div>
                </div>
                
                <div className={`p-2 rounded text-center text-xs font-bold border ${results.badgeCount > 0 ? 'bg-green-900/20 border-green-500/50 text-green-200' : 'bg-red-900/20 border-red-500/50 text-red-200'}`}>
                    Hands with Bonuses: {results.badgeCount} ({(results.badgeCount/results.iterations*100).toFixed(1)}%)
                </div>

                <div className="border-t border-slate-800 pt-4 mt-4">
                    <h3 className="text-yellow-400 font-bold uppercase mb-4">Recommended Thresholds</h3>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Win (Top 50%):</span> <span className="text-white">{results.median.toFixed(1)} FP</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Big Win (Top 25%):</span> <span className="text-white">{results.p75.toFixed(1)} FP</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Jackpot (Top 10%):</span> <span className="text-white">{results.p90.toFixed(1)} FP</span></div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </PageContainer>
  );
}