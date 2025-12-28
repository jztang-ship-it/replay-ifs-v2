import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import Play from './pages/Play';
import Pulse from './pages/Pulse';
import Collect from './pages/Collect';

export default function App() {
  return (
    <Router>
      <div className="bg-slate-950 min-h-screen text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<Play />} />
          <Route path="/pulse" element={<Pulse />} />
          <Route path="/collect" element={<Collect />} />
        </Routes>
      </div>
    </Router>
  );
}