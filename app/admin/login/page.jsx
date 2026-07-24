'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Sparkles, Key } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (password === 'seramc123') {
        document.cookie = "admin_token=authenticated; path=/; max-age=86400"; // 1 day
        localStorage.setItem('sera_admin_auth', 'true');
        router.push('/admin');
      } else {
        setError('Kata sandi yang Anda masukkan salah.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="bg-[#0b101d]/90 border border-slate-800 p-8 sm:p-10 rounded-3xl w-full max-w-md backdrop-blur-2xl shadow-2xl relative z-10 space-y-8">
        {/* Top Logo & Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/25 border border-cyan-400/30 text-white font-black text-3xl">
            S
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              SERA MC <span className="text-xs uppercase bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">Admin</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Portal Manajemen & Control Panel Supabase DB
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Kata Sandi Admin
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Masukkan kata sandi..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                required
              />
            </div>
            {error && (
              <p className="text-rose-400 text-xs font-semibold mt-1 text-center bg-rose-500/10 border border-rose-500/20 py-2 rounded-lg">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2 text-sm tracking-wide disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div className="pt-4 border-t border-slate-800/80 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Akses Terproteksi & Terenkripsi</span>
        </div>
      </div>
    </div>
  );
}
