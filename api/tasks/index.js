// api/tasks/index.js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { type } = req.query; // Ambil query 'type' dari URL
    let query = supabase.from('tasks').select('*').eq('status', 'active');

    // Jika ada filter type, tambahkan ke query
    if (type) {
      query = query.eq('task_type', type);
    }

    let { data: tasks, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

