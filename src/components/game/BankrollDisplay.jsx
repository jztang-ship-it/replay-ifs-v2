import React from 'react';

export default function BankrollDisplay({ amount }) {
  // Safe fallback if amount is missing
  const safeAmount = amount !== undefined && amount !== null ? amount : 0;

  return (
    <div className="bg-slate-900 border border-slate-700 px-4 py-1 rounded-full flex items-center gap-2 shadow-inner">
      <span className="text-green-400 text-xs font-black uppercase tracking-widest">BANKROLL</span>
      <span className="text-white font-mono font-bold text-lg">
        ${safeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </div>
  );
}