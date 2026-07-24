import React from 'react';
import { Camera, MapPin, Quote, Heart } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryTestimonialsProps {
  items?: GalleryItem[];
}

export const GalleryTestimonials: React.FC<GalleryTestimonialsProps> = ({ items = [] }) => {
  const galleryItems = items;

  return (
    <div id="galeri-dokumentasi" className="w-full bg-slate-50 border-b border-slate-200/80 px-4 sm:px-8 md:px-12 py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dokumentasi Lapangan & Galeri</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Aksi Nyata & Dokumentasi Penyaluran
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Potret kegiatan penyaluran donasi langsung oleh BEM Politeknik LP3I Pekanbaru Kabinet Luminaire.
          </p>
        </div>

        {/* Photo Gallery Grid or Empty State */}
        {galleryItems.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-slate-200/90 text-center space-y-3 max-w-xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Belum Ada Dokumentasi Penyaluran</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Foto kegiatan dan aksi lapangan akan diunggah oleh pengurus BEM LP3I Pekanbaru setelah pelaksanaan penyaluran donasi nasi kotak.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white text-[10px] font-extrabold flex items-center gap-1 backdrop-blur-xs">
                    <MapPin className="w-3 h-3 text-amber-300" />
                    <span>{item.location}</span>
                  </span>
                </div>

                <div className="px-5 pb-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>{item.date}</span>
                      <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-extrabold">{item.portions}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
