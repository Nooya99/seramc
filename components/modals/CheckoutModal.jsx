'use client';

import { useState, useEffect } from 'react';
import PixelIcon from '@/components/PixelIcon';

const admins = [
  { name: 'Admin 1 (Owner)', phone: '628123456789' },
  { name: 'Admin 2', phone: '628123456789' },
  { name: 'Admin 3', phone: '628123456789' },
];

export default function CheckoutModal({ isOpen, onClose, cart = [], playerContext }) {
  const [ign, setIgn] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(admins[0].phone);

  useEffect(() => {
    if (playerContext?.nickname) {
      setIgn(playerContext.nickname);
    }
  }, [playerContext]);

  if (!isOpen) return null;

  const handleCheckout = (e) => {
    e.preventDefault();
    
    if (!ign || !whatsapp) {
      alert('Mohon isi In-Game Name dan Nomor WhatsApp Anda.');
      return;
    }

    let itemsList = cart.map((item, i) => `${i + 1}. ${item.quantity || 1}x ${item.name} (${item.duration}) - ${item.price}`).join('\n');
    
    const purchaseMsg = `*PESANAN BARU - SERA MC*\n\n*In-Game Name:* ${ign}\n*No. WhatsApp:* ${whatsapp}\n\n*Pesanan:*\n${itemsList}\n\n*Catatan Tambahan:*\n${notes || '-'}\n\nMohon info untuk proses pembayarannya. Terima kasih!`;
    
    const encodedText = encodeURIComponent(purchaseMsg);
    window.open(`https://wa.me/${selectedAdmin}?text=${encodedText}`, '_blank');
    onClose();
  };

  return (
    <div 
      className="modal fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="modal-content bubble-glass w-full max-w-lg rounded-[2rem] p-6 md:p-8 relative"
        style={{ background: 'rgba(11,17,33,0.95)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 md:top-5 right-4 md:right-5 text-gray-400 hover:text-white glass-pill w-10 h-10 flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ease-in-out active:scale-95"
        >
          <PixelIcon name="close" className="w-5 h-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-poppins text-center">Informasi Pembelian</h2>

        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">In-Game Name (IGN)</label>
            {playerContext ? (
              <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
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
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f2e28a] focus:ring-1 focus:ring-[#f2e28a] transition-all"
                required
              />
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">Nomor WhatsApp</label>
            <input 
              type="tel" 
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Contoh: 08123456789"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f2e28a] focus:ring-1 focus:ring-[#f2e28a] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">Catatan (Opsional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan pesan atau request khusus..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f2e28a] focus:ring-1 focus:ring-[#f2e28a] transition-all h-24 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">Pilih Admin WhatsApp</label>
            <select 
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f2e28a] focus:ring-1 focus:ring-[#f2e28a] transition-all"
            >
              {admins.map((admin, idx) => (
                <option key={idx} value={admin.phone} className="bg-[#0b1121]">
                  {admin.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#f2e28a] hover:bg-[#e6d680] text-gray-900 font-bold py-3.5 rounded-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg mt-4"
          >
            Lanjutkan via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
