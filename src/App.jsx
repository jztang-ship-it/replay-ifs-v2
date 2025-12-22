import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BankrollProvider } from './context/BankrollContext'; 

import Home from './pages/HomePage';
import Play from './pages/Play';
import TopNav from './components/layout/TopNav';
import MenuOverlay from './components/layout/MenuOverlay';

// Layout Helper
const Layout = ({ children }) => {
  return (
    <>
      {/* Universal TopNav - Shows on ALL pages now */}
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
              <Route path="/" element={<Home />} />
              <Route path="/play" element={<Play />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </Router>
    </BankrollProvider>
  );
}