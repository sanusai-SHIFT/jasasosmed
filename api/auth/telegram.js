// api/auth/telegram.js
import crypto from 'crypto';
import { Pool } from 'pg';

let pool;
// Menambahkan log unik untuk verifikasi deploy
console.log("--- [DEBUG v3] Kode SSL FIX dengan sslmode=no-verify sedang diinisialisasi ---");


try {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error("Variabel POSTGRES_URL tidak ditemukan.");
  }
  
  // === PERUBAHAN UTAMA: MENAMBAHKAN PARAMETER LANGSUNG ===
  // Ini akan "memaksa" koneksi untuk tidak memverifikasi sertifikat SSL
  const dbUrl = `${connectionString}?sslmode=no-verify`;

  pool = new Pool({
    connectionString: dbUrl,
  });
  
  console.log("Koneksi pool database berhasil diinisialisasi dengan sslmode=no-verify.");

} catch (error) {
  console.error("!!! GAGAL INISIALISASI DATABASE POOL:", error.message);
}

// ... (Fungsi validateTelegramData tetap sama, tidak perlu diubah)
function validateTelegramData(initData, botToken) {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');
    const keys = Array.from(params.keys()).sort();
    const dataCheckString = keys.map(key => `${key}=${params.get(key)}`).join('\n');
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    return hmac === hash;
}

export default async function handler(req, res) {
  // Menambahkan log unik di dalam handler
  console.log("--- [DEBUG v3] Handler dieksekusi ---");

  if (!pool) {
    console.error("Handler dieksekusi tetapi pool database tidak tersedia.");
    return res.status(500).json({ error: 'Konfigurasi database bermasalah.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { initData } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!initData || !BOT_TOKEN) {
      return res.status(400).json({ error: 'initData and Bot Token are required' });
    }

    const isValid = validateTelegramData(initData, BOT_TOKEN);
    if (!isValid) {
      return res.status(403).json({ error: 'Invalid data from Telegram' });
    }

    const params = new URLSearchParams(initData);
    const userData = JSON.parse(params.get('user'));
    const telegram_id = userData.id;

    const client = await pool.connect(); // Baris ini yang error
    console.log("Berhasil terhubung ke database.");
    let userRecord;

    try {
      const { rows } = await client.query('SELECT * FROM users WHERE telegram_id = $1', [telegram_id]);
      
      if (rows.length > 0) {
        userRecord = rows[0];
        console.log(`User ditemukan: ${userRecord.first_name}`);
      } else {
        const newUserQuery = `
          INSERT INTO users (telegram_id, first_name, last_name, username, language_code, is_premium, wallet_balance)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `;
        const newUserValues = [
          telegram_id, userData.first_name || null, userData.last_name || null,
          userData.username || null, userData.language_code || 'en', userData.is_premium || false, 0
        ];
        const newResult = await client.query(newUserQuery, newUserValues);
        userRecord = newResult.rows[0];
        console.log(`User baru berhasil dibuat: ${userRecord.first_name}`);
      }
    } finally {
      client.release();
    }

    res.status(200).json(userRecord);

  } catch (error) {
    console.error('!!! SERVER ERROR DI DALAM HANDLER (v3):', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

