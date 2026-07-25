import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction } from '../types';
import { formatRupiah } from '../utils/formatters';

interface LeaderboardProps {
  transactions: Transaction[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ transactions }) => {
  // Aggregate donations by donorOrVendor (only INCOME, ignoring "Hamba Allah" and empty)
  const donorTotals = transactions
    .filter(t => t.type === 'INCOME' && t.donorOrVendor && !t.donorOrVendor.toLowerCase().includes('hamba allah') && !t.donorOrVendor.toLowerCase().includes('hamba allah ') && !t.donorOrVendor.toLowerCase().includes('nn'))
    .reduce((acc, curr) => {
      acc[curr.donorOrVendor] = (acc[curr.donorOrVendor] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedDonors = Object.entries(donorTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3); // Top 3

  if (sortedDonors.length === 0) return null;

  return (
    <div className="w-full bg-slate-900 text-white border-y border-slate-800 px-4 sm:px-8 md:px-12 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 border border-amber-400/30">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Top Pahlawan Kebaikan</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Papan Peringkat Donatur
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Apresiasi sebesar-besarnya untuk pahlawan kebaikan yang telah menyisihkan rezeki terbanyak bulan ini.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          {sortedDonors.map(([name, total], index) => {
            let Icon = Award;
            let iconColor = "text-blue-400";
            let bgClass = "bg-slate-800 border-slate-700";
            let scaleClass = "scale-100";

            if (index === 0) {
              Icon = Trophy;
              iconColor = "text-amber-400";
              bgClass = "bg-gradient-to-b from-amber-500/20 to-slate-800 border-amber-500/30 shadow-lg shadow-amber-900/20";
              scaleClass = "sm:scale-110 z-10";
            } else if (index === 1) {
              Icon = Medal;
              iconColor = "text-slate-300";
              bgClass = "bg-gradient-to-b from-slate-400/20 to-slate-800 border-slate-400/30";
            } else if (index === 2) {
              Icon = Medal;
              iconColor = "text-orange-400";
              bgClass = "bg-gradient-to-b from-orange-500/20 to-slate-800 border-orange-500/30";
            }

            return (
              <motion.div 
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`p-6 rounded-3xl border flex flex-col items-center text-center space-y-4 ${bgClass} ${scaleClass}`}
              >
                <div className="w-14 h-14 rounded-full bg-slate-900/50 flex items-center justify-center border border-white/5 shadow-inner">
                  <Icon className={`w-7 h-7 ${iconColor}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-white line-clamp-1">{name}</h3>
                  <p className="text-xs font-medium text-slate-400">Total Donasi</p>
                  <p className="font-black text-xl text-emerald-400">{formatRupiah(total)}</p>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  Peringkat #{index + 1}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
