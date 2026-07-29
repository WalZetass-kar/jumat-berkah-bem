-- =========================================================================
-- QUERY SQL TABEL BERITA BEM (news_articles) FOR SUPABASE
-- Salin dan Jalankan di SQL Editor Dashboard Supabase Anda
-- =========================================================================

-- 1. Buat Tabel news_articles
CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Kegiatan BEM', 'Jumat Berkah', 'Pengumuman', 'Prestasi', 'Artikel')),
    author TEXT NOT NULL DEFAULT 'Humas BEM LP3I',
    image_url TEXT,
    published_at TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan Read (Publik & Siapa Saja Bisa Membaca Berita)
CREATE POLICY "Semua orang bisa melihat berita" 
ON public.news_articles 
FOR SELECT 
USING (true);

-- 4. Kebijakan Insert/Update/Delete (Hanya Admin Terautentikasi)
CREATE POLICY "Admin dapat menambah berita" 
ON public.news_articles 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin dapat mengedit berita" 
ON public.news_articles 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin dapat menghapus berita" 
ON public.news_articles 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 5. Contoh Data Berita Awal (Optional / Demo)
INSERT INTO public.news_articles (title, slug, content, excerpt, category, author, published_at)
VALUES 
(
  'BEM LP3I Pekanbaru Sukses Gelar Penyaluran 150 Porsi Nasi Kotak Jumat Berkah',
  'bem-lp3i-penyaluran-nasi-kotak',
  'Alhamdulillah, kegiatan penyaluran Jumat Berkah BEM LP3I Pekanbaru pekan ini berjalan lancar. Sebanyak 150 porsi nasi kotak telah dibagikan kepada jamaah shalat jumat, petugas kebersihan, pengemudi ojek online, dan panti asuhan di sekitar kampus Pekanbaru.',
  'Kegiatan penyaluran donasi umat berjalan lancar di Masjid Agung Al-Falah dan panti asuhan setempat.',
  'Jumat Berkah',
  'Humas BEM LP3I',
  '24 Juli 2026'
),
(
  'Pelantikan Pengurus BEM Kabinet Luminaire Periode 2026/2027',
  'pelantikan-bem-kabinet-luminaire',
  'Selamat dan sukses atas dilantiknya pengurus BEM LP3I Pekanbaru Kabinet Luminaire periode 2026/2027. Dengan semangat solidaritas dan kebersamaan, BEM berkomitmen menghadirkan program kerja yang berdampak nyata bagi mahasiswa dan masyarakat.',
  'Pengurus BEM LP3I Pekanbaru resmi dilantik untuk mengemban amanah selama satu periode ke depan.',
  'Kegiatan BEM',
  'Pengurus BEM',
  '15 Juli 2026'
);
