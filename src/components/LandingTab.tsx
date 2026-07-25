import React, { useState, useEffect } from 'react';
import { WeeklyConfig, Transaction, DistributionSpot, GalleryItem } from '../types';
import { HeroSection } from './landing/HeroSection';
import { StatsSection } from './landing/StatsSection';
import { ActivitySection } from './landing/ActivitySection';
import { DonorsSection } from './landing/DonorsSection';
import { FaqSection } from './landing/FaqSection';
import { Footer } from './landing/Footer';
import { BackToTop } from './landing/BackToTop';
import confetti from 'canvas-confetti';
import { X, Copy, Check, MessageSquare } from 'lucide-react';

interface LandingTabProps {
  config: WeeklyConfig;
  transactions: Transaction[];
  spots: DistributionSpot[];
  galleryItems?: GalleryItem[];
  isAdminLoggedIn?: boolean;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export const LandingTab: React.FC<LandingTabProps> = ({
  config,
  transactions,
  spots,
  galleryItems,
  isAdminLoggedIn = false,
  onLoginClick,
  onLogoutClick,
  onNavigateToTab,
}) => {
  const [showDonationFormModal, setShowDonationFormModal] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  // Donation form state
  const [donasiName, setDonasiName] = useState('');
  const [donasiAmount, setDonasiAmount] = useState('');
  const [donasiAnonim, setDonasiAnonim] = useState(false);
  const [donasiDoa, setDonasiDoa] = useState('');

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDistributed = spots.reduce((sum, s) => sum + s.distributedPackages, 0);
  const totalTarget = spots.reduce((sum, s) => sum + s.targetPackages, 0);

  const handleDonateClick = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FBBF24', '#F59E0B', '#10B981']
    });
    setShowDonationFormModal(true);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(config.bankInfo);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleDonationFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDonationFormModal(false);
    setShowQrisModal(true);
  };

  const waMessage = `Assalamualaikum min, saya ingin konfirmasi donasi Jumat Berkah.

*Nama:* ${donasiAnonim ? 'Hamba Allah' : (donasiName || '.............')}
*Nominal:* ${donasiAmount ? `Rp ${donasiAmount}` : '.............'}
*Pesan/Doa:* ${donasiDoa || '-'}
*Metode:* QRIS / Transfer

Berikut saya lampirkan bukti transfernya.`;
  const waConfirmationUrl = config.contactWa ? `https://wa.me/${config.contactWa}?text=${encodeURIComponent(waMessage)}` : '#';

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans selection:bg-blue-500/30 selection:text-blue-900">
      
      <HeroSection 
        config={config} 
        totalDistributed={totalDistributed} 
        totalTarget={totalTarget} 
        onDonateClick={handleDonateClick} 
      />

      <StatsSection 
        totalIncome={totalIncome} 
        totalDistributed={totalDistributed} 
        totalLocations={spots.length} 
        totalDonors={new Set(transactions.filter(t => t.type === 'INCOME').map(t => t.donorOrVendor)).size} 
      />

      <ActivitySection 
        spots={spots} 
        galleryItems={galleryItems || []} 
      />

      <DonorsSection 
        transactions={transactions} 
      />

      <FaqSection />

      <Footer 
        config={config} 
        onAdminClick={onLoginClick} 
      />

      <BackToTop />

      {/* Donation Form Modal */}
      {showDonationFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowDonationFormModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-2xl text-slate-900 mb-2">Niatkan Berdonasi</h3>
            <p className="text-slate-500 text-sm mb-6">Isi nominal dan pesan Anda, semoga menjadi amal jariyah.</p>

            <form onSubmit={handleDonationFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nominal (Rp)</label>
                <input 
                  type="number" 
                  required
                  value={donasiAmount}
                  onChange={(e) => setDonasiAmount(e.target.value)}
                  placeholder="Misal: 50000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Anda</label>
                <input 
                  type="text" 
                  required={!donasiAnonim}
                  disabled={donasiAnonim}
                  value={donasiAnonim ? 'Hamba Allah' : donasiName}
                  onChange={(e) => setDonasiName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 disabled:bg-slate-50 disabled:text-slate-500"
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit">
                  <input 
                    type="checkbox" 
                    checked={donasiAnonim}
                    onChange={(e) => setDonasiAnonim(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-sm font-medium text-slate-600">Sembunyikan nama saya (Hamba Allah)</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Pesan / Doa (Opsional)</label>
                <textarea 
                  value={donasiDoa}
                  onChange={(e) => setDonasiDoa(e.target.value)}
                  placeholder="Tuliskan doa atau pesan Anda..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 mt-2"
              >
                Lanjut ke Pembayaran
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QRIS & Rekening Modal */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
            <button 
              onClick={() => setShowQrisModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-2xl text-slate-900 mb-2">Selesaikan Donasi</h3>
            <p className="text-slate-500 text-sm mb-6">Pilih metode pembayaran dan konfirmasi ke admin.</p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
              <p className="text-sm text-slate-500 mb-2 font-medium uppercase tracking-wider">Transfer Bank BSI</p>
              <p className="text-2xl font-black text-slate-900 mb-3 tracking-wider">{config.bankInfo}</p>
              <button 
                onClick={handleCopyAccount}
                className="mx-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {copiedBank ? (
                  <><Check className="w-4 h-4 text-emerald-500" /> Tersalin!</>
                ) : (
                  <><Copy className="w-4 h-4" /> Salin Rekening</>
                )}
              </button>
            </div>

            {config.qrisImageUrl && (
              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-3 font-medium uppercase tracking-wider">Atau scan QRIS</p>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 inline-block shadow-sm">
                  <img src={config.qrisImageUrl} alt="QRIS" className="w-48 h-48 object-cover rounded-xl" />
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 pt-6">
              <p className="text-sm text-slate-500 mb-3 font-medium">Setelah transfer, mohon konfirmasi ke Admin.</p>
              <a 
                href={waConfirmationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/30"
              >
                <MessageSquare className="w-5 h-5" />
                Konfirmasi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
