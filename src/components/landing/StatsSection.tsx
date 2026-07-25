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
    <section id="statistik" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Transparansi Penyaluran</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Setiap rupiah yang diamanahkan akan selalu kami laporkan secara terbuka. Berikut adalah pencapaian kolektif kita bersama.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Stat Card - Total Donasi */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="md:col-span-3 lg:col-span-1 bg-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors"></div>
            
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
              <Wallet className="w-7 h-7 text-blue-400" />
            </div>
            
            <p className="text-slate-400 font-medium mb-2 text-lg">Total Donasi Terkumpul</p>
            <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
              {formatRupiah(totalIncome)}
            </h3>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Real-time update
            </div>
          </motion.div>

          {/* Secondary Stats */}
          <div className="md:col-span-3 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Package className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <p className="text-slate-500 font-medium mb-1 text-sm uppercase tracking-wider">Porsi Nasi Dibagikan</p>
              <h3 className="text-4xl font-bold text-slate-900">
                {totalDistributed} <span className="text-xl text-slate-400 font-medium">Kotak</span>
              </h3>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-100 transition-all group"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                <MapPin className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <p className="text-slate-500 font-medium mb-1 text-sm uppercase tracking-wider">Titik Penyaluran</p>
              <h3 className="text-4xl font-bold text-slate-900">
                {totalLocations} <span className="text-xl text-slate-400 font-medium">Lokasi</span>
              </h3>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="sm:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-slate-100 transition-colors"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-slate-600 font-medium uppercase tracking-wider text-sm">Total Partisipasi Donatur</p>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mt-3">{totalDonors} Orang Baik</h3>
              </div>
              <a href="#donatur" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
                Lihat Daftar Donatur
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
