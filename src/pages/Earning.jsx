// src/pages/Earning.jsx
import React, { useState, useEffect } from 'react';

const Earning = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect akan berjalan sekali saat komponen dimuat
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Gagal mengambil data tugas');
        }
        const data = await response.json();
        setTasks(data); // Simpan data tugas ke dalam state
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // Hentikan loading, baik berhasil maupun gagal
      }
    };

    fetchTasks();
  }, []);

  const taskItemStyle = {
    backgroundColor: 'white',
    padding: '16px',
    margin: '8px 16px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const rewardStyle = {
    backgroundColor: '#e9f5e9',
    color: '#28a745',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
  };

  // Tampilkan pesan loading saat data sedang diambil
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '40px' }}>Memuat tugas...</div>;
  }

  return (
    <div style={{ padding: '10px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Pusat Pendapatan</h1>
      
      {tasks.length > 0 ? (
        tasks.map(task => (
          <div key={task.id} style={taskItemStyle}>
            <span>{task.title}</span>
            <span style={rewardStyle}>+Rp {task.reward}</span>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#6c757d' }}>
          Saat ini belum ada tugas yang tersedia.
        </div>
      )}
    </div>
  );
};

export default Earning;

