import React, { useState } from 'react';
import { Newspaper, Calendar, User, ArrowRight, Tag, Search, Sparkles, Share2 } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsPublicSectionProps {
  articles: NewsArticle[];
}

export const NewsPublicSection: React.FC<NewsPublicSectionProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const categories = ['Semua', 'Kegiatan BEM', 'Jumat Berkah', 'Pengumuman', 'Prestasi', 'Artikel'];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="berita-bem" className="py-[120px] bg-[#F8FAFC] text-slate-900 border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
            <Newspaper className="w-4 h-4 text-emerald-600" />
            <span>Kabar & Informasi Terkini</span>
          </div>
          <h2 className="text-3xl sm:text-[40px] font-black tracking-tight text-slate-900 leading-tight">
            Berita & Kabar <span className="text-emerald-600">BEM LP3I</span>
          </h2>
          <p className="text-slate-600 text-base font-medium">
            Ikuti update kegiatan mahasiswa, informasi donasi Jumat Berkah, serta pengumuman resmi dari Kabinet BEM.
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12 bg-white p-5 rounded-[20px] border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
            />
          </div>
        </div>

        {/* News Grid (3 Columns) */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[20px] border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <Newspaper className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-base">Belum ada berita dalam kategori ini.</p>
            <p className="text-slate-500 text-xs mt-1">Coba gunakan kata kunci pencarian lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => {
                  window.location.href = `/berita/${article.slug || article.id}`;
                }}
                className="bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
              >
                {/* Thumbnail Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                  <img
                    src={article.imageUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-slate-500 text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        {article.publishedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4 text-emerald-600" />
                        {article.author}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 font-normal">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail Berita */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative text-white shadow-2xl">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            {activeArticle.imageUrl && (
              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-slate-950">
                <img src={activeArticle.imageUrl} alt={activeArticle.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                  {activeArticle.category}
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {activeArticle.publishedAt}
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  {activeArticle.author}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black leading-tight text-white">
                {activeArticle.title}
              </h2>
            </div>

            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line border-t border-slate-800 pt-4">
              {activeArticle.content}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  const shareText = `*${activeArticle.title}*\n\n${activeArticle.excerpt}\n\nBaca Berita Lengkap di BEM LP3I Pekanbaru: ${window.location.origin}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30"
              >
                <Share2 className="w-4 h-4" />
                Bagikan ke WhatsApp
              </button>

              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
