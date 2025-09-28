// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import komponen utama
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Earning from './pages/Earning';
import Advertise from './pages/Advertise';
import Profile from './pages/Profile';

// Import halaman-halaman baru untuk fitur Earning
import ViewAdsList from './pages/earning/ViewAdsList';
import WatchTaskPage from './pages/earning/WatchTaskPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... (kode otentikasi Anda yang sudah ada, tidak perlu diubah)
    const authenticateUser = async () => {
      if (window.Telegram && window.Telegram.WebApp) {
        // ... Logika fetch ke /api/auth/telegram ...
        try {
          const initData = window.Telegram.WebApp.initData;
          const response = await fetch('/api/auth/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData }),
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error("Gagal Otentikasi:", error);
        } finally {
          setLoading(false);
        }
      } else { setLoading(false); }
    };
    authenticateUser();
  }, []);
  
  if (loading) { return <div>Loading...</div>; }
  if (!user) { return <div>Gagal memuat data pengguna. Silakan buka melalui Telegram.</div>; }

  return (
    <BrowserRouter>
      <main style={{ paddingBottom: '70px' }}>
        <Routes>
          {/* Rute Utama */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/earning" element={<Earning />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/profile" element={<Profile user={user} />} />

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

