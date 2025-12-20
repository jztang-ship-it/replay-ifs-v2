import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Play from './pages/Play';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 pb-20 md:pb-0 md:pt-20 text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}