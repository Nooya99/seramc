'use client';

import { useEffect } from 'react';
import { ShoppingCart, Award, Shield, Trophy, Gem, Crown, Wand2, X } from 'lucide-react';

const ranks = [
  {
    name: 'LUX',
    icon: Award,
    badge: 'LUX',
    color: 'orange',
    prices: [
      { duration: '1 Bulan', price: '25K' },
      { duration: 'Permanen', price: '45K' },
    ],
    buyAll: '25K / 45K',
    bgClass: 'bg-orange-500/10 text-orange-400 border-orange-400/40',
    btnClass: 'bg-[#3b2314] hover:bg-orange-900 text-orange-200 border border-orange-500/20'
  },
  {
    name: 'VEIL',
    icon: Shield,
    badge: 'VEIL',
    color: 'gray',
    prices: [
      { duration: '1 Bulan', price: '40K' },
      { duration: 'Permanen', price: '65K' },
    ],
    buyAll: '40K / 65K',
    bgClass: 'bg-gray-400/10 text-gray-400 border-gray-400/40',
    btnClass: 'bg-[#2b2f3a] hover:bg-gray-700 text-gray-200 border border-gray-500/20'
  },
  {
    name: 'RIFT',
    icon: Trophy,
    badge: 'RIFT',
    color: 'yellow',
    prices: [
      { duration: '1 Bulan', price: '65K' },
      { duration: 'Permanen', price: '90K' },
    ],
    buyAll: '65K / 90K',
    bgClass: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/40',
    btnClass: 'bg-[#3d3315] hover:bg-yellow-900 text-yellow-200 border border-yellow-500/20'
  },
  {
    name: 'CORE',
    icon: Gem,
    badge: 'CORE',
    color: 'cyan',
    prices: [
      { duration: '1 Bulan', price: '90K' },
      { duration: 'Permanen', price: '120K' },
    ],
    buyAll: '90K / 120K',
    bgClass: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/40',
    btnClass: 'bg-[#15323d] hover:bg-cyan-900 text-cyan-200 border border-cyan-500/20'
  },
  {
    name: 'ARCH',
    icon: Crown,
    badge: 'ARCH',
    color: 'purple',
    prices: [
      { duration: '1 Bulan', price: '120K' },
      { duration: 'Permanen', price: '160K' },
    ],
    buyAll: '120K / 160K',
    bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/40',
    btnClass: 'bg-[#2d153d] hover:bg-purple-900 text-purple-200 border border-purple-500/20'
  },
  {
    name: 'CUSTOM',
    icon: Wand2,
    badge: 'CUSTOM',
    color: 'pink',
    isSpecial: true,
    prices: [
      { duration: '1 Bulan', price: '300K' },
      { duration: 'Permanen', price: '450K' },
    ],
    buyAll: '300K / 450K',
    bgClass: 'bg-pink-500/10 text-pink-400 border-pink-400/40',
    btnClass: 'bg-[#3d152a] hover:bg-pink-900 text-pink-200 border border-pink-500/20'
  }
];

export default function ShopModal({ isOpen, onClose, onBuyRank }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="modal-content flex flex-col relative w-full max-w-5xl max-h-[85vh] rounded-3xl bg-[#0b1120] border border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Navbar inside Modal */}
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-white/10 bg-[#0b1120] z-20 shrink-0">
          <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full glass-pill text-blue-400 shrink-0">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          
          <div className="flex-1 flex justify-center px-2">
            <img 
              src="/serashop.png" 
              alt="Sera Shop Logo" 
              className="h-12 md:h-16 object-contain drop-shadow-xl scale-[1.8] md:scale-[2.2]"
            />
          </div>

          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white glass-pill w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ease-in-out active:scale-95 rounded-full shrink-0"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="w-full flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">

        {/* Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {ranks.flatMap((item) => {
            const Icon = item.icon;
            return item.prices.map((p) => (
              <div 
                key={`${item.name}-${p.duration}`} 
                className="bg-[#0f1422] rounded-[1.5rem] p-6 md:p-8 flex flex-col relative overflow-hidden border border-white/5 shadow-xl transition-transform hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 border ${item.bgClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                {/* Rank Name & Duration */}
                <div className="mb-6">
                  <h3 className="font-black text-3xl md:text-4xl text-white font-poppins tracking-wide">
                    {item.badge}
                  </h3>
                  <p className="text-gray-400 font-medium mt-1">{p.duration}</p>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-4 mb-8 mt-auto">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-gray-300 text-[14px] md:text-[15px] font-medium">
                      Harga
                    </span>
                    <span className="text-[#f2e28a] font-bold text-3xl">
                      {p.price}
                    </span>
                  </div>
                </div>

                {/* Purchase Button */}
                <button 
                  onClick={() => onBuyRank(item.name, p.duration, p.price)}
                  className={`w-full font-bold py-3.5 rounded-2xl transition-all duration-300 ease-in-out text-[14px] md:text-[15px] active:scale-95 ${item.btnClass}`}
                >
                  Purchase Now
                </button>
              </div>
            ));
          })}
        </div>

        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin-top: 16px;
          margin-bottom: 16px;
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
