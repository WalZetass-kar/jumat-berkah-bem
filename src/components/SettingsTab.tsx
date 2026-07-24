import React, { useState, useRef } from 'react';
import { Settings, Save, RotateCcw, Building, CreditCard, Target, Download, Upload, Database, FileJson, CheckCircle, AlertCircle } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { WeeklyConfig, Transaction, DistributionSpot } from '../types';
import { useToast } from '../context/ToastContext';

interface SettingsTabProps {
  config: WeeklyConfig;
  transactions: Transaction[];
  spots: DistributionSpot[];
  onSaveConfig: (updated: WeeklyConfig) => void;
  onResetData: () => void;
  onRestoreBackup: (data: { config?: WeeklyConfig; transactions?: Transaction[]; spots?: DistributionSpot[] }) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  config,
  transactions,
  spots,
  onSaveConfig,
  onResetData,
  onRestoreBackup,
}) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<WeeklyConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [restoreDataToConfirm, setRestoreDataToConfirm] = useState<{ config?: WeeklyConfig; transactions?: Transaction[]; spots?: DistributionSpot[] } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      appName: 'Kas & Penyaluran Jumat Berkah',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      config: formData,
      transactions,
      spots,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    const filename = `backup-jumat-berkah-${new Date().toISOString().slice(0, 10)}.json`;
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast('Cadangan Data Berhasil Diunduh!', 'success', `File ${filename} telah disimpan ke perangkat Anda.`);
  };

  // Import / Restore JSON Backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed || (typeof parsed !== 'object')) {
          throw new Error('Format file JSON tidak valid.');
        }

        const restoreData: { config?: WeeklyConfig; transactions?: Transaction[]; spots?: DistributionSpot[] } = {};

        if (parsed.config && typeof parsed.config === 'object') {
          restoreData.config = parsed.config;
        }
        if (Array.isArray(parsed.transactions)) {
          restoreData.transactions = parsed.transactions;
        }
        if (Array.isArray(parsed.spots)) {
          restoreData.spots = parsed.spots;
        }

        if (!restoreData.config && !restoreData.transactions && !restoreData.spots) {
          addToast('File Kosong / Format Salah', 'error', 'File JSON tidak memiliki struktur data Jumat Berkah yang valid.');
          return;
        }

        setRestoreDataToConfirm(restoreData);
      } catch (err) {
        addToast('Gagal Membaca File JSON', 'error', 'Pastikan file yang diunggah berformat .json yang sesuai.');
      }
    };

    reader.readAsText(file);
    // Reset input value so same file can be re-uploaded if needed
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Pengaturan Komunitas & Program
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur nama masjid, rekening donasi, target porsi, serta cadangan & pemulihan data
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan berhasil diperbarui!</span>
          </div>
        )}

        {/* Organization Info */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            Profil Komunitas / Masjid
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Organisasi / Masjid</label>
            <input
              type="text"
              required
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Slogan / Motto Program</label>
            <input
              type="text"
              value={formData.motto}
              onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Bank & Donation Info */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Informasi Rekening Donasi
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bank & Nomor Rekening</label>
            <input
              type="text"
              value={formData.bankInfo}
              onChange={(e) => setFormData({ ...formData, bankInfo: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pemilik Rekening / Yayasan</label>
            <input
              type="text"
              value={formData.accountHolder}
              onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Target Settings */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            Target Bulanan & Mingguan Program
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Porsi per Bulan</label>
              <input
                type="number"
                value={formData.targetMonthlyPortions || 2000}
                onChange={(e) => setFormData({ ...formData, targetMonthlyPortions: Number(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Donasi per Bulan (Rp)</label>
              <input
                type="number"
                step="100000"
                value={formData.targetMonthlyDonation || 30000000}
                onChange={(e) => setFormData({ ...formData, targetMonthlyDonation: Number(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bulan Periode Target</label>
              <input
                type="text"
                value={formData.targetMonthLabel || "Juli 2026"}
                onChange={(e) => setFormData({ ...formData, targetMonthLabel: e.target.value })}
                placeholder="Misal: Juli 2026"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Porsi per Jumat</label>
              <input
                type="number"
                value={formData.targetPortions}
                onChange={(e) => setFormData({ ...formData, targetPortions: Number(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimasi Biaya per Porsi (Rp)</label>
              <input
                type="number"
                step="1000"
                value={formData.estimatedCostPerPortion}
                onChange={(e) => setFormData({ ...formData, estimatedCostPerPortion: Number(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Kosongkan Data Kas & Penyaluran</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>

      {/* Backup & Restore Data Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            Cadangan & Pemulihan Data (Backup & Restore)
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Unduh seluruh data transaksi, lokasi penyaluran, dan profil pengaturan ke file JSON untuk disimpan secara lokal atau dipindahkan ke perangkat lain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Download Backup Button */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Unduh Backup Data (JSON)</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Simpan file cadangan transaksi ({transactions.length}) & titik penyaluran ({spots.length}).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportBackup}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File Backup (.json)</span>
            </button>
          </div>

          {/* Restore Data Button */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Restore / Muat Ulang Backup</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pilih file .json cadangan untuk memulihkan seluruh data aplikasi.
                </p>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Unggah & Pulihkan Data</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        title="Kosongkan Semua Data?"
        message="Peringatan! Ini akan menghapus seluruh data transaksi, titik penyaluran, dan galeri foto secara permanen. Anda yakin?"
        confirmText="Ya, Kosongkan Data"
        cancelText="Batal"
        onConfirm={() => {
          onResetData();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />

      <ConfirmModal
        isOpen={restoreDataToConfirm !== null}
        title="Pulihkan Data Backup?"
        message="Memulihkan dari file JSON akan menimpa pengaturan dan seluruh data saat ini. Apakah Anda yakin?"
        confirmText="Ya, Pulihkan Data"
        cancelText="Batal"
        onConfirm={() => {
          if (restoreDataToConfirm) {
            onRestoreBackup(restoreDataToConfirm);
            if (restoreDataToConfirm.config) {
              setFormData(restoreDataToConfirm.config);
            }
          }
          setRestoreDataToConfirm(null);
        }}
        onCancel={() => setRestoreDataToConfirm(null)}
      />
    </div>
  );
};

