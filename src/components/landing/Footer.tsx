import React from 'react';
import { Mail, Camera, Heart } from 'lucide-react';
import { WeeklyConfig } from '../../types';

interface FooterProps {
  config: WeeklyConfig;
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onAdminClick }) => {
  return (
    <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mx-auto mb-4">
            <span className="text-white font-bold text-2xl tracking-tight">LS</span>
          </div>
          <h2 className="font-bold text-white text-xl leading-tight mb-1">Lumina Sharing</h2>
          <p className="text-sm text-blue-400 font-medium mb-4">BEM LP3I Pekanbaru</p>
          
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <Camera className="w-5 h-5" />
            </a>
            <a href={`https://wa.me/${config.contactWa}`} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col items-center gap-4">
          <p className="text-slate-500 text-sm flex items-center justify-center gap-1.5">
            Dibuat oleh WalZetass-Kar
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-2">
            <p className="text-slate-600 text-sm">© 2026 Lumina Sharing. All rights reserved.</p>
            <button onClick={onAdminClick} className="text-slate-500 hover:text-slate-300 text-sm transition-colors font-medium">
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
