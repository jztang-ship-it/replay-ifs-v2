import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { getAllPlayers, getPlayerGameLog } from '../data/real_nba_db';

export default function Simulate() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  // --- REPLICATE EXACT GAME LOGIC ---
  const SALARY_CAP = 15.0; // STRICT RULE

  const getCost = (p) => parseFloat(p.cost || p.price || 0);

  const buildHand = (allPlayers) => {
    // Exact logic from Play.jsx (simplified for speed)
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

            let candidates = allPlayers.filter(p => 
                getCost(p) <= maxSpend && !hand.includes(p)
            );
            
            if (candidates.length === 0) { success = false; break; }

            // Using the "Smart" logic (Top 50%)
            candidates.sort((a, b) => getCost(b) - getCost(a));
            let topSlice = Math.max(1, Math.floor(candidates.length * 0.5));
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
    setTimeout(() => {
        const allPlayers = getAllPlayers();
        const iterations = 10000;
        const scores = [];
        let fails = 0;

        for(let i=0; i<iterations; i++) {
            const hand = buildHand(allPlayers);
            if(!hand) { fails++; continue; }
            
            // Calculate Score
            const totalScore = hand.reduce((acc, player) => {
                const stats = getPlayerGameLog(player);
                return acc + stats.score;
            }, 0);
            scores.push(totalScore);
        }

        // Stats Analysis
        scores.sort((a,b) => a - b);
        const min = scores[0];
        const max = scores[scores.length-1];
        const avg = scores.reduce((a,b) => a+b, 0) / scores.length;
        const median = scores[Math.floor(scores.length / 2)];
        
        // Distribution
        const p90 = scores[Math.floor(scores.length * 0.90)]; // Top 10%
        const p75 = scores[Math.floor(scores.length * 0.75)]; // Top 25%
        const p50 = median;

        setResults({ iterations, fails, min, max, avg, median, p90, p75, p50 });
        setRunning(false);
    }, 100);
  };

  return (
    <PageContainer>
      <div className="p-8 text-white max-w-2xl mx-auto">
        <h1 className="text-3xl font-black italic uppercase mb-4 text-yellow-400">Monte Carlo Simulation</h1>
        <p className="text-slate-400 mb-8">Simulating 10,000 hands with strict $15.0 Salary Cap.</p>

        <button 
            onClick={runSimulation} 
            disabled={running}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-black uppercase tracking-widest rounded-xl mb-8 transition-all"
        >
            {running ? 'Running Math...' : 'Run Simulation (10k Hands)'}
        </button>

        {results && (
            <div className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase">Average Score</div>
                        <div className="text-2xl font-mono font-black text-white">{results.avg.toFixed(1)}</div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase">Max Score Seen</div>
                        <div className="text-2xl font-mono font-black text-green-400">{results.max.toFixed(1)}</div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-4 mt-4">
                    <h3 className="text-yellow-400 font-bold uppercase mb-4">Recommended Thresholds</h3>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Top 50% (Win 1x):</span>
                            <span className="text-white">{results.p50.toFixed(1)} FP</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Top 25% (Win 2x):</span>
                            <span className="text-white">{results.p75.toFixed(1)} FP</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Top 10% (Win 5x):</span>
                            <span className="text-white">{results.p90.toFixed(1)} FP</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </PageContainer>
  );
}