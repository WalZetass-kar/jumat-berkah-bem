import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name, phone, role, status } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, Nama, dan Sandi wajib diisi.' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return res.status(500).json({
        error: 'Konfigurasi belum lengkap. Anda wajib menambahkan SUPABASE_SERVICE_ROLE_KEY di pengaturan Environment Variables Vercel agar fitur auto-create sandi berfungsi.',
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // 1. Buat User di sistem Autentikasi Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto aktif tanpa perlu verifikasi email
    });

    if (authError) {
      return res.status(400).json({ error: `Gagal membuat kredensial login: ${authError.message}` });
    }

    // 2. Simpan profil lengkap ke tabel admin_users
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('admin_users')
      .insert([
        {
          id: authData.user.id, // Sinkronkan ID Auth dengan ID Profil
          name,
          email,
          phone,
          role,
          status: status || 'Aktif',
        },
      ])
      .select();

    if (profileError) {
      // Jika gagal simpan profil, hapus kembali user auth-nya agar tidak ada data yatim piatu (rollback)
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: `Gagal menyimpan profil tabel: ${profileError.message}` });
    }

    return res.status(200).json({ admin: profileData[0] });
  } catch (err: any) {
    console.error('Error in /api/create-admin:', err);
    return res.status(500).json({
      error: 'Terjadi kesalahan sistem: ' + (err.message || 'Error tidak diketahui'),
    });
  }
}
