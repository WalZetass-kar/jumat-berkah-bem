import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, ShieldCheck, Mail, Phone, Users, AlertCircle } from 'lucide-react';
import { WeeklyConfig, AdminUser } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface AdminUsersTabProps {
  adminUsers: AdminUser[];
  onAddAdminUser: (admin: any) => Promise<void>;
  onUpdateAdminUser: (id: string, data: any) => Promise<void>;
  onDeleteAdminUser: (id: string) => Promise<void>;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({ 
  adminUsers, 
  onAddAdminUser, 
  onUpdateAdminUser, 
  onDeleteAdminUser 
}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: '',
    role: '',
    email: '',
    phone: '',
    status: 'Aktif',
    password: ''
  } as any);

  const [deleteConfirmAdmin, setDeleteConfirmAdmin] = useState<AdminUser | null>(null);

  const handleOpenModal = (admin?: AdminUser) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData(admin);
    } else {
      setEditingAdmin(null);
      setFormData({
        name: '',
        role: '',
        email: '',
        phone: '',
        status: 'Aktif',
        password: ''
      } as any);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (editingAdmin) {
      await onUpdateAdminUser(editingAdmin.id, formData);
    } else {
      await onAddAdminUser(formData);
    }
    
    setIsSaving(false);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirmAdmin) return;
    setIsSaving(true);
    
    await onDeleteAdminUser(deleteConfirmAdmin.id);
    
    setIsSaving(false);
    setDeleteConfirmAdmin(null);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600" />
            Kelola Akses Pengelola (Admin & Developer)
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Daftar pengurus BEM dan tim Developer yang memiliki akses ke portal admin.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-sm text-emerald-900">
          <p className="font-bold mb-1">Peran Akses: Admin & Developer</p>
          <p>
            Sistem memiliki 2 tingkatan peran: <strong>Admin</strong> (untuk pengurus & bendahara BEM) dan <strong>Developer</strong> (untuk tim pengembang sistem & IT kampus).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminUsers && adminUsers.map(admin => (
          <div key={admin.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-lg">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{admin.name}</h3>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-emerald-700 border border-emerald-200/50">
                    {admin.role || 'Admin'}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${admin.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {admin.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{admin.email}</span>
              </div>
              {admin.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{admin.phone}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => handleOpenModal(admin)}
                className="flex-1 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => setDeleteConfirmAdmin(admin)}
                className="flex-1 py-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                {editingAdmin ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  placeholder="Nama Lengkap"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Peran / Role *</label>
                <select
                  required
                  value={formData.role || 'Admin'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800"
                >
                  <option value="Admin">Admin (Pengurus BEM)</option>
                  <option value="Developer">Developer (Pengembang IT)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  placeholder="email@lp3i.ac.id"
                />
              </div>

              {!editingAdmin && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Sandi (Password Login)</label>
                  <input
                    type="password"
                    required={!editingAdmin}
                    value={(formData as any).password || ''}
                    onChange={(e) => setFormData({...formData, password: e.target.value} as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    placeholder="Minimal 6 karakter"
                    minLength={6}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Sandi ini akan digunakan untuk login ke portal.</p>
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">No. WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  placeholder="0812xxxxxx"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmAdmin && (
        <ConfirmModal
          isOpen={!!deleteConfirmAdmin}
          title="Hapus Data Admin"
          message={`Apakah Anda yakin ingin menghapus "${deleteConfirmAdmin.name}" dari daftar pengelola?`}
          confirmText="Ya, Hapus"
          cancelText="Batal"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmAdmin(null)}
          isDestructive={true}
          isLoading={isSaving}
        />
      )}
    </div>
  );
};
