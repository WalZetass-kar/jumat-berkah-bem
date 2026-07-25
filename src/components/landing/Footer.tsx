import React from 'react';
import { Mail, MapPin, Phone, Camera, ShieldCheck, Heart } from 'lucide-react';
import { WeeklyConfig } from '../../types';

interface FooterProps {
  config: WeeklyConfig;
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onAdminClick }) => {
  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-xl tracking-tight">LS</span>
              </div>
              <div>
                <h2 className="font-bold text-white text-lg leading-tight">Lumina Sharing</h2>
                <p className="text-xs text-blue-400 font-medium">BEM LP3I Pekanbaru</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Wadah transparansi donasi Jumat Berkah. 100% donasi disalurkan tanpa potongan operasional untuk berbagi kebaikan.
            </p>
          </div>

          {/* Navigasi */}
          <div className="space-y-6 md:pl-8">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Navigasi</h3>
            <ul className="space-y-3">
              <li><a href="#hero" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Beranda</a></li>
              <li><a href="#statistik" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Statistik</a></li>
              <li><a href="#kegiatan" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Kegiatan</a></li>
              <li><a href="#donatur" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Donatur</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Kontak</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
                <p className="text-slate-400 text-sm font-medium">Kampus LP3I Pekanbaru<br/>Jl. Pattimura, Riau</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-500 shrink-0" />
                <a href={`https://wa.me/${config.contactWa}`} className="text-slate-400 text-sm hover:text-white transition-colors font-medium">
                  +{config.contactWa || '6281234567890'}
                </a>
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  <Camera className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm flex items-center gap-1.5 font-medium">
            Dibuat dengan <Heart className="w-4 h-4 text-slate-700" /> oleh <span className="text-slate-400">WalZetass-Kar</span>
          </p>
          <div className="flex items-center gap-6">
            <p className="text-slate-600 text-sm">© 2026 Lumina Sharing. All rights reserved.</p>
            <button onClick={onAdminClick} className="text-slate-500 hover:text-slate-300 text-sm transition-colors flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4" /> Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
