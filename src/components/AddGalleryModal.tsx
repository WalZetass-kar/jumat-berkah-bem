import React, { useState } from 'react';
import { X, Camera, Upload, Image as ImageIcon, MapPin, Calendar, Heart } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface AddGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGalleryItem: (item: Omit<GalleryItem, 'id'>, file: File | null) => Promise<void>;
}

export const AddGalleryModal: React.FC<AddGalleryModalProps> = ({
  isOpen,
  onClose,
  onAddGalleryItem,
}) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('Jumat, 24 Juli 2026');
  const [portions, setPortions] = useState('100 Porsi');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBlob = await compressImage(file, 1200, 0.8);
        const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });
        setImageFile(compressedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImagePreview(result);
          setImageUrl(result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        setImageFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isLoading) return;

    setIsLoading(true);
    const finalImage = imageUrl.trim() || imagePreview || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800';

    await onAddGalleryItem({
      title: title.trim(),
      location: location.trim() || 'Pekanbaru',
      date: date.trim() || 'Jumat Berkah',
      portions: portions.trim() || '100 Porsi',
      imageUrl: finalImage,
      description: description.trim() || 'Dokumentasi penyaluran donasi BEM LP3I Pekanbaru Kabinet Luminaire.',
    }, imageFile);

    // Reset form
    setTitle('');
    setLocation('');
    setDescription('');
    setImageUrl('');
    setImagePreview('');
    setImageFile(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 space-y-0 animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">Upload Foto Galeri Dokumentasi</h3>
              <p className="text-xs text-slate-300 font-medium">Tambahkan foto aksi lapangan ke landing page publik</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* File Upload / Image Preview */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Foto Kegiatan / Dokumentasi:
            </label>
            
            {imagePreview || imageUrl ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
                <img src={imagePreview || imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setImageUrl('');
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-xl bg-slate-950/80 text-white text-xs hover:bg-rose-600 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-3 bg-slate-50 hover:bg-emerald-50/30 transition-all">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer">
                    <span>Pilih Foto dari Galeri / Kamera</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">Format JPG, PNG, WEBP (Maks. 10MB)</p>
                </div>
              </div>
            )}

            <div className="pt-1">
              <span className="text-[11px] text-slate-400 block mb-1 font-medium">Atau tempel Link URL Foto Online:</span>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  if (e.target.value) setImagePreview(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Judul Kegiatan Penyaluran:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Penyaluran Jamaah Jumat Masjid LP3I"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Location & Portions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Lokasi Penyaluran:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Jl. Tuanku Tambusai"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Jumlah Bantuan / Porsi:</label>
              <input
                type="text"
                value={portions}
                onChange={(e) => setPortions(e.target.value)}
                placeholder="e.g. 150 Porsi Nasi Kotak"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tanggal / Periode:</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. Jumat, 24 Juli 2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Keterangan / Catatan Singkat:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan catatan singkat aksi lapangan..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Mengupload...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Simpan & Upload Foto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
