import React from 'react';
import { BADGE_DEFINITIONS } from '../../utils/badges';

export default function BadgeLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md text-[9px] text-slate-300">
      {Object.entries(BADGE_DEFINITIONS)
        // FILTER: Removes any badge where the label refers to percentages or 3s/FG
        .filter(([_, def]) => !def.label.includes('FG') && !def.label.includes('3') && !def.label.includes('%'))
        .map(([code, def]) => (
        <div key={code} className="flex items-center gap-1">
          <span className="text-base leading-none">{def.emoji}</span>
          <span className="uppercase tracking-wider font-bold">{def.label}</span>
        </div>
      ))}
    </div>
  );
}