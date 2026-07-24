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
  Heart
} from 'lucide-react';

export type TabType = 'landing' | 'dashboard' | 'transactions' | 'distribution' | 'reports' | 'settings';

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
    { id: 'dashboard' as TabType, label: 'Ringkasan Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as TabType, label: 'Buku Kas & Donasi', icon: Wallet },
    { id: 'distribution' as TabType, label: 'Kelola Titik Penyaluran', icon: HeartHandshake },
    { id: 'reports' as TabType, label: 'Laporan Transparansi & WA', icon: FileText },
    { id: 'settings' as TabType, label: 'Pengaturan Modul', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 ${activeTab === 'landing' ? 'top-14 sm:top-16' : 'top-0'} bottom-0 bg-white border-r border-slate-200/90 z-30 justify-between transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20 p-3' : 'w-64 p-5'
        }`}
      >
        <div className="space-y-4">
          {/* Header & Toggle Button */}
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'} px-1 py-1`}>
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white text-blue-600 flex items-center justify-center font-bold text-xs p-0.5 overflow-hidden">
                  <img src="/lp3i-logo.png" alt="LP3I Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-black tracking-wider text-slate-800 uppercase">
                  Admin BEM
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              title={isSidebarCollapsed ? "Buka Sidebar" : "Tutup/Kecilkan Sidebar"}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-blue-600" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>

          {/* Nav Items */}
          <div className="space-y-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center gap-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer Callout / Quick Actions */}
        <div className="space-y-3">
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={onOpenAddModal}
                title="+ Catat Transaksi"
                className="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center font-bold shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onLogoutClick}
                title="Keluar Admin"
                className="w-10 h-10 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white relative overflow-hidden shadow-lg space-y-3">
              <div className="relative z-10">
                <p className="text-xs font-bold text-slate-100 leading-tight">
                  BEM Kabinet Luminaire
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Politeknik LP3I Pekanbaru</p>

                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={onOpenAddModal}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Catat Transaksi</span>
                  </button>

                  <button
                    type="button"
                    onClick={onLogoutClick}
                    className="w-full py-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Admin</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isSidebarCollapsed && (
            <div className="text-[10px] text-slate-400 text-center font-bold tracking-wide">
              Kabinet Luminaire • <span className="text-blue-600">Pekanbaru</span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-3 py-1.5 shadow-lg">
        <div className="max-w-md mx-auto flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors cursor-pointer ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-400'}`} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
