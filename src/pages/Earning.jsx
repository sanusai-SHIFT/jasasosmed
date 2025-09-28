// src/pages/Earning.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const Earning = () => {
  // Hanya contoh, nanti bisa dibuat dinamis
  const taskTypes = [
    { name: "Lihat Iklan View", path: "/earning/view", color: "#fff0c2" },
    { name: "Lihat Iklan Subscribe", path: "#", color: "#d4edda" },
    { name: "Lihat Iklan Follow", path: "#", color: "#d1ecf1" },
  ];

  const itemStyle = {
    padding: '16px',
    margin: '8px 16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    textAlign: 'center',
    textDecoration: 'none',
    color: 'black',
    display: 'block',
    fontWeight: '500'
  };

  return (
    <div style={{ padding: '10px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Pilih Jenis Tugas</h1>
      {taskTypes.map((task) => (
        <Link 
          key={task.name} 
          to={task.path} // Arahkan ke path yang sesuai
          style={{ ...itemStyle, backgroundColor: task.color }}
        >
          {task.name}
        </Link>
      ))}
    </div>
  );
};

export default Earning;

