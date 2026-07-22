'use client';

import Image from 'next/image';
import { Phone, MessageCircle, Video, CheckSquare, X } from 'lucide-react';

const admins = [
  { name: 'Admin 1 (Owner)', phone: '628123456789' },
  { name: 'Admin 2', phone: '628123456789' },
  { name: 'Admin 3', phone: '628123456789' },
];

export default function ContactModal({ isOpen, onClose, cart = [] }) {
  if (!isOpen) return null;

  const defaultMsg = 'Halo Admin, saya ingin bertanya tentang server SERA MC.';
  
  // Format cart items for WhatsApp message
  let purchaseMsg = defaultMsg;
  if (cart.length > 0) {
    let itemsList = cart.map((item, i) => `${i + 1}. ${item.quantity || 1}x ${item.name} (${item.duration}) - ${item.price}`).join('\n');
    purchaseMsg = `Halo Admin, saya tertarik untuk membeli item berikut dari Shop:\n\n${itemsList}\n\nMohon info untuk proses pembayarannya. Terima kasih!`;
  }

  const encodedText = encodeURIComponent(purchaseMsg);

  return (
    <div 
      className="modal fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="modal-content bubble-glass w-full max-w-lg rounded-[2rem] p-6 md:p-8 relative text-center"
        style={{ background: 'rgba(11,17,33,0.95)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        <button 
          onClick={onClose} 
          className="modal-close-btn absolute top-4 md:top-5 right-4 md:right-5 text-gray-400 hover:text-white glass-pill w-12 h-12 flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ease-in-out active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        <Image 
          src="/2.png" 
          alt="SERA MC" 
          width={180}
          height={60}
          className="h-16 md:h-20 mx-auto mb-3 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        />

        <h2 className="text-lg md:text-xl font-bold text-white mb-6 font-poppins">Hubungi Kami</h2>

        {/* ADMIN LIST */}
        <div className="flex flex-col gap-3 mb-4">
          {admins.map((admin, idx) => (
            <a 
              key={idx}
              href={`https://wa.me/${admin.phone}?text=${encodedText}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center gap-4 bg-black/40 hover:bg-[#25D366]/10 border border-white/10 hover:border-[#25D366]/50 rounded-full p-2 pr-6 transition-all duration-300 ease-in-out group cursor-pointer active:scale-95"
            >
              <div className="w-10 h-10 bg-[#25D366]/20 text-[#25D366] rounded-full flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white text-[13px] md:text-sm leading-tight">{admin.name}</h4>
                <p className="text-gray-400 text-[10px] md:text-xs mt-0.5">WhatsApp Contact</p>
              </div>
            </a>
          ))}
        </div>

        {/* SOCIAL LINKS */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 mt-2">
          
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="bg-[#131826] border border-white/5 hover:border-[#5865F2]/50 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ease-in-out group hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(88,101,242,0.2)] active:scale-98"
          >
            <div className="w-11 h-11 bg-[#5865F2]/10 text-[#5865F2] rounded-full flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-white text-[13px] md:text-sm leading-tight">Discord Server</h4>
              <p className="text-gray-400 text-[10px] md:text-xs mt-0.5">Grup Komunitas</p>
            </div>
          </a>

          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="bg-[#131826] border border-white/5 hover:border-[#25D366]/50 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ease-in-out group hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(37,211,102,0.2)] active:scale-98"
          >
            <div className="w-11 h-11 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-white text-[13px] md:text-sm leading-tight">WhatsApp Group</h4>
              <p className="text-gray-400 text-[10px] md:text-xs mt-0.5">Grup Obrolan</p>
            </div>
          </a>

          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="bg-[#131826] border border-white/5 hover:border-[#ff0050]/50 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ease-in-out group hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(255,0,80,0.2)] active:scale-98"
          >
            <div className="w-11 h-11 bg-white/5 text-white group-hover:text-[#ff0050] rounded-full flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-white text-[13px] md:text-sm leading-tight">TikTok Resmi</h4>
              <p className="text-gray-400 text-[10px] md:text-xs mt-0.5">Video & Hiburan</p>
            </div>
          </a>

          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            className="bg-[#131826] border border-white/5 hover:border-[#f2e28a]/50 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ease-in-out group hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(242,226,138,0.2)] active:scale-98"
          >
            <div className="w-11 h-11 bg-[#f2e28a]/10 text-[#f2e28a] rounded-full flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-white text-[13px] md:text-sm leading-tight">Vote Server</h4>
              <p className="text-gray-400 text-[10px] md:text-xs mt-0.5">Dukung Kami</p>
            </div>
          </a>

        </div>
      </div>
    </div>
  );
}
