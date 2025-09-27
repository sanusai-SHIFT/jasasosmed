// src/pages/Profile.jsx
import React from 'react';

const Profile = () => {
  // Data ini nantinya akan diambil dari database/API
  const userProfile = {
    name: "Sukron Alfan",
    email: "sukron.alfan@example.com",
    walletBalance: 150000, // dalam Rupiah
    bankAccount: "BCA - 1234567890"
  };

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

  return (
    <div style={{ padding: '10px' }}>
      <div style={profileCard}>
        <h2>{userProfile.name}</h2>
        <p>Saldo Dompet: Rp {userProfile.walletBalance.toLocaleString('id-ID')}</p>
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

