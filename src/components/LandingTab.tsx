import React, { useState } from 'react';
import { WeeklyConfig, Transaction, DistributionSpot, GalleryItem, NewsArticle } from '../types';
import { HeroSection } from './landing/HeroSection';
import { StatsSection } from './landing/StatsSection';
import { ActivitySection } from './landing/ActivitySection';
import { DonorsSection } from './landing/DonorsSection';
import { FaqSection } from './landing/FaqSection';
import { Footer } from './landing/Footer';
import { BackToTop } from './landing/BackToTop';
import { NewsPublicSection } from './NewsPublicSection';
import confetti from 'canvas-confetti';
import { X, Copy, Check, Send, QrCode } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface LandingTabProps {
  config: WeeklyConfig;
  transactions: Transaction[];
  spots: DistributionSpot[];
  articles?: NewsArticle[];
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
  articles = [],
  galleryItems,
  isAdminLoggedIn = false,
  onLoginClick,
  onLogoutClick,
  onNavigateToTab,
}) => {
  const [showDonationFormModal, setShowDonationFormModal] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);

  // Donation form state
  const [donasiName, setDonasiName] = useState('');
  const [donasiAmount, setDonasiAmount] = useState('');
  const [donasiAnonim, setDonasiAnonim] = useState(false);
  const [donasiDoa, setDonasiDoa] = useState('');

  // Volunteer form state
  const [volName, setVolName] = useState('');
  const [volProdi, setVolProdi] = useState('Manajemen Informatika');
  const [volNim, setVolNim] = useState('');
  const [volWa, setVolWa] = useState('');
  const [volSubmitted, setVolSubmitted] = useState(false);
  const [isSubmittingVol, setIsSubmittingVol] = useState(false);

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

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName || !volWa) return;
    
    setIsSubmittingVol(true);
    const { error } = await supabase.from('volunteers').insert([{
      name: volName,
      prodi: volProdi,
      nim: volNim,
      wa_number: volWa
    }]);
    setIsSubmittingVol(false);

    if (error) {
      alert('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
      return;
    }

    setVolSubmitted(true);
    setTimeout(() => {
      setVolSubmitted(false);
      setShowVolunteerModal(false);
      setVolName('');
      setVolNim('');
      setVolWa('');
    }, 2500);
  };

  const waMessage = `Assalamualaikum min, saya ingin konfirmasi donasi Jumat Berkah.

*Nama:* ${donasiAnonim ? 'Hamba Allah' : (donasiName || '.............')}
*Nominal:* ${donasiAmount ? `Rp ${donasiAmount}` : '.............'}
*Pesan/Doa:* ${donasiDoa || '-'}
*Metode:* QRIS / Transfer

Berikut saya lampirkan bukti transfernya.`;
  const waConfirmationUrl = config.contactWa ? `https://wa.me/${config.contactWa}?text=${encodeURIComponent(waMessage)}` : '#';

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-900">
      
      <HeroSection 
        config={config} 
        totalDistributed={totalDistributed} 
        totalTarget={totalTarget} 
        galleryItems={galleryItems}
        onDonateClick={handleDonateClick}
        onVolunteerClick={() => setShowVolunteerModal(true)}
        onInfoClick={() => setShowQrisModal(true)}
      />

      <NewsPublicSection articles={articles} />

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
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 sm:p-8 max-w-md w-full shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-slate-200 relative">
            <button 
              onClick={() => setShowDonationFormModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-2xl text-slate-900 mb-2">Niatkan Berdonasi</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">Isi nominal dan pesan Anda, semoga menjadi amal jariyah.</p>

            <form onSubmit={handleDonationFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nominal (Rp)</label>
                <input 
                  type="number" 
                  required
                  value={donasiAmount}
                  onChange={(e) => setDonasiAmount(e.target.value)}
                  placeholder="Misal: 50000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-slate-900"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 font-medium"
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit">
                  <input 
                    type="checkbox" 
                    checked={donasiAnonim}
                    onChange={(e) => setDonasiAnonim(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-900 resize-none font-medium"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full h-[52px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-[16px] transition-all shadow-md mt-2 cursor-pointer active:scale-95"
              >
                Lanjut ke Pembayaran
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QRIS & Rekening Modal */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-[20px] p-6 sm:p-8 max-w-md w-full space-y-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-slate-200 relative">
            <button 
              onClick={() => setShowQrisModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold uppercase">
                Rekening & QRIS BEM LP3I Pekanbaru
              </span>
              <h3 className="font-black text-2xl text-slate-900 mt-2">Selesaikan Donasi</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Dapat transfer ke rekening atau scan QRIS dengan GoPay, OVO, ShopeePay, M-Banking</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center">
              <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">Transfer Bank BSI</p>
              <p className="text-xl font-black text-slate-900 mb-3 tracking-wider">{config.bankInfo}</p>
              <button 
                onClick={handleCopyAccount}
                className="mx-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
              >
                {copiedBank ? (
                  <><Check className="w-4 h-4 text-emerald-600" /> Tersalin!</>
                ) : (
                  <><Copy className="w-4 h-4" /> Salin Rekening</>
                )}
              </button>
            </div>

            {/* QRIS Visual Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                {config.qrisImageUrl ? (
                  <img src={config.qrisImageUrl} alt="QRIS BEM LP3I" className="w-48 h-48 object-contain rounded-lg" />
                ) : (
                  <div className="w-48 h-48 bg-slate-900 text-white p-3 rounded-xl flex flex-col items-center justify-center relative">
                    <QrCode className="w-24 h-24 text-white" />
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 mt-2 uppercase text-center font-bold">QRIS BELUM TERSEDIA</span>
                  </div>
                )}
              </div>
              <div className="text-center space-y-0.5">
                <strong className="text-xs font-black text-slate-900 block">Atas Nama BEM LP3I Pekanbaru</strong>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={waConfirmationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                  });
                }}
                className="w-full h-[52px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-[16px] cursor-pointer flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Konfirmasi via WhatsApp</span>
              </a>
              <button
                onClick={() => setShowQrisModal(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Tutup QRIS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Volunteer Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-[20px] p-6 sm:p-8 max-w-md w-full space-y-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-slate-200 relative">
            <button 
              onClick={() => setShowVolunteerModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold uppercase">
                Relawan BEM Kabinet Luminaire
              </span>
              <h3 className="font-black text-2xl text-slate-900 mt-2">Pendaftaran Tim Lapangan</h3>
              <p className="text-xs text-slate-500 font-medium">Bergabunglah dalam aksi penyaluran Jumat Berkah LP3I Pekanbaru</p>
            </div>

            {volSubmitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <Check className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Pendaftaran Berhasil!</h4>
                <p className="text-xs text-slate-600">Tim BEM LP3I Pekanbaru akan menghubungi WhatsApp Anda.</p>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Nama Lengkap Mahasiswa</label>
                  <input
                    type="text"
                    required
                    value={volName}
                    onChange={(e) => setVolName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Program Studi</label>
                    <select
                      value={volProdi}
                      onChange={(e) => setVolProdi(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-white font-medium"
                    >
                      <option value="Manajemen Informatika">Manajemen Informatika</option>
                      <option value="Akuntansi Keuangan">Akuntansi Keuangan</option>
                      <option value="Administrasi Bisnis">Administrasi Bisnis</option>
                      <option value="Hubungan Masyarakat">Hubungan Masyarakat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">NIM / Semester</label>
                    <input
                      type="text"
                      value={volNim}
                      onChange={(e) => setVolNim(e.target.value)}
                      placeholder="20240102 / 3"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">No. WhatsApp Aktif</label>
                  <input
                    type="tel"
                    required
                    value={volWa}
                    onChange={(e) => setVolWa(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowVolunteerModal(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer hover:bg-slate-200 transition-colors text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingVol}
                    className="flex-1 h-[48px] bg-emerald-600 text-white font-extrabold rounded-xl cursor-pointer hover:bg-emerald-700 disabled:opacity-50 transition-colors text-xs shadow-sm"
                  >
                    {isSubmittingVol ? 'Mendaftar...' : 'Daftar Sekarang'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
