// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BankrollProvider } from './context/BankrollContext'; 

// --- IMPORTS ---
import Home from './pages/HomePage';
import Play from './pages/Play';
import Pulse from './components/Pulse'; 
import GameRoom from './pages/GameRoom'; // <--- 1. IMPORT ADDED
import TopNav from './components/layout/TopNav';
import MenuOverlay from './components/layout/MenuOverlay';
import Collect from './pages/Collect';

// Layout Helper
const Layout = ({ children }) => {
  return (
    <>
      <TopNav />
      <MenuOverlay />
      {children}
    </>
  );
};

export default function App() {
  return (
    <BankrollProvider>
      <Router>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              {/* --- MAIN PAGES --- */}
              <Route path="/" element={<Home />} />
              <Route path="/play" element={<Play />} />
              <Route path="/pulse" element={<Pulse />} />
              <Route path="/collect" element={<Collect />} />
              
              {/* --- 2. GAME ROOM ROUTE ADDED HERE --- */}
              {/* This tells the app: "If URL has /game/ANYTHING, show GameRoom" */}
              <Route path="/game/:id" element={<GameRoom />} />
              
            </Routes>
          </AnimatePresence>
        </Layout>
      </Router>
    </BankrollProvider>
  );
}