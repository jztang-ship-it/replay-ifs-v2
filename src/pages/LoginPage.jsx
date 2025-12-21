import React, { useState } from 'react';

export default function LoginPage({ onComplete }) {
  const [email, setEmail] = useState('');
  
  const handleSocialLogin = (provider) => {
    // Simulating a social login callback
    onComplete(`User_${provider}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
      
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>

        <h2 className="text-3xl font-black italic text-white mb-2 text-center">WELCOME BACK</h2>
        <p className="text-slate-500 text-center mb-8 text-sm">Login to access your wallet</p>

        {/* SOCIAL BUTTONS */}
        <div className="space-y-3 mb-8">
          <button 
            onClick={() => handleSocialLogin('Google')}
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-colors"
          >
            <span className="text-lg">G</span> Continue with Google
          </button>
          
          <button 
            onClick={() => handleSocialLogin('Apple')}
            className="w-full bg-slate-950 text-white border border-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors"
          >
            <span className="text-lg"></span> Continue with Apple
          </button>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 mb-8 opacity-50">
          <div className="h-px bg-slate-700 flex-1"></div>
          <span className="text-slate-500 text-xs uppercase tracking-widest">Or via Email</span>
          <div className="h-px bg-slate-700 flex-1"></div>
        </div>

        {/* TRADITIONAL FORM */}
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-slate-950 border border-slate-700 text-white p-4 rounded-xl focus:border-blue-500 outline-none transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            onClick={() => onComplete(email.split('@')[0] || 'PlayerOne')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-wide"
          >
            LOG IN 
          </button>
        </div>

      </div>
    </div>
  );
}