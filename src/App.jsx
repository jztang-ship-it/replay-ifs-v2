import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav'; 
import HomePage from './pages/HomePage';
import Play from './pages/Play';
import LoginPage from './pages/LoginPage';
import { loadUserData, saveUserData } from './utils/storage';

// --- PLACEHOLDER COMPONENTS ---
const Pulse = ({ onBack }) => <div className="flex-1 flex flex-col items-center justify-center text-4xl text-white">🔥<div className="text-sm mt-4">Pulse News</div></div>;
const Stats = ({ onBack }) => <div className="flex-1 flex flex-col items-center justify-center text-4xl text-white">📊<div className="text-sm mt-4">Stats</div></div>;
const Collect = ({ onBack }) => <div className="flex-1 flex flex-col items-center justify-center text-4xl text-white">🎁<div className="text-sm mt-4">Rewards</div></div>;

// --- MODAL ---
const SaveWarningModal = ({ balance, onConfirmExit, onRegister, onCancel }) => (
  <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-red-500/50 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
      <h2 className="text-2xl font-black text-white mb-2">WALK AWAY?</h2>
      <p className="text-slate-400 mb-6">You have <span className="text-green-400 font-bold">${balance?.toLocaleString()}</span>. Register to save it.</p>
      <button onClick={onRegister} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl mb-3">SAVE ACCOUNT</button>
      <button onClick={onConfirmExit} className="w-full border border-slate-700 text-slate-500 py-3 rounded-xl">Delete & Exit</button>
      <button onClick={onCancel} className="mt-4 text-slate-500 text-xs underline">Cancel</button>
    </div>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState('HOME');
  const [showExitWarning, setShowExitWarning] = useState(false);
  
  // 1. INITIALIZE USER
  const [user, setUser] = useState(() => {
    const loaded = loadUserData();
    if (!loaded || !loaded.username) return null;
    return loaded;
  });

  useEffect(() => { if (user) saveUserData(user); }, [user]);

  // --- ACTIONS ---
  const handleInstantPlay = () => {
    if (!user) setUser({ username: 'Guest', isGuest: true, vipLevel: 'NONE', vipPoints: 0, bankroll: 1000, gamesPlayed: 0, avatar: '👻' });
    setCurrentView('PLAY');
  };

  const handleRegister = (name) => {
    setUser(prev => ({ ...prev, username: name, isGuest: false, avatar: '🐶' }));
    setShowExitWarning(false);
    setCurrentView('HOME');
  };

  const triggerSaveFlow = () => {
    if (user?.isGuest) setShowExitWarning(true);
    else setCurrentView('LOGIN');
  };

  const confirmExit = () => {
    setUser(null);
    localStorage.removeItem('IFS_USER_DATA_V2');
    setShowExitWarning(false);
    setCurrentView('HOME');
  };

  // DEBUGGING TOOL: Force Reset
  const forceReset = () => {
    setUser(null);
    localStorage.removeItem('IFS_USER_DATA_V2');
    setCurrentView('HOME');
    window.location.reload();
  };

  const handleGameResult = (diff) => {
    if (user) setUser(prev => ({ ...prev, bankroll: prev.bankroll + diff }));
  };

  // --- RENDER ---
  const renderContent = () => {
    switch (currentView) {
      case 'PLAY': return <Play userBankroll={user?.bankroll || 1000} onBankrollUpdate={handleGameResult} />;
      case 'LOGIN': return <LoginPage onComplete={handleRegister} />;
      case 'PULSE': return <Pulse />;
      case 'STATS': return <Stats />;
      case 'COLLECT': return <Collect />;
      default: return <HomePage user={user} onNavigate={setCurrentView} onInstantPlay={handleInstantPlay} />;
    }
  };

  return (
    <div className="antialiased h-screen w-screen overflow-hidden bg-slate-950 text-white flex flex-col">
      <TopNav user={user} onNavigate={setCurrentView} onTriggerSave={triggerSaveFlow} />
      
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>

      {showExitWarning && user && (
        <SaveWarningModal balance={user.bankroll} onConfirmExit={confirmExit} onRegister={() => setCurrentView('LOGIN')} onCancel={() => setShowExitWarning(false)} />
      )}

      {/* DEBUG BUTTON */}
      <button onClick={forceReset} className="fixed bottom-2 left-2 text-[8px] text-slate-700 hover:text-red-500 uppercase font-bold z-[9999]">
        [Debug] Factory Reset
      </button>
    </div>
  );
}