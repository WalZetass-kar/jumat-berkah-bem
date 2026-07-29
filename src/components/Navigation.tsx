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
        className={`hidden md:flex flex-col fixed left-0 ${activeTab === 'landing' ? 'top-14 sm:top-16' : 'top-0'} bottom-0 bg-white border-r border-slate-200 z-30 justify-between transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20 p-3' : 'w-64 p-4'
        } shadow-sm overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200`}
      >
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-4">
            {/* Header & Toggle Button */}
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-3' : 'justify-between'} px-1 py-1`}>
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs p-1.5 shadow-md shrink-0">
                    <img src="/lp3i-logo.svg" alt="LP3I" className="w-full h-full object-contain filter brightness-0 invert" />
                  </div>
                  <div>
                    <span className="text-sm font-black tracking-widest text-slate-900 uppercase block leading-tight">
                      Admin BEM
                    </span>
                    <span className="text-[10px] text-emerald-700 font-extrabold tracking-wider">LP3I PEKANBARU</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                title={isSidebarCollapsed ? "Buka Sidebar" : "Tutup/Kecilkan Sidebar"}
                className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-all cursor-pointer border border-slate-200"
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Nav Items (Scrollable if screen height is small) */}
            <div className="space-y-1.5 pt-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={item.label}
                    className={`w-full flex items-center gap-3.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer group ${
                      isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3'
                    } ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600'}`} />
                    {!isSidebarCollapsed && <span className="truncate tracking-wide">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer Callout / Quick Actions */}
          <div className="space-y-4 pt-2 border-t border-slate-200 shrink-0">
            {isSidebarCollapsed ? (
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenAddModal}
                  title="+ Catat Transaksi"
                  className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md transition-all cursor-pointer active:scale-95 hover:bg-emerald-700"
                >
                  <Plus className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={onLogoutClick}
                  title="Keluar Admin"
                  className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center font-bold transition-all cursor-pointer border border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-slate-900 relative overflow-hidden shadow-xs">
                <div className="relative z-10">
                  <p className="text-xs font-black text-emerald-900 leading-tight uppercase tracking-wider">
                    BEM Luminaire
                  </p>
                  <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Kabinet 2026/2027</p>

                  <div className="mt-3 space-y-2">
                    <button
                      type="button"
                      onClick={onOpenAddModal}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-95 rounded-xl"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>+ Catat Transaksi</span>
                    </button>

                    <button
                      type="button"
                      onClick={onLogoutClick}
                      className="w-full py-2 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-300 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      <span>Keluar Admin</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!isSidebarCollapsed && (
              <div className="text-[10px] text-slate-500 text-center font-extrabold tracking-widest flex items-center justify-center gap-1.5 uppercase pb-1">
                <span>LP3I</span>
                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                <span className="text-emerald-700">Pekanbaru</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)] overflow-x-auto">
        <div className="max-w-md mx-auto flex justify-between items-center gap-1 min-w-max px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all duration-200 cursor-pointer min-w-[50px] ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all ${isActive ? 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/40' : 'bg-transparent'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <span className={`text-[9px] text-center font-bold tracking-wide ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
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
