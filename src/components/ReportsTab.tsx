import React, { useState } from 'react';
import { 
  FileText, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Heart, 
  Sparkles, 
  Building2, 
  ShieldCheck,
  QrCode,
  FileSpreadsheet,
  MapPin
} from 'lucide-react';
import { Transaction, DistributionSpot, WeeklyConfig } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

interface ReportsTabProps {
  config: WeeklyConfig;
  transactions: Transaction[];
  spots: DistributionSpot[];
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  config,
  transactions,
  spots,
}) => {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [csvDownloaded, setCsvDownloaded] = useState(false);


  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;
  const totalDistributed = spots.reduce((sum, s) => sum + s.distributedPackages, 0);

  // Generate WhatsApp Message Text
  const waMessageText = `*LAPORAN KEUANGAN & PENYALURAN JUMAT BERKAH*
*${config.organizationName}*
*${config.currentFridayLabel}*
______________________________________

*RINGKASAN KAS:*
• Donasi Masuk: *${formatRupiah(totalIncome)}*
• Belanja & Operasional: *${formatRupiah(totalExpense)}*
• Sisa Saldo Kas: *${formatRupiah(currentBalance)}*
• Porsi Nasi Terbagikan: *${totalDistributed} Porsi*

*ALOKASI BELANJA JUMAT INI:*
${transactions
  .filter((t) => t.type === 'EXPENSE')
  .map((t) => `• ${t.category}: ${formatRupiah(t.amount)} (${t.notes})`)
  .join('\n') || '• Belum ada catatan belanja'}

*TITIK PENYALURAN:*
${spots
  .map(
    (s) =>
      `• ${s.name} (${s.distributedPackages}/${s.targetPackages} porsi) - Status: ${s.status === 'COMPLETED' ? 'Selesai' : 'Proses'}`
  )
  .join('\n') || '• Belum ada titik penyaluran'}

______________________________________
*REKENING DONASI MINGGU DEPAN:*
${config.bankInfo}
a.n. *${config.accountHolder}*

Jazakumullah Khairan Katsiran kepada seluruh Donatur. Semoga menjadi pahala jariyah yang mengalir tiada putus. Aamiin.`;

  const handleCopyWA = () => {
    navigator.clipboard.writeText(waMessageText);
    setCopied(true);
    addToast('Teks Format Disalin!', 'success', 'Format pesan WhatsApp siap dibagikan ke grup donatur/komunitas.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPDF = () => {
    addToast('Menyiapkan Cetak PDF', 'info', 'Silakan pilih simpan sebagai PDF di menu cetak browser.');
    window.print();
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const sanitize = (val: string | number | undefined) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };

    const lines: string[] = [];

    // Header info
    lines.push(sanitize('LAPORAN KEUANGAN & PENYALURAN JUMAT BERKAH'));
    lines.push(`${sanitize('Organisasi')},${sanitize(config.organizationName)}`);
    lines.push(`${sanitize('Periode')},${sanitize(config.currentFridayLabel)}`);
    lines.push(`${sanitize('Total Donasi Masuk')},${sanitize(totalIncome)}`);
    lines.push(`${sanitize('Total Belanja Operasional')},${sanitize(totalExpense)}`);
    lines.push(`${sanitize('Sisa Saldo Kas')},${sanitize(currentBalance)}`);
    lines.push(`${sanitize('Total Porsi Terbagikan')},${sanitize(totalDistributed)}`);
    lines.push('');

    // Transactions Section
    lines.push(sanitize('--- BUATAN BUKU KAS & TRANSAKSI ---'));
    lines.push([
      sanitize('ID Transaksi'),
      sanitize('Tanggal'),
      sanitize('Tipe'),
      sanitize('Kategori'),
      sanitize('Donatur / Pemasok'),
      sanitize('Metode Pembayaran'),
      sanitize('Jumlah (Rp)'),
      sanitize('Catatan'),
      sanitize('Verifikator')
    ].join(','));

    transactions.forEach((t) => {
      lines.push([
        sanitize(t.id),
        sanitize(t.date),
        sanitize(t.type === 'INCOME' ? 'PEMASUKAN / DONASI' : 'PENGELUARAN / BELANJA'),
        sanitize(t.category),
        sanitize(t.donorOrVendor),
        sanitize(t.paymentMethod),
        sanitize(t.amount),
        sanitize(t.notes || '-'),
        sanitize(t.verifiedBy || '-')
      ].join(','));
    });

    lines.push('');

    // Distribution Spots Section
    lines.push(sanitize('--- DATA TITIK PENYALURAN ---'));
    lines.push([
      sanitize('ID Spot'),
      sanitize('Nama Lokasi'),
      sanitize('Kategori'),
      sanitize('Detail Lokasi'),
      sanitize('Target Porsi'),
      sanitize('Porsi Terbagikan'),
      sanitize('Status'),
      sanitize('Koordinator'),
      sanitize('Jam Waktu')
    ].join(','));

    spots.forEach((s) => {
      lines.push([
        sanitize(s.id),
        sanitize(s.name),
        sanitize(s.category),
        sanitize(s.location),
        sanitize(s.targetPackages),
        sanitize(s.distributedPackages),
        sanitize(s.status === 'COMPLETED' ? 'Selesai' : s.status === 'IN_PROGRESS' ? 'Berjalan' : 'Pending'),
        sanitize(s.coordinator),
        sanitize(s.timeSlot)
      ].join(','));
    });

    // Create Download Link (with UTF-8 BOM for Excel compatibility)
    const csvContent = '\uFEFF' + lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const filenameDate = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Laporan_Jumat_Berkah_BEM_Luminaire_${filenameDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCsvDownloaded(true);
    addToast('File CSV Diunduh!', 'success', 'Laporan transaksi & penyaluran telah diunduh ke format Excel/CSV.');
    setTimeout(() => setCsvDownloaded(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Laporan Transparansi & Ekspor Arsip
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan pertanggungjawaban donatur, ekspor CSV/PDF untuk arsip BEM, & broadcast WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{csvDownloaded ? 'CSV Terunduh!' : 'Ekspor CSV'}</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak / PDF</span>
          </button>

          <button
            onClick={handleCopyWA}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Teks WA Tersalin!' : 'Salin Teks WA'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* WhatsApp Generator Card (Width 5) - Hidden on Print */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-emerald-950 text-white space-y-4 shadow-xl print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <Share2 className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-white">Broadcast WhatsApp</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold">
              Siap Kirim
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Format pesan otomatis tersinkronisasi dengan transaksi & titik penyaluran. Tinggal tekan tombol salin lalu tempel ke grup WhatsApp.
          </p>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-emerald-300/90 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed select-all">
            {waMessageText}
          </div>

          <button
            onClick={handleCopyWA}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Berhasil Disalin ke Clipboard!' : 'Salin Teks Pesan WhatsApp'}</span>
          </button>
        </div>

        {/* Official Printable Report Sheet (Width 7) */}
        <div className="lg:col-span-7 printable-document p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 print:shadow-none print:border-none print:p-0 print:w-full">
          {/* Header Report Printable */}
          <div className="border-b border-slate-200 pb-6 text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 font-bold shadow">
              <Heart className="w-6 h-6 fill-white/20" />
            </div>
            <h3 className="font-black text-xl text-slate-900 tracking-tight">{config.organizationName}</h3>
            <p className="text-xs text-slate-500 font-semibold">{config.motto}</p>
            <div className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              Laporan Keuangan & Penyaluran {config.currentFridayLabel}
            </div>
          </div>

          {/* Quick Action Export Buttons inside Document */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 print:hidden text-xs">
            <span className="font-bold text-slate-700">Arsip Resmi Laporan Kegiatan:</span>
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
              <button
                onClick={handlePrintPDF}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-bold hover:bg-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>

          {/* Financial Summary Matrix */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Donasi</span>
              <span className="font-extrabold text-base md:text-lg text-emerald-900 mt-0.5 block">{formatRupiah(totalIncome)}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Total Belanja</span>
              <span className="font-extrabold text-base md:text-lg text-rose-900 mt-0.5 block">{formatRupiah(totalExpense)}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Sisa Kas</span>
              <span className="font-extrabold text-base md:text-lg text-slate-900 mt-0.5 block">{formatRupiah(currentBalance)}</span>
            </div>
          </div>

          {/* Table List of Income (Donasi) */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Daftar Donatur / Infaq Masuk
            </h4>
            {transactions.filter((t) => t.type === 'INCOME').length === 0 ? (
              <div className="p-4 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
                Belum ada catatan donasi masuk.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                      <th className="p-2.5">Donatur</th>
                      <th className="p-2.5">Metode</th>
                      <th className="p-2.5 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {transactions
                      .filter((t) => t.type === 'INCOME')
                      .map((t) => (
                        <tr key={t.id}>
                          <td className="p-2.5 font-medium">{t.donorOrVendor}</td>
                          <td className="p-2.5 text-slate-500">{t.paymentMethod}</td>
                          <td className="p-2.5 text-right font-extrabold text-emerald-700">
                            {formatRupiah(t.amount)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Table List of Expense (Belanja) */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Rincian Pengeluaran & Belanja Operasional
            </h4>
            {transactions.filter((t) => t.type === 'EXPENSE').length === 0 ? (
              <div className="p-4 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
                Belum ada catatan pengeluaran belanja.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                      <th className="p-2.5">Kategori / Keperluan</th>
                      <th className="p-2.5">Pemasok / Toko</th>
                      <th className="p-2.5 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {transactions
                      .filter((t) => t.type === 'EXPENSE')
                      .map((t) => (
                        <tr key={t.id}>
                          <td className="p-2.5 font-medium">
                            {t.category}
                            {t.notes && <span className="block text-[11px] text-slate-400 font-normal">{t.notes}</span>}
                          </td>
                          <td className="p-2.5 text-slate-500">{t.donorOrVendor}</td>
                          <td className="p-2.5 text-right font-extrabold text-rose-700">
                            {formatRupiah(t.amount)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Distribution Spots Summary Table */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Status Penyaluran Paket Nasi & Santunan
            </h4>
            {spots.length === 0 ? (
              <div className="p-4 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
                Belum ada data titik penyaluran.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                      <th className="p-2.5">Lokasi Spot</th>
                      <th className="p-2.5 text-center">Porsi</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {spots.map((s) => (
                      <tr key={s.id}>
                        <td className="p-2.5 font-medium">{s.name}</td>
                        <td className="p-2.5 text-center font-bold">{s.distributedPackages} / {s.targetPackages}</td>
                        <td className="p-2.5 text-right font-bold">
                          <span className={s.status === 'COMPLETED' ? 'text-emerald-700' : 'text-amber-600'}>
                            {s.status === 'COMPLETED' ? 'Selesai' : s.status === 'IN_PROGRESS' ? 'Berjalan' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bank Info Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Rekening Resmi Donasi
              </span>
              <strong className="font-extrabold text-xs text-slate-900 block">{config.bankInfo}</strong>
              <span className="text-[11px] text-slate-500">a.n. {config.accountHolder}</span>
            </div>
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

