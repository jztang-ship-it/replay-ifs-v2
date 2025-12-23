// src/components/Pulse/PulseTicker.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function PulseTicker({ items }) {
  return (
    <div className="w-full bg-black/80 border-b border-gray-700 h-10 flex items-center overflow-hidden relative z-10">
      
      {/* The scrolling wrapper */}
      <div className="animate-marquee whitespace-nowrap flex gap-8 px-4">
        
        {/* FIRST LOOP */}
        {items.map((item) => (
          <Link 
            key={item.id} 
            to={`/game/${item.id}`} 
            className="text-sm font-mono text-green-400 font-bold uppercase tracking-wider hover:text-white cursor-pointer"
          >
            {item.text}
          </Link>
        ))}

        {/* SECOND LOOP (Duplicate for smooth scrolling effect) */}
        {items.map((item) => (
          <Link 
            key={`dup-${item.id}`} 
            to={`/game/${item.id}`} 
            className="text-sm font-mono text-green-400 font-bold uppercase tracking-wider hover:text-white cursor-pointer"
          >
            {item.text}
          </Link>
        ))}

      </div>
    </div>
  );
}