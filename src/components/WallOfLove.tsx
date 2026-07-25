import React from 'react';
import { Heart, MessageCircleHeart } from 'lucide-react';
import { Transaction } from '../types';

interface WallOfLoveProps {
  transactions: Transaction[];
}

export const WallOfLove: React.FC<WallOfLoveProps> = ({ transactions }) => {
  // Filter only income transactions that have a meaningful note/doa
  const donaturMessages = transactions
    .filter(t => t.type === 'INCOME' && t.notes && t.notes.trim().length > 3 && t.notes !== '-')
    .slice(0, 20);

  if (donaturMessages.length === 0) return null;

  return (
    <div className="w-full py-16 sm:py-24 overflow-hidden bg-slate-950 relative border-t border-slate-800">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold tracking-wide uppercase mb-4">
          <Heart className="w-4 h-4" />
          <span>Wall of Love</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Pesan & Doa <span className="text-rose-400">Orang Baik</span></h2>
        <p className="text-slate-400 mt-3 max-w-2xl mx-auto">Doa-doa tulus dari para donatur yang telah menyisihkan sebagian hartanya untuk program Jumat Berkah BEM LP3I Pekanbaru.</p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        {/* Animated Marquee content */}
        <div className="py-4 animate-marquee whitespace-nowrap flex items-center gap-6 px-6 group-hover:[animation-play-state:paused]">
          {[...donaturMessages, ...donaturMessages].map((msg, index) => (
            <div 
              key={`${msg.id}-${index}`} 
              className="inline-flex flex-col w-80 sm:w-[380px] p-6 bg-slate-900/80 backdrop-blur-md rounded-[2rem] border border-slate-800 shadow-xl relative whitespace-normal shrink-0"
            >
              <div className="absolute top-5 right-6 text-rose-500/20">
                <MessageCircleHeart className="w-12 h-12" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white font-bold shadow-md">
                    {(msg.donorOrVendor || 'H').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{msg.donorOrVendor || 'Hamba Allah'}</h4>
                    <p className="text-xs text-slate-400">{new Date(msg.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <p className="text-slate-300 italic text-sm leading-relaxed line-clamp-3">"{msg.notes}"</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Second identical div for seamless looping */}
        <div className="py-4 animate-marquee2 whitespace-nowrap flex items-center gap-6 px-6 absolute top-0 group-hover:[animation-play-state:paused]">
          {[...donaturMessages, ...donaturMessages].map((msg, index) => (
            <div 
              key={`copy-${msg.id}-${index}`} 
              className="inline-flex flex-col w-80 sm:w-[380px] p-6 bg-slate-900/80 backdrop-blur-md rounded-[2rem] border border-slate-800 shadow-xl relative whitespace-normal shrink-0"
            >
              <div className="absolute top-5 right-6 text-rose-500/20">
                <MessageCircleHeart className="w-12 h-12" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white font-bold shadow-md">
                    {(msg.donorOrVendor || 'H').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{msg.donorOrVendor || 'Hamba Allah'}</h4>
                    <p className="text-xs text-slate-400">{new Date(msg.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <p className="text-slate-300 italic text-sm leading-relaxed line-clamp-3">"{msg.notes}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
