import React, { useState, useEffect } from 'react';

export default function JackpotBar({ addAmount = 0 }) {
  const [amount, setAmount] = useState(12451.29); // Matching screenshot
  
  useEffect(() => {
    if (addAmount > 0) setAmount(p => p + addAmount);
  }, [addAmount]);

  // Subtle ticker
  useEffect(() => {
    const i = setInterval(() => setAmount(p => p + 0.01), 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <div className="bg-slate-900/90 border border-yellow-600/30 px-8 py-2 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.15)] flex flex-col items-center">
            <span className="text-[9px] text-yellow-600 font-black tracking-[0.3em] uppercase mb-[-2px]">Grand Jackpot</span>
            <span className="text-3xl font-black font-mono text-yellow-400 drop-shadow-sm tracking-tight">
                ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
        </div>
        {/* Conditions below the bar */}
        <div className="flex gap-4 mt-1">
            <span className="text-[9px] font-bold text-slate-500">220+ FP = <span className="text-yellow-600">10%</span></span>
            <div className="w-px h-3 bg-slate-800"></div>
            <span className="text-[9px] font-bold text-slate-500">250+ FP = <span className="text-yellow-400">100%</span></span>
        </div>
    </div>
  );
}