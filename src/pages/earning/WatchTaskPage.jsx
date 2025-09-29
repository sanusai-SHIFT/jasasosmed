// src/pages/earning/WatchTaskPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';

// === TAMBAHKAN BARIS INI UNTUK MEMUAT CSS ===
import 'react-simple-captcha/dist/logic/canvas-engine.css';
// ===========================================

const WatchTaskPage = ({ user }) => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  // ... (Sisa kode Anda tidak perlu diubah, biarkan sama seperti sebelumnya) ...
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [isCaptchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  useEffect(() => {
    fetch(`/api/tasks?id=${taskId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setTask(data[0]);
          setTimer(data[0].duration);
        } else {
          setError('Tugas tidak ditemukan.');
        }
        setLoading(false);
      });
  }, [taskId]);

  useEffect(() => {
    if (!isCaptchaVerified || timer === null || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCaptchaVerified, timer]);

  useEffect(() => {
    if (timer === 0) {
      handleCompleteTask();
    }
  }, [timer]);

  const handleVerifyCaptcha = (e) => {
    e.preventDefault();
    if (validateCaptcha(captchaInput) === true) {
      setCaptchaVerified(true);
      setError('');
    } else {
      setError('Captcha salah, silakan coba lagi.');
      setCaptchaInput('');
      loadCaptchaEnginge(6);
    }
  };
  
  const handleCompleteTask = async () => {
    try {
        const response = await fetch('/api/tasks/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.telegram_id, taskId: task.id, reward: task.reward })
        });
        if (!response.ok) throw new Error('Gagal mengirim hadiah.');
        setSuccess(`Selamat! Anda mendapatkan Rp ${task.reward}.`);
        setTimeout(() => navigate('/earning/view'), 3000);
    } catch (err) {
        setError('Terjadi kesalahan saat validasi.');
    }
  };

  if (loading) return <div style={{textAlign: 'center'}}>Memuat...</div>;
  if (error && !success) return <div style={{textAlign: 'center', color: 'red', marginTop: '20px'}}>{error}</div>
  if (success) return <div style={{textAlign: 'center', color: 'green', fontSize: '20px', marginTop: '50px'}}>{success}</div>

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '16px' }}>
        <h2>{task.title}</h2>
        {isCaptchaVerified && <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{timer} Detik</div>}
      </div>

      {!isCaptchaVerified ? (
        <form onSubmit={handleVerifyCaptcha} style={{ textAlign: 'center', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h3>Masukkan kode yang terlihat</h3>
          <div style={{margin: '15px 0'}}>
            <LoadCanvasTemplate />
          </div>
          <input 
            type="text" 
            placeholder="Ketik captcha di sini..."
            value={captchaInput} 
            onChange={(e) => setCaptchaInput(e.target.value)}
            style={{ width: '80%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
          />
          <button type="submit" style={{width: '85%', padding: '12px', border: 'none', backgroundColor: '#0d6efd', color: 'white', borderRadius: '4px', cursor: 'pointer'}}>
            Validasi
          </button>
        </form>
      ) : (
        <iframe 
          src={task.url} 
          title={task.title}
          style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '8px' }}
        />
      )}
    </div>
  );
};

export default WatchTaskPage;

