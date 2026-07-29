import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Package, MapPin, Users } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface StatsSectionProps {
  totalIncome: number;
  totalDistributed: number;
  totalLocations: number;
  totalDonors: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ 
  totalIncome, 
  totalDistributed, 
  totalLocations,
  totalDonors 
}) => {
  return (
    <section id="statistik" className="py-[120px] bg-white border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>Transparansi Laporan</span>
          </div>
          <h2 className="text-3xl sm:text-[40px] font-black tracking-tight text-slate-900 leading-tight">
            Transparansi Penyaluran Donasi
          </h2>
          <p className="text-slate-600 text-base font-medium">
            Setiap rupiah yang diamanahkan akan selalu kami laporkan secara terbuka. Berikut adalah pencapaian kolektif kita bersama.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-stretch">
          {/* Main Stat Dashboard Box (Kiri Width 5) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-slate-900 rounded-[20px] p-8 sm:p-10 text-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex flex-col justify-between border border-slate-800"
          >
            <div>
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              
              <p className="text-slate-400 font-bold mb-2 text-sm uppercase tracking-wider">Total Donasi Terkumpul</p>
              <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-6">
                {formatRupiah(totalIncome)}
              </h3>
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">Status Pengelolaan</span>
                <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  100% Transparan
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Diperbarui secara otomatis melalui catatan kas resmi BEM Politeknik LP3I Pekanbaru.
              </p>
            </div>
          </motion.div>

          {/* Secondary Stats Grid (Kanan Width 7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-[32px]">
            {/* Stat 1: Porsi Nasi */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[20px] p-8 border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-slate-500 font-extrabold mb-1 text-xs uppercase tracking-wider">Porsi Nasi Dibagikan</p>
                <h3 className="text-3xl font-black text-slate-900">
                  {totalDistributed} <span className="text-lg text-slate-500 font-bold">Kotak</span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4 font-medium">Disalurkan setiap hari Jumat</p>
            </motion.div>

            {/* Stat 2: Titik Penyaluran */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[20px] p-8 border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-slate-500 font-extrabold mb-1 text-xs uppercase tracking-wider">Titik Penyaluran</p>
                <h3 className="text-3xl font-black text-slate-900">
                  {totalLocations} <span className="text-lg text-slate-500 font-bold">Lokasi</span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4 font-medium">Area kampus & sekitarnya</p>
            </motion.div>

            {/* Stat 3: Total Partisipasi Donatur */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="sm:col-span-2 bg-white rounded-[20px] p-8 border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-slate-500 font-extrabold uppercase tracking-wider text-xs">Total Partisipasi Donatur</p>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mt-2">{totalDonors} Orang Baik</h3>
              </div>
              <a href="#donatur" className="h-[48px] px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center shrink-0">
                Lihat Daftar Donatur
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
