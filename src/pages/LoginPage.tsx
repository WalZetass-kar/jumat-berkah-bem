import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Heart } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      addToast('Login Gagal', 'error', error.message);
      setIsLoading(false);
    } else {
      addToast('Login Berhasil', 'success', 'Selamat datang di Panel Admin.');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-lg relative z-10 mb-4 p-2 overflow-hidden">
            <img src="/lp3i-logo.png" alt="LP3I Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight relative z-10">Admin Login</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium relative z-10">Panel Pengelola BEM Luminaire</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Admin</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@bem.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Masuk ke Dashboard
              </>
            )}
          </button>
          
          <div className="text-center">
            <button type="button" onClick={() => navigate('/')} className="text-xs text-slate-500 hover:text-blue-600 font-bold transition-colors">
              &larr; Kembali ke Landing Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
