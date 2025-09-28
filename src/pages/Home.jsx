// src/pages/Home.jsx
import React from 'react';

// Terima 'user' sebagai props
const Home = ({ user }) => {
  // Gunakan nama user jika ada, jika tidak gunakan sapaan umum
  const welcomeMessage = user ? `Selamat datang ${user.first_name}` : "Selamat datang";

  const announcements = [
    { id: 1, title: "Group Telegram Jasaview.ID", content: "Untuk mendapatkan informasi terbaru atau ingin bertanya tanya silahkan ikuti Group Telegram kami.", link: "https://t.me/example" },
    { id: 2, title: "Panduan Klik Iklan", content: "Jasaview.id menyediakan layanan baru untuk viewers agar bisa mendapatkan penghasilan yaitu Klik Iklan.", link: "/panduan/klik-iklan" },
    { id: 3, title: "Pengumuman Penting!!", content: "Member dilarang memiliki lebih dari 1 Akun. Bila ketahuan maka akan dibekukan atau dinonaktifkan.", link: null },
  ];
  const referralLink = "https://www.jasaview.id/hw92z8bv";

  const cardStyle = {
    backgroundColor: 'white',
    padding: '16px',
    margin: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  return (
    <div style={{ padding: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>{welcomeMessage}</h2>
      
      {announcements.map(item => (
        <div key={item.id} style={cardStyle}>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
          {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer">Pelajari lebih lanjut</a>}
        </div>
      ))}

      <div style={cardStyle}>
        <h3>Link Refferal</h3>
        <input type="text" readOnly value={referralLink} style={{ width: 'calc(100% - 10px)', padding: '5px' }} />
      </div>
    </div>
  );
};

export default Home;

