// src/pages/earning/WatchTaskPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import library hCaptcha
import HCaptcha from '@hcaptcha/react-hcaptcha';

const WatchTaskPage = ({ user }) => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const captchaRef = useRef(null); // Ref untuk mengakses komponen HCaptcha

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(null);
  const [isCaptchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Ambil Site Key dari environment variable
  const hcaptchaSiteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;

  useEffect(() => {
    fetch(`/api/tasks?id=${taskId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setTask(data[0]);
          setTimer(data[0].duration);
        } else { setError('Tugas tidak ditemukan.'); }
        setLoading(false);
      });
  }, [taskId]);

  useEffect(() => {
    if (!isCaptchaVerified || timer === null || timer <= 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [isCaptchaVerified, timer]);

  useEffect(() => {
    if (timer === 0) {
      handleCompleteTask();
    }
  }, [timer]);

  const handleCaptchaVerify = (token) => {
    // hCaptcha memberikan 'token' jika berhasil.
    // Untuk aplikasi sederhana ini, kita anggap token ini sebagai bukti verifikasi.
    if (token) {
      setCaptchaVerified(true);
      setError('');
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
        <h2>{task?.title || 'Memuat...'}</h2>
        {isCaptchaVerified && <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{timer} Detik</div>}
      </div>

      {!isCaptchaVerified ? (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Silakan verifikasi Anda bukan robot</h3>
          <div style={{ margin: '15px 0' }}>
            <HCaptcha
              sitekey={hcaptchaSiteKey}
              onVerify={handleCaptchaVerify}
              ref={captchaRef}
            />
          </div>
        </div>
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

