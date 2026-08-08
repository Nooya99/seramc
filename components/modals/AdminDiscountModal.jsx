'use client';

import React, { useState, useEffect } from 'react';
import { Percent, X, CheckCircle2, Clock, Timer, ArrowLeft } from 'lucide-react';

export default function AdminDiscountModal({ isOpen, onClose, selectedIds = [], defaultTarget = 'ALL', initialDiscount = '', initialExpiry = null, onSuccess }) {
  const [viewState, setViewState] = useState('form'); // form, timer, countdown
  const [saving, setSaving] = useState(false);
  
  const [globalDiscount, setGlobalDiscount] = useState('');
  const [discountTarget, setDiscountTarget] = useState(defaultTarget);
  const [discountCategory, setDiscountCategory] = useState('Rank');
  
  const [createdDiscountExpiry, setCreatedDiscountExpiry] = useState(null);
  
  const [durationDays, setDurationDays] = useState(''); 
  const [durationHours, setDurationHours] = useState(''); 
  const [durationMinutes, setDurationMinutes] = useState(''); 

  useEffect(() => {
    if (isOpen) {
      setGlobalDiscount(initialDiscount ? initialDiscount.toString() : '');
      setDiscountTarget(defaultTarget);
      
      if (initialExpiry) {
        const diff = new Date(initialExpiry).getTime() - new Date().getTime();
        if (diff > 0) {
          const hoursTotal = Math.floor(diff / (1000 * 60 * 60));
          const days = Math.floor(hoursTotal / 24);
          const hours = hoursTotal % 24;
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          setDurationDays(days > 0 ? days.toString() : '');
          setDurationHours(hours > 0 ? hours.toString() : '');
          setDurationMinutes(minutes > 0 ? minutes.toString() : '');
          setViewState('timer'); // Start in timer view if editing active expiry
        } else {
          setDurationDays('');
          setDurationHours('');
          setDurationMinutes('');
          setViewState('form');
        }
      } else {
        setDurationDays('');
        setDurationHours('');
        setDurationMinutes('');
        setViewState('form');
      }
    }
  }, [isOpen, defaultTarget]);

  const handleApplyDiscount = async (reset = false) => {
    const discountValue = reset ? 0 : parseInt(globalDiscount);
    if (!reset && (isNaN(discountValue) || discountValue < 0 || discountValue > 100)) {
      alert('Masukkan diskon antara 0 - 100');
      return;
    }

    if (discountTarget === 'SELECTED' && selectedIds.length === 0) {
      alert('Pilih setidaknya 1 produk terlebih dahulu');
      return;
    }

    setSaving(true);
    try {
      const payload = { 
        discount: discountValue,
        target: discountTarget,
        category: discountCategory,
        productIds: selectedIds,
        durationDays: reset ? null : (durationDays ? parseInt(durationDays) : null),
        durationHours: reset ? null : (durationHours ? parseInt(durationHours) : null),
        durationMinutes: reset ? null : (durationMinutes ? parseInt(durationMinutes) : null),
      };

      const res = await fetch('/api/products/discount', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onSuccess(reset ? 'Diskon berhasil direset!' : `Diskon ${discountValue}% berhasil diterapkan!`);
        onClose();
      } else {
        const errData = await res.json();
        alert('Gagal mengubah diskon: ' + (errData.error || 'Unknown error'));
        if (!reset) setViewState('form');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
      if (!reset) setViewState('form');
    } finally {
      setSaving(false);
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
        className="bg-[#121827] border border-cyan-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-900/20 overflow-y-auto custom-scrollbar"
        style={{ animation: 'slideUp 0.3s ease-out forwards' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-10 bg-[#121827]">
          <div className="flex items-center gap-3">
            {viewState !== 'form' && viewState !== 'countdown' && (
              <button 
                onClick={() => setViewState('form')}
                className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 transition-colors mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/20 text-cyan-400`}>
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {viewState === 'timer' ? 'Set Durasi Diskon' : 'Atur Diskon Global'}
              </h2>
              <p className="text-sm text-slate-400">
                 {viewState === 'timer' ? 'Tentukan masa berlaku diskon' : 'Berikan diskon untuk produk'}
              </p>
              {discountTarget === 'SELECTED' && viewState === 'form' && (
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

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar" data-lenis-prevent>
          
          {viewState === 'timer' ? (
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
                    onClick={() => handleApplyDiscount(false)}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                  >
                    {saving ? 'Menyimpan...' : 'Start Timer & Terapkan'}
                  </button>
                </div>

             </div>
          ) : (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Target Diskon</label>
                <select
                  value={discountTarget}
                  onChange={(e) => setDiscountTarget(e.target.value)}
                  className={`w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 ${discountTarget === 'CATEGORY' ? 'mb-3' : ''}`}
                >
                  <option value="ALL">Semua Produk</option>
                  <option value="CATEGORY">Berdasarkan Kategori</option>
                  <option value="SELECTED" disabled={selectedIds.length === 0}>
                    Hanya Produk Terpilih ({selectedIds.length} item)
                  </option>
                </select>

                {discountTarget === 'CATEGORY' && (
                  <select
                    value={discountCategory}
                    onChange={(e) => setDiscountCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Rank">Rank</option>
                    <option value="Key / Crate">Key / Crate</option>
                    <option value="Others">Others</option>
                    <option value="Race">Race</option>
                  </select>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Persentase Diskon (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Contoh: 15"
                  value={globalDiscount}
                  onChange={(e) => setGlobalDiscount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setViewState('timer')}
                  disabled={saving || !globalDiscount}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Timer className="w-4 h-4" />
                  Set Durasi & Terapkan Diskon
                </button>
                <button
                  onClick={() => handleApplyDiscount(true)}
                  disabled={saving}
                  className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  Reset Diskon (0%)
                </button>
              </div>
            </div>
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
