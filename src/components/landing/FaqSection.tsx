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
    <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tanya Jawab</h2>
          <p className="text-lg text-slate-500">
            Pertanyaan yang sering diajukan seputar program Jumat Berkah.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="font-bold text-slate-900 text-lg pr-8">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-slate-500" />
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
                    <div className="px-6 pb-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 mt-4 pt-4">
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
