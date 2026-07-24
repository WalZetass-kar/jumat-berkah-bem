import React, { useState } from 'react';
import { Search, Heart, PlusCircle, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { WeeklyConfig } from '../types';

interface NavbarProps {
  config: WeeklyConfig;
  onOpenAddModal: (defaultType?: 'INCOME' | 'EXPENSE') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: string;
  onNavigateToTab?: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  onOpenAddModal,
  searchTerm,
  setSearchTerm,
  activeTab,
  onNavigateToTab,
  isAdminLoggedIn,
  onLoginClick,
  onLogoutClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (anchorId: string) => {
    setIsMobileMenuOpen(false);
    if (activeTab !== 'landing' && onNavigateToTab) {
      onNavigateToTab('landing');
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(anchorId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Beranda', href: '#hero', id: 'hero' },
    { label: 'Agenda', href: '#agenda-jumat', id: 'agenda-jumat' },
    { label: 'Rekening', href: '#donasi-rekening', id: 'donasi-rekening' },
    { label: 'Titik Penyaluran', href: '#titik-penyaluran', id: 'titik-penyaluran' },
    { label: 'Dokumentasi', href: '#galeri-dokumentasi', id: 'galeri-dokumentasi' },
    { label: 'FAQ', href: '#faq-section', id: 'faq-section' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Brand & Mosque Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 p-1.5 overflow-hidden">
            <img src="/lp3i-logo.svg" alt="LP3I Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-none">
                {config.organizationName || "Politeknik LP3I Pekanbaru"}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-extrabold tracking-wide uppercase">
                Kabinet Luminaire
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden md:block mt-0.5">
              {config.motto || "Sedekah Membawa Keberkahan & Kelapangan Rezeki"}
            </p>
          </div>
        </div>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => handleNavClick(link.id)}
              className="px-3 py-1 rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-2xs transition-all whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Desktop Actions & Mobile Burger */}
        <div className="flex items-center gap-2">
          {/* Search Box (Desktop) */}
          <div className="hidden xl:flex relative w-40">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari donatur..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Burger Menu Button for Mobile & Tablet (< lg) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Search */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari donatur..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col space-y-1 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => handleNavClick(link.id)}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-blue-600 transition-all flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-slate-300 text-sm">→</span>
              </a>
            ))}
          </div>

        </div>
      )}
    </header>
  );
};


