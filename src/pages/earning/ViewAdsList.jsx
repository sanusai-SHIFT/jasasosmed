// src/pages/earning/ViewAdsList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ViewAdsList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil hanya tugas dengan tipe 'view'
    fetch('/api/tasks?type=view')
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ textAlign: 'center' }}>Memuat iklan...</div>;

  return (
    <div style={{ padding: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>Iklan View Tersedia</h2>
      {tasks.length > 0 ? tasks.map(task => (
        <Link 
          to={`/earning/view/${task.id}`} 
          key={task.id}
          style={{
            display: 'block', textDecoration: 'none', color: 'inherit',
            margin: '16px', padding: '16px', backgroundColor: 'white',
            borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{task.title}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555' }}>
            <span>Durasi: {task.duration} Detik</span>
            <span style={{ color: '#28a745', fontWeight: 'bold' }}>Rp. {task.reward}</span>
          </div>
        </Link>
      )) : <p style={{ textAlign: 'center' }}>Tidak ada iklan view saat ini.</p>}
    </div>
  );
};

export default ViewAdsList;

