import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { playSuccessSound, playNotificationSound } from '../utils/sounds';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  addToast: (title: string, type?: ToastType, description?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((title: string, type: ToastType = 'success', description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, type, title, description };

    setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 toasts

    if (type === 'success') {
      playSuccessSound();
    } else {
      playNotificationSound();
    }

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Floating Toast Container */}
      <div 
        aria-live="assertive"
        className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 sm:top-6 sm:w-96 z-[100] flex flex-col gap-2.5 pointer-events-none print:hidden"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.15 } }}
              className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3.5 backdrop-blur-md transition-all ${
                toast.type === 'success'
                  ? 'bg-slate-900/95 text-white border-emerald-500/40'
                  : toast.type === 'error'
                  ? 'bg-slate-900/95 text-white border-rose-500/40'
                  : toast.type === 'warning'
                  ? 'bg-slate-900/95 text-white border-amber-500/40'
                  : 'bg-slate-900/95 text-white border-sky-500/40'
              }`}
            >
              {/* Type Icon */}
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {toast.type === 'error' && (
                  <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
                {toast.type === 'warning' && (
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
                {toast.type === 'info' && (
                  <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                    <Info className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Toast Text Content */}
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="text-xs font-extrabold text-slate-100 tracking-wide">{toast.title}</h4>
                {toast.description && (
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toast.description}</p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
