// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import komponen utama
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Earning from './pages/Earning';
import Advertise from './pages/Advertise';
import Profile from './pages/Profile';

// Import halaman-halaman untuk fitur Earning
import ViewAdsList from './pages/earning/ViewAdsList';
import WatchTaskPage from './pages/earning/WatchTaskPage';

// Import halaman-halaman untuk fitur Advertise
import NewAdPage from './pages/advertise/NewAdPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticateUser = async () => {
      // Cek apakah aplikasi berjalan di dalam Telegram
      if (window.Telegram && window.Telegram.WebApp) {
        const initData = window.Telegram.WebApp.initData;
        
        if (!initData) {
          console.error("InitData tidak ditemukan.");
          setLoading(false);
          return;
        }

        try {
          // Kirim initData ke backend Anda untuk divalidasi
          const response = await fetch('/api/auth/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData }),
          });

          if (!response.ok) {
            throw new Error('Gagal melakukan otentikasi');
          }

          const userData = await response.json();
          setUser(userData);

        } catch (error) {
          console.error("Error otentikasi:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn("Aplikasi tidak berjalan di lingkungan Telegram.");
        setLoading(false);
      }
    };

    authenticateUser();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }
  
  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Gagal memuat data pengguna. Silakan buka melalui Telegram.</div>;
  }

  return (
    <BrowserRouter>
      <main style={{ paddingBottom: '70px' }}>
        <Routes>
          {/* Rute Utama */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/earning" element={<Earning />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/profile" element={<Profile user={user} />} />
          
          {/* Rute untuk halaman form baru */}
          <Route path="/advertise/new" element={<NewAdPage user={user} />} />

          {/* Rute Spesifik untuk Fitur Earning */}
          <Route path="/earning/view" element={<ViewAdsList />} />
          <Route path="/earning/view/:taskId" element={<WatchTaskPage user={user} />} />
        </Routes>
      </main>

      <BottomNav />
    </BrowserRouter>
  );
}

export default App;

