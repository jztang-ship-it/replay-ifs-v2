import React, { useState, useEffect } from 'react';

const Ticker = ({ value }) => {
  return (
    <span className="font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 drop-shadow-sm">
      ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
};

export default function JackpotBar({ addAmount }) {
  const [amount, setAmount] = useState(12450.75);

  useEffect(() => {
    const interval = setInterval(() => {
      const growth = Math.random() * 0.30 + 0.05;
      setAmount(prev => prev + growth);
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (addAmount > 0) {
      setAmount(prev => prev + addAmount);
    }
  }, [addAmount]);

  return (
    // Centered Container
    <div className="absolute top-20 left-0 w-full flex items-center justify-center z-40 pointer-events-none">
      
      {/* Wrapper for Bar + Legend */}
      <div className="flex items-center gap-4">
        
        {/* 1. THE BAR */}
        <div className="relative">
            <div className="absolute inset-0 bg-yellow-600 blur-[50px] opacity-20 rounded-full animate-pulse"></div>
            
            <div className="bg-slate-900/90 border-y border-yellow-500/20 backdrop-blur-xl px-12 py-1 flex flex-col items-center shadow-2xl relative rounded-full min-w-[280px]">
                {/* Live Dot */}
                <div className="absolute top-2 right-4 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-yellow-600 tracking-[0.3em] uppercase">JACKPOT</span>
                </div>

                <div className="text-4xl leading-none filter drop-shadow-lg font-black tabular-nums">
                    <Ticker value={amount} />
                </div>
            </div>
        </div>

        {/* 2. THE RULES (Side Stack) */}
        <div className="flex flex-col gap-1 opacity-90">
             <div className="bg-black/60 px-3 py-0.5 rounded-full backdrop-blur-md border border-white/5 shadow-lg whitespace-nowrap">
                <span className="text-[8px] font-bold text-yellow-200 tracking-wider">
                    220+ FP <span className="text-white opacity-50">= 10%</span>
                </span>
             </div>
             <div className="bg-black/60 px-3 py-0.5 rounded-full backdrop-blur-md border border-white/5 shadow-lg whitespace-nowrap">
                <span className="text-[8px] font-bold text-yellow-200 tracking-wider">
                    250+ FP <span className="text-white opacity-50">= 100%</span>
                </span>
             </div>
        </div>

      </div>
    </div>
  );
}