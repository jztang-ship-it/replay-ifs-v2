import React from 'react';

export default function BadgeLegend() {
  // Hardcoded list to ensure these always appear exactly as requested
  const badges = [
    { label: "ON FIRE", emoji: "🔥" },
    { label: "TRIPLE DBL", emoji: "👑" },
    { label: "DOUBLE DBL", emoji: "✌️" },
    { label: "5 x 5", emoji: "🖐️" },
    { label: "QUAD DBL", emoji: "🦕" },
    { label: "4+ STOCKS", emoji: "🔒" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 bg-slate-900/80 px-6 py-3 rounded-xl border border-white/10 shadow-xl backdrop-blur-md">
      {badges.map((def, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="text-base leading-none filter drop-shadow-md">{def.emoji}</span>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">{def.label}</span>
        </div>
      ))}
    </div>
  );
}