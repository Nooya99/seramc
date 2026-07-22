'use client';

import { ShoppingCart, Award, Shield, Trophy, Gem, Crown, Wand2 } from 'lucide-react';
import Link from 'next/link';

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

export default function SeraShop() {
  return (
    <div className="min-h-screen bg-[#0b1120] p-6 flex flex-col items-center">
      
      {/* Header section */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-10 mt-4">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
          ← Back to Home
        </Link>
        <h1 className="text-white text-2xl md:text-4xl font-bold tracking-wider font-poppins text-center flex-1">SERA SHOP</h1>
        <button className="bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/40 transition-colors p-3 rounded-2xl flex items-center justify-center cursor-pointer text-blue-400">
          <ShoppingCart className="w-6 h-6" />
        </button>
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full pb-20">
        {ranks.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.name} 
              className="bg-[#0f1422] rounded-[1.5rem] p-8 flex flex-col relative overflow-hidden border border-white/5 shadow-2xl transition-transform hover:-translate-y-1"
            >
              
              {/* Icon */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 border ${item.bgClass}`}>
                <Icon className="w-6 h-6" />
              </div>
              
              {/* Rank Name */}
              <h3 className="font-black text-4xl text-white font-poppins tracking-wide mb-6">
                {item.badge}
              </h3>

              {/* Pricing Rows */}
              <div className="flex flex-col gap-4 mb-8">
                {item.prices.map((p, idx) => (
                  <div 
                    key={idx}
                    className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0"
                  >
                    <span className="text-gray-300 text-[15px] font-medium">
                      {p.duration}
                    </span>
                    <span className="text-[#f2e28a] font-bold text-xl">
                      {p.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Purchase Button */}
              <button 
                className={`mt-auto w-full font-bold py-4 rounded-2xl transition-all duration-300 ease-in-out text-[15px] ${item.btnClass}`}
              >
                Purchase Now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
