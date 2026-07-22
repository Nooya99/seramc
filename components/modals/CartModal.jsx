'use client';

import { ArrowLeft, ShoppingCart, Trash2, CheckCircle2 } from 'lucide-react';

export default function CartModal({ isOpen, onClose, cart, onRemoveItem, onCheckout }) {
  if (!isOpen) return null;

  // Calculate total price
  // Prices are strings like '25K', '1K', '300K'
  const totalPrice = cart.reduce((total, item) => {
    if (!item.price) return total;
    const num = parseInt(item.price.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return total;
    if (item.price.toUpperCase().includes('K')) {
      return total + (num * 1000);
    }
    return total + num;
  }, 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
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
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-poppins">Keranjang Belanja</h2>
          </div>
          
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 w-10 h-10 flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ease-in-out active:scale-95 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="w-full flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">Keranjang Anda Kosong</h3>
              <p className="text-gray-500">Silakan pilih item dari Shop untuk ditambahkan ke keranjang.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 shrink-0 mt-1">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{item.name}</h4>
                      <p className="text-gray-400 text-sm">{item.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#f2e28a] font-bold text-lg">{item.price}</span>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-full transition-colors active:scale-95"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="p-6 md:p-8 border-t border-white/10 bg-[#0f1422] shrink-0">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-300 font-medium text-lg">Total Pembayaran</span>
              <span className="text-[#f2e28a] font-black text-2xl md:text-3xl">{formatPrice(totalPrice)}</span>
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
