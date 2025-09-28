// api/tasks/index.js (Update)
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') { return res.status(405).json({ error: 'Method Not Allowed' }); }

  try {
    const { type, id } = req.query; // Tambahkan 'id'
    let query = supabase.from('tasks').select('*');

    if (id) {
        // Jika ada ID, ambil satu tugas saja
        query = query.eq('id', id);
    } else {
        // Jika tidak ada ID, ambil berdasarkan tipe
        query = query.eq('status', 'active');
        if (type) {
          query = query.eq('task_type', type);
        }
        query = query.order('created_at', { ascending: false });
    }
    
    let { data: tasks, error } = await query;
    if (error) throw error;

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

