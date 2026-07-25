import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { WeeklyConfig } from '../../types';

interface NavigationProps {
  isAdminLoggedIn?: boolean;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  isAdminLoggedIn, 
  onLoginClick, 
  onLogoutClick, 
  onNavigateToTab 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Donasi', href: '#hero' },
    { label: 'Statistik', href: '#statistik' },
    { label: 'Kegiatan', href: '#kegiatan' },
    { label: 'Donatur', href: '#donatur' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl tracking-tight">LS</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-white leading-tight">Lumina Sharing</h1>
            <p className="text-xs text-slate-400">Jumat Berkah BEM LP3I</p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Auth CTA */}
        <div className="hidden md:flex items-center gap-4">
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateToTab?.('dashboard')}
                className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Dashboard Admin
              </button>
              <button
                onClick={onLogoutClick}
                className="px-4 py-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Admin Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-slate-200 py-2 border-b border-slate-800/50"
                >
                  {link.label}
                </a>
              ))}
              
              <div className="pt-4 pb-2">
                {isAdminLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => { onNavigateToTab?.('dashboard'); setMobileMenuOpen(false); }}
                      className="w-full py-3 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl font-bold"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      Dashboard Admin
                    </button>
                    <button
                      onClick={() => { onLogoutClick?.(); setMobileMenuOpen(false); }}
                      className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { onLoginClick?.(); setMobileMenuOpen(false); }}
                    className="w-full py-3 flex items-center justify-center gap-2 text-slate-300 hover:text-white border border-slate-700 rounded-xl font-bold"
                  >
                    Admin Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
