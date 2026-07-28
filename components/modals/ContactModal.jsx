'use client';

import Image from 'next/image';
import PixelIcon from '@/components/PixelIcon';
import { Icon } from '@iconify/react';
import { useState } from 'react';

const ExpandableButton = ({ title, subtitle, icon, iconColorClass, linkColorClass, links }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div 
      className={`neo-inset flex flex-col transition-all duration-300 ease-in-out cursor-pointer group hover:neo-glow ${expanded ? 'p-4 gap-3 bg-white/5' : 'p-4'}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform ${iconColorClass}`}>
          {icon}
        </div>
        <div className="text-left">
          <h4 className="font-bold text-white text-[13px] md:text-sm leading-tight">{title}</h4>
          <p className="text-gray-400 text-[10px] md:text-xs mt-0.5">{subtitle}</p>
        </div>
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out flex gap-2 w-full ${expanded ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {links.map((l, i) => (
          <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" className={`flex-1 bg-white/5 border border-white/5 text-center py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${linkColorClass}`}>
            {l.text}
          </a>
        ))}
      </div>
    </div>
  );
};

const admins = [
  { name: 'Admin 1 (Kira)', phone: '6283178533575' },
  { name: 'Admin 2 (Kaes)', phone: '6285273165229' },
  { name: 'Admin 3 (Finn)', phone: '6283119355072' },
];

export default function ContactModal({ isOpen, onClose, cart = [] }) {
  if (!isOpen) return null;

  const defaultMsg = 'Halo Admin, saya ingin bertanya tentang server SERA MC.';
  
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return 0;
    return priceStr.toUpperCase().includes('K') ? num * 1000 : num;
  };

  const formatPrice = (price) => price.toLocaleString('id-ID');

  let purchaseMsg = defaultMsg;
  if (cart.length > 0) {
    let itemsList = cart.map((item, i) => {
      const itemTotal = parsePrice(item.price) * (item.quantity || 1);
      return `${i + 1}. ${item.quantity || 1}x ${item.name} (${item.duration}) - ${formatPrice(itemTotal)}`;
    }).join('\n');
    const grandTotal = cart.reduce((total, item) => total + (parsePrice(item.price) * (item.quantity || 1)), 0);
    purchaseMsg = `Halo Admin, saya tertarik untuk membeli item berikut dari Shop:\n\n${itemsList}\n*Total Harga:* ${formatPrice(grandTotal)}\n\nMohon info untuk proses pembayarannya. Terima kasih!`;
  }

  const encodedText = encodeURIComponent(purchaseMsg);

  return (
    <div 
      className="modal fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="modal-content neo-glass w-full max-w-lg p-6 md:p-8 relative text-center"
      >
        <button 
          onClick={onClose} 
          className="modal-close-btn absolute top-4 md:top-5 right-4 md:right-5 text-gray-400 hover:text-white glass-pill w-12 h-12 flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ease-in-out active:scale-95"
        >
          <PixelIcon name="close" className="w-5 h-5" />
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
            <ExpandableButton 
              key={idx}
              title={admin.name}
              subtitle="WhatsApp Contact"
              icon={<Icon icon="simple-icons:whatsapp" className="w-5 h-5" />}
              iconColorClass="bg-[#25D366]/20 text-[#25D366]"
              linkColorClass="hover:bg-[#25D366]/20 hover:border-[#25D366]/30 text-[#25D366]"
              links={[
                { text: 'Chat via WA', href: `https://wa.me/${admin.phone}?text=${encodedText}` }
              ]}
            />
          ))}
        </div>

        {/* SOCIAL LINKS */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 mt-2 items-start">
          
          <ExpandableButton 
            title="Discord Server"
            subtitle="Grup Komunitas"
            icon={<Icon icon="simple-icons:discord" className="w-5 h-5" />}
            iconColorClass="bg-[#5865F2]/10 text-[#5865F2]"
            linkColorClass="hover:bg-[#5865F2]/20 hover:border-[#5865F2]/30 text-[#5865F2]"
            links={[
              { text: 'Join Discord', href: 'https://seramc.top/dc' }
            ]}
          />

          <ExpandableButton 
            title="WhatsApp Group"
            subtitle="Grup Obrolan"
            icon={<Icon icon="simple-icons:whatsapp" className="w-5 h-5" />}
            iconColorClass="bg-[#25D366]/10 text-[#25D366]"
            linkColorClass="hover:bg-[#25D366]/20 hover:border-[#25D366]/30 text-[#25D366]"
            links={[
              { text: 'Join Grup', href: 'https://seramc.top/wa' }
            ]}
          />

          <ExpandableButton 
            title="TikTok Resmi"
            subtitle="Video & Hiburan"
            icon={<Icon icon="simple-icons:tiktok" className="w-5 h-5" />}
            iconColorClass="bg-white/5 text-white group-hover:text-[#ff0050]"
            linkColorClass="hover:bg-[#ff0050]/20 hover:border-[#ff0050]/30 text-white hover:text-[#ff0050]"
            links={[
              { text: 'Buka TikTok', href: 'https://www.tiktok.com/@seramc.id?_r=1&_t=ZS-98P6TO16TIb' }
            ]}
          />

          <ExpandableButton 
            title="Vote Server"
            subtitle="Dukung Kami"
            icon={<PixelIcon name="checkbox-on" className="w-5 h-5" />}
            iconColorClass="bg-[#f2e28a]/10 text-[#f2e28a]"
            linkColorClass="hover:bg-[#f2e28a]/20 hover:border-[#f2e28a]/30 text-[#f2e28a]"
            links={[
              { text: 'Link 1', href: 'https://seramc.top/vote1' },
              { text: 'Link 2', href: 'https://seramc.top/vote2' }
            ]}
          />

        </div>
      </div>
    </div>
  );
}
