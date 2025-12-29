import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';

// This function MUST be the default export
export default function Profile() {
  return (
    <PageContainer>
      <div className="flex-1 p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat">
        <div className="max-w-md mx-auto bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-slate-400">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1 .437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.602-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter">Coach Profile</h1>
              <p className="text-slate-500 text-sm">Manage your account</p>
            </div>
          </div>

          <div className="space-y-3">
             <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Username</span>
                <div className="text-white font-mono font-bold">CoachTang</div>
             </div>
             <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Bankroll</span>
                <div className="text-green-400 font-mono font-black text-xl">$1,000.00</div>
             </div>
          </div>

          <Link to="/" className="block w-full py-3 mt-8 bg-slate-800 hover:bg-slate-700 text-white font-bold text-center rounded-xl transition-all uppercase tracking-widest text-sm">
            Back to Game
          </Link>

        </div>
      </div>
    </PageContainer>
  );
}