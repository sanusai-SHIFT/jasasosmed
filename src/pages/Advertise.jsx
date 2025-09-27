// src/pages/Advertise.jsx
import React from 'react';

const Advertise = () => {
    const advertiserMenu = [
    "Buat Iklan", "Daftar Iklan View", "Daftar Iklan View Orisinal", 
    "Daftar Iklan Subscribe", "Daftar Iklan Follow", "Daftar Iklan Like", 
    "Daftar Iklan Komentar", "Daftar Iklan Posting", "Daftar Iklan Download",
    "Daftar Iklan Survey", "Daftar Iklan Registrasi", "Daftar Iklan Polling",
    "Daftar Iklan Langganan", "Deposit Dana", "Panduan Advertiser"
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
  
  return (
    <div style={{ padding: '10px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Advertiser</h1>
      {advertiserMenu.map((menu, index) => (
        <div key={index} style={itemStyle}>
          {menu}
        </div>
      ))}
    </div>
  );
};

export default Advertise;

