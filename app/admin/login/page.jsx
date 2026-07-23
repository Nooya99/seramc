'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Default password for now
    if (password === 'seramc123') {
      document.cookie = "admin_token=authenticated; path=/; max-age=86400"; // 1 day
      router.push('/admin');
    } else {
      setError('Password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1121] flex items-center justify-center p-4 font-poppins">
      <div className="bg-black/40 border border-white/10 p-8 rounded-2xl w-full max-w-md backdrop-blur-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Masukkan kata sandi untuk masuk</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Kata Sandi..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
