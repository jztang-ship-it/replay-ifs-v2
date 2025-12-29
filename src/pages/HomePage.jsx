import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
// import logo from '../assets/logo.png'; // <--- COMMENTED OUT

export default function HomePage() {
  return (
    <PageContainer>
      <div className="flex-1 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat opacity-100">
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden">
          
          <div className="flex justify-center mb-6">
             <div className="w-24 h-24 flex items-center justify-center bg-slate-800 rounded-full">
                {/* TEMPORARY PLACEHOLDER */}
                <span className="text-2xl">🐶</span>
             </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black italic text-white mb-2 tracking-tighter drop-shadow-lg uppercase">
            Welcome Back
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base font-medium mb-8 tracking-wide">
            Daily Fantasy. Reimagined.
          </p>

          <Link to="/play" className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(37,99,235,0.5)] tracking-widest uppercase">
            Enter Game
          </Link>

        </div>
      </div>
    </PageContainer>
  );
}