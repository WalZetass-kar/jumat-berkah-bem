import React, { useState } from 'react';
import { Calculator, Utensils, Heart, QrCode, Sparkles, Check } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface DonationCalculatorProps {
  onOpenQris: () => void;
  costPerPortion?: number;
}

export const DonationCalculator: React.FC<DonationCalculatorProps> = ({
  onOpenQris,
  costPerPortion = 15000,
}) => {
  const [portions, setPortions] = useState<number>(5);

  const totalAmount = portions * costPerPortion;

  const presets = [1, 5, 10, 20, 50, 100];

  return (
    <div id="kalkulator-donasi" className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 md:px-12 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-[11px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            <span>Kalkulator & Simulasi Donasi</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Hitung Dampak Infaq Nasi Kotak Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Satu porsi nasi kotak nutrisi seharga <strong className="text-blue-700">Rp 15.000</strong> sudah termasuk makanan sehat, lauk pauk, dan air mineral.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-8">
          {/* Preset Buttons */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
              Pilih Jumlah Porsi:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {presets.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPortions(num)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    portions === num
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {num} Porsi
                </button>
              ))}
            </div>
          </div>

          {/* Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span>Atur Manual ({portions} Porsi)</span>
              <span className="text-amber-400 font-mono text-sm font-black">{portions} Porsi</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={portions}
              onChange={(e) => setPortions(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
              <span>1 Porsi</span>
              <span>50 Porsi</span>
              <span>100 Porsi</span>
            </div>
          </div>

          {/* Calculation Breakdown & Total */}
          <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-xs text-slate-400 font-medium">Total Nilai Infaq ({portions} Porsi × Rp 15.000)</span>
              <p className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                {formatRupiah(totalAmount)}
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold pt-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Membantu kebutuhan nutrisi {portions} orang penerima manfaat</span>
              </div>
            </div>

            <button
              onClick={onOpenQris}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>Infaq Rp {totalAmount.toLocaleString('id-ID')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
