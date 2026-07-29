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
    <section id="donatur" className="py-[120px] bg-white border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Orang-orang Baik</span>
          </div>
          <h2 className="text-3xl sm:text-[40px] font-black tracking-tight text-slate-900 leading-tight">
            Daftar Donatur Terverifikasi
          </h2>
          <p className="text-slate-600 text-base font-medium">
            Daftar donatur yang telah menyisihkan sebagian hartanya untuk kebaikan bersama. Semoga menjadi amal jariyah yang tak terputus.
          </p>
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Donasi Terbaru</h3>
          </div>

          {recentIncomes.length === 0 ? (
            <div className="bg-white rounded-[20px] border border-slate-200 p-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <EmptyState 
                icon={Users} 
                title="Belum Ada Donasi" 
                description="Jadilah yang pertama berkontribusi dalam program ini." 
              />
            </div>
          ) : (
            <div className="space-y-4">
              {recentIncomes.map((tx, idx) => (
                <motion.div 
                  key={tx.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white p-6 rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-base shrink-0">
                      {(tx.donorOrVendor || 'H').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">
                          {tx.donorOrVendor || 'Hamba Allah (Anonim)'}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase">
                          Orang Baik
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-slate-500 font-medium">{formatDateIndo(tx.date)}</p>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">{tx.paymentMethod}</span>
                      </div>
                      {tx.notes && tx.notes !== '-' && (
                        <p className="text-sm text-slate-600 italic mt-2 line-clamp-2 font-normal">"{tx.notes}"</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-emerald-600 text-lg block">{formatRupiah(tx.amount)}</span>
                    <div className="flex items-center justify-end gap-1 mt-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold uppercase">Terverifikasi</span>
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
