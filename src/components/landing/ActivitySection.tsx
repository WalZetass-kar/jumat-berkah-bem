import React from 'react';
import { motion } from 'framer-motion';
import { Map, Camera, MapPin } from 'lucide-react';
import { DistributionSpot, GalleryItem } from '../../types';
import { EmptyState } from './EmptyState';

interface ActivitySectionProps {
  spots: DistributionSpot[];
  galleryItems: GalleryItem[];
}

export const ActivitySection: React.FC<ActivitySectionProps> = ({ spots, galleryItems }) => {
  return (
    <section id="kegiatan" className="py-[120px] bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
            <Map className="w-4 h-4 text-emerald-600" />
            <span>Aksi Lapangan & Dokumentasi</span>
          </div>
          <h2 className="text-3xl sm:text-[40px] font-black tracking-tight text-slate-900 leading-tight">
            Kegiatan & Penyaluran Berkah
          </h2>
          <p className="text-slate-600 text-base font-medium">
            Dokumentasi dan peta lokasi penyaluran donasi nasi kotak di sekitar area kampus dan sekitarnya.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px]">
          
          {/* Map/Locations Timeline Column */}
          <div id="titik-penyaluran">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Timeline Titik Penyaluran</h3>
                <p className="text-xs text-slate-500 font-medium">Lokasi pembagian porsi nasi berkah</p>
              </div>
            </div>

            {spots.length === 0 ? (
              <div className="bg-white rounded-[20px] border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-8 text-center space-y-2">
                <EmptyState 
                  icon={MapPin} 
                  title="Belum Ada Lokasi" 
                  description="Titik penyaluran akan diperbarui segera setelah kami melakukan survei lapangan."
                />
              </div>
            ) : (
              <div className="bg-white rounded-[20px] border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-6 space-y-6">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {spots.map((spot, idx) => (
                    <motion.div 
                      key={spot.id} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative flex items-start gap-4 group"
                    >
                      {/* Timeline Node Icon */}
                      <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white shadow-sm">
                        ✓
                      </div>

                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 w-full group-hover:border-emerald-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900 text-base">{spot.name}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${spot.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {spot.status === 'COMPLETED' ? 'Selesai' : 'Dalam Proses'}
                          </span>
                        </div>
                        
                        <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-slate-600">
                          <span className="bg-white px-3 py-1 rounded-md border border-slate-200">Target: {spot.targetPackages} porsi</span>
                          <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-md border border-emerald-200 font-bold">Tersalurkan: {spot.distributedPackages} porsi</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gallery Masonry Column */}
          <div id="galeri-dokumentasi">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Dokumentasi Foto</h3>
                <p className="text-xs text-slate-500 font-medium">Galeri aksi langsung BEM Luminaire</p>
              </div>
            </div>

            {galleryItems.length === 0 ? (
              <div className="bg-white rounded-[20px] border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-8 text-center">
                <EmptyState 
                  icon={Camera} 
                  title="Belum Ada Dokumentasi" 
                  description="Foto kegiatan dan bukti penyaluran akan ditampilkan di sini setelah program berjalan."
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {galleryItems.slice(0, 4).map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative rounded-[20px] overflow-hidden aspect-square bg-slate-100 border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)] group cursor-pointer"
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-900 p-4 border-t border-slate-800 transition-opacity duration-300">
                      <h4 className="text-white font-bold text-xs line-clamp-1">{item.title}</h4>
                      {item.description && <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-1 font-normal">{item.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
