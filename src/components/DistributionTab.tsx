import React, { useState } from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle2, 
  Plus, 
  Calculator, 
  Sparkles, 
  PackageCheck,
  Building,
  Users,
  Utensils,
  Trash2
} from 'lucide-react';
import { DistributionSpot, WeeklyConfig } from '../types';
import { formatRupiah } from '../utils/formatters';

interface DistributionTabProps {
  spots: DistributionSpot[];
  config: WeeklyConfig;
  onUpdateSpotStatus: (id: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => void;
  onAddSpot: (spot: Omit<DistributionSpot, 'id'>) => void;
  onDeleteSpot?: (id: string) => void;
}

export const DistributionTab: React.FC<DistributionTabProps> = ({
  spots,
  config,
  onUpdateSpotStatus,
  onAddSpot,
  onDeleteSpot,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [calcPortions, setCalcPortions] = useState<number>(config.targetPortions || 500);
  const [calcPricePerPortion, setCalcPricePerPortion] = useState<number>(config.estimatedCostPerPortion || 15000);

  // New Spot Form State
  const [newSpotName, setNewSpotName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTarget, setNewTarget] = useState(100);
  const [newCoordinator, setNewCoordinator] = useState('');
  const [newTime, setNewTime] = useState('12:30 WIB');
  const [newCategory, setNewCategory] = useState<DistributionSpot['category']>('Masjid');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpotName || !newLocation) return;

    onAddSpot({
      name: newSpotName,
      location: newLocation,
      targetPackages: newTarget,
      distributedPackages: 0,
      status: 'PENDING',
      coordinator: newCoordinator || 'Relawan',
      timeSlot: newTime,
      category: newCategory,
      icon: 'HeartHandshake'
    });

    setShowAddModal(false);
    setNewSpotName('');
    setNewLocation('');
  };

  // Calculator Estimates
  const totalCalcBudget = calcPortions * calcPricePerPortion;
  const estimatedRiceKg = (calcPortions * 0.1).toFixed(1); // ~100g per portion
  const estimatedChickenCount = Math.ceil(calcPortions / 10); // ~10 portions per chicken
  const estimatedWaterBoxes = Math.ceil(calcPortions / 48); // 48 cups per box

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Program & Titik Penyaluran Jumat Berkah
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar lokasi sasaran pembagian nasi kotak & sembako beserta status real-time
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Titik Penyaluran</span>
        </button>
      </div>

      {/* Distribution Spots Bento Cards */}
      {spots.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3 shadow-xs">
          <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">Belum Ada Titik Penyaluran</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Klik tombol "+ Tambah Titik Penyaluran" di atas untuk mendaftarkan lokasi distribusi porsi Nasi Kotak & Santunan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spots.map((spot) => {
            const isDone = spot.status === 'COMPLETED';
            const isInProgress = spot.status === 'IN_PROGRESS';
            const percent = Math.min(100, Math.round((spot.distributedPackages / (spot.targetPackages || 1)) * 100));

            return (
              <div
                key={spot.id}
                className={`p-6 rounded-3xl border transition-all space-y-4 ${
                  isDone
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : isInProgress
                    ? 'bg-sky-50/40 border-sky-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-extrabold uppercase tracking-wide">
                      {spot.category}
                    </span>
                    <h3 className="font-extrabold text-lg text-slate-900 mt-1">{spot.name}</h3>
                  </div>

                  {/* Status Selector Switch & Delete Button */}
                  <div className="flex items-center gap-2">
                    <select
                      value={spot.status}
                      onChange={(e) =>
                        onUpdateSpotStatus(
                          spot.id,
                          e.target.value as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
                        )
                      }
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                        isDone
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : isInProgress
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="PENDING">Belum Mulai</option>
                      <option value="IN_PROGRESS">Berjalan</option>
                      <option value="COMPLETED">Selesai</option>
                    </select>

                    {onDeleteSpot && (
                      <button
                        onClick={() => {
                          if (window.confirm('Hapus titik penyaluran ini?')) onDeleteSpot(spot.id);
                        }}
                        className="p-1.5 rounded-xl bg-slate-100/50 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Hapus Titik Penyaluran"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Detail Info */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{spot.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Waktu: {spot.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Koordinator: {spot.coordinator}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">Progres Penyaluran</span>
                    <span className="font-extrabold text-slate-900">
                      {spot.distributedPackages} / {spot.targetPackages} Porsi ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDone ? 'bg-emerald-600' : isInProgress ? 'bg-sky-600' : 'bg-slate-400'
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

      {/* Interactive Portion Calculator */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">Kalkulator Estimasi Bahan & Biaya Porsi</h3>
            <p className="text-xs text-slate-300">Hitung otomatis kebutuhan beras, lauk, minuman, dan total anggaran</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Target Jumlah Porsi Nasi Kotak
              </label>
              <input
                type="number"
                value={calcPortions}
                onChange={(e) => setCalcPortions(Number(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Estimasi Biaya per Porsi (Lengkap Lauk + Minum)
              </label>
              <input
                type="number"
                step="1000"
                value={calcPricePerPortion}
                onChange={(e) => setCalcPricePerPortion(Number(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* Outputs */}
          <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-3">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              ESTIMASI KESELEHAN BAHAN (SISTEM)
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-slate-400 block text-[11px]">Beras Masak</span>
                <strong className="text-sm font-extrabold text-white">± {estimatedRiceKg} Kg</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-slate-400 block text-[11px]">Ayam / Lauk</span>
                <strong className="text-sm font-extrabold text-white">± {estimatedChickenCount} Ekor</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-slate-400 block text-[11px]">Air Mineral Cup</span>
                <strong className="text-sm font-extrabold text-white">± {estimatedWaterBoxes} Dus</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-slate-400 block text-[11px]">Box / Sendok</span>
                <strong className="text-sm font-extrabold text-white">{calcPortions} Set</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300">Total Kebutuhan Anggaran:</span>
              <span className="text-xl font-black text-emerald-400">{formatRupiah(totalCalcBudget)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Add Distribution Spot */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-lg text-slate-900">Tambah Titik Penyaluran Baru</h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lokasi / Titik</label>
                <input
                  type="text"
                  required
                  value={newSpotName}
                  onChange={(e) => setNewSpotName(e.target.value)}
                  placeholder="Misal: Panti Asuhan Kasih Ibu"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat / Keterangan Lokasi</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Jl. Mawar No. 10"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Porsi</label>
                  <input
                    type="number"
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DistributionSpot['category'])}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Masjid">Masjid</option>
                    <option value="Panti Asuhan">Panti Asuhan</option>
                    <option value="Pejuang Jalanan / Ojol">Pejuang Jalanan / Ojol</option>
                    <option value="Dhuafa / Pemulung">Dhuafa / Pemulung</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Koordinator</label>
                  <input
                    type="text"
                    value={newCoordinator}
                    onChange={(e) => setNewCoordinator(e.target.value)}
                    placeholder="Nama Penanggungjawab"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jam Penyaluran</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="12:30 WIB"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl cursor-pointer hover:bg-emerald-700"
                >
                  Simpan Titik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
