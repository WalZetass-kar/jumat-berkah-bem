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
    { label: 'Berita BEM', href: '#berita-bem', id: 'berita-bem' },
    { label: 'Agenda', href: '#agenda-jumat', id: 'agenda-jumat' },
    { label: 'Rekening', href: '#donasi-rekening', id: 'donasi-rekening' },
    { label: 'Titik Penyaluran', href: '#titik-penyaluran', id: 'titik-penyaluran' },
    { label: 'Dokumentasi', href: '#galeri-dokumentasi', id: 'galeri-dokumentasi' },
    { label: 'FAQ', href: '#faq-section', id: 'faq-section' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Mosque Title */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => handleNavClick('hero')}>
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0 p-2 overflow-hidden">
            <img src="/lp3i-logo.svg" alt="LP3I Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight leading-none">
                {config.organizationName || "Politeknik LP3I Pekanbaru"}
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold tracking-wide uppercase">
                Kabinet Luminaire
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden md:block mt-1">
              {config.motto || "Sedekah Membawa Keberkahan & Kelapangan Rezeki"}
            </p>
          </div>
        </div>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => handleNavClick(link.id)}
              className="px-3.5 py-2 rounded-xl hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all whitespace-nowrap font-bold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* CTA Button Donasi */}
          <a
            href="#donasi-rekening"
            onClick={() => handleNavClick('donasi-rekening')}
            className="hidden sm:flex items-center justify-center gap-2 px-5 h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Heart className="w-4 h-4 text-white fill-white" />
            <span>Donasi Sekarang</span>
          </a>

          {/* Burger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none transition-colors cursor-pointer border border-slate-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 shadow-xl">
          {/* Mobile Links */}
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => handleNavClick(link.id)}
                className="px-4 py-3 rounded-xl hover:bg-emerald-50 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-all flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-slate-400 text-sm">→</span>
              </a>
            ))}
          </div>

          <a
            href="#donasi-rekening"
            onClick={() => handleNavClick('donasi-rekening')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Donasi Sekarang</span>
          </a>
        </div>
      )}
    </header>
  );
};


