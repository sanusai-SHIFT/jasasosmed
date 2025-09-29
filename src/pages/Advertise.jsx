// src/pages/Advertise.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Advertise = () => {
  const itemStyle = {
    backgroundColor: 'white',
    padding: '16px 20px',
    margin: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  };
  
  return (
    <div style={{ padding: '10px' }}>
      <h1 style={{ textAlign: 'center' }}>Menu Advertiser</h1>
      <Link to="/advertise/new" style={{ ...itemStyle, backgroundColor: '#0d6efd' }}>
        + Buat Iklan Baru
      </Link>
      {/* Tambahkan menu lain di sini nanti */}
    </div>
  );
};

export default Advertise;

