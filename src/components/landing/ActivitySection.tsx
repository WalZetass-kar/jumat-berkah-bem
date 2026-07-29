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
    <section id="kegiatan" className="py-24 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Kegiatan & Penyaluran</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Dokumentasi dan peta lokasi penyaluran donasi nasi kotak di sekitar area kampus dan sekitarnya.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Map/Locations Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Map className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Lokasi Penyaluran</h3>
            </div>

            {spots.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[400px] flex items-center justify-center">
                <EmptyState 
                  icon={MapPin} 
                  title="Belum Ada Lokasi" 
                  description="Titik penyaluran akan diperbarui segera setelah kami melakukan survei lapangan."
                />
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-1 bg-slate-100">
                  <div className="w-full h-48 bg-slate-200 rounded-2xl bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply"></div>
                    <MapPin className="w-16 h-16 text-emerald-600/50 absolute" />
                  </div>
                </div>
                
                <div className="p-6 divide-y divide-slate-100">
                  {spots.map((spot) => (
                    <motion.div 
                      key={spot.id} 
                      whileHover={{ x: 4 }}
                      className="py-4 flex items-start gap-4"
                    >
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{spot.name}</h4>
                        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
                          <span>Target: {spot.targetPackages} porsi</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-emerald-700 font-bold">Tersalurkan: {spot.distributedPackages} porsi</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gallery Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Dokumentasi</h3>
            </div>

            {galleryItems.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[400px] flex items-center justify-center">
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group rounded-3xl overflow-hidden aspect-square bg-slate-100"
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <h4 className="text-white font-bold text-sm">{item.title}</h4>
                      {item.description && <p className="text-slate-300 text-xs mt-1 line-clamp-2">{item.description}</p>}
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
