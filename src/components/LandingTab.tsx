import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check, 
  ArrowRight, 
  Users, 
  Gift, 
  MapPin, 
  Share2, 
  ExternalLink, 
  Award, 
  Building2, 
  HeartHandshake, 
  MessageSquare,
  Send,
  Calendar,
  Clock,
  Timer,
  Utensils,
  CheckCircle2,
  Zap,
  Navigation,
  Lock,
  Phone,
  Mail
} from 'lucide-react';
import { WeeklyConfig, Transaction, DistributionSpot, GalleryItem } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { GalleryTestimonials } from './GalleryTestimonials';
import { FaqSection } from './FaqSection';
import { ShareSection } from './ShareSection';

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

const getNextFridayTarget = () => {
  const now = new Date();
  const target = new Date(now);
  const dayOfWeek = now.getDay(); // 0: Sun, 1: Mon, ..., 5: Fri, 6: Sat
  
  let daysToGo = (5 - dayOfWeek + 7) % 7;
  if (daysToGo === 0 && now.getHours() >= 14) {
    daysToGo = 7;
  }

  target.setDate(now.getDate() + daysToGo);
  target.setHours(11, 30, 0, 0);
  return target;
};

const calculateTimeRemaining = () => {
  const target = getNextFridayTarget();
  const diff = Math.max(0, target.getTime() - Date.now());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, targetDate: target };
};

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
  const [copiedBank, setCopiedBank] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Volunteer form state
  const [volName, setVolName] = useState('');
  const [volProdi, setVolProdi] = useState('Manajemen Informatika');
  const [volNim, setVolNim] = useState('');
  const [volWa, setVolWa] = useState('');
  const [volSubmitted, setVolSubmitted] = useState(false);

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;
  const totalDistributed = spots.reduce((sum, s) => sum + s.distributedPackages, 0);
  const totalTarget = spots.reduce((sum, s) => sum + s.targetPackages, 0);
  const progressPercent = totalTarget > 0 ? Math.round((totalDistributed / totalTarget) * 100) : 0;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("7100202488");
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName || !volWa) return;
    setVolSubmitted(true);
    setTimeout(() => {
      setVolSubmitted(false);
      setShowVolunteerModal(false);
      setVolName('');
      setVolNim('');
      setVolWa('');
    }, 2000);
  };

  // WhatsApp confirmation text generator
  const waConfirmationUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(
    `Halo BEM LP3I Pekanbaru Kabinet Luminaire,\nSaya ingin mengonfirmasi donasi untuk Program Lumina Sharing Jumat Berkah.`
  )}`;

  return (
    <div className="w-full pb-0 space-y-0">
      {/* Hero Banner Section with Campus Background */}
      <div id="hero" className="w-full relative text-white px-4 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20 overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx7vsQhix8E6D2Ss-p17Bi8YQ-Vo2LrA24e2Q9YbLJpg&s=10')]">
        {/* Dark Overlay for clear text legibility */}
        <div className="absolute inset-0 bg-slate-950/85"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/30 text-blue-200 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Kampus LP3I Pekanbaru • BEM Kabinet Luminaire</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Lumina Sharing <br />
            <span className="text-amber-300">
              Jumat Berkah LP3I Pekanbaru
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl font-normal">
            {config.motto}. Wadah resmi transparansi infaq, sedekah porsi nasi kotak, dan santunan yatim yang dikelola langsung oleh mahasiswa BEM LP3I Pekanbaru Kabinet Luminaire.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowQrisModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>Donasi Sekarang (QRIS / Bank)</span>
            </button>

            <a
              href="#donasi-rekening"
              className="px-5 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-blue-200" />
              <span>Info Rekening & QRIS</span>
            </a>

            <button
              onClick={() => setShowVolunteerModal(true)}
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-300" />
              <span>Daftar Relawan Mahasiswa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simplified Friday Agenda & Countdown Banner */}
      <div id="agenda-jumat" className="w-full bg-slate-900 text-white border-y border-slate-800 px-4 sm:px-8 md:px-12 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Pengingat Agenda Jumat Terdekat</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {formatDateIndo(timeLeft.targetDate.toISOString())}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Penyaluran Nasi Kotak Nutrisi & Santunan Dhuafa oleh BEM LP3I Pekanbaru Kabinet Luminaire. Target pekan ini: <strong className="text-amber-300">{config.targetPortions} Porsi</strong>.
            </p>
          </div>

          {/* Live Countdown Timer Blocks */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
            <div className="flex flex-col items-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg sm:text-xl font-black text-amber-300">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Hari</span>
            </div>

            <span className="text-lg font-bold text-slate-500 mb-3">:</span>

            <div className="flex flex-col items-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg sm:text-xl font-black text-blue-300">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Jam</span>
            </div>

            <span className="text-lg font-bold text-slate-500 mb-3">:</span>

            <div className="flex flex-col items-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg sm:text-xl font-black text-sky-300">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Menit</span>
            </div>

            <span className="text-lg font-bold text-slate-500 mb-3">:</span>

            <div className="flex flex-col items-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg sm:text-xl font-black text-rose-300">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Detik</span>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setShowQrisModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>Donasi Sekarang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Impact Matrix */}
      <div className="w-full bg-slate-50 border-b border-slate-200/80 px-4 sm:px-8 md:px-12 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Donasi Terkumpul</span>
              <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
                <Gift className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{formatRupiah(totalIncome)}</p>
            <div className="flex items-center justify-between text-xs font-semibold text-blue-700">
              <span>{transactions.filter(t => t.type === 'INCOME').length} Donatur Terdaftar</span>
              <span className="px-2 py-0.5 bg-blue-100 rounded-full text-[10px] font-bold">Transparan</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-blue-600 text-white shadow-xs space-y-3">
            <div className="flex justify-between items-center text-blue-100">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Porsi Terbagikan</span>
              <div className="p-2 bg-blue-700 rounded-xl text-white">
                <HeartHandshake className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">{totalDistributed} <span className="text-lg font-bold text-blue-200">/ {totalTarget} Porsi</span></p>
            <div className="w-full bg-blue-800 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Penyaluran (Belanja)</span>
              <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-orange-500 tracking-tight">{formatRupiah(totalExpense)}</p>
            <p className="text-xs text-slate-500 font-medium">Nasi Kotak, Minuman & Santunan Yatim</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xs space-y-3 flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Sisa Saldo Kas Mengendap</span>
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white tracking-tight">{formatRupiah(currentBalance)}</p>
            <p className="text-xs text-slate-400">Kas terbuka LP3I Pekanbaru (Kabinet Luminaire)</p>
          </div>
        </div>
      </div>

      {/* How It Works - 4 Friday Cycle */}
      <div id="mekanisme" className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 md:px-12 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-[11px] font-extrabold uppercase tracking-wider">
              Alur Program Kerja
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Mekanisme Siklus Bulanan Jumat Berkah
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Program sosial berkelanjutan oleh BEM Politeknik LP3I Pekanbaru
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full uppercase">
                  Jumat Pekan 1 s/d 4
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Pengumpulan Infaq Kampus
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap hari Jumat, tim BEM meminta sumbangan secara sukarela kepada seluruh civitas akademika Politeknik LP3I Pekanbaru (Dosen, Staf, & Mahasiswa).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
                <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full uppercase">
                  Akhir Bulan (Pekan 4)
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Rekapitulasi & Pembelian Porsi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setelah terkumpul selama 1 bulan (4 kali Jumat), dana dihitung dan dibelanjakan untuk paket nasi bungkus/kotak dan kebutuhan penyaluran.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase">
                  Aksi Lapangan
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Penyaluran Akbar di Jalanan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tim mahasiswa BEM membagikan paket makanan langsung kepada masyarakat yang membutuhkan, driver ojol, dhuafa, dan panti asuhan di Pekanbaru.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Program Pillars & Luminaire Cabinet Mission */}
      <div id="pilar-program" className="w-full bg-slate-50 border-b border-slate-200/80 px-4 sm:px-8 md:px-12 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider">
              Aksi Nyata BEM LP3I Pekanbaru
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              4 Pilar Utama Program Lumina Sharing
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Dikaji dan dieksekusi secara terstruktur oleh BEM Kabinet Luminaire demi kemaslahatan masyarakat Riau
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">1. Porsi Nasi Kotak Nutrisi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Penyediaan makanan sehat dan bergizi untuk jamaah Shalat Jumat dan masyarakat yang membutuhkan di Pekanbaru.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">2. Santunan Pendidikan Yatim</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bantuan tunai dan alat tulis langsung disalurkan ke panti asuhan binaan sekitar Pekanbaru.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">3. Aksi Mobile Pejuang Jalanan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tim mahasiswa menyisir jalanan Tuanku Tambusai & Rumbai membagikan makanan ke driver ojol & dhuafa.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">4. 100% Audit Transparansi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Laporan real-time terbuka yang dapat diakses seluruh civitas akademika, donatur, dan masyarakat umum.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Channel Card (Bank Transfer & QRIS) */}
      <div id="donasi-rekening" className="w-full bg-slate-900 text-white px-4 sm:px-8 md:px-12 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-extrabold uppercase tracking-widest">
                Rekening Resmi BEM LP3I Pekanbaru
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Salurkan Infaq Terbaik Anda Hari Ini
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Setiap Rp 15.000 mewakili 1 porsi nasi kotak lengkap dengan lauk, sayur, dan air mineral.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowQrisModal(true)}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                <span>Buka QRIS Donasi</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Bank Account Info Card */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Bank Syariah Indonesia (BSI)</span>
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Nomor Rekening:</span>
                <div className="flex items-center justify-between gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
                  <span className="font-mono text-lg font-black text-blue-300 tracking-wider">7100-2024-88</span>
                  <button
                    onClick={handleCopyAccount}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Salin No Rekening"
                  >
                    {copiedBank ? <Check className="w-4 h-4 text-blue-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copiedBank && <span className="text-[10px] text-blue-400 font-bold mt-1 block">Nomor Rekening Tersalin!</span>}
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Atas Nama:</span>
                <strong className="text-sm font-extrabold text-white">BEM LP3I Pekanbaru (Kabinet Luminaire)</strong>
              </div>
            </div>

            {/* Quick WA Confirmation Card */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Konfirmasi Otomatis</span>
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Setelah melakukan transfer, silakan kirimkan bukti resi ke panitia BEM agar segera dicatat secara transparan.
                </p>
              </div>

              <a
                href={waConfirmationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Konfirmasi Donasi via WA</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Spots Live Progress */}
      <div id="titik-penyaluran" className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 md:px-12 py-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Titik Penyaluran Lumina Sharing Pekan Ini
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Lokasi sasaran distribusi nasi kotak & santunan oleh BEM LP3I Pekanbaru
              </p>
            </div>
          </div>

          {spots.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">Belum Ada Titik Penyaluran</h3>
              <p className="text-xs text-slate-500">
                Titik penyaluran porsi Nasi Kotak & Santunan akan diinput secara real-time oleh pengurus BEM Kabinet Luminaire.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spots.map((spot) => {
                const isDone = spot.status === 'COMPLETED';
                const percent = Math.min(100, Math.round((spot.distributedPackages / (spot.targetPackages || 1)) * 100));

                return (
                  <div
                    key={spot.id}
                    className={`p-6 rounded-3xl border transition-all space-y-4 ${
                      isDone
                        ? 'bg-blue-50/50 border-blue-200'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wide">
                          {spot.category}
                        </span>
                        <h3 className="font-extrabold text-lg text-slate-900 mt-1">{spot.name}</h3>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          isDone
                            ? 'bg-blue-600 text-white'
                            : spot.status === 'IN_PROGRESS'
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isDone ? 'Selesai' : spot.status === 'IN_PROGRESS' ? 'Berjalan' : 'Pending'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{spot.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Koordinator: {spot.coordinator}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Progres Penyaluran</span>
                        <span>{spot.distributedPackages} / {spot.targetPackages} Porsi ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDone ? 'bg-blue-600' : 'bg-sky-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Gallery & Testimonials Section */}
      <GalleryTestimonials items={galleryItems} />

      {/* Live Recent Donors Section */}
      <div id="donatur-terbaru" className="w-full bg-slate-50 border-b border-slate-200/80 px-4 sm:px-8 md:px-12 py-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Daftar Donatur Terakhir</h2>
              <p className="text-xs text-slate-500">Donasi masuk real-time terverifikasi oleh BEM Kabinet Luminaire</p>
            </div>

            <span className="px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-full border border-blue-100">
              Transparan & Terverifikasi
            </span>
          </div>

          {transactions.filter((t) => t.type === 'INCOME').length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <Heart className="w-8 h-8 text-blue-500 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">Belum Ada Catatan Donasi</h3>
              <p className="text-xs text-slate-500">
                Setiap donasi masuk yang dicatat oleh pengurus BEM akan langsung muncul di sini secara real-time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              {transactions
                .filter((t) => t.type === 'INCOME')
                .slice(0, 5)
                .map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        <Heart className="w-4 h-4 fill-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{tx.donorOrVendor}</h4>
                        <p className="text-[11px] text-slate-500">{tx.notes}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-blue-600 text-sm block">+{formatRupiah(tx.amount)}</span>
                      <span className="text-[10px] font-semibold text-slate-400">{tx.paymentMethod} • {tx.date}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Social Share Section */}
      <ShareSection />

      {/* Simple & Elegant Full-Width Footer */}
      <footer className="w-full bg-slate-900 text-slate-300 px-4 sm:px-8 md:px-12 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            {/* Brand */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 p-1 overflow-hidden">
                  <img src="/lp3i-logo.png" alt="LP3I Logo" className="w-full h-full object-contain" />
                </div>
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Politeknik LP3I Pekanbaru
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Kabinet Luminaire • Program Sedekah & Berbagi Berkah
              </p>
            </div>

            {/* Quick Nav Links */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-400">
              <a href="#hero" className="hover:text-white transition-colors">Beranda</a>
              <a href="#agenda-jumat" className="hover:text-white transition-colors">Agenda Jumat</a>
              <a href="#mekanisme" className="hover:text-white transition-colors">Siklus Program</a>
              <a href="#donasi-rekening" className="hover:text-white transition-colors">Rekening & QRIS</a>
              <a href="#titik-penyaluran" className="hover:text-white transition-colors">Titik Penyaluran</a>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
            <p>© {new Date().getFullYear()} BEM Politeknik LP3I Pekanbaru. All rights reserved.</p>

            {isAdminLoggedIn && (
              <button
                onClick={() => onNavigateToTab && onNavigateToTab('dashboard')}
                className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Dashboard Admin</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* QRIS Modal */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">
                QRIS BEM LP3I Pekanbaru
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-2">Scan QRIS Lumina Sharing</h3>
              <p className="text-xs text-slate-500 mt-0.5">Dapat discan dengan GoPay, OVO, ShopeePay, BCA, BSI & M-Banking</p>
            </div>

            {/* QRIS Visual Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner flex flex-col items-center justify-center">
                <div className="w-48 h-48 bg-slate-900 text-white p-3 rounded-lg flex flex-col items-center justify-center relative">
                  <QrCode className="w-36 h-36 text-white" />
                  <span className="text-[9px] font-mono tracking-widest text-blue-300 mt-1 uppercase">BEM LP3I LUMINA</span>
                </div>
              </div>
              <div className="text-center space-y-0.5">
                <strong className="text-xs font-black text-slate-900 block">NMID: ID102024889901</strong>
                <span className="text-[11px] text-slate-500 font-medium">BEM LP3I Pekanbaru (Kabinet Luminaire)</span>
              </div>
            </div>

            <button
              onClick={() => setShowQrisModal(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Tutup QRIS
            </button>
          </div>
        </div>
      )}

      {/* Student Volunteer Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">
                Relawan BEM Kabinet Luminaire
              </span>
              <h3 className="font-black text-xl text-slate-900 mt-1">Pendaftaran Tim Lapangan Mahasiswa</h3>
              <p className="text-xs text-slate-500">Bergabunglah dalam aksi penyaluran Jumat Berkah LP3I Pekanbaru</p>
            </div>

            {volSubmitted ? (
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 text-center space-y-2">
                <Check className="w-10 h-10 text-blue-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Pendaftaran Berhasil!</h4>
                <p className="text-xs text-slate-600">Tim Kementerian Sosmas BEM LP3I Pekanbaru akan menghubungi WhatsApp Anda.</p>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Mahasiswa</label>
                  <input
                    type="text"
                    required
                    value={volName}
                    onChange={(e) => setVolName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Program Studi</label>
                    <select
                      value={volProdi}
                      onChange={(e) => setVolProdi(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Manajemen Informatika">Manajemen Informatika</option>
                      <option value="Akuntansi Keuangan">Akuntansi Keuangan</option>
                      <option value="Administrasi Bisnis">Administrasi Bisnis</option>
                      <option value="Hubungan Masyarakat">Hubungan Masyarakat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">NIM / Semester</label>
                    <input
                      type="text"
                      value={volNim}
                      onChange={(e) => setVolNim(e.target.value)}
                      placeholder="Misal: 20240102 / Sem 3"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp Aktif</label>
                  <input
                    type="tel"
                    required
                    value={volWa}
                    onChange={(e) => setVolWa(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowVolunteerModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer hover:bg-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl cursor-pointer hover:bg-blue-700"
                  >
                    Kirim Pendaftaran
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
