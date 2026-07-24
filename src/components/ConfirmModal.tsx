import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  isDestructive = true,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl scale-100 transform transition-transform animate-in fade-in zoom-in-95 duration-200">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDestructive ? 'bg-rose-100' : 'bg-blue-100'}`}>
          <AlertTriangle className={`w-6 h-6 ${isDestructive ? 'text-rose-600' : 'text-blue-600'}`} />
        </div>
        <div className="text-center space-y-2 mb-6">
          <h3 className="font-extrabold text-lg text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            disabled={isLoading}
            className={`flex-1 py-2.5 font-bold text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-70 ${
              isDestructive 
                ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
            }`}
          >
            {isLoading ? '...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
