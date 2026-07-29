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
    <div id="hero" className="relative w-full bg-[#F8FAFC] py-20 lg:py-28 px-4 sm:px-6 md:px-8 border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Text & CTA */}
        <div className="col-span-1 lg:col-span-7 space-y-8 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold tracking-wide"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>BEM LP3I Pekanbaru Kabinet Luminaire</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[64px] font-black text-slate-900 tracking-tight leading-[1.1]"
          >
            Lumina Sharing <br />
            <span className="text-emerald-600">
              Jumat Berkah
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-medium"
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
              className="h-[52px] px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-[16px] text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Donasi Sekarang</span>
            </button>
            <button
              onClick={onInfoClick}
              className="h-[52px] px-7 bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold rounded-[16px] border border-emerald-600 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Info Rekening & QRIS</span>
            </button>
            <button
              onClick={onVolunteerClick}
              className="h-[52px] px-7 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-[16px] border border-slate-300 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Users className="w-5 h-5 text-slate-500" />
              <span>Daftar Relawan</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Solid Hero Card & Floating Realtime Stats */}
        <div className="col-span-1 lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-[20px] p-6 sm:p-8 border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)] space-y-6 relative"
          >
            {/* Hero Image / Illustration */}
            <div className="w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-slate-100 border border-slate-200 relative">
              <img 
                src={galleryItems && galleryItems.length > 0 ? galleryItems[0].imageUrl : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"} 
                alt="Dokumentasi BEM LP3I" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-900">Penyaluran Berjalan</span>
              </div>
            </div>

            {/* Floating Realtime Stats Row */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Porsi</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{totalTarget} Porsi</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Tersalurkan</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">{totalDistributed} Kotak</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
