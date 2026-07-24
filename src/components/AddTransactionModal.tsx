import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, PlusCircle, Check, Calendar } from 'lucide-react';
import { Transaction, TransactionType, DonationCategory, ExpenseCategory } from '../types';
import { formatDateIndo } from '../utils/formatters';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  defaultType?: TransactionType;
}

const donationCategories: DonationCategory[] = [
  'Donasi Tunai',
  'Transfer Bank',
  'Sumbangan Nasi Kotak',
  'Sumbangan Sembako',
  'Kotak Amal Jumat',
];

const expenseCategories: ExpenseCategory[] = [
  'Nasi Kotak / Makanan Siap Saji',
  'Bahan Baku & Sembako',
  'Air Mineral & Minuman',
  'Kemasan, Plastik & Mangkuk',
  'Operasional & Transportasi',
  'Santunan Cash / Dhuafa',
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  defaultType = 'INCOME',
}) => {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<string>(
    defaultType === 'INCOME' ? donationCategories[0] : expenseCategories[0]
  );
  const [donorOrVendor, setDonorOrVendor] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Transaction['paymentMethod']>('Transfer BSI');
  const [verifiedBy, setVerifiedBy] = useState('Panitia');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [fridayPeriod, setFridayPeriod] = useState(() => formatDateIndo(new Date().toISOString().slice(0, 10)));

  if (!isOpen) return null;

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (newDate) {
      setFridayPeriod(formatDateIndo(newDate));
    }
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'INCOME' ? donationCategories[0] : expenseCategories[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !donorOrVendor) return;

    onAddTransaction({
      type,
      amount: Number(amount),
      category: category as DonationCategory | ExpenseCategory,
      date,
      fridayPeriod: fridayPeriod || formatDateIndo(date),
      donorOrVendor: donorOrVendor || 'Hamba Allah',
      notes: notes || (type === 'INCOME' ? 'Donasi Nasi Kotak Jumat Berkah' : 'Belanja Konsumsi'),
      paymentMethod,
      verifiedBy,
    });

    onClose();
    // Reset Form
    setAmount('');
    setDonorOrVendor('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900">Catat Transaksi Keuangan</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tambah donasi masuk atau pengeluaran belanja</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('INCOME')}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'INCOME'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Donasi Masuk (+)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('EXPENSE')}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'EXPENSE'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Pengeluaran (-)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {type === 'INCOME' ? 'Nama Donatur / Infaq' : 'Vendor / Penerima / Keperluan'}
            </label>
            <input
              type="text"
              required
              value={donorOrVendor}
              onChange={(e) => setDonorOrVendor(e.target.value)}
              placeholder={type === 'INCOME' ? 'Misal: Hamba Allah / Hj. Siti' : 'Misal: Catering Dapur Ibu Nur / Toko Plastik'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nominal (Rp)</label>
              <input
                type="number"
                required
                min="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || '')}
                placeholder="Misal: 1500000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-extrabold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {(type === 'INCOME' ? donationCategories : expenseCategories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Metode Pembayaran</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as Transaction['paymentMethod'])}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Transfer BSI">Transfer Bank (BSI)</option>
                <option value="Cash">Cash / Tunai</option>
                <option value="QRIS">QRIS</option>
                <option value="Barang / In-Kind">Barang / In-Kind</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal (Hari/Bulan/Tahun)</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Periode Hari Jumat / Tagminggu</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                Otomatis / BISA DIEDIT
              </span>
            </label>
            <input
              type="text"
              required
              value={fridayPeriod}
              onChange={(e) => setFridayPeriod(e.target.value)}
              placeholder="Misal: Jumat, 24 Juli 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              *Tercatat sebagai: <span className="font-semibold text-slate-700">{formatDateIndo(date) || date}</span>
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Catatan / Rincian Paket</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Keterangan tambahan..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer ${
                type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
