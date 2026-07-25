import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Medal, Clock, CheckCircle2 } from 'lucide-react';
import { Transaction } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { EmptyState } from './EmptyState';

interface DonorsSectionProps {
  transactions: Transaction[];
}

export const DonorsSection: React.FC<DonorsSectionProps> = ({ transactions }) => {
  const incomes = transactions.filter(t => t.type === 'INCOME');
  const recentIncomes = [...incomes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // Calculate top donors for podium
  const donorTotals = incomes.reduce((acc, curr) => {
    const name = curr.donorOrVendor || 'Hamba Allah';
    acc[name] = (acc[name] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const topDonors = Object.entries(donorTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, amount]) => ({ name, amount }));

  return (
    <section id="donatur" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-gradient-to-b from-slate-50 to-transparent skew-x-12 -translate-y-12 translate-x-12"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Orang-orang Baik</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Daftar donatur yang telah menyisihkan sebagian hartanya untuk kebaikan bersama. 
            Semoga menjadi amal jariyah yang tak terputus.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Podium Leaderboard */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-12 lg:mb-20">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Top Donatur</h3>
            </div>

            {topDonors.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <EmptyState 
                  icon={Trophy} 
                  title="Belum Ada Data" 
                  description="Jadilah donatur pertama dan puncaki leaderboard ini!" 
                />
              </div>
            ) : (
              <div className="flex items-end justify-center gap-2 sm:gap-6 h-[300px] mt-10">
                {/* Rank 2 - Silver */}
                {topDonors[1] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: '65%', opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-1/3 max-w-[140px] flex flex-col items-center justify-end relative"
                  >
                    <div className="absolute -top-16 flex flex-col items-center w-full">
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-2 shadow-lg border-2 border-white text-slate-600 font-bold text-xl">2</div>
                      <p className="text-sm font-bold text-slate-700 text-center truncate w-full px-2" title={topDonors[1].name}>{topDonors[1].name}</p>
                      <p className="text-xs text-slate-500 font-medium">{formatRupiah(topDonors[1].amount)}</p>
                    </div>
                    <div className="w-full h-full bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl shadow-inner border border-slate-200/50 flex flex-col items-center justify-start pt-6">
                      <Medal className="w-8 h-8 text-slate-400" />
                    </div>
                  </motion.div>
                )}

                {/* Rank 1 - Gold */}
                {topDonors[0] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: '85%', opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-1/3 max-w-[160px] flex flex-col items-center justify-end relative z-10"
                  >
                    <div className="absolute -top-20 flex flex-col items-center w-full">
                      <div className="w-16 h-16 rounded-full bg-amber-300 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(251,191,36,0.5)] border-2 border-white text-amber-800 font-black text-2xl">1</div>
                      <p className="text-base font-bold text-slate-900 text-center truncate w-full px-2" title={topDonors[0].name}>{topDonors[0].name}</p>
                      <p className="text-sm text-amber-600 font-bold">{formatRupiah(topDonors[0].amount)}</p>
                    </div>
                    <div className="w-full h-full bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-2xl shadow-[0_-5px_15px_rgba(251,191,36,0.1)] border border-amber-200/50 flex flex-col items-center justify-start pt-6">
                      <Trophy className="w-10 h-10 text-amber-500" />
                    </div>
                  </motion.div>
                )}

                {/* Rank 3 - Bronze */}
                {topDonors[2] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: '50%', opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="w-1/3 max-w-[140px] flex flex-col items-center justify-end relative"
                  >
                    <div className="absolute -top-16 flex flex-col items-center w-full">
                      <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center mb-2 shadow-lg border-2 border-white text-orange-700 font-bold text-xl">3</div>
                      <p className="text-sm font-bold text-slate-700 text-center truncate w-full px-2" title={topDonors[2].name}>{topDonors[2].name}</p>
                      <p className="text-xs text-slate-500 font-medium">{formatRupiah(topDonors[2].amount)}</p>
                    </div>
                    <div className="w-full h-full bg-gradient-to-t from-orange-100 to-orange-50 rounded-t-2xl shadow-inner border border-orange-200/50 flex flex-col items-center justify-start pt-6">
                      <Medal className="w-8 h-8 text-orange-400" />
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Recent Donors List */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Donasi Terbaru</h3>
            </div>

            {recentIncomes.length === 0 ? (
              <EmptyState 
                icon={Users} 
                title="Belum Ada Donasi" 
                description="Jadilah yang pertama berkontribusi dalam program ini." 
              />
            ) : (
              <div className="space-y-4">
                {recentIncomes.map((tx, idx) => (
                  <motion.div 
                    key={tx.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                        {(tx.donorOrVendor || 'H').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {tx.donorOrVendor || 'Hamba Allah'}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-slate-500">{formatDateIndo(tx.date)}</p>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{tx.paymentMethod}</span>
                        </div>
                        {tx.notes && tx.notes !== '-' && (
                          <p className="text-sm text-slate-600 italic mt-2 line-clamp-2">"{tx.notes}"</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-emerald-600 block">{formatRupiah(tx.amount)}</span>
                      <div className="flex items-center justify-end gap-1 mt-1 text-emerald-500">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">Terverifikasi</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
