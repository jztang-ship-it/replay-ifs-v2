import React from 'react';

export default function BadgeLegend() {
  
  // MANUAL LIST: To guarantee the icons appear exactly as requested
  const badges = [
    { label: "ON FIRE", emoji: "🔥" },
    { label: "TRIPLE DBL", emoji: "👑" },
    { label: "DOUBLE DBL", emoji: "✌️" },
    { label: "5 x 5", emoji: "🖐️" },
    { label: "QUAD DBL", emoji: "🦕" },
    { label: "4+ STOCKS", emoji: "🔒" }, // Explicitly named as requested
  ];

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md text-[9px] text-slate-300">
      {badges.map((def, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="text-base leading-none">{def.emoji}</span>
          <span className="uppercase tracking-wider font-bold">{def.label}</span>
        </div>
      ))}
    </div>
  );
}