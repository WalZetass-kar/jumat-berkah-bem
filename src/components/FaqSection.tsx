import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ShieldCheck } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Bagaimana donasi saya dikelola dan disalurkan?",
      answer: "Setiap rupiah donasi yang masuk dicatat secara otomatis dan realtime pada sistem laporan keuangan kas terbuka ini. Tim BEM LP3I Pekanbaru membelanjakan dana untuk bahan makanan/nasi kotak sehat dan mendistribusikannya setiap hari Jumat jam 11:30 WIB."
    },
    {
      question: "Apakah ada pemotongan biaya administrasi?",
      answer: "Tidak ada pemotongan operasional komersial. 100% donasi dialokasikan langsung untuk pembuatan/pembelian nasi kotak, sembako, dan biaya operasional distribusi langsung di lapangan."
    },
    {
      question: "Apakah saya bisa berdonasi selain uang tunai/transfer?",
      answer: "Sangat bisa! Kami menerima donasi barang (in-kind) seperti nasi kotak siap saji, air mineral, beras, bahan baku, atau boks kemasan. Anda dapat menghubungi panitia via WhatsApp konfirmasi."
    },
    {
      question: "Kapan laporan keuangan diperbarui?",
      answer: "Laporan diperbarui secara teratur oleh Bendahara BEM LP3I Kabinet Luminaire segera setelah donasi diverifikasi atau pengeluaran dilakukan."
    },
    {
      question: "Siapa saja target utama penerima manfaat program ini?",
      answer: "Target penerima meliputi jamaah shalat Jumat di sekitar kampus/masjid binaan, masyarakat dhuafa, pekerja harian & pengemudi ojol, serta anak-anak di panti asuhan Pekanbaru."
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div id="faq-section" className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 md:px-12 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-[11px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pertanyaan Umum (FAQ)</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Informasi Transparansi & Pengelolaan Donasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Temukan jawaban atas pertanyaan seputar program Lumina Sharing BEM LP3I Pekanbaru.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left font-extrabold text-xs sm:text-sm text-slate-900 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-blue-600 font-mono text-xs">0{idx + 1}.</span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-medium bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
