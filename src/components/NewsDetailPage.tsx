import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Newspaper, Calendar, User, ArrowLeft, Share2, Tag, ChevronRight } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsDetailPageProps {
  articles: NewsArticle[];
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ articles }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = articles.find(
    (a) => a.slug === slug || a.id === slug
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <Newspaper className="w-16 h-16 text-emerald-500/50 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Berita Tidak Ditemukan</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-md">
          Berita yang Anda cari mungkin telah dihapus atau URL tidak valid.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const relatedArticles = articles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  const handleShareWA = () => {
    const shareText = `*${article.title}*\n\n${article.excerpt}\n\nBaca selengkapnya di BEM LP3I Pekanbaru:\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
      {/* Header Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <button 
            onClick={() => navigate('/')} 
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Beranda
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <button 
            onClick={() => navigate('/#berita-bem')} 
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Berita BEM
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-emerald-400 truncate max-w-[200px]">{article.title}</span>
        </div>

        {/* Header Metadata */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            {article.category}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium pt-2 border-b border-slate-800 pb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {article.publishedAt}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              {article.author}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt Box */}
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-sm sm:text-base font-semibold leading-relaxed italic">
          "{article.excerpt}"
        </div>

        {/* Main Content */}
        <div className="prose prose-invert max-w-none text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal space-y-4">
          {article.content}
        </div>

        {/* Share Section */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleShareWA}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            Bagikan Berita ini ke WhatsApp
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="pt-12 border-t border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white">Berita Terkait Lainnya</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/berita/${rel.slug || rel.id}`)}
                  className="bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer space-y-2 group"
                >
                  {rel.imageUrl && (
                    <div className="h-28 rounded-xl overflow-hidden bg-slate-800">
                      <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <h4 className="font-bold text-xs text-white group-hover:text-emerald-400 line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-[10px] text-slate-500">{rel.publishedAt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
