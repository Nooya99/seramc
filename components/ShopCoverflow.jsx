'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Award, Shield, Trophy, Gem, Crown, Wand2 } from 'lucide-react';

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
    bgClass: 'bg-orange-500/20 text-orange-400 border-orange-400/40',
    btnClass: 'bg-orange-500/20 hover:bg-orange-500/80 text-orange-200 border-orange-500/30'
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
    bgClass: 'bg-gray-400/20 text-gray-300 border-gray-300/40',
    btnClass: 'bg-gray-400/20 hover:bg-gray-400/80 text-gray-200 border-gray-400/30'
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
    bgClass: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/40',
    btnClass: 'bg-yellow-400/20 hover:bg-yellow-500/80 text-yellow-200 border-yellow-400/30'
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
    bgClass: 'bg-cyan-400/20 text-cyan-400 border-cyan-400/40',
    btnClass: 'bg-cyan-500/20 hover:bg-cyan-500/80 text-cyan-200 border-cyan-500/30'
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
    bgClass: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    btnClass: 'bg-purple-500/20 hover:bg-purple-500/80 text-purple-200 border-purple-500/30'
  },
  {
    name: 'CUSTOM',
    icon: Wand2,
    badge: 'CUSTOM',
    color: 'pink',
    isSpecial: true,
    prices: [
      { duration: '1 Bulan (Teks Biasa)', price: '300K' },
      { duration: 'Permanen (Custom Font)', price: '450K' },
    ],
    buyAll: '300K / 450K',
    bgClass: 'bg-pink-500/20 text-pink-400 border-pink-400/40',
    btnClass: 'bg-[#f2e28a] hover:bg-[#e6d680] text-gray-900 shadow-lg'
  }
];

export default function ShopCoverflow({ onBuyRank }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const moveShop = (step) => {
    setCurrentIndex((prev) => (prev + step + ranks.length) % ranks.length);
  };

  const getCardClass = (index) => {
    if (index === currentIndex) return 'center';
    if (index === (currentIndex - 1 + ranks.length) % ranks.length) return 'left';
    if (index === (currentIndex + 1) % ranks.length) return 'right';
    return 'hidden-card';
  };

  return (
    <section id="shop" className="py-16 md:py-24 px-4 md:px-6 max-w-6xl mx-auto relative z-10 overflow-hidden">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3 font-poppins drop-shadow-lg">
          Pricelist Server
        </h2>
        <p className="text-gray-200 font-medium text-[14px] md:text-[15px]">
          Dukung server dan dapatkan keuntungan eksklusif sesuai dengan rank pilihanmu.
        </p>
      </div>

      <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center">
        <button 
          onClick={() => moveShop(-1)} 
          className="absolute left-2 md:left-10 z-40 text-gray-400 hover:text-[#f2e28a] transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-12 h-12 md:w-16 md:h-16" />
        </button>
 
        <div id="shop-track" className="relative w-full max-w-5xl h-full flex justify-center items-center">
          {ranks.map((item, index) => {
            const Icon = item.icon;
            const cardState = getCardClass(index);
 
            return (
              <div 
                key={item.name} 
                className={`shop-card p-8 md:p-10 flex flex-col ${cardState}`}
                onClick={() => {
                  if (cardState === 'left') moveShop(-1);
                  if (cardState === 'right') moveShop(1);
                }}
                style={item.isSpecial ? { background: 'rgba(242,226,138,0.1)', borderColor: 'rgba(242,226,138,0.4)' } : {}}
              >
                {item.isSpecial && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#f2e28a] text-gray-900 text-xs md:text-sm font-bold px-5 py-1.5 rounded-full uppercase shadow-lg z-10">
                    Special Tier
                  </div>
                )}
 
                <div className="mb-8">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-5 border ${item.bgClass}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="font-bold text-2xl md:text-3xl text-white font-poppins">{item.badge}</h3>
 
                  <div className="space-y-4 mt-6 text-[15px] md:text-[16px] text-gray-300 w-full">
                    {item.prices.map((p, idx) => (
                      <button 
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBuyRank(item.name, p.duration, p.price);
                        }}
                        className="w-full flex justify-between items-center border-b border-white/10 pb-3 text-left focus:outline-none bg-transparent group active:scale-95 cursor-pointer transition-all duration-300 ease-in-out"
                      >
                        <span className="group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                          {p.duration}
                        </span>
                        <span className="text-[#f2e28a] font-bold text-lg md:text-xl group-hover:scale-105 transition-all duration-300">
                          {p.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
 
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuyRank(item.name, '1 Bulan / Permanen', item.buyAll);
                  }}
                  className={`mt-auto w-full font-bold py-3.5 rounded-xl transition-all duration-300 ease-in-out hover:scale-[1.02] border text-[15px] md:text-[16px] active:scale-95 cursor-pointer ${item.btnClass}`}
                >
                  Purchase Now
                </button>
              </div>
            );
          })}
        </div>
 
        <button 
          onClick={() => moveShop(1)} 
          className="absolute right-2 md:right-10 z-40 text-gray-400 hover:text-[#f2e28a] transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-12 h-12 md:w-16 md:h-16" />
        </button>
      </div>
    </section>
  );
}
