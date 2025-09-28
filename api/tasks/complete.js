// api/tasks/complete.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId, taskId, reward } = req.body;

    if (!userId || !taskId || !reward) {
      return res.status(400).json({ error: 'Data tidak lengkap.' });
    }

    // Gunakan RPC (Remote Procedure Call) di Supabase untuk increment balance
    // Ini lebih aman dari race condition daripada SELECT lalu UPDATE
    const { error } = await supabase.rpc('add_to_wallet', {
      user_id_param: userId,
      amount_param: reward
    });

    if (error) {
      throw new Error(`Gagal memperbarui saldo: ${error.message}`);
    }

    // Di sini Anda juga bisa menambahkan logika untuk mencatat transaksi
    // atau menandai bahwa user sudah menyelesaikan tugas ini.

    res.status(200).json({ message: 'Hadiah berhasil ditambahkan!' });

  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}


