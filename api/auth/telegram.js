// api/auth/telegram.js
import crypto from 'crypto';
// Kita tidak lagi butuh 'pg', tapi kita butuh Service Key Supabase
// Pastikan Anda sudah menambahkan SUPABASE_SERVICE_ROLE_KEY di Vercel Env Vars
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Admin Client di sisi server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("--- [DEBUG v6] Kode Final dengan Supabase Client ---");


// Fungsi validateTelegramData (tidak berubah, dan typo sudah benar)
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

    // --- LOGIKA SUPABASE DIMULAI DI SINI ---
    
    // 1. Cek apakah user sudah ada
    let { data: userRecord, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegram_id)
      .single(); // .single() akan mengembalikan satu objek atau null

    if (selectError && selectError.code !== 'PGRST116') {
      // Abaikan error 'PGRST116' (Not Found), tapi tangani error lain
      throw selectError;
    }
    
    // 2. Jika user tidak ditemukan, buat user baru
    if (!userRecord) {
      console.log(`User dengan ID ${telegram_id} tidak ditemukan, membuat user baru...`);
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          { 
            telegram_id: telegram_id,
            first_name: userData.first_name || null,
            last_name: userData.last_name || null,
            username: userData.username || null,
            language_code: userData.language_code || 'en',
            is_premium: userData.is_premium || false,
            wallet_balance: 0
          },
        ])
        .select()
        .single();
      
      if (insertError) {
        throw insertError;
      }
      userRecord = newUser;
      console.log(`[v6] User baru berhasil dibuat: ${userRecord.first_name}`);
    } else {
      console.log(`[v6] User ditemukan: ${userRecord.first_name}`);
    }

    res.status(200).json(userRecord);

  } catch (error) {
    console.error('!!! SERVER ERROR DI DALAM HANDLER (v6):', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

