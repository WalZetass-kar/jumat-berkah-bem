import React, { useState } from 'react';
import { Share2, Copy, Check, MessageSquare, Send, Heart, Sparkles } from 'lucide-react';
import { WeeklyConfig } from '../types';

interface ShareSectionProps {
  config: WeeklyConfig;
}

export const ShareSection: React.FC<ShareSectionProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);

  const campaignUrl = typeof window !== 'undefined' ? window.location.href : 'https://lp3i-pekanbaru.ac.id/lumina-sharing';

  const defaultShareText = `Mari bergabung dalam gerakan kebaikan "Lumina Sharing - Jumat Berkah" BEM Politeknik LP3I Pekanbaru Kabinet Luminaire. Infaq nasi kotak Rp 15.000/porsi untuk pejuang jalanan & jamaah Jumat.\n\nLihat transparansi kas donasi di sini: ${campaignUrl}`;
  const shareText = config.shareText || defaultShareText;

  const handleCopy = () => {
    navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWaShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div id="bagikan-kebaikan" className="w-full bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-8 md:px-12 py-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-900/60 to-slate-900 p-6 sm:p-8 rounded-3xl border border-blue-800/40 shadow-xl">
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 border border-amber-400/30">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Sebarkan Kebaikan</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Ajak Teman & Keluarga Berbagi di Hari Jumat
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Satu kali Anda membagikan informasi ini di WhatsApp atau media sosial bisa menjadi jalan rizki bagi yang membutuhkan.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={handleWaShare}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Bagikan ke WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
