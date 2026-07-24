import React, { useMemo, useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Package, 
  Calendar, 
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Coins,
  Receipt,
  Users,
  BarChart2,
  Wallet,
  MapPin,
  Camera,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  } from 'recharts';
import { Transaction, DistributionSpot, WeeklyConfig, FridayTrendData, GalleryItem } from '../types';
import { formatRupiah, formatShortRupiah } from '../utils/formatters';

interface DashboardTabProps {
  config: WeeklyConfig;
  transactions: Transaction[];
  spots: DistributionSpot[];
  trendData: FridayTrendData[];
  galleryItems?: GalleryItem[];
  onOpenAddModal: (defaultType?: 'INCOME' | 'EXPENSE') => void;
  onNavigateToTab: (tab: 'transactions' | 'distribution' | 'reports') => void;
  onOpenAddGalleryModal?: () => void;
  onDeleteGalleryItem?: (id: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  config,
  transactions,
  spots,
  trendData,
  galleryItems = [],
  onOpenAddModal,
  onNavigateToTab,
  onOpenAddGalleryModal,
  onDeleteGalleryItem,
}) => {
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  const targetMonthlyDonation = config.targetMonthlyDonation || 30000000;
  const targetMonthlyPortions = config.targetMonthlyPortions || 2000;
  const targetBudget = targetMonthlyDonation;
  const budgetProgressPercent = Math.min(
    100,
    Math.round((totalIncome / (targetMonthlyDonation || 1)) * 100)
  );
  const monthlyBudgetProgressPercent = budgetProgressPercent;

  const totalDistributedPackages = spots.reduce(
    (sum, s) => sum + s.distributedPackages,
    0
  );
  const totalTargetPackages = spots.reduce(
    (sum, s) => sum + s.targetPackages,
    0
  );
  const distributionProgressPercent = Math.min(
    100,
    Math.round((totalDistributedPackages / (targetMonthlyPortions || 1)) * 100)
  );

  // Chart data aggregation for Recharts
  const chartData = useMemo(() => {
    if (transactions.length === 0 && spots.length === 0 && trendData.length > 0) {
      return trendData.map((d) => ({
        name: d.label,
        income: d.income,
        expense: d.expense,
        portions: d.portions,
      }));
    }

    if (transactions.length === 0 && spots.length === 0) {
      return [
        { name: 'Jumat ke-1', income: 0, expense: 0, portions: 0 },
        { name: 'Jumat ke-2', income: 0, expense: 0, portions: 0 },
        { name: 'Jumat ke-3', income: 0, expense: 0, portions: 0 },
        { name: `Jumat ke-4 (${config.targetMonthLabel || 'Bulan Ini'})`, income: 0, expense: 0, portions: 0 },
      ];
    }

    // Group transactions by fridayPeriod or date
    const groups: { [key: string]: { name: string; income: number; expense: number; portions: number } } = {};

    transactions.forEach((t) => {
      const key = t.fridayPeriod || t.date || 'Lainnya';
      if (!groups[key]) {
        groups[key] = { name: key, income: 0, expense: 0, portions: 0 };
      }
      if (t.type === 'INCOME') {
        groups[key].income += t.amount;
      } else {
        groups[key].expense += t.amount;
      }
    });

    const totalDistributed = spots.reduce((sum, s) => sum + s.distributedPackages, 0);
    const result = Object.values(groups);

    if (result.length > 0) {
      result[result.length - 1].portions = totalDistributed;
    }

    return result;
  }, [transactions, spots, trendData, config]);

  const categoryTotals: { [key: string]: number } = {};
  transactions
    .filter((t) => t.type === 'EXPENSE')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // SVG Circumference calculations for Dial
  const radiusOuter = 75;
  const circumferenceOuter = 2 * Math.PI * radiusOuter;
  const strokeDashoffsetOuter =
    circumferenceOuter - (monthlyBudgetProgressPercent / 100) * circumferenceOuter;

  const radiusInner = 55;
  const circumferenceInner = 2 * Math.PI * radiusInner;
  const strokeDashoffsetInner =
    circumferenceInner - (distributionProgressPercent / 100) * circumferenceInner;

  const completedSpotsCount = spots.filter((s) => s.status === 'COMPLETED').length;
  const activeSpotsCount = spots.filter((s) => s.status === 'IN_PROGRESS' || s.status === 'PENDING').length;

  return (
    <div className="space-y-8 pb-10">
      {/* Executive Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Saldo Kas Saat Ini */}
        <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-md border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-blue-400" />
                Saldo Kas Saat Ini
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-900 text-blue-200 text-[10px] font-bold border border-blue-700/50">
                Kas Bersih
              </span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">{formatRupiah(currentBalance)}</h2>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-medium">
            <span>Masuk: <strong className="text-white">{formatShortRupiah(totalIncome)}</strong></span>
            <span>Belanja: <strong className="text-rose-300">{formatShortRupiah(totalExpense)}</strong></span>
          </div>
        </div>

        {/* Card 2: Total Paket Terbagikan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-blue-600" />
                Total Paket Terbagikan
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                {distributionProgressPercent}% Target
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{totalDistributedPackages}</h2>
              <span className="text-slate-500 text-xs font-semibold">/ {targetMonthlyPortions} Porsi</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1.5">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${distributionProgressPercent}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Target Bulan: <span className="font-bold text-slate-700">{config.targetMonthLabel || 'Bulan Ini'}</span>
            </p>
          </div>
        </div>

        {/* Card 3: Jumlah Titik Penyaluran Aktif */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Titik Penyaluran Aktif
              </span>
              <button 
                onClick={() => onNavigateToTab('distribution')}
                className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                Peta <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{spots.length}</h2>
              <span className="text-slate-500 text-xs font-semibold">Lokasi Penyaluran</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
            <span className="text-blue-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {completedSpotsCount} Selesai
            </span>
            <span className="text-amber-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {activeSpotsCount} Dalam Proses
            </span>
          </div>
        </div>

        {/* Card 4: Capaian Donasi & Aksi Cepat */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-blue-600" />
                Capaian Donasi Masuk
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                {monthlyBudgetProgressPercent}%
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{formatShortRupiah(totalIncome)}</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Target: {formatShortRupiah(targetMonthlyDonation)}</p>
          </div>
          <div className="mt-3">
            <button
              onClick={() => onOpenAddModal('INCOME')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Catat Transaksi Baru
            </button>
          </div>
        </div>
      </div>


      {/* Interactive Recharts Financial & Distribution Trend Chart */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <BarChart2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Visualisasi Grafik Recharts</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Tren Pemasukan, Belanja & Penyaluran Porsi</h3>
            <p className="text-xs text-slate-500 mt-0.5">Grafik perbandingan real-time donasi masuk (Rp), belanja operasional (Rp), dan porsi nasi terbagikan</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full border border-blue-200">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Donasi Masuk</span>
            </div>
            <div className="flex items-center gap-1.5 bg-rose-50 text-rose-800 px-3 py-1.5 rounded-full border border-rose-200">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Belanja / Outflow</span>
            </div>
            <div className="flex items-center gap-1.5 bg-sky-50 text-sky-800 px-3 py-1.5 rounded-full border border-sky-200">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span>Porsi Nasi</span>
            </div>
          </div>
        </div>

        {/* Recharts ComposedChart Container */}
        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                tickFormatter={(value) => formatShortRupiah(value)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 10, fontWeight: 600, fill: '#0284c7' }}
                tickFormatter={(val) => `${val} Porsi`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5">
                        <p className="font-extrabold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
                        {payload.map((entry: any, index: number) => {
                          const isPortions = entry.dataKey === 'portions';
                          return (
                            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                              <span className="flex items-center gap-1.5 font-semibold" style={{ color: entry.color }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                {entry.name}:
                              </span>
                              <span className="font-extrabold">
                                {isPortions ? `${entry.value} Porsi` : formatRupiah(entry.value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 600 }} 
              />
              <Bar 
                yAxisId="left"
                dataKey="income" 
                name="Donasi Masuk (Rp)" 
                fill="#2563eb" 
                radius={[8, 8, 0, 0]} 
                maxBarSize={40}
              />
              <Bar 
                yAxisId="left"
                dataKey="expense" 
                name="Belanja Operasional (Rp)" 
                fill="#f43f5e" 
                radius={[8, 8, 0, 0]} 
                maxBarSize={40}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="portions" 
                name="Porsi Nasi Terbagikan" 
                stroke="#0284c7" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#0284c7', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 7 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Content: Data Grid & Target Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Financial Log Table (Width 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Log Aktivitas Keuangan</h3>
              <p className="text-xs text-slate-400">Pencatatan real-time penerimaan donasi dan operasional</p>
            </div>
            <button
              onClick={() => onNavigateToTab('transactions')}
              className="px-3.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              Lihat Semua Buku Kas
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Keterangan</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.slice(0, 5).map((tx) => {
                  const isIncome = tx.type === 'INCOME';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 text-sm">{tx.donorOrVendor}</p>
                        <p className="text-xs text-slate-400 font-normal line-clamp-1">{tx.notes}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                            isIncome
                              ? 'bg-blue-50 text-blue-600'
                              : tx.category.includes('Nasi') || tx.category.includes('Bahan')
                              ? 'bg-orange-50 text-orange-600'
                              : 'bg-purple-50 text-purple-600'
                          }`}
                        >
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-mono uppercase">
                        {tx.date}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-bold text-sm ${
                          isIncome ? 'text-blue-600' : 'text-orange-600'
                        }`}
                      >
                        {isIncome ? '+ ' : '- '}{formatRupiah(tx.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar Statistics (Width 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex-grow space-y-6">
            <h3 className="font-bold text-slate-800 text-base">Target Penyaluran Lokasi</h3>
            
            <div className="space-y-6">
              {spots.slice(0, 3).map((spot) => {
                const percent = Math.min(100, Math.round((spot.distributedPackages / (spot.targetPackages || 1)) * 100));
                const isComplete = percent === 100;
                
                return (
                  <div key={spot.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
                      <span className="text-slate-600 line-clamp-1">{spot.name}</span>
                      <span className={isComplete ? 'text-blue-600' : 'text-orange-500'}>
                        {percent}% {isComplete ? 'Selesai' : 'Terkumpul'}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isComplete ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-800 p-6 rounded-3xl text-white relative overflow-hidden shadow-md">
            <div className="relative z-10">
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Pesan Berkah</p>
              <p className="text-sm italic font-medium leading-relaxed">
                "Tangan di atas lebih baik daripada tangan di bawah."
              </p>
              <div className="mt-4 pt-4 border-t border-blue-700 text-[10px] uppercase font-bold text-blue-300">
                Reminder: Laporan Transparansi Siap Kirim WA
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Gallery Management Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kelola Galeri Dokumentasi</span>
            </span>
            <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">Foto Aksi Lapangan & Penyaluran</h3>
            <p className="text-xs text-slate-500 font-medium">Foto yang diupload akan langsung ditampilkan di Galeri Landing Page publik.</p>
          </div>

          <button
            type="button"
            onClick={onOpenAddGalleryModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload Foto Dokumentasi</span>
          </button>
        </div>

        {galleryItems.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">Belum Ada Foto Dokumentasi</h4>
            <p className="text-xs text-slate-500">Klik tombol "+ Upload Foto Dokumentasi" di atas untuk menambahkan foto kegiatan BEM.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="group relative bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden space-y-3 p-3 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-200">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {onDeleteGalleryItem && (
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item.id)}
                      title="Hapus Foto"
                      className="absolute top-2 right-2 p-2 rounded-xl bg-slate-950/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-amber-300 text-[10px] font-extrabold">
                    {item.portions}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                    <span>{item.date}</span>
                    <span className="truncate max-w-[120px]">{item.location}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={itemToDelete !== null}
        title="Hapus Foto Dokumentasi?"
        message="Tindakan ini tidak dapat dibatalkan. Foto ini akan dihapus dari galeri dan halaman publik."
        confirmText="Ya, Hapus Foto"
        cancelText="Batal"
        onConfirm={() => {
          if (itemToDelete && onDeleteGalleryItem) {
            onDeleteGalleryItem(itemToDelete);
          }
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};
