import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. IMPORT NAV & PAGES
import TopNav from './components/layout/TopNav';
import Play from './pages/Play';
import HomePage from './pages/HomePage';
import Pulse from './pages/Pulse';
import Collect from './pages/Collect';
import Profile from './pages/Profile';

// 2. IMPORT CONTEXT PROVIDERS
import { BankrollProvider } from './context/BankrollContext';
import { RosterProvider } from './context/RosterContext'; 

function App() {
  return (
    <RosterProvider>
      <BankrollProvider>
        <Router>
            <TopNav />
            <Routes>
                {/* Main Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/play" element={<Play />} />
                <Route path="/pulse" element={<Pulse />} />
                <Route path="/collect" element={<Collect />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
      </BankrollProvider>
    </RosterProvider>
  );
}

export default App;