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
    <div id="hero" className="relative w-full min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden bg-slate-950">
      {/* Background Image with elegant overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx7vsQhix8E6D2Ss-p17Bi8YQ-Vo2LrA24e2Q9YbLJpg&s=10')" }}
      >
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Text Content */}
        <div className="col-span-1 lg:col-span-7 space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold tracking-wide"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            BEM LP3I Pekanbaru Kabinet Luminaire
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]"
          >
            Lumina Sharing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">
              Jumat Berkah
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
          >
            {config.motto}. Wadah resmi transparansi infaq, sedekah porsi nasi kotak, dan santunan yatim yang dikelola langsung oleh mahasiswa.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-4 justify-center lg:justify-start"
          >
            <button
              onClick={onDonateClick}
              className="px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm sm:text-base transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-slate-950" />
              Donasi Sekarang
            </button>
            <button
              onClick={onInfoClick}
              className="px-6 py-4 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Building2 className="w-5 h-5 text-teal-200" />
              Info Rekening & QRIS
            </button>
            <button
              onClick={onVolunteerClick}
              className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5 text-slate-400" />
              Daftar Relawan
            </button>
          </motion.div>
        </div>

        {/* Right Column: Animated Image Collage */}
        {galleryItems && galleryItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="col-span-1 lg:col-span-5 hidden lg:flex justify-center items-center relative min-h-[500px]"
          >
            {/* Glowing Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-amber-500/20 blur-[100px] rounded-full animate-pulse"></div>
            
            <style>{`
              @keyframes float-img-1 {
                0% { transform: rotate(5deg) translate(20px, 0px); }
                50% { transform: rotate(5deg) translate(20px, -20px); }
                100% { transform: rotate(5deg) translate(20px, 0px); }
              }
              @keyframes float-img-2 {
                0% { transform: rotate(-6deg) translate(-50px, 40px); }
                50% { transform: rotate(-6deg) translate(-50px, 20px); }
                100% { transform: rotate(-6deg) translate(-50px, 40px); }
              }
              @keyframes float-badge {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
                100% { transform: translateY(0px); }
              }
            `}</style>

            {/* Image 1: Main (Right/Top) */}
            <div 
              className="absolute z-30 w-72 h-[350px] rounded-[2rem] overflow-hidden border-[6px] border-white/10 shadow-2xl backdrop-blur-md"
              style={{ animation: 'float-img-1 6s ease-in-out infinite' }}
            >
               <img 
                 src={galleryItems[0].imageUrl} 
                 alt="Dokumentasi 1" 
                 className="w-full h-full object-cover bg-slate-800"
               />
               <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-5">
                  <p className="text-white text-sm font-black tracking-wide">Aksi Nyata BEM LP3I</p>
                  <p className="text-amber-300 text-[10px] font-bold uppercase mt-0.5">Jumat Berkah</p>
               </div>
            </div>

            {/* Image 2: Secondary (Left/Bottom) - Only show if there's a second image */}
            {galleryItems.length > 1 && (
              <div 
                className="absolute z-20 w-64 h-[300px] rounded-[2rem] overflow-hidden border-[6px] border-white/5 shadow-2xl backdrop-blur-md"
                style={{ animation: 'float-img-2 7s ease-in-out infinite 1s' }}
              >
                 <img 
                   src={galleryItems[1].imageUrl} 
                   alt="Dokumentasi 2" 
                   className="w-full h-full object-cover grayscale-[30%] bg-slate-800"
                 />
                 <div className="absolute inset-0 bg-slate-900/20"></div>
              </div>
            )}

            {/* Decoration Badge */}
            <div 
              className="absolute z-40 top-16 -right-4 bg-amber-400 text-slate-950 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2"
              style={{ animation: 'float-badge 5s ease-in-out infinite 0.5s' }}
            >
               <Heart className="w-5 h-5 fill-slate-950 animate-pulse" />
               <div>
                 <p className="text-xs font-black tracking-wide">#LuminaSharing</p>
               </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
