import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on load
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark-theme-filter');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark-theme-filter');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark-theme-filter');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <>
      <style>{`
        html.dark-theme-filter {
          filter: invert(1) hue-rotate(180deg);
          background: #0f172a; /* to prevent white scrollbars/edges */
        }
        html.dark-theme-filter img, 
        html.dark-theme-filter video,
        html.dark-theme-filter .keep-colors {
          filter: invert(1) hue-rotate(180deg);
        }
      `}</style>
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={toggleTheme}
        className="fixed top-24 right-4 z-50 p-3 rounded-full bg-slate-900 text-amber-300 shadow-xl border border-slate-700 cursor-pointer hover:scale-110 active:scale-95 transition-all"
        title="Toggle Dark Mode"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-blue-300" />}
      </motion.button>
    </>
  );
};
