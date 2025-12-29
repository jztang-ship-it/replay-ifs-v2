import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Profile from './pages/Profile';
import PulsePage from './pages/Pulse';       
import CollectPage from './pages/Collect';   
import PlayPage from './pages/Play'; 
// IMPORT SIM
import Simulate from './pages/Simulate';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/play" element={<PlayPage />} /> 
        <Route path="/pulse" element={<PulsePage />} />
        <Route path="/collect" element={<CollectPage />} />
        
        {/* ADD SIM ROUTE */}
        <Route path="/simulate" element={<Simulate />} />
      </Routes>
    </BrowserRouter>
  );
}