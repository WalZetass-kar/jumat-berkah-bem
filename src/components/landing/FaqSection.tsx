import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "Apa itu Lumina Sharing?",
    a: "Lumina Sharing adalah program sosial mingguan resmi dari BEM LP3I Pekanbaru Kabinet Luminaire yang berfokus pada pembagian nasi kotak gratis dan santunan kepada yang membutuhkan setiap hari Jumat."
  },
  {
    q: "Bagaimana cara berdonasi?",
    a: "Anda dapat berdonasi dengan klik tombol 'Donasi Sekarang', lalu mengisi form yang disediakan. Anda bisa menggunakan QRIS, transfer bank (BSI), atau cash. Setelah itu, mohon konfirmasi via WhatsApp ke admin."
  },
  {
    q: "Apakah donasi saya disalurkan 100%?",
    a: "Ya, 100% dana yang terkumpul disalurkan untuk program Jumat Berkah (pembelian nasi kotak & santunan). Tidak ada potongan operasional. Semua laporan dicatat dan bisa dilihat secara transparan di website ini."
  },
  {
    q: "Bagaimana cara menjadi Relawan?",
    a: "Kami sangat terbuka untuk relawan! Anda cukup klik tombol 'Daftar Relawan' di menu Kegiatan, lalu isi biodata. Tim kami akan menghubungi Anda untuk jadwal distribusi hari Jumat."
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-[120px] bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-[40px] font-black tracking-tight text-slate-900 leading-tight">
            Tanya Jawab (FAQ)
          </h2>
          <p className="text-slate-600 text-base font-medium">
            Pertanyaan yang paling sering diajukan seputar program Jumat Berkah BEM LP3I Pekanbaru.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
              >
                <span className="font-bold text-slate-900 text-base sm:text-lg pr-6">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100"
                >
                  <ChevronDown className="w-5 h-5 text-emerald-600" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-0 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 mt-2 pt-4 font-normal">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
