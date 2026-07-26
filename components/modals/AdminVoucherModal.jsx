'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Ticket, X, Plus, Trash2, CheckCircle2, RefreshCw, Clock, Timer, ArrowLeft } from 'lucide-react';

const CountdownTimer = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = new Date(expiresAt).getTime() - new Date().getTime();
      if (diff <= 0) return 'Expired';
      
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const hh = hours.toString().padStart(2, '0');
      const mm = minutes.toString().padStart(2, '0');
      const ss = seconds.toString().padStart(2, '0');
      
      return days > 0 ? `${days}:${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const tl = calculateTimeLeft();
      setTimeLeft(tl);
      if (tl === 'Expired') clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!timeLeft) return null; // initial render
  if (timeLeft === 'Expired') {
    return <span className="ml-2 text-rose-500 font-semibold text-[11px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 animate-pulse">• Expired</span>;
  }

  return (
    <span className="ml-2 text-cyan-400 font-mono font-semibold text-[11px] bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-500/20">
      ⏳ {timeLeft}
    </span>
  );
};

const SuccessCountdown = ({ expiresAt }) => {
  const [timeData, setTimeData] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const diff = new Date(expiresAt).getTime() - now;
      if (diff <= 0) {
        setTimeData({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return false;
      }
      
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeData({ days, hours, minutes, seconds, isExpired: false });
      return true;
    };

    calculate();
    const timer = setInterval(() => {
      const isRunning = calculate();
      if (!isRunning) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 my-4">
      <div className="flex items-center justify-center gap-2 md:gap-4 text-center">
        {timeData.days > 0 && (
          <>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Days</span>
              <span className="text-5xl md:text-6xl font-bold text-white font-mono">{timeData.days.toString().padStart(2, '0')}</span>
            </div>
            <span className="text-4xl md:text-5xl font-bold text-slate-600 mt-4">:</span>
          </>
        )}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Hours</span>
          <span className="text-5xl md:text-6xl font-bold text-white font-mono">{timeData.hours.toString().padStart(2, '0')}</span>
        </div>
        <span className="text-4xl md:text-5xl font-bold text-slate-600 mt-4">:</span>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Minutes</span>
          <span className="text-5xl md:text-6xl font-bold text-white font-mono">{timeData.minutes.toString().padStart(2, '0')}</span>
        </div>
        <span className="text-4xl md:text-5xl font-bold text-slate-600 mt-4">:</span>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Seconds</span>
          <span className="text-5xl md:text-6xl font-bold text-white font-mono">{timeData.seconds.toString().padStart(2, '0')}</span>
        </div>
      </div>
      {timeData.isExpired ? (
        <span className="text-rose-500 text-base mt-4 flex items-center gap-1.5 font-semibold animate-pulse">• Expired</span>
      ) : (
        <span className="text-slate-400 text-base mt-4 flex items-center gap-1.5"><Clock className="w-5 h-5 text-emerald-400"/> Voucher Aktif</span>
      )}
    </div>
  );
};

export default function AdminVoucherModal({ isOpen, onClose, selectedIds = [] }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // View state: 'list', 'timer', 'countdown'
  const [viewState, setViewState] = useState('list'); 
  const [createdVoucherExpiry, setCreatedVoucherExpiry] = useState(null);
  
  // Basic Form State
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [maxUses, setMaxUses] = useState(''); // empty string means no limit
  
  // Timer State
  const [durationDays, setDurationDays] = useState(''); 
  const [durationHours, setDurationHours] = useState(''); 
  const [durationMinutes, setDurationMinutes] = useState(''); 

  useEffect(() => {
    if (isOpen) {
      fetchVouchers();
      setViewState('list');
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

  const handleCreate = async () => {
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
          durationHours: durationHours ? parseInt(durationHours) : null,
          durationMinutes: durationMinutes ? parseInt(durationMinutes) : null,
          applicableProductIds: selectedIds
        })
      });
      if (res.ok) {
        const data = await res.json();
        // Reset form
        setCode('');
        setDiscount('');
        setMaxUses('');
        setDurationDays('');
        setDurationHours('');
        setDurationMinutes('');
        fetchVouchers();
        
        if (data.expiresAt) {
           setCreatedVoucherExpiry(data.expiresAt);
           setViewState('countdown');
        } else {
           setViewState('list');
        }
      } else {
        const err = await res.json();
        alert(err.error || 'Gagal membuat voucher');
        setViewState('list');
      }
    } catch (error) {
      console.error('Failed to create voucher', error);
      alert('Terjadi kesalahan jaringan atau server');
      setViewState('list');
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

  const applyTemplate = (days, hours, minutes) => {
    setDurationDays(days ? days.toString() : '');
    setDurationHours(hours ? hours.toString() : '');
    setDurationMinutes(minutes ? minutes.toString() : '');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0b101d]/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        className="bg-[#121827] border border-cyan-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-900/20 overflow-hidden"
        style={{ animation: 'slideUp 0.3s ease-out forwards' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-10 bg-[#121827]">
          <div className="flex items-center gap-3">
            {viewState !== 'list' && (
              <button 
                onClick={() => setViewState('list')}
                className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 transition-colors mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${viewState === 'countdown' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
              {viewState === 'countdown' ? <CheckCircle2 className="w-5 h-5" /> : <Ticket className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {viewState === 'timer' ? 'Set Durasi Voucher' : viewState === 'countdown' ? 'Voucher Berhasil!' : 'Kelola Voucher'}
              </h2>
              <p className="text-sm text-slate-400">
                 {viewState === 'timer' ? 'Tentukan masa berlaku voucher' : viewState === 'countdown' ? 'Voucher telah aktif dan siap digunakan' : 'Buat dan atur kode diskon untuk pembeli'}
              </p>
              {selectedIds.length > 0 && viewState === 'list' && (
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
          
          {viewState === 'countdown' ? (
             <div className="flex flex-col items-center justify-center py-4">
                <SuccessCountdown expiresAt={createdVoucherExpiry} />
                <button
                  onClick={() => setViewState('list')}
                  className="mt-8 px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all active:scale-95 border border-white/5"
                >
                  Kembali
                </button>
             </div>
          ) : viewState === 'timer' ? (
             <div className="flex flex-col items-center space-y-8 py-4">
                
                {/* Timer Inputs */}
                <div className="flex items-center justify-center gap-4 md:gap-8 w-full max-w-lg">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Days</span>
                    <input
                      type="number"
                      min="0"
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                      placeholder="00"
                      className="w-20 md:w-24 h-24 bg-transparent border-b-2 border-slate-700 focus:border-cyan-500 text-center text-4xl md:text-5xl font-bold text-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-slate-700 pb-2">:</div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Hours</span>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                      placeholder="00"
                      className="w-20 md:w-24 h-24 bg-transparent border-b-2 border-slate-700 focus:border-cyan-500 text-center text-4xl md:text-5xl font-bold text-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-slate-700 pb-2">:</div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Minutes</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      placeholder="00"
                      className="w-20 md:w-24 h-24 bg-transparent border-b-2 border-slate-700 focus:border-cyan-500 text-center text-4xl md:text-5xl font-bold text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Templates */}
                <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                  <button onClick={() => applyTemplate(7, 0, 0)} className="px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-white/5 transition-colors">
                    7 Days
                  </button>
                  <button onClick={() => applyTemplate(1, 0, 30)} className="px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-white/5 transition-colors">
                    1 Day 30 Mins
                  </button>
                  <button onClick={() => applyTemplate(0, 2, 15)} className="px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-white/5 transition-colors">
                    2 Hours 15 Mins
                  </button>
                  <button onClick={() => applyTemplate(0, 0, 15)} className="px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-white/5 transition-colors">
                    15 Mins
                  </button>
                </div>

                {/* Start Button */}
                <div className="pt-8 w-full max-w-xs">
                  <button
                    onClick={handleCreate}
                    disabled={saving || (!durationDays && !durationHours && !durationMinutes)}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                  >
                    {saving ? 'Creating...' : 'Start'}
                  </button>
                </div>

             </div>
          ) : (
            <>
              {/* Create Form */}
              <form onSubmit={(e) => { e.preventDefault(); setViewState('timer'); }} className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 space-y-4">
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
                  
                  <div className="space-y-1.5 md:col-span-2">
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
                </div>

                <button
                  type="submit"
                  disabled={!code || !discount}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  <Timer className="w-4 h-4" />
                  Set Durasi & Buat Voucher
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
                                <CountdownTimer expiresAt={voucher.expiresAt} />
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
