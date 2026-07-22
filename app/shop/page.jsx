'use client';

import { ShoppingCart } from 'lucide-react';

const shopItems = [
  { id: 1, rank: 'LUX', duration: '1 Bulan', price: '25K' },
  { id: 2, rank: 'LUX', duration: 'Permanen', price: '45K' },
  { id: 3, rank: 'VEIL', duration: '1 Bulan', price: '40K' },
  { id: 4, rank: 'VEIL', duration: 'Permanen', price: '65K' },
  { id: 5, rank: 'RIFT', duration: '1 Bulan', price: '65K' },
  { id: 6, rank: 'RIFT', duration: 'Permanen', price: '90K' },
  { id: 7, rank: 'CORE', duration: '1 Bulan', price: '90K' },
  { id: 8, rank: 'CORE', duration: 'Permanen', price: '120K' },
  { id: 9, rank: 'ARCH', duration: '1 Bulan', price: '120K' },
  { id: 10, rank: 'ARCH', duration: 'Permanen', price: '160K' },
  { id: 11, rank: 'CUSTOM', duration: '1 Bulan', price: '300K' },
  { id: 12, rank: 'CUSTOM', duration: 'Permanen', price: '450K' },
];

export default function SeraShop() {
  return (
    <div className="min-h-screen bg-[#11101A] p-6 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-[#1A1826] rounded-3xl p-6 md:p-10 shadow-2xl relative border border-gray-800">
        
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold tracking-wider">SERA SHOP</h1>
          
          <button className="bg-blue-700 hover:bg-blue-600 transition-colors p-3 rounded-2xl flex items-center justify-center cursor-pointer">
            <ShoppingCart className="text-white w-6 h-6" />
          </button>
        </div>

        {/* Scrollable / Grid Area */}
        {/* We use a grid that maps nicely similar to the image (which has 2 rows and scrolls horizontally, or wraps) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
          {shopItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#FFB74D] rounded-2xl p-4 flex flex-col justify-between aspect-[3/4] shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-center mt-2 text-[#4A3219]">
                <h3 className="font-bold text-2xl">{item.rank}</h3>
                <p className="font-medium text-sm mt-1">{item.duration}</p>
                <p className="font-black text-xl mt-3">{item.price}</p>
              </div>

              <button className="mt-auto bg-[#1A16C0] hover:bg-blue-800 transition-colors text-white text-xs font-bold py-2 px-3 rounded-full w-full shadow-md">
                ADD TO CART
              </button>
            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1A1826;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3F3C56;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5A567A;
        }
      `}</style>
    </div>
  );
}
