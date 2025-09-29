// src/pages/advertise/NewAdPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewAdPage = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', url: '', duration: 10 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Harga per detik (misal: Rp 5)
  const pricePerSecond = 5;
  const reward = formData.duration * pricePerSecond;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        reward: reward,
        userId: user.telegram_id,
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      setMessage({ type: 'success', text: 'Iklan berhasil dibuat!' });
      setTimeout(() => navigate('/advertise'), 2000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Terjadi kesalahan.' });
    }
  };

  const formStyle = { padding: '20px', backgroundColor: 'white', borderRadius: '8px', margin: '16px' };
  const inputStyle = { width: 'calc(100% - 22px)', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Buat Iklan View Baru</h1>
      <form style={formStyle} onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Judul Iklan</label>
          <input style={inputStyle} type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Contoh: Kunjungi Website Keren Kami" required />
        </div>
        <div>
          <label style={labelStyle}>URL Website</label>
          <input style={inputStyle} type="url" name="url" value={formData.url} onChange={handleChange} placeholder="https://example.com" required />
        </div>
        <div>
          <label style={labelStyle}>Durasi Tonton (Detik)</label>
          <select style={inputStyle} name="duration" value={formData.duration} onChange={handleChange}>
            <option value="5">5 Detik</option>
            <option value="10">10 Detik</option>
            <option value="15">15 Detik</option>
            <option value="30">30 Detik</option>
          </select>
        </div>
        <div style={{ padding: '15px', margin: '10px 0', border: '1px dashed #0d6efd', borderRadius: '4px', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>Total Biaya: <strong>Rp {reward.toLocaleString('id-ID')}</strong></p>
          <small>(Hadiah untuk viewer)</small>
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', border: 'none', backgroundColor: '#28a745', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Memproses...' : 'Pasang Iklan Sekarang'}
        </button>
        {message.text && <p style={{ color: message.type === 'error' ? 'red' : 'green', textAlign: 'center', marginTop: '15px' }}>{message.text}</p>}
      </form>
    </div>
  );
};

export default NewAdPage;

