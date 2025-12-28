import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';

export default function HomePage() {
  return (
    <PageContainer>
      {/* Centering Wrapper: Fills the flex-1 space defined in PageContainer */}
      <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-opacity-10">
        
        {/* Main Card */}
        <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden group">
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <img src="/assets/Beta-logo.png" alt="NBA Replay" className="h-16 w-auto relative z-10" />
            
            <div className="text-center relative z-10">
                <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Welcome Back</h1>
                <p className="text-slate-400 text-sm font-medium">Daily Fantasy. Reimagined.</p>
            </div>

            <Link to="/play" className="w-full relative z-10">
                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl uppercase tracking-[0.2em] shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-200">
                    Enter Game
                </button>
            </Link>
        </div>

      </div>
    </PageContainer>
  );
}