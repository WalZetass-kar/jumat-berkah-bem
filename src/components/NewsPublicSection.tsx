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
    <section id="berita-bem" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Newspaper className="w-4 h-4 text-emerald-400" />
            Kabar & Informasi Terkini
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Berita & Kabar <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">BEM LP3I</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            Ikuti update kegiatan mahasiswa, informasi donasi Jumat Berkah, serta pengumuman resmi dari Kabinet BEM.
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 backdrop-blur-md">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* News Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/40 rounded-3xl border border-slate-800">
            <Newspaper className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold text-base">Belum ada berita dalam kategori ini.</p>
            <p className="text-slate-500 text-xs mt-1">Coba gunakan kata kunci pencarian lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => {
                  window.location.href = `/berita/${article.slug || article.id}`;
                }}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 flex flex-col group cursor-pointer"
              >
                {/* Thumbnail Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={article.imageUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-slate-400 text-[11px] font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {article.publishedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        {article.author}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                      Baca Selengkapnya
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
