import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useBankroll } from '../context/BankrollContext';

export default function Sync() {
  const { bankroll, xp, history } = useBankroll();

  return (
    <PageContainer>
      <div className="flex flex-col min-h-screen px-4 pt-6 pb-24 max-w-xl mx-auto w-full">
        
        {/* HEADER */}
        <div className="flex flex-col mb-8 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-slate-800 shadow-xl">
            🔗
          </div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter">SYNC ACCOUNT</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Save Progress • Cross-Device
          </p>
        </div>

        {/* STATUS CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Connection Status</span>
            <span className="flex items-center gap-1.5 text-[10px] font-black text-green-400 uppercase tracking-wider bg-green-400/10 px-2 py-1 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Online
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-sm text-slate-400">Bankroll</span>
              <span className="text-sm font-mono font-bold text-white">${bankroll.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-sm text-slate-400">XP Level</span>
              <span className="text-sm font-mono font-bold text-blue-400">{xp.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-400">Games Played</span>
              <span className="text-sm font-mono font-bold text-white">{history.length}</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 gap-3">
          <button className="py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
            <span>☁️</span> Force Backup
          </button>
          <button className="py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest rounded-xl transition-all border border-slate-700">
            Restore Data
          </button>
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-600 font-mono">
          Device ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>

      </div>
    </PageContainer>
  );
}