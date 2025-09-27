// src/pages/Earning.jsx
import React from 'react';

const Earning = () => {
  const earningTasks = [
    "Lihat Iklan View", "Lihat Iklan View Orisinal", "Lihat Iklan Subscribe",
    "Lihat Iklan Follow", "Lihat Iklan Like", "Lihat Iklan Komentar",
    "Lihat Iklan Posting", "Lihat Iklan Download", "Lihat Iklan Survey",
    "Lihat Iklan Registrasi", "Lihat Iklan Polling", "Lihat Iklan Klik",
    "Lihat Iklan Langganan"
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
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Pusat Pendapatan</h1>
      {earningTasks.map((task, index) => (
        <div key={index} style={itemStyle}>
          {task}
        </div>
      ))}
    </div>
  );
};

export default Earning;

