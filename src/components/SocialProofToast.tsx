import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah } from '../utils/formatters';

interface SocialProofToastProps {
  transactions: Transaction[];
}

export const SocialProofToast: React.FC<SocialProofToastProps> = ({ transactions }) => {
  const [currentTx, setCurrentTx] = useState<Transaction | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const incomes = transactions.filter(t => t.type === 'INCOME');
    if (incomes.length === 0) return;

    // Start a cycle of showing a random toast every 15 seconds, visible for 5 seconds
    const cycle = setInterval(() => {
      const randomTx = incomes[Math.floor(Math.random() * incomes.length)];
      setCurrentTx(randomTx);
      setIsVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 15000);

    // Initial show after 3 seconds
    setTimeout(() => {
      const randomTx = incomes[Math.floor(Math.random() * incomes.length)];
      setCurrentTx(randomTx);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    }, 3000);

    return () => clearInterval(cycle);
  }, [transactions]);

  return (
    <AnimatePresence>
      {isVisible && currentTx && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-6 left-6 z-50 pointer-events-none"
        >
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 p-3.5 rounded-2xl shadow-xl shadow-slate-900/10 flex items-center gap-3 max-w-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-emerald-500 text-emerald-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-slate-500 leading-tight">
                <strong className="text-slate-900">{currentTx.donorOrVendor}</strong> baru saja berdonasi
              </p>
              <p className="font-black text-sm text-emerald-600">
                {formatRupiah(currentTx.amount)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
