import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle2 } from 'lucide-react';
import { Transaction } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { EmptyState } from './EmptyState';

interface DonorsSectionProps {
  transactions: Transaction[];
}

export const DonorsSection: React.FC<DonorsSectionProps> = ({ transactions }) => {
  const incomes = transactions.filter(t => t.type === 'INCOME');
  const recentIncomes = [...incomes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

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

        <div className="max-w-4xl mx-auto w-full">
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
    </section>
  );
};
