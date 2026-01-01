import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. IMPORT NAV & PAGES
import TopNav from './components/layout/TopNav';
import Play from './pages/Play';
import AnimationDemo from './pages/AnimationDemo'; // <--- Your new demo page

// 2. IMPORT CONTEXT PROVIDERS (This is what was missing!)
// These give your app access to the "Bankroll" and "Player Data"
import { BankrollProvider } from './context/BankrollContext';
import { RosterProvider } from './context/RosterContext'; 

function App() {
  return (
    // 3. WRAP THE APP IN PROVIDERS
    <RosterProvider>
      <BankrollProvider>
        <Router>
            <TopNav />
            <Routes>
                {/* Main Game Page */}
                <Route path="/" element={<Play />} />
                <Route path="/play" element={<Play />} />
                
                {/* Animation Demo Page */}
                <Route path="/demo" element={<AnimationDemo />} />
                
                {/* Placeholders for future tabs */}
                <Route path="/pulse" element={<div className="pt-20 text-white text-center">PULSE COMING SOON</div>} />
                <Route path="/collect" element={<div className="pt-20 text-white text-center">COLLECT COMING SOON</div>} />
                <Route path="/profile" element={<div className="pt-20 text-white text-center">PROFILE COMING SOON</div>} />
            </Routes>
        </Router>
      </BankrollProvider>
    </RosterProvider>
  );
}

export default App;