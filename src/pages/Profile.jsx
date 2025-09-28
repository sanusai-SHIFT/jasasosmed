// src/pages/Profile.jsx
import React from 'react';

// Terima 'user' sebagai props dari App.jsx
const Profile = ({ user }) => {
  const profileMenu = [
    "Edit Info", "Ganti Password", "Refferal Saya", "Akun Bank", "Dompet"
  ];
  
  const itemStyle = {
    backgroundColor: 'white',
    padding: '12px 16px',
    margin: '8px 16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    textAlign: 'center'
  };
  
  const profileCard = {
    backgroundColor: '#0d6efd',
    color: 'white',
    padding: '20px',
    margin: '16px',
    borderRadius: '10px',
    textAlign: 'center'
  };

  // Tampilkan loading atau pesan jika data user belum ada
  if (!user) {
    return <div>Memuat data profil...</div>;
  }

  // Tampilkan data asli dari database
  return (
    <div style={{ padding: '10px' }}>
      <div style={profileCard}>
        {/* Gunakan data 'user' dari props */}
        <h2>{user.first_name || user.username}</h2>
        <p>Saldo Dompet: Rp {user.wallet_balance.toLocaleString('id-ID')}</p>
        <small>ID Telegram: {user.telegram_id}</small>
      </div>

      {profileMenu.map((menu, index) => (
         <div key={index} style={itemStyle}>
          {menu}
        </div>
      ))}
    </div>
  );
};

export default Profile;

