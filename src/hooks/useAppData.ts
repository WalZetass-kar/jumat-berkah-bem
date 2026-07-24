import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { initialConfig } from '../data/mockData';
import { Transaction, DistributionSpot, WeeklyConfig, GalleryItem } from '../types';
import { useToast } from '../context/ToastContext';
import { formatRupiah } from '../utils/formatters';

export function useAppData() {
  const { addToast } = useToast();
  const [config, setConfig] = useState<WeeklyConfig>(initialConfig);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [spots, setSpots] = useState<DistributionSpot[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [txRes, spotsRes, galleryRes, configRes, adminsRes] = await Promise.all([
          supabase.from('transactions').select('*').order('created_at', { ascending: false }),
          supabase.from('distribution_spots').select('*').order('created_at', { ascending: true }),
          supabase.from('gallery_items').select('*').order('created_at', { ascending: false }),
          supabase.from('config').select('*').eq('id', 1).single(),
          supabase.from('admin_users').select('*').order('created_at', { ascending: true })
        ]);
        
        if (txRes.data) setTransactions(txRes.data as Transaction[]);
        if (spotsRes.data) setSpots(spotsRes.data as DistributionSpot[]);
        if (galleryRes.data) setGalleryItems(galleryRes.data as GalleryItem[]);
        if (configRes.data) setConfig(configRes.data as WeeklyConfig);
        if (adminsRes.data) setAdminUsers(adminsRes.data);
      } catch (err) {
        console.error("Error fetching data from Supabase", err);
      } finally {
        setIsDataLoaded(true);
      }
    }
    fetchData();
  }, []);

  const handleAddTransaction = async (newTxData: Omit<Transaction, 'id'>) => {
    const { data, error } = await supabase.from('transactions').insert([newTxData]).select();
    if (error) {
      addToast('Gagal Menambah Transaksi', 'error', error.message);
      return;
    }
    if (data && data.length > 0) {
      setTransactions((prev) => [data[0] as Transaction, ...prev]);
      addToast(
        'Transaksi Berhasil Dicatat!',
        'success',
        `${newTxData.type === 'INCOME' ? 'Donasi masuk' : 'Belanja operasional'} ${formatRupiah(newTxData.amount)} telah disimpan.`
      );
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      addToast('Gagal Menghapus', 'error', error.message);
      return;
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    addToast('Transaksi Dihapus', 'info', 'Catatan transaksi telah dihapus dari database.');
  };

  const handleUpdateSpotStatus = async (
    id: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  ) => {
    const spot = spots.find(s => s.id === id);
    if (!spot) return;

    const distributed =
      status === 'COMPLETED' ? spot.targetPackages : status === 'PENDING' ? 0 : Math.round(spot.targetPackages * 0.7);

    const { error } = await supabase
      .from('distribution_spots')
      .update({ status, distributedPackages: distributed })
      .eq('id', id);

    if (error) {
      addToast('Gagal Memperbarui', 'error', error.message);
      return;
    }

    setSpots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, distributedPackages: distributed } : s))
    );
    
    const statusText = status === 'COMPLETED' ? 'Selesai Penyaluran' : status === 'IN_PROGRESS' ? 'Sedang Penyaluran' : 'Pending';
    addToast('Status Penyaluran Diperbarui', 'success', `Status titik penyaluran diubah menjadi "${statusText}".`);
  };

  const handleAddSpot = async (newSpot: Omit<DistributionSpot, 'id'>) => {
    const { data, error } = await supabase.from('distribution_spots').insert([{...newSpot, distributedPackages: 0}]).select();
    if (error) {
      addToast('Gagal Menambah Titik', 'error', error.message);
      return;
    }
    if (data && data.length > 0) {
      setSpots((prev) => [...prev, data[0] as DistributionSpot]);
      addToast('Titik Penyaluran Ditambahkan', 'success', `Lokasi "${newSpot.name}" (${newSpot.targetPackages} porsi) berhasil didaftarkan.`);
    }
  };

  const handleSaveConfig = async (updatedConfig: WeeklyConfig) => {
    // Make sure to remove admins property so it doesn't cause Supabase schema errors
    const configToSave = { ...updatedConfig } as any;
    if ('admins' in configToSave) {
      delete configToSave.admins;
    }

    const { error } = await supabase.from('config').upsert({ id: 1, ...configToSave });
    if (error) {
      addToast('Gagal Menyimpan Pengaturan', 'error', error.message);
      return;
    }
    setConfig(updatedConfig);
    addToast('Pengaturan Berhasil Disimpan', 'success', 'Target bulanan dan informasi rekening bank telah diperbarui.');
  };

  const handleResetData = async () => {
    const { error: err1 } = await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: err2 } = await supabase.from('distribution_spots').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (err1 || err2) {
      addToast('Gagal Mereset Data', 'error', 'Terjadi kesalahan saat menghapus data.');
      return;
    }
    setTransactions([]);
    setSpots([]);
    addToast('Data Telah Dikosongkan', 'warning', 'Seluruh data transaksi dan titik penyaluran telah direset dari database.');
  };

  const handleAddGalleryItem = async (newItemData: Omit<GalleryItem, 'id'>, file?: File | null) => {
    let finalImageUrl = newItemData.imageUrl;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('jumat_berkah_gallery')
        .upload(filePath, file);

      if (uploadError) {
        addToast('Gagal Upload Foto', 'error', uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('jumat_berkah_gallery')
        .getPublicUrl(filePath);
        
      finalImageUrl = publicUrl;
    }

    const { data, error } = await supabase.from('gallery_items').insert([{...newItemData, imageUrl: finalImageUrl}]).select();
    if (error) {
      addToast('Gagal Mengupload', 'error', error.message);
      return;
    }
    if (data && data.length > 0) {
      setGalleryItems((prev) => [data[0] as GalleryItem, ...prev]);
      addToast('Foto Dokumentasi Ditambahkan!', 'success', `Foto "${newItemData.title}" telah dipublikasikan ke Galeri.`);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) {
      addToast('Gagal Menghapus Foto', 'error', error.message);
      return;
    }
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
    addToast('Foto Dihapus', 'info', 'Foto dokumentasi telah dihapus dari galeri.');
  };

  const handleDeleteSpot = async (id: string) => {
    const { error } = await supabase.from('distribution_spots').delete().eq('id', id);
    if (error) {
      addToast('Gagal Menghapus Titik', 'error', error.message);
      return;
    }
    setSpots((prev) => prev.filter((s) => s.id !== id));
    addToast('Titik Penyaluran Dihapus', 'info', 'Lokasi penyaluran telah dihapus dari database.');
  };

  const handleAddAdminUser = async (newAdmin: any) => {
    try {
      const res = await fetch('/api/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });

      const data = await res.json();
      if (!res.ok) {
        addToast('Gagal Menambah Admin', 'error', data.error || 'Server error');
        return;
      }

      if (data.admin) {
        setAdminUsers((prev) => [...prev, data.admin]);
        addToast('Admin Berhasil Ditambahkan', 'success', `Admin ${newAdmin.name} telah didaftarkan beserta kredensial login-nya.`);
      }
    } catch (err: any) {
      addToast('Koneksi Error', 'error', err.message);
    }
  };

  const handleUpdateAdminUser = async (id: string, updatedData: any) => {
    const { data, error } = await supabase.from('admin_users').update(updatedData).eq('id', id).select();
    if (error) {
      addToast('Gagal Mengupdate Admin', 'error', error.message);
      return;
    }
    if (data && data.length > 0) {
      setAdminUsers((prev) => prev.map((a) => a.id === id ? data[0] : a));
      addToast('Data Admin Diperbarui', 'success', `Data admin berhasil disimpan.`);
    }
  };

  const handleDeleteAdminUser = async (id: string) => {
    const { error } = await supabase.from('admin_users').delete().eq('id', id);
    if (error) {
      addToast('Gagal Menghapus Admin', 'error', error.message);
      return;
    }
    setAdminUsers((prev) => prev.filter((a) => a.id !== id));
    addToast('Admin Dihapus', 'info', 'Data admin telah dihapus.');
  };

  return {
    config, transactions, spots, galleryItems, adminUsers, isDataLoaded,
    handleAddTransaction, handleDeleteTransaction,
    handleUpdateSpotStatus, handleAddSpot, handleDeleteSpot,
    handleSaveConfig, handleResetData,
    handleAddGalleryItem, handleDeleteGalleryItem,
    handleAddAdminUser, handleUpdateAdminUser, handleDeleteAdminUser
  };
}
