import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Heart } from 'lucide-react';
import { WeeklyConfig, DistributionSpot } from '../../types';

interface HeroSectionProps {
  config: WeeklyConfig;
  totalDistributed: number;
  totalTarget: number;
  onDonateClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  config, 
  totalDistributed, 
  totalTarget, 
  onDonateClick 
}) => {
  const progressPercent = totalTarget > 0 ? Math.round((totalDistributed / totalTarget) * 100) : 0;
  
  const getNextFridayTarget = () => {
    const now = new Date();
    const target = new Date(now);
    const dayOfWeek = now.getDay();
    let daysToGo = (5 - dayOfWeek + 7) % 7;
    if (daysToGo === 0 && now.getHours() >= 14) {
      daysToGo = 7;
    }
    target.setDate(now.getDate() + daysToGo);
    target.setHours(13, 0, 0, 0);
    return target;
  };

  const nextFriday = getNextFridayTarget();

  return (
    <div id="hero" className="relative w-full min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden bg-slate-950">
      {/* Background Image with elegant overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920')" }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Text Content */}
        <div className="col-span-1 lg:col-span-7 space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wide"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            BEM LP3I Pekanbaru Kabinet Luminaire
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]"
          >
            Lumina Sharing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
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
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start"
          >
            <button
              onClick={onDonateClick}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-white" />
              Donasi Sekarang
            </button>
            <a
              href="#kegiatan"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-lg transition-all duration-300 border border-white/10 text-center"
            >
              Lihat Kegiatan
            </a>
          </motion.div>
        </div>

        {/* Stats & Progress Card */}
        <div className="col-span-1 lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Calendar className="w-32 h-32 text-slate-100" />
            </div>

            <div className="relative z-10 space-y-8">
              <div>
                <h3 className="text-slate-400 font-medium text-sm tracking-wide uppercase mb-2">Target Bulan Ini</h3>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-5xl font-bold text-white">{totalDistributed}</span>
                  <span className="text-xl text-slate-500 font-medium mb-1">/ {totalTarget} Porsi</span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-3 text-sm font-medium">
                  <span className="text-blue-400">{progressPercent}% Tercapai</span>
                  <span className="text-slate-400">Insya Allah Tembus!</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/60">
                <h3 className="text-slate-400 font-medium text-sm tracking-wide uppercase mb-3">Penyaluran Berikutnya</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">
                      {nextFriday.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-slate-400 text-sm">Pukul 13:00 WIB</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
