'use client';

import { useState, useEffect } from 'react';
import PixelIcon from '@/components/PixelIcon';
import { Icon } from '@iconify/react';

const targetAdmin = '6285161516730'; // Owner WhatsApp

export default function CheckoutModal({ isOpen, onClose, onSuccess, cart = [], playerContext, appliedVoucher }) {
  const [ign, setIgn] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (playerContext?.nickname) {
        setIgn(playerContext.nickname);
      }
      setCheckoutStatus(null);
      setCheckoutMessage('');
    }
  }, [isOpen, playerContext]);

  if (!isOpen) return null;

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return 0;
    return priceStr.toUpperCase().includes('K') ? num * 1000 : num;
  };

  const formatPrice = (price) => {
    return price.toLocaleString('id-ID');
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + parsePrice(item.price) * (item.quantity || 1);
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

  const handleCheckout = async (e, platform = 'whatsapp') => {
    e.preventDefault();
    
    if (!ign || (platform === 'whatsapp' && !whatsapp)) {
      setCheckoutStatus('error');
      setCheckoutMessage(platform === 'whatsapp' ? 'Mohon isi In-Game Name dan Nomor WhatsApp Anda.' : 'Mohon isi In-Game Name Anda.');
      return;
    }

    // Save to database
    let shortOrderId = null;
    let initialCheckoutMsg = '';
    
    try {
      const orderData = {
        ign,
        whatsapp,
        items: cart,
        totalAmount: calculateTotal(),
        paymentMethod: platform === 'discord' ? 'Discord' : 'WhatsApp',
        voucherCode: appliedVoucher?.code || null
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        const data = await res.json();
        // Extract the short order ID (first segment of UUID)
        shortOrderId = data.id ? data.id.split('-')[0].toUpperCase() : null;
        if (shortOrderId) {
          initialCheckoutMsg = `PESANAN ANDA SEDANG DI PROSES. ID Pesanan Anda: ${shortOrderId}`;
          setCheckoutMessage(initialCheckoutMsg);
        } else {
          initialCheckoutMsg = 'PESANAN ANDA SEDANG DI PROSES';
          setCheckoutMessage(initialCheckoutMsg);
        }
      } else {
        initialCheckoutMsg = 'PESANAN ANDA SEDANG DI PROSES';
        setCheckoutMessage(initialCheckoutMsg);
      }
    } catch (error) {
      console.error('Failed to save order to database', error);
      // We continue to WhatsApp even if DB fails so user can still order
    }

    let itemsList = cart.map((item, i) => {
      const itemTotal = parsePrice(item.price) * (item.quantity || 1);
      return `${i + 1}. ${item.quantity || 1}x ${item.name} (${item.duration}) - ${formatPrice(itemTotal)}`;
    }).join('\n');
    
    const purchaseMsg = `*PESANAN BARU - SERA MC*\n\n*In-Game Name:* ${ign}\n*No. WhatsApp:* ${whatsapp}${shortOrderId ? `\n*ID Pesanan:* ${shortOrderId}` : ''}\n\n*Pesanan:*\n${itemsList}${appliedVoucher ? `\n*Voucher:* ${appliedVoucher.code} (-${appliedVoucher.discount}%)` : ''}\n*Total Harga:* ${formatPrice(calculateTotal())}\n\n*Metode Pembayaran:* ${platform === 'discord' ? 'Discord' : 'WhatsApp'}\n\nMohon info untuk proses pembayarannya. Terima kasih!`;
    
    if (platform === 'discord') {
      try {
        await navigator.clipboard.writeText(purchaseMsg);
        alert("Rincian pesanan telah disalin ke clipboard! Silakan Paste/Tempel pesan tersebut saat membuka tiket di server Discord kami.");
      } catch (err) {
        console.error('Failed to copy', err);
      }
      window.open('https://discord.com/channels/1509580648925626599/1522494890443935774', '_blank');
    } else {
      const encodedText = encodeURIComponent(purchaseMsg);
      window.open(`https://wa.me/${targetAdmin}?text=${encodedText}`, '_blank');
    }
    
    setTimeout(() => {
      setCheckoutStatus('success');
      // Set to generic message if the database request didn't finish setting it
      setCheckoutMessage(prev => prev || initialCheckoutMsg || 'PESANAN ANDA SEDANG DI PROSES');
    }, 500);
  };

  return (
    <div 
      className="modal fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget && !checkoutStatus) onClose(); }}
    >
      <div 
        className="modal-content neo-glass w-full max-w-lg p-6 md:p-8 relative overflow-hidden"
      >
        {checkoutStatus && (
          <div className="absolute inset-0 bg-[#0b1120]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-8 text-center" style={{ animation: 'fadeIn 0.3s ease-out forwards' }}>
            <div 
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl ${
                checkoutStatus === 'success' 
                  ? 'bg-emerald-500/20 text-emerald-400 border-[3px] border-emerald-500/50 shadow-emerald-500/20' 
                  : 'bg-red-500/20 text-red-400 border-[3px] border-red-500/50 shadow-red-500/20'
              }`}
              style={{ animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
            >
              <PixelIcon name={checkoutStatus === 'success' ? 'check' : 'close'} className="w-12 h-12" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-poppins uppercase tracking-wide" style={{ animation: 'slideUp 0.5s ease-out 0.2s both' }}>
              {checkoutStatus === 'success' ? 'PESANAN BERHASIL!' : 'GAGAL!'}
            </h3>
            <p className="text-gray-300 mb-8 text-sm md:text-base max-w-[280px]" style={{ animation: 'slideUp 0.5s ease-out 0.3s both' }}>
              {checkoutMessage}
            </p>
            <button 
              onClick={() => {
                const currentStatus = checkoutStatus;
                setCheckoutStatus(null);
                if (currentStatus === 'success') {
                  if (onSuccess) onSuccess();
                  else onClose();
                }
              }}
              className="neo-button-primary w-full max-w-[200px] font-bold py-3.5 transition-all duration-300 ease-in-out"
              style={{ animation: 'slideUp 0.5s ease-out 0.4s both' }}
            >
              Oke
            </button>
          </div>
        )}

        <button 
          onClick={onClose} 
          className="absolute top-4 md:top-5 right-4 md:right-5 text-gray-400 hover:text-white glass-pill w-10 h-10 flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ease-in-out active:scale-95 z-40"
        >
          <PixelIcon name="close" className="w-5 h-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-poppins text-center">Informasi Pembelian</h2>

        <form className="space-y-4 relative z-10">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">In-Game Name (IGN)</label>
            {playerContext ? (
              <div className="flex items-center gap-3 neo-inset px-4 py-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-[#f2e28a] shrink-0 bg-[#0b1120]">
                  <img src={playerContext.avatarUrl} alt={playerContext.nickname} className="w-full h-full object-cover rendering-pixelated" style={{ imageRendering: 'pixelated' }} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm md:text-base font-poppins">{playerContext.nickname}</span>
                </div>
              </div>
            ) : (
              <input 
                type="text" 
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                placeholder="Contoh: Steve_Minecraft"
                className="w-full neo-inset px-4 py-3 placeholder-gray-500 focus:outline-none focus:neo-glow transition-all"
                required
              />
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Nomor WhatsApp <span className="text-gray-500 font-normal text-xs">(Opsional jika via Discord)</span>
            </label>
            <input 
              type="tel" 
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Contoh: 085161516730"
              className="w-full neo-inset px-4 py-3 placeholder-gray-500 focus:outline-none focus:neo-glow transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">Ringkasan Pesanan</label>
            <div className="w-full neo-inset px-4 py-3">
              <div className="flex justify-between items-center text-[10px] md:text-xs text-gray-500 font-bold mb-3 pb-2 border-b border-white/20 uppercase tracking-widest">
                <span>Item</span>
                <span>Total</span>
              </div>
              <div className="max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, idx) => {
                  const itemTotal = parsePrice(item.price) * (item.quantity || 1);
                  return (
                    <div key={idx} className="flex justify-between items-center text-sm mb-2 pb-2 border-b border-white/5 last:border-0 last:mb-0 last:pb-0">
                      <span className="text-gray-300">{item.quantity || 1}x {item.name} <span className="text-xs text-gray-500">({item.duration})</span></span>
                      <span className="text-[#f2e28a] font-bold">{formatPrice(itemTotal)}</span>
                    </div>
                  );
                })}
              </div>
              {appliedVoucher && (
                <div className="flex justify-between items-center mt-2 text-emerald-400">
                  <span className="text-xs">
                    Diskon Voucher ({appliedVoucher.discount}%)
                    {appliedVoucher.applicableProductIds?.length > 0 && " (Item Tertentu)"}
                  </span>
                  <span className="font-bold">- {formatPrice(calculateDiscountValue())}</span>
                </div>
              )}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/20">
                <span className="font-bold text-white uppercase text-xs tracking-wider">TOTAL</span>
                <span className="text-[#f2e28a] font-bold text-lg">{formatPrice(calculateTotal())}</span>
              </div>
            </div>
          </div>

          {/* Removed Voucher Input from here as it's now in CartModal */}

          <div className="pt-2">
            <label className="block text-gray-300 text-sm font-bold mb-3 text-center tracking-wide">Lanjut Pembayaran via</label>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={(e) => handleCheckout(e, 'discord')}
                className="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 md:py-4 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(88,101,242,0.2)] hover:shadow-[0_0_30px_rgba(88,101,242,0.4)]"
              >
                <Icon icon="simple-icons:discord" className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">Discord</span>
              </button>

              <button 
                type="button"
                onClick={(e) => handleCheckout(e, 'whatsapp')}
                className="flex-1 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-3 md:py-4 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]"
              >
                <Icon icon="simple-icons:whatsapp" className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">WhatsApp</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
