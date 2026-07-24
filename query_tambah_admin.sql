-- Kueri ini digunakan untuk membuat tabel khusus admin di Supabase
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  role text DEFAULT 'admin',
  status text DEFAULT 'Aktif',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan keamanan tingkat baris (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses: Hanya admin yang login yang bisa mengubah data
CREATE POLICY "Enable all actions for authenticated users only" ON public.admin_users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Kebijakan Akses: Semua orang bisa melihat data admin (opsional)
CREATE POLICY "Enable read access for all users" ON public.admin_users
  FOR SELECT
  TO public
  USING (true);

-- Menambahkan admin pertama secara default
INSERT INTO public.admin_users (name, email, role, phone, status) 
VALUES ('Administrator', 'admin@lp3i.ac.id', 'Koordinator Utama', '081234567890', 'Aktif')
ON CONFLICT (email) DO NOTHING;
