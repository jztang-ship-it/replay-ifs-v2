import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BankrollProvider } from './context/BankrollContext';

// Page Components
import HomePage from './pages/HomePage';
import Play from './pages/Play';
import Pulse from './pages/Pulse';
import Collect from './pages/Collect';
import Profile from './pages/Profile';
import LoginPage from './pages/LoginPage';
import GameRoom from './pages/GameRoom';
import Sync from './pages/Sync';

export default function App() {
  return (
    // 1. Wrap the entire app in BankrollProvider so balance updates work globally
    <BankrollProvider>
      {/* 2. Router handles navigation between pages */}
      <Router>
        <Routes>
          {/* Main Navigation Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<Play />} />
          <Route path="/pulse" element={<Pulse />} />
          <Route path="/collect" element={<Collect />} />
          
          {/* New Profile Page */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Utility / Other Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/gameroom" element={<GameRoom />} />
          <Route path="/sync" element={<Sync />} />
          
          {/* Fallback for unknown routes (optional, redirects to Home) */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
    </BankrollProvider>
  );
}