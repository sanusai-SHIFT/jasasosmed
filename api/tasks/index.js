// api/tasks/index.js
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Hanya izinkan metode GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Ambil semua tugas yang statusnya 'active' dari tabel 'tasks'
    let { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false }); // Tampilkan yang terbaru di atas

    if (error) {
      throw error;
    }

    // Kirim data tugas sebagai response
    res.status(200).json(tasks);

  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

