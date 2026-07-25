import React from 'react';
import { Mail, Camera, MapPin, Heart, Phone } from 'lucide-react';
import { WeeklyConfig } from '../../types';

interface FooterProps {
  config: WeeklyConfig;
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onAdminClick }) => {
  return (
    <footer className="bg-slate-950 pt-24 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & About */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-xl tracking-tight">LS</span>
              </div>
              <div>
                <h2 className="font-bold text-white text-lg leading-tight">Lumina Sharing</h2>
                <p className="text-xs text-blue-400 font-medium">BEM LP3I Pekanbaru</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Platform transparansi donasi dan penyaluran sedekah porsi nasi kotak & santunan yatim resmi yang dikelola oleh mahasiswa BEM LP3I Pekanbaru Kabinet Luminaire.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Camera className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg">Navigasi</h3>
            <ul className="space-y-4">
              <li><a href="#hero" className="text-slate-400 hover:text-white transition-colors text-sm">Donasi</a></li>
              <li><a href="#statistik" className="text-slate-400 hover:text-white transition-colors text-sm">Transparansi Statistik</a></li>
              <li><a href="#kegiatan" className="text-slate-400 hover:text-white transition-colors text-sm">Lokasi & Dokumentasi</a></li>
              <li><a href="#donatur" className="text-slate-400 hover:text-white transition-colors text-sm">Daftar Donatur</a></li>
              <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors text-sm">Tanya Jawab (FAQ)</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6 lg:col-span-2">
            <h3 className="text-white font-bold text-lg">Hubungi Kami</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm mb-1">Sekretariat BEM</p>
                  <p className="text-slate-400 text-sm leading-relaxed">Kampus LP3I Pekanbaru<br />Jl. Pattimura, Pekanbaru, Riau</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-green-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm mb-1">WhatsApp Admin</p>
                  <a href={`https://wa.me/${config.contactWa}`} className="text-slate-400 text-sm hover:text-white transition-colors">
                    +{config.contactWa || '6281234567890'}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            Dibuat dengan <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> oleh BEM LP3I Pekanbaru
          </p>
          <div className="flex items-center gap-6">
            <p className="text-slate-500 text-sm">© 2026 Lumina Sharing. All rights reserved.</p>
            <button onClick={onAdminClick} className="text-slate-600 hover:text-slate-400 text-sm transition-colors font-medium">
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
