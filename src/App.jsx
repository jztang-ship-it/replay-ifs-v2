import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Profile from './pages/Profile';
import PulsePage from './pages/Pulse';       
import CollectPage from './pages/Collect';   

// 1. IMPORT THE REAL GAME PAGE (Note: Your file is named Play.jsx)
import PlayPage from './pages/Play'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* 2. POINT THE ROUTE TO THE GAME */}
        <Route path="/play" element={<PlayPage />} /> 
        
        <Route path="/pulse" element={<PulsePage />} />
        <Route path="/collect" element={<CollectPage />} />
      </Routes>
    </BrowserRouter>
  );
}