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

