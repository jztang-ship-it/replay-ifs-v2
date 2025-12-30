import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Play from './pages/Play';
import Profile from './pages/Profile';
import Pulse from './pages/Pulse';     // Links to your EXISTING file
import Collect from './pages/Collect'; // Links to your EXISTING file
import { BankrollProvider } from './context/BankrollContext';
import { RosterProvider } from './context/RosterContext';

function App() {
  return (
    <BankrollProvider>
      <RosterProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/play" element={<Play />} />
            <Route path="/pulse" element={<Pulse />} />
            <Route path="/collect" element={<Collect />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </RosterProvider>
    </BankrollProvider>
  );
}

export default App;