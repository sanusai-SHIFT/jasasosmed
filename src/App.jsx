// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import komponen
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Earning from './pages/Earning';
import Advertise from './pages/Advertise';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null); // State untuk menyimpan data user setelah login
  const [loading, setLoading] = useState(true); // State untuk menunjukkan proses loading

  useEffect(() => {
    const authenticateUser = async () => {
      // Cek apakah aplikasi berjalan di dalam Telegram
      if (window.Telegram && window.Telegram.WebApp) {
        const initData = window.Telegram.WebApp.initData;
        
        // Jika tidak ada initData, hentikan proses
        if (!initData) {
          console.error("InitData tidak ditemukan.");
          setLoading(false);
          // Di sini Anda bisa menampilkan pesan error kepada pengguna
          return;
        }

        try {
          // Kirim initData ke backend Anda untuk divalidasi
          const response = await fetch('/api/auth/telegram', { // Endpoint backend
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ initData }),
          });

          if (!response.ok) {
            throw new Error('Gagal melakukan otentikasi');
          }

          const userData = await response.json();
          setUser(userData); // Simpan data pengguna yang diterima dari backend

        } catch (error) {
          console.error("Error otentikasi:", error);
          // Tampilkan pesan error jika perlu
        } finally {
          setLoading(false); // Selesai loading, baik berhasil maupun gagal
        }
      } else {
        console.warn("Aplikasi tidak berjalan di lingkungan Telegram.");
        setLoading(false); // Tidak di lingkungan Telegram, lanjutkan tanpa user
      }
    };

    authenticateUser();
  }, []); // [] berarti useEffect ini hanya berjalan sekali saat komponen dimuat

  // Tampilkan loading spinner saat proses otentikasi
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }
  
  // Jika tidak ada user setelah loading (error atau bukan dari Telegram)
  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Gagal memuat data pengguna. Silakan buka melalui Telegram.</div>;
  }

  // Jika otentikasi berhasil, tampilkan aplikasi
  return (
    <BrowserRouter>
      <main>
        {/* Sekarang Anda bisa meneruskan data 'user' ke halaman yang butuh */}
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/earning" element={<Earning />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
      </main>

      <BottomNav />
    </BrowserRouter>
  );
}

export default App;

