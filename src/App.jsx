import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BankrollProvider } from './context/BankrollContext';

// Import Pages
import HomePage from './pages/HomePage';
import Play from './pages/Play';
import Collect from './pages/Collect';
import Sync from './pages/Sync';
import Pulse from './pages/Pulse'; 

// Import Navigation
import TopNav from './components/layout/TopNav'; 

export default function App() {
  return (
    <BankrollProvider>
      <Router>
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-blue-500/30">
          
          <TopNav /> 

          {/* PT-16 matches the h-16 of the header perfectly */}
          <div className="pt-16 relative z-0"> 
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/play" element={<Play />} />
              <Route path="/collect" element={<Collect />} />
              <Route path="/sync" element={<Sync />} />
              <Route path="/pulse" element={<Pulse />} />
            </Routes>
          </div>
          
        </div>
      </Router>
    </BankrollProvider>
  );
}