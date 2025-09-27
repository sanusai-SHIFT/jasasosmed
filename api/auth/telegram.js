// api/auth/telegram.js
import crypto from 'crypto';
import { Pool } from 'pg'; // Ganti dengan library database Anda

// Konfigurasi koneksi database dari environment variables
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Vercel akan menyediakan ini
});

// Fungsi untuk memvalidasi data dari Telegram
function validateTelegramData(initData, botToken) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash'); // Hapus hash dari parameter untuk validasi

  // Urutkan key secara alfabetis
  const keys = Array.from(params.keys()).sort();
  
  // Buat data-check-string
  const dataCheckString = keys.map(key => `${key}=${params.get(key)}`).join('\n');

  // Buat secret key dari Bot Token
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();

  // Buat hash dari data-check-string
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  // Bandingkan hash kita dengan hash dari Telegram
  return hmac === hash;
}


// Ini adalah handler utama untuk serverless function
export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { initData } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!initData || !BOT_TOKEN) {
      return res.status(400).json({ error: 'initData and Bot Token are required' });
    }

    // 1. Validasi data
    const isValid = validateTelegramData(initData, BOT_TOKEN);
    if (!isValid) {
      return res.status(403).json({ error: 'Invalid data from Telegram' });
    }

    // 2. Ekstrak informasi pengguna
    const params = new URLSearchParams(initData);
    const userData = JSON.parse(params.get('user'));
    const telegram_id = userData.id;

    // 3. Cek ke database
    const client = await pool.connect();
    let userRecord;

    try {
      const { rows } = await client.query('SELECT * FROM users WHERE telegram_id = $1', [telegram_id]);
      
      if (rows.length > 0) {
        // 5. Jika pengguna sudah ada, ambil datanya
        userRecord = rows[0];
        console.log(`User ditemukan: ${userRecord.first_name}`);

      } else {
        // 4. Jika belum ada, buat pengguna baru
        const newUserQuery = `
          INSERT INTO users (telegram_id, first_name, last_name, username, language_code, is_premium, wallet_balance)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `;
        const newUserValues = [
          telegram_id,
          userData.first_name || null,
          userData.last_name || null,
          userData.username || null,
          userData.language_code || 'en',
          userData.is_premium || false,
          0 // Saldo awal dompet
        ];
        const newResult = await client.query(newUserQuery, newUserValues);
        userRecord = newResult.rows[0];
        console.log(`User baru dibuat: ${userRecord.first_name}`);
      }
    } finally {
      client.release(); // Selalu lepaskan client setelah selesai
    }

    // 6. Kirimkan kembali data pengguna ke frontend
    res.status(200).json(userRecord);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

