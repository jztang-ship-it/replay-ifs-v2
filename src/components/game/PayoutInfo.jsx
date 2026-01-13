import React from 'react';

export default function PayoutInfo({ onClose }) {
  const tiers = [
    { label: "JACKPOT", score: "280+", mult: "100x", color: "text-yellow-400 border-yellow-500/50 bg-yellow-500/10" },
    { label: "LEGENDARY", score: "250+", mult: "15x", color: "text-purple-400 border-purple-500/50 bg-purple-500/10" },
    { label: "BIG WIN", score: "220+", mult: "5x", color: "text-green-400 border-green-500/50 bg-green-500/10" },
    { label: "WINNER", score: "190+", mult: "2x", color: "text-blue-400 border-blue-500/50 bg-blue-500/10" },
    { label: "SAVER", score: "165+", mult: "0.5x", color: "text-slate-400 border-slate-500/50 bg-slate-500/10" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-white font-black uppercase tracking-wider text-sm">Target Scores</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">✕</button>
        </div>

        {/* Table */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2 mb-1">
            <span>Tier</span>
            <div className="flex gap-8">
              <span>Target FP</span>
              <span>Payout</span>
            </div>
          </div>
          
          {tiers.map((t, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${t.color}`}>
              <span className="font-black text-xs tracking-wider">{t.label}</span>
              <div className="flex items-center gap-8">
                <span className="font-mono font-bold text-sm">{t.score}</span>
                <span className="font-black text-sm w-8 text-right">{t.mult}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-950/50 text-center border-t border-slate-800">
          <p className="text-[10px] text-slate-500">
            Scores are based on real-life player performance.<br/>
            Team FP = Sum of your 5 players' scores.
          </p>
          <button onClick={onClose} className="mt-3 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs uppercase tracking-widest transition-colors">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}