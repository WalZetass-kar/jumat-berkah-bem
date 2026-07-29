import React, { useState } from 'react';
import { Newspaper, Plus, Trash2, Edit3, Eye, Calendar, User, Tag, Sparkles, Image as ImageIcon } from 'lucide-react';
import { NewsArticle } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface AdminNewsTabProps {
  articles: NewsArticle[];
  onAddArticle: (article: Omit<NewsArticle, 'id'>, imageFile?: File | null) => void;
  onDeleteArticle: (id: string) => void;
}

export const AdminNewsTab: React.FC<AdminNewsTabProps> = ({
  articles,
  onAddArticle,
  onDeleteArticle,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NewsArticle['category']>('Kegiatan BEM');
  const [author, setAuthor] = useState('Humas BEM LP3I');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];
      try {
        const compressedBlob = await compressImage(originalFile, 1200, 0.8);
        const compressedFile = new File([compressedBlob], originalFile.name, { type: 'image/jpeg' });
        setImageFile(compressedFile);
      } catch (err) {
        setImageFile(originalFile);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !excerpt) return;

    const newArticle: Omit<NewsArticle, 'id'> = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      author,
      excerpt,
      content,
      imageUrl: imageUrl || undefined,
      publishedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      views: 0
    };

    onAddArticle(newArticle, imageFile);
    setIsModalOpen(false);

    // Reset Form
    setTitle('');
    setExcerpt('');
    setContent('');
    setImageUrl('');
    setImageFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Newspaper className="w-3.5 h-3.5" />
            Manajemen Konten Publik
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Kelola Berita & Publikasi BEM
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl">
            Buat dan terbitkan berita, pengumuman kegiatan, artikel serta dokumentasi program langsung dari mana saja untuk dibaca publik.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Buat Berita Baru</span>
        </button>
      </div>

      {/* Articles Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-emerald-400" />
            Daftar Berita Terbit ({articles.length})
          </h3>
        </div>

        {articles.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Newspaper className="w-10 h-10 mx-auto text-slate-600" />
            <p className="font-bold text-slate-400 text-sm">Belum ada berita terbit.</p>
            <p className="text-xs text-slate-500">Klik "+ Buat Berita Baru" untuk menambahkan berita pertama BEM LP3I.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="p-4">Gambar</th>
                  <th className="p-4">Judul Berita</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Penulis</th>
                  <th className="p-4">Tanggal Terbit</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {articles.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-800">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white text-sm line-clamp-1">{item.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.excerpt}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-semibold">{item.author}</td>
                    <td className="p-4 text-slate-400">{item.publishedAt}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onDeleteArticle(item.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer border border-rose-500/30"
                        title="Hapus Berita"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add News */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 text-white shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-emerald-400" />
                Buat Berita / Artikel Baru
              </h3>
              <p className="text-slate-400 text-xs">
                Tulis berita terbaru mengenai aktivitas BEM LP3I Pekanbaru atau program Jumat Berkah.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Judul Berita *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: BEM LP3I Pekanbaru Salurkan 200 Porsi Nasi Kotak"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Kategori *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Kegiatan BEM">Kegiatan BEM</option>
                    <option value="Jumat Berkah">Jumat Berkah</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Artikel">Artikel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Penulis *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Ringkasan Singkat (Excerpt) *</label>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk preview di kartu berita..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Isi Berita Lengkap *</label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan berita lengkap di sini..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Upload Foto / Gambar Utama</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-slate-950 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Atau masukkan URL gambar langsung</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  Terbitkan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
