import React from 'react';
import { 
  Globe, 
  LayoutDashboard, 
  Wallet, 
  HeartHandshake, 
  FileText, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Lock,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Heart,
  Users
} from 'lucide-react';

export type TabType = 'landing' | 'dashboard' | 'transactions' | 'distribution' | 'news' | 'admins' | 'volunteers' | 'reports' | 'settings';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
  isAdminLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  isAdminLoggedIn,
  onLoginClick,
  onLogoutClick,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) => {
  // If not logged in as admin, do not render sidebar
  if (!isAdminLoggedIn) {
    return null;
  }

  const navItems = [
    { id: 'dashboard' as TabType, label: 'Ringkasan Dashboard', short: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as TabType, label: 'Buku Kas & Donasi', short: 'Keuangan', icon: Wallet },
    { id: 'distribution' as TabType, label: 'Kelola Titik Penyaluran', short: 'Penyaluran', icon: HeartHandshake },
    { id: 'news' as TabType, label: 'Kelola Berita BEM', short: 'Berita', icon: Globe },
    { id: 'admins' as TabType, label: 'Kelola Admin', short: 'Admin', icon: ShieldCheck },
    { id: 'volunteers' as TabType, label: 'Daftar Relawan', short: 'Relawan', icon: Users },
    { id: 'reports' as TabType, label: 'Laporan Transparansi & WA', short: 'Laporan', icon: FileText },
    { id: 'settings' as TabType, label: 'Pengaturan Modul', short: 'Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 ${activeTab === 'landing' ? 'top-14 sm:top-16' : 'top-0'} bottom-0 bg-slate-950 border-r border-slate-800 z-30 justify-between transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20 p-3' : 'w-64 p-4'
        } shadow-2xl shadow-emerald-900/10`}
      >
        <div className="space-y-6 relative z-10">
          {/* Header & Toggle Button */}
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-3' : 'justify-between'} px-1 py-1`}>
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-xs p-1.5 shadow-lg shadow-emerald-600/30">
                  <img src="/lp3i-logo.svg" alt="LP3I" className="w-full h-full object-contain filter brightness-0 invert" />
                </div>
                <div>
                  <span className="text-sm font-black tracking-widest text-white uppercase block leading-tight">
                    Admin BEM
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold tracking-wider">LP3I PEKANBARU</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              title={isSidebarCollapsed ? "Buka Sidebar" : "Tutup/Kecilkan Sidebar"}
              className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700/50"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Nav Items */}
          <div className="space-y-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center gap-3.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer group ${
                    isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3.5'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/25 border border-emerald-400/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'}`} />
                  {!isSidebarCollapsed && <span className="truncate tracking-wide">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer Callout / Quick Actions */}
        <div className="space-y-4 relative z-10">
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={onOpenAddModal}
                title="+ Catat Transaksi"
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onLogoutClick}
                title="Keluar Admin"
                className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold transition-all cursor-pointer border border-slate-700 hover:border-rose-500/50"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 p-5 rounded-2xl text-white relative overflow-hidden shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <p className="text-xs font-black text-white leading-tight uppercase tracking-wider">
                  BEM Luminaire
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Kabinet 2026/2027</p>

                <div className="mt-4 space-y-2.5">
                  <button
                    type="button"
                    onClick={onOpenAddModal}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Catat Transaksi</span>
                  </button>

                  <button
                    type="button"
                    onClick={onLogoutClick}
                    className="w-full py-2 bg-slate-800/80 hover:bg-rose-500/90 text-slate-300 hover:text-white border border-slate-600/50 hover:border-rose-500/50 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Admin</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isSidebarCollapsed && (
            <div className="text-[10px] text-slate-500 text-center font-bold tracking-widest flex items-center justify-center gap-1.5 uppercase">
              <span>LP3I</span>
              <div className="w-1 h-1 rounded-full bg-slate-600"></div>
              <span className="text-emerald-500">Pekanbaru</span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)]">
        <div className="max-w-md mx-auto flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-all ${isActive ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-500/40' : 'bg-transparent'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <span className={`text-[9px] text-center font-bold tracking-wide ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                  {item.short}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
