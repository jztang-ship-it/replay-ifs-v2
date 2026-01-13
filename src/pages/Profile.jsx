import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useBankroll } from '../context/BankrollContext';

export default function Profile() {
  const { bankroll, xp, history } = useBankroll();

  return (
    <PageContainer>
      <div className="flex flex-col items-center p-8 max-w-2xl mx-auto w-full overflow-y-auto pb-32">
        {/* HEADER */}
        <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center mb-4 shadow-2xl">
                <span className="text-4xl">😎</span>
            </div>
            <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">My Profile</h1>
            <div className="bg-slate-900 px-4 py-1 rounded-full border border-slate-800 mt-2">
                <span className="text-xs font-mono text-slate-400">ID: USER-STABLE</span>
            </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Bankroll</div>
                <div className="text-2xl font-mono font-black text-green-400">${bankroll.toLocaleString()}</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Experience</div>
                <div className="text-2xl font-mono font-black text-blue-400">{xp.toLocaleString()} XP</div>
            </div>
        </div>

        {/* RECENT HISTORY */}
        <div className="w-full bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="bg-slate-900 p-3 border-b border-slate-800 flex justify-between">
                <h3 className="text-xs font-black text-white uppercase italic">Game History</h3>
                <span className="text-[10px] text-slate-500 uppercase">{history.length} Hands</span>
            </div>
            <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto custom-scrollbar">
                {history.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-600 font-mono italic">No hands played yet.</div>
                ) : (
                    history.slice().reverse().map((game, i) => (
                        <div key={i} className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
                            <div className="flex flex-col">
                                <span className={`font-black text-xs uppercase ${game.result === 'LOSS' ? 'text-slate-500' : 'text-green-400'}`}>{game.result}</span>
                                <span className="text-[10px] text-slate-600 font-mono">{new Date(game.date).toLocaleDateString()}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black text-white font-mono">{game.score.toFixed(1)} FP</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </PageContainer>
  );
}