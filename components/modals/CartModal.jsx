'use client';

import { useState, useEffect } from 'react';
import PixelIcon from '@/components/PixelIcon';

export default function CartModal({ isOpen, onClose, cart, onRemoveItem, onUpdateQuantity, onCheckout, appliedVoucher, setAppliedVoucher }) {
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [validatingVoucher, setValidatingVoucher] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (!appliedVoucher) {
        setVoucherCode('');
      }
      setVoucherError('');
    }
  }, [isOpen, appliedVoucher]);
  if (!isOpen) return null;

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return 0;
    return priceStr.toUpperCase().includes('K') ? num * 1000 : num;
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + (parsePrice(item.price) * (item.quantity || 1));
    }, 0);
  };

  const calculateDiscountValue = () => {
    if (!appliedVoucher) return 0;
    
    // If the voucher has specific items, calculate subtotal only for those items
    if (appliedVoucher.applicableProductIds && appliedVoucher.applicableProductIds.length > 0) {
      const applicableSubtotal = cart.reduce((total, item) => {
        if (appliedVoucher.applicableProductIds.includes(item.id)) {
          return total + parsePrice(item.price) * (item.quantity || 1);
        }
        return total;
      }, 0);
      return applicableSubtotal * (appliedVoucher.discount / 100);
    }
    
    // Otherwise, apply to the entire subtotal
    const subtotal = calculateSubtotal();
    return subtotal * (appliedVoucher.discount / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - calculateDiscountValue();
  };

  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    setValidatingVoucher(true);
    setVoucherError('');
    try {
      const res = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCode.trim().toUpperCase() })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        // Check if the voucher applies to the current cart
        if (data.applicableProductIds && data.applicableProductIds.length > 0) {
          const hasApplicableItem = cart.some(item => data.applicableProductIds.includes(item.id));
          if (!hasApplicableItem) {
            setVoucherError('Voucher ini tidak berlaku untuk item di keranjang Anda');
            setAppliedVoucher(null);
            return;
          }
        }
        setAppliedVoucher(data);
        setVoucherError('');
      } else {
        setVoucherError(data.error || 'Voucher tidak valid');
        setAppliedVoucher(null);
      }
    } catch (err) {
      setVoucherError('Gagal memvalidasi voucher');
      setAppliedVoucher(null);
    } finally {
      setValidatingVoucher(false);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('id-ID');
  };

  return (
    <div 
      className="modal fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="modal-content flex flex-col relative w-full max-w-2xl max-h-[85vh] rounded-[2rem] bg-[#0b1120] border border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0f1422] z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
              <PixelIcon name="shopping-cart" className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-poppins">Keranjang Belanja</h2>
          </div>
          
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 w-10 h-10 flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ease-in-out active:scale-95 rounded-full"
          >
            <PixelIcon name="arrow-left" className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="w-full flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <PixelIcon name="shopping-cart" className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">Keranjang Anda Kosong</h3>
              <p className="text-gray-500">Silakan pilih item dari Shop untuk ditambahkan ke keranjang.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 shrink-0 mt-1">
                      <PixelIcon name="check" className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{item.name}</h4>
                      <p className="text-gray-400 text-sm">{item.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4">
                      <span className="text-[#f2e28a] font-bold text-lg">{formatPrice(parsePrice(item.price) * (item.quantity || 1))}</span>
                      
                      <div className="flex items-center gap-3 bg-black/20 rounded-full px-2 py-1">
                        <button 
                          onClick={() => onUpdateQuantity(index, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors active:scale-95"
                        >
                          <PixelIcon name="minus" className="w-3 h-3" />
                        </button>
                        <span className="text-white font-bold text-sm w-4 text-center">{item.quantity || 1}</span>
                        <button 
                          onClick={() => onUpdateQuantity(index, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors active:scale-95"
                        >
                          <PixelIcon name="plus" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-full transition-colors active:scale-95 ml-2"
                    >
                      <PixelIcon name="trash" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="p-6 md:p-8 border-t border-white/10 bg-[#0f1422] shrink-0 space-y-5">
            {/* Voucher Input */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">Kode Voucher <span className="text-gray-500 font-normal text-xs">(Opsional)</span></label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="Masukkan kode voucher"
                  disabled={appliedVoucher !== null}
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-50"
                />
                {appliedVoucher ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedVoucher(null);
                      setVoucherCode('');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 font-bold text-sm border border-rose-500/30 hover:bg-rose-500/30 transition-all"
                  >
                    Batal
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    disabled={validatingVoucher || !voucherCode.trim()}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm border border-emerald-500/30 hover:bg-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {validatingVoucher ? 'Cek...' : 'Pakai'}
                  </button>
                )}
              </div>
              {voucherError && <p className="text-rose-400 text-xs mt-2">{voucherError}</p>}
              {appliedVoucher && (
                <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
                  Voucher berhasil diterapkan! (-{appliedVoucher.discount}%)
                  {appliedVoucher.applicableProductIds?.length > 0 && " (Item Tertentu)"}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-gray-400 text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(calculateSubtotal())}</span>
              </div>
              {appliedVoucher && (
                <div className="flex items-center justify-between text-emerald-400 text-sm">
                  <span>
                    Diskon Voucher ({appliedVoucher.discount}%)
                    {appliedVoucher.applicableProductIds?.length > 0 && " (Item Tertentu)"}
                  </span>
                  <span className="font-bold">- {formatPrice(calculateDiscountValue())}</span>
                </div>
              )}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                <span className="text-gray-200 font-medium text-lg">Total Pembayaran</span>
                <span className="text-[#f2e28a] font-black text-2xl md:text-3xl">{formatPrice(calculateTotal())}</span>
              </div>
            </div>
            
            <button 
              onClick={onCheckout}
              className="w-full font-bold py-4 rounded-2xl transition-all duration-300 ease-in-out text-base md:text-lg active:scale-95 bg-[#25D366] hover:bg-[#1ebd5a] text-white shadow-[0_0_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2"
            >
              Lanjut pembayaran
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
