import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Play from './pages/Play';
import Pulse from './pages/Pulse';
import Collect from './pages/Collect'; // RESTORED
import Profile from './pages/Profile'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<Play />} />
        <Route path="/pulse" element={<Pulse />} />
        <Route path="/collect" element={<Collect />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}