import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Play from './pages/Play'; // <--- THE GAME IS BACK
import { loadUserData, saveUserData } from './utils/storage';

// --- PLACEHOLDERS ---
const Pulse = ({ onBack }) => (
  <div className="h-screen bg-slate-950 text-white p-10 flex flex-col items-center justify-center">
    <h1 className="text-4xl mb-4">📰</h1>
    <h2 className="text-2xl font-bold">Pulse News</h2>
    <button onClick={onBack} className="mt-6 bg-slate-800 px-6 py-2 rounded-full border border-slate-700">← Back</button>
  </div>
);

const Stats = ({ onBack }) => (
  <div className="h-screen bg-slate-950 text-white p-10 flex flex-col items-center justify-center">
    <h1 className="text-4xl mb-4">📊</h1>
    <h2 className="text-2xl font-bold">Stats & History</h2>
    <button onClick={onBack} className="mt-6 bg-slate-800 px-6 py-2 rounded-full border border-slate-700">← Back</button>
  </div>
);

const Collect = ({ onBack }) => (
  <div className="h-screen bg-slate-950 text-white p-10 flex flex-col items-center justify-center">
    <h1 className="text-4xl mb-4">🎁</h1>
    <h2 className="text-2xl font-bold">Daily Rewards</h2>
    <button onClick={onBack} className="mt-6 bg-slate-800 px-6 py-2 rounded-full border border-slate-700">← Back</button>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState('HOME');
  
  // Load User (Will now default to Dog because we switched to V2)
  const [user, setUser] = useState(() => loadUserData());

  useEffect(() => {
    saveUserData(user);
  }, [user]);

  const handleGameResult = (amountDiff) => {
    setUser(prev => ({
      ...prev,
      bankroll: prev.bankroll + amountDiff,
      vipPoints: amountDiff < 0 ? prev.vipPoints + 1 : prev.vipPoints, 
      gamesPlayed: prev.gamesPlayed + 1
    }));
  };

  const renderView = () => {
    switch (currentView) {
      case 'PLAY':
        return (
          <div className="relative h-screen w-full">
            <Play 
              userBankroll={user.bankroll} 
              onBankrollUpdate={handleGameResult}
              onBack={() => setCurrentView('HOME')} // Pass the back function
            />
            {/* Redundant float button removed since Play.jsx has its own header now, 
                but keeping a safety exit just in case Play.jsx header is missing */}
             <button 
              onClick={() => setCurrentView('HOME')}
              className="fixed top-20 right-4 z-[60] bg-red-900/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-red-500/30 hover:bg-red-800 transition-colors"
            >
              EXIT GAME
            </button>
          </div>
        );
      case 'PULSE': return <Pulse onBack={() => setCurrentView('HOME')} />;
      case 'STATS': return <Stats onBack={() => setCurrentView('HOME')} />;
      case 'COLLECT': return <Collect onBack={() => setCurrentView('HOME')} />;
      default: return <Home user={user} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="antialiased h-screen w-screen overflow-hidden bg-slate-950 text-white flex flex-col">
      {renderView()}
    </div>
  );
}