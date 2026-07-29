import React from 'react';
import { Mail, MapPin, Phone, Camera, ShieldCheck, Heart } from 'lucide-react';
import { WeeklyConfig } from '../../types';

interface FooterProps {
  config: WeeklyConfig;
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onAdminClick }) => {
  return (
    <footer className="bg-[#047857] text-white pt-20 pb-12 border-t border-emerald-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white text-emerald-800 rounded-2xl flex items-center justify-center shadow-md p-2">
                <img src="/lp3i-logo.svg" alt="LP3I Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="font-black text-white text-xl leading-tight">Lumina Sharing</h2>
                <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider">BEM LP3I Pekanbaru</p>
              </div>
            </div>
            <p className="text-emerald-100 text-sm leading-relaxed max-w-sm font-normal">
              Wadah transparansi donasi Jumat Berkah. 100% donasi disalurkan tanpa potongan operasional untuk berbagi kebaikan.
            </p>
          </div>

          {/* Navigasi */}
          <div className="space-y-6 md:pl-8">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider border-b border-emerald-600/60 pb-2">Navigasi</h3>
            <ul className="space-y-3 text-sm font-semibold">
              <li><a href="#hero" className="text-emerald-100 hover:text-white transition-colors">Beranda</a></li>
              <li><a href="#berita-bem" className="text-emerald-100 hover:text-white transition-colors">Berita BEM</a></li>
              <li><a href="#statistik" className="text-emerald-100 hover:text-white transition-colors">Statistik & Donasi</a></li>
              <li><a href="#titik-penyaluran" className="text-emerald-100 hover:text-white transition-colors">Titik Penyaluran</a></li>
              <li><a href="#donatur" className="text-emerald-100 hover:text-white transition-colors">Daftar Donatur</a></li>
              <li><a href="#faq-section" className="text-emerald-100 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="space-y-6">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider border-b border-emerald-600/60 pb-2">Kontak BEM LP3I</h3>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <p className="text-emerald-100 leading-relaxed">
                  Kampus LP3I Pekanbaru<br/>
                  Jl. Taman Sari No.11, Tengkerang Selatan,<br/>
                  Kec. Bukit Raya, Kota Pekanbaru.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-300 shrink-0" />
                <a href={`https://wa.me/${config.contactWa}`} className="text-emerald-100 hover:text-white transition-colors font-bold">
                  +{config.contactWa || '6281234567890'}
                </a>
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-emerald-800 border border-emerald-700 flex items-center justify-center text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors">
                  <Camera className="w-5 h-5" />
                </a>
                <a href="mailto:info@lp3ijumatberkah.my.id" className="w-10 h-10 rounded-xl bg-emerald-800 border border-emerald-700 flex items-center justify-center text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-600/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
          <p className="text-emerald-200 flex items-center gap-1.5">
            Dibuat dengan <Heart className="w-4 h-4 text-emerald-300 fill-emerald-300" /> oleh <span className="text-white font-bold">WalZetass-Kar</span>
          </p>
          <div className="flex items-center gap-6">
            <p className="text-emerald-200">© 2026 Lumina Sharing BEM LP3I. All rights reserved.</p>
            <button onClick={onAdminClick} className="text-emerald-200 hover:text-white transition-colors flex items-center gap-1.5 font-bold bg-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-700 cursor-pointer">
              <ShieldCheck className="w-4 h-4" /> Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
