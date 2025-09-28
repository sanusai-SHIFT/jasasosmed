// api/auth/telegram.js
import crypto from 'crypto';
import { Client } from 'pg'; // <-- GANTI dari Pool ke Client

// Menambahkan log unik untuk verifikasi deploy
console.log("--- [DEBUG v4] Kode SSL FIX dengan Direct Client sedang diinisialisasi ---");

// Fungsi validateTelegramData tetap sama
function validateTelegramData(initData, botToken) {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');
    const keys = Array.from(params.keys()).sort();
    const dataCheckString = keys.map(key => `${key}=${params.get(key)}`).join('\n');
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(data-check-string).digest('hex');
    return hmac === hash;
}

export default async function handler(req, res) {
  console.log("--- [DEBUG v4] Handler dieksekusi ---");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Buat instance Client baru di setiap request
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

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

    await client.connect(); // <-- KONEKSI LANGSUNG
    console.log("[v4] Berhasil terhubung ke database via Direct Client.");
    let userRecord;

    try {
      const { rows } = await client.query('SELECT * FROM users WHERE telegram_id = $1', [telegram_id]);
      
      if (rows.length > 0) {
        userRecord = rows[0];
        console.log(`[v4] User ditemukan: ${userRecord.first_name}`);
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
        console.log(`[v4] User baru berhasil dibuat: ${userRecord.first_name}`);
      }
    } finally {
      await client.end(); // <-- TUTUP KONEKSI LANGSUNG
      console.log("[v4] Koneksi Direct Client ditutup.");
    }

    res.status(200).json(userRecord);

  } catch (error) {
    console.error('!!! SERVER ERROR DI DALAM HANDLER (v4):', error);
    // Jika koneksi masih terbuka saat error, coba tutup
    if (client._connected) {
      await client.end();
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

