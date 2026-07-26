'use client';

import { useState, useEffect } from 'react';
import { Ticket, X, Plus, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminVoucherModal({ isOpen, onClose, selectedIds = [] }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [popupState, setPopupState] = useState({ show: false, type: 'success', message: '' });

  // Form State
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [maxUses, setMaxUses] = useState(''); // empty string means no limit
  const [durationDays, setDurationDays] = useState(''); // empty string means no expiry

  useEffect(() => {
    if (isOpen) {
      fetchVouchers();
    }
  }, [isOpen]);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vouchers');
      const data = await res.json();
      if (res.ok) {
        setVouchers(data);
      }
    } catch (error) {
      console.error('Failed to fetch vouchers', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'SERA-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!code || !discount) return;

    setSaving(true);
    try {
      const res = await fetch('/api/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discount: parseInt(discount),
          maxUses: maxUses ? parseInt(maxUses) : null,
          durationDays: durationDays ? parseInt(durationDays) : null,
          applicableProductIds: selectedIds
        })
      });
      if (res.ok) {
        // Reset form
        setCode('');
        setDiscount('');
        setMaxUses('');
        setDurationDays('');
        // Refresh list
        fetchVouchers();
        setPopupState({ show: true, type: 'success', message: 'Voucher berhasil dibuat!' });
      } else {
        const err = await res.json();
        setPopupState({ show: true, type: 'error', message: err.error || 'Gagal membuat voucher' });
      }
    } catch (error) {
      console.error('Failed to create voucher', error);
      setPopupState({ show: true, type: 'error', message: 'Terjadi kesalahan jaringan atau server' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus voucher ini?')) return;
    try {
      const res = await fetch('/api/vouchers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchVouchers();
      }
    } catch (error) {
      console.error('Failed to delete voucher', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0b101d]/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        className="bg-[#121827] border border-cyan-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-900/20"
        style={{ animation: 'slideUp 0.3s ease-out forwards' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Kelola Voucher</h2>
              <p className="text-sm text-slate-400">Buat dan atur kode diskon untuk pembeli</p>
              {selectedIds.length > 0 && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Berlaku untuk {selectedIds.length} Produk Terpilih
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {popupState.show ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 min-h-[300px]">
              {popupState.type === 'success' ? (
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-rose-500/20 flex items-center justify-center animate-pulse">
                  <X className="w-12 h-12 text-rose-500" />
                </div>
              )}
              
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {popupState.type === 'success' ? 'Berhasil!' : 'Gagal!'}
                </h3>
                <p className="text-slate-400 max-w-sm">{popupState.message}</p>
              </div>

              <button
                onClick={() => setPopupState({ show: false, type: 'success', message: '' })}
                className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all active:scale-95 border border-white/5"
              >
                Kembali
              </button>
            </div>
          ) : (
            <>
              {/* Create Form */}
              <form onSubmit={handleCreate} className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Buat Voucher Baru</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Kode Voucher</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Contoh: SERA2024"
                        className="flex-1 bg-[#0b101d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={generateRandomCode}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        title="Generate Random Code"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Diskon (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="10"
                      className="w-full bg-[#0b101d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-semibold text-slate-400">Batas Penggunaan (Limit)</label>
                    <input
                      type="number"
                      min="1"
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                      placeholder="Kosongkan jika tanpa batas"
                      className="w-full bg-[#0b101d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-1">
                    <label className="text-xs font-semibold text-slate-400">Durasi (Hari)</label>
                    <input
                      type="number"
                      min="1"
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                      placeholder="Kosongkan jika permanen"
                      className="w-full bg-[#0b101d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  <Plus className="w-4 h-4" />
                  {saving ? 'Menyimpan...' : 'Buat Voucher'}
                </button>
              </form>

              {/* List Vouchers */}
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Daftar Voucher Aktif</h3>
                
                {loading ? (
                  <div className="text-center py-8 text-slate-500 text-sm">Memuat data...</div>
                ) : vouchers.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-white/10 rounded-2xl">
                    Belum ada voucher yang dibuat.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vouchers.map(voucher => (
                      <div key={voucher.id} className="flex items-center justify-between p-4 bg-slate-900/40 border border-white/5 rounded-xl hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20">
                            {voucher.discount}%
                          </div>
                          <div>
                            <div className="font-bold text-white tracking-wide">{voucher.code}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              {voucher.maxUses ? (
                                <span>Terpakai {voucher.usedCount} / {voucher.maxUses}</span>
                              ) : (
                                <span>Terpakai {voucher.usedCount} (Tanpa Batas)</span>
                              )}
                              {voucher.expiresAt && (
                                <span className={new Date(voucher.expiresAt) < new Date() ? "ml-2 text-rose-500 font-semibold" : "ml-2 text-cyan-500 font-semibold"}>
                                  • {new Date(voucher.expiresAt) < new Date() ? 'Expired' : `Hingga ${new Date(voucher.expiresAt).toLocaleDateString('id-ID')}`}
                                </span>
                              )}
                              {voucher.applicableProductIds?.length > 0 && (
                                <span className="ml-2 text-emerald-500 font-semibold">• {voucher.applicableProductIds.length} Item Khusus</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(voucher.id)}
                          className="p-2 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
                          title="Hapus Voucher"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
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
          background: rgba(6, 182, 212, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.4);
        }
      `}</style>
    </div>
  );
}
