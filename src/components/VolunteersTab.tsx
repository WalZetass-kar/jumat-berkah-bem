import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Volunteer } from '../types';
import { Users, CheckCircle, XCircle, Clock, MessageCircle, Trash2 } from 'lucide-react';

export const VolunteersTab: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setVolunteers(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: Volunteer['status']) => {
    const { error } = await supabase
      .from('volunteers')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (!error) {
      setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    }
  };

  const deleteVolunteer = async (id: string) => {
    if (!confirm('Hapus relawan ini?')) return;
    const { error } = await supabase
      .from('volunteers')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setVolunteers(prev => prev.filter(v => v.id !== id));
    }
  };

  const openWhatsApp = (wa: string, name: string) => {
    const cleanWa = wa.replace(/\D/g, '');
    const phone = cleanWa.startsWith('0') ? '62' + cleanWa.substring(1) : cleanWa;
    const text = encodeURIComponent(`Halo ${name}, kami dari tim BEM LP3I Pekanbaru. Terima kasih sudah mendaftar sebagai relawan Jumat Berkah!`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Relawan</h2>
        <p className="text-xs text-slate-500 mt-0.5">Kelola pendaftaran tim lapangan / relawan mahasiswa untuk kegiatan Jumat Berkah</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-4">Nama Mahasiswa</th>
                <th className="px-5 py-4">Prodi & NIM</th>
                <th className="px-5 py-4">No. WhatsApp</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">Memuat data relawan...</td>
                </tr>
              ) : volunteers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400 flex flex-col items-center">
                    <Users className="w-10 h-10 mb-2 opacity-50" />
                    Belum ada relawan yang mendaftar
                  </td>
                </tr>
              ) : (
                volunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {vol.name}
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Mendaftar: {vol.created_at ? new Date(vol.created_at).toLocaleDateString('id-ID') : '-'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold">{vol.prodi}</div>
                      <div className="text-[10px] text-slate-500">{vol.nim}</div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">
                      {vol.wa_number}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={vol.status}
                        onChange={(e) => updateStatus(vol.id, e.target.value as Volunteer['status'])}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-2 ${
                          vol.status === 'Menunggu' ? 'bg-amber-100 text-amber-800' :
                          vol.status === 'Dihubungi' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <option value="Menunggu">Menunggu</option>
                        <option value="Dihubungi">Sudah Dihubungi</option>
                        <option value="Ditolak">Ditolak / Batal</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openWhatsApp(vol.wa_number, vol.name)}
                          className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                          title="Hubungi via WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteVolunteer(vol.id)}
                          className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
