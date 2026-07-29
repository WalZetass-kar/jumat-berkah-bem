import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Building2, Users } from 'lucide-react';
import { WeeklyConfig, GalleryItem } from '../../types';

interface HeroSectionProps {
  config: WeeklyConfig;
  totalDistributed: number;
  totalTarget: number;
  galleryItems?: GalleryItem[];
  onDonateClick: () => void;
  onVolunteerClick: () => void;
  onInfoClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  config, 
  totalDistributed, 
  totalTarget, 
  galleryItems = [],
  onDonateClick,
  onVolunteerClick,
  onInfoClick
}) => {
  return (
    <div id="hero" className="relative w-full py-20 lg:py-28 px-4 sm:px-6 md:px-8 border-b border-slate-200 overflow-hidden bg-slate-900 text-white">
      {/* Background Image Kampus LP3I Pekanbaru */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://plb.ac.id/id/wp-content/uploads/2024/03/kampus-pekanbaru.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/85"></div>
      </div>

      <div className="max-w-[1280px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Text & CTA */}
        <div className="col-span-1 lg:col-span-7 space-y-8 text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[64px] font-black text-white tracking-tight leading-[1.1]"
          >
            Lumina Sharing <br />
            <span className="text-emerald-400">
              Jumat Berkah
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium"
          >
            {config.motto || "Sedekah Membawa Keberkahan & Kelapangan Rezeki"}. Wadah resmi transparansi infaq, sedekah porsi nasi kotak, dan santunan yatim yang dikelola langsung oleh mahasiswa.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <button
              onClick={onDonateClick}
              className="h-[52px] px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-[16px] text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Donasi Sekarang</span>
            </button>
            <button
              onClick={onInfoClick}
              className="h-[52px] px-7 bg-slate-800 hover:bg-slate-700 text-white font-extrabold rounded-[16px] border border-slate-700 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Info Rekening & QRIS</span>
            </button>
            <button
              onClick={onVolunteerClick}
              className="h-[52px] px-7 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold rounded-[16px] border border-slate-700 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Users className="w-5 h-5 text-slate-400" />
              <span>Daftar Relawan</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Floating Realtime Stats Box Only (Foto anak/dummy telah dihapus) */}
        <div className="col-span-1 lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-[20px] p-6 sm:p-8 border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.12)] space-y-6 text-slate-900"
          >
            {galleryItems && galleryItems.length > 0 ? (
              <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img 
                  src={galleryItems[0].imageUrl} 
                  alt={galleryItems[0].title || "Dokumentasi Resmi BEM"} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-900">Dokumentasi Resmi BEM</span>
                </div>
              </div>
            ) : null}

            {/* Realtime Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">TARGET PORSI</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{totalTarget} Porsi</p>
              </div>
              <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">TERSALURKAN</p>
                <p className="text-2xl font-black text-emerald-700 mt-1">{totalDistributed} Kotak</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
