'use client';

import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';

export default function AdminPromoPasteModal({ isOpen, onClose, onSuccess }) {
  const [promoText, setPromoText] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleProcess = async () => {
    if (!promoText.trim()) {
      alert('Masukkan teks promo terlebih dahulu.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/products/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: promoText })
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess(`Berhasil memproses promo! ${data.updatedCount} produk diperbarui.`);
        onClose();
        setPromoText('');
      } else {
        alert('Gagal memproses promo: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0b101d]/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        className="bg-[#121827] border border-fuchsia-500/30 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl shadow-fuchsia-900/20 overflow-hidden"
        style={{ animation: 'slideUp 0.3s ease-out forwards' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#121827]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-fuchsia-500/20 text-fuchsia-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Auto Promo (Paste)</h2>
              <p className="text-sm text-slate-400">Tempelkan teks promo Anda untuk menyesuaikan diskon harga otomatis.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <textarea
            value={promoText}
            onChange={(e) => setPromoText(e.target.value)}
            placeholder="Paste text promo di sini... (Contoh: - *Lux* ~Rp.45.000~ Rp.30.000)"
            className="w-full h-64 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-fuchsia-500 custom-scrollbar resize-none"
          />

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleProcess}
              disabled={saving}
              className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? 'Memproses...' : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Proses & Terapkan Diskon
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(217, 70, 239, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(217, 70, 239, 0.4);
        }
      `}</style>
    </div>
  );
}
