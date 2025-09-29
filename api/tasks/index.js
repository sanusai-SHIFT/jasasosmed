// api/tasks/index.js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // --- BAGIAN GET (TIDAK BERUBAH) ---
  if (req.method === 'GET') {
    try {
      const { type, id } = req.query;
      let query = supabase.from('tasks').select('*');
      if (id) {
        query = query.eq('id', id);
      } else {
        query = query.eq('status', 'active');
        if (type) {
          query = query.eq('task_type', type);
        }
        query = query.order('created_at', { ascending: false });
      }
      let { data: tasks, error } = await query;
      if (error) throw error;
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }

  // --- BAGIAN POST (BARU) ---
  if (req.method === 'POST') {
    try {
      const { title, url, duration, reward, userId } = req.body;
      const cost = reward; // Untuk saat ini, biaya = hadiah

      // 1. Panggil fungsi untuk mengurangi saldo
      const { data: deductionSuccess, error: rpcError } = await supabase.rpc('deduct_from_wallet', {
        user_id_param: userId,
        cost_param: cost
      });

      if (rpcError) throw rpcError;
      
      // 2. Jika saldo tidak cukup, kirim error
      if (!deductionSuccess) {
        return res.status(402).json({ error: 'Saldo Anda tidak mencukupi.' });
      }

      // 3. Jika saldo cukup, masukkan iklan baru ke tabel tasks
      const { data: newTask, error: insertError } = await supabase
        .from('tasks')
        .insert({
          title: title,
          url: url,
          duration: duration,
          reward: reward,
          task_type: 'view', // Hardcode untuk 'view'
          // Anda bisa menambahkan 'advertiser_id: userId' jika perlu
        })
        .select()
        .single();
      
      if (insertError) throw insertError;

      return res.status(201).json({ message: 'Iklan berhasil dibuat!', task: newTask });

    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }

  // Jika metode bukan GET atau POST
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

