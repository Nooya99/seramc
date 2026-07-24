'use client';

import { useState, useEffect } from 'react';
import PixelIcon from '@/components/PixelIcon';

export default function OrderStatusModal({ isOpen, onClose, playerContext }) {
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOrderId('');
      setOrders([]);
      setHasSearched(false);
    }
      setOrders([]);
      setHasSearched(false);
    }
  }, [isOpen, playerContext]);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const res = await fetch(`/api/orders/check?orderId=${encodeURIComponent(orderId.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'PAID': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div 
      className="modal fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content neo-glass w-full max-w-2xl p-6 md:p-8 relative overflow-hidden flex flex-col max-h-[90vh]">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 md:top-5 right-4 md:right-5 text-gray-400 hover:text-white glass-pill w-10 h-10 flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ease-in-out active:scale-95 z-40"
        >
          <PixelIcon name="arrow-left" className="w-5 h-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 font-poppins text-center">Cek Status Pesanan</h2>
        <p className="text-gray-400 text-sm text-center mb-6">Masukkan ID Pesanan Anda untuk melihat status pesanan.</p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-6 shrink-0 relative z-10">
          <input 
            type="text" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="ID Pesanan (Contoh: A1B2C3D4...)"
            className="flex-1 neo-inset px-4 py-3 placeholder-gray-500 focus:outline-none focus:neo-glow transition-all"
            required
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="neo-button-primary font-bold px-6 py-3 whitespace-nowrap flex items-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <PixelIcon name="search" className="w-4 h-4" /> Cari
              </>
            )}
          </button>
        </form>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
          {!hasSearched ? (
            <div className="h-40 flex flex-col items-center justify-center text-gray-500">
              <PixelIcon name="search" className="w-12 h-12 mb-3 opacity-20" />
              <p>Mulai pencarian pesanan...</p>
            </div>
          ) : isLoading ? (
            <div className="h-40 flex flex-col items-center justify-center text-gray-400">
              <p>Mencari data...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-gray-500 bg-[#0b1120] rounded-2xl border border-white/5">
              <PixelIcon name="close" className="w-10 h-10 mb-2 opacity-30 text-red-400" />
              <p>Tidak ada pesanan ditemukan dengan ID tersebut.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="neo-inset p-4 md:p-5 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-gray-400 text-xs block mb-1">Order ID / Tanggal</span>
                      <div className="text-white font-mono text-sm">{order.id.split('-')[0].toUpperCase()} <span className="text-gray-500 mx-1">•</span> {new Date(order.createdAt).toLocaleDateString('id-ID')}</div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider text-center ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">
                          {item.quantity}x {item.product?.name || 'Produk Dihapus'} 
                          <span className="text-gray-500 text-xs ml-1">({item.duration})</span>
                        </span>
                        <span className="text-gray-400">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-1">
                    <span className="text-gray-400 text-sm font-bold">TOTAL</span>
                    <span className="text-[#f2e28a] font-bold text-lg">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
