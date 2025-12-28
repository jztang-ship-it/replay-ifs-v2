import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';

export default function LoginPage() {
  return (
    <PageContainer>
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat">
        
        <div className="w-full max-w-sm bg-slate-900/90 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          
          {/* UPDATED: Frenchie Logo */}
          <div className="flex justify-center mb-6">
             <div className="w-20 h-20 relative">
                <img 
                  src="/images/logo-frenchie.png" 
                  alt="Replay Logo" 
                  className="w-full h-full object-contain drop-shadow-xl"
                />
             </div>
          </div>

          <h1 className="text-3xl font-black italic text-white text-center mb-2 uppercase tracking-tighter">
            Player Login
          </h1>
          <p className="text-slate-500 text-center text-sm mb-8">
            Enter the arena.
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</label>
                <input type="email" placeholder="coach@replay.app" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            
            <Link to="/" className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-center rounded-xl transition-all shadow-lg uppercase tracking-widest mt-6">
                Sign In
            </Link>
          </form>

          <div className="mt-6 text-center">
            <span className="text-slate-600 text-xs">Don't have an account? </span>
            <span className="text-blue-400 text-xs font-bold cursor-pointer hover:underline">Scout New Team</span>
          </div>

        </div>
      </div>
    </PageContainer>
  );
}