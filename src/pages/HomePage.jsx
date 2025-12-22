import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden pt-20">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[128px]"></div>
      </div>

      <div className="z-10 flex flex-col items-center gap-6">
        {/* Logo / Title */}
        <div className="flex flex-col items-center text-center">
             <img src="/assets/Beta-logo.png" alt="Logo" className="w-32 h-32 object-contain mb-4 opacity-90" />
             <h1 className="text-6xl font-black text-white tracking-tighter mb-2">
                REPLAY <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">IFS</span>
             </h1>
             {/* UPDATED TAGLINE */}
             <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">
                The <span className="text-green-400 font-bold">INSTANT</span> Fantasy Experience
             </p>
        </div>

        {/* Play Button */}
        <Link to="/play">
          <button className="px-12 py-5 bg-white text-slate-950 font-black rounded-full text-xl hover:scale-105 hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] mt-4">
            ENTER GAME
          </button>
        </Link>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 text-slate-600 text-xs font-mono">
        v2.0.3 // POWERED BY GEMINI
      </div>
    </div>
  );
}