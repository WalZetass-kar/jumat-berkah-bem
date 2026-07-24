import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt, 
  Download, 
  Trash2, 
  CheckCircle,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface TransactionsTabProps {
  transactions: Transaction[];
  onOpenAddModal: (defaultType?: TransactionType) => void;
  onDeleteTransaction: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({
  transactions,
  onOpenAddModal,
  onDeleteTransaction,
  searchTerm,
  setSearchTerm,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [previewReceipt, setPreviewReceipt] = useState<string | null>(null);

  // Filter logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.donorOrVendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'ALL' || tx.type === filterType;
    const matchesCategory =
      selectedCategory === 'ALL' || tx.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID,Tanggal,Jenis,Kategori,Donatur/Vendor,Metode,Jumlah,Catatan'];
    const rows = filteredTransactions.map((t) =>
      `"${t.id}","${t.date}","${t.type}","${t.category}","${t.donorOrVendor}","${t.paymentMethod}","${t.amount}","${t.notes.replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `buku_kas_jumat_berkah_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Buku Kas & Catatan Keuangan</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan lengkap seluruh donasi masuk dan pengeluaran belanja Jumat Berkah
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onOpenAddModal('INCOME')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Catat Transaksi</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase tracking-wider">Total Donasi Masuk</span>
            <ArrowDownRight className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="font-black text-3xl text-slate-900 mt-2">{formatRupiah(totalIncome)}</p>
          <span className="inline-block mt-3 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase">
            Pemasukan
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-orange-600">
            <span className="text-xs font-bold uppercase tracking-wider">Total Belanja / Outflow</span>
            <ArrowUpRight className="w-5 h-5 text-orange-500" />
          </div>
          <p className="font-black text-3xl text-orange-500 mt-2">{formatRupiah(totalExpense)}</p>
          <span className="inline-block mt-3 px-2.5 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full uppercase">
            Pengeluaran
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-lg shadow-emerald-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-100">
            <span className="text-xs font-bold uppercase tracking-wider">Sisa Saldo Kas</span>
            <CheckCircle className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="font-black text-3xl text-white mt-2">{formatRupiah(currentBalance)}</p>
          <p className="text-xs text-emerald-200/90 mt-3 font-medium">Terverifikasi & Siap Disalurkan</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs: ALL, INCOME, EXPENSE */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl max-w-md">
            <button
              onClick={() => setFilterType('ALL')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Semua ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('INCOME')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'INCOME' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Donasi Masuk
            </button>
            <button
              onClick={() => setFilterType('EXPENSE')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'EXPENSE' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Pengeluaran
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kata kunci..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-500 font-medium text-sm">Tidak ada transaksi yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => {
              const isIncome = tx.type === 'INCOME';
              return (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      {isIncome ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900">{tx.donorOrVendor}</h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isIncome
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {tx.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {tx.paymentMethod}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{tx.notes}</p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium pt-0.5">
                        <span>{formatDateIndo(tx.date)}</span>
                        {tx.verifiedBy && <span>• Diverifikasi: {tx.verifiedBy}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span
                        className={`font-black text-lg block ${
                          isIncome ? 'text-emerald-600' : 'text-orange-600'
                        }`}
                      >
                        {isIncome ? '+' : '-'} {formatRupiah(tx.amount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {tx.receiptUrl && (
                        <button
                          onClick={() => setPreviewReceipt(tx.receiptUrl!)}
                          title="Lihat Bukti Foto"
                          className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-sky-600" />
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        title="Hapus Transaksi"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Preview Receipt Photo */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-900">Bukti Transaksi / Nota</h3>
            <div className="rounded-2xl overflow-hidden bg-slate-100 max-h-80 flex items-center justify-center">
              <img src={previewReceipt} alt="Bukti Transaksi" className="object-contain w-full h-full" />
            </div>
            <button
              onClick={() => setPreviewReceipt(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-800"
            >
              Tutup Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
