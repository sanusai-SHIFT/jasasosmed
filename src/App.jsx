// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import komponen
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Earning from './pages/Earning';
import Advertise from './pages/Advertise';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <main>
        {/* Konten halaman akan dirender di sini */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/earning" element={<Earning />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Navigasi bawah selalu tampil */}
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;

