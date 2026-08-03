'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Hero({ onOpenModal }) {
  const [isHelperOpen, setIsHelperOpen] = useState(false);

  useEffect(() => {
    fetch('/api/helper/status')
      .then(res => res.json())
      .then(data => setIsHelperOpen(data.isOpen))
      .catch(console.error);
  }, []);

  return (
    <section id="home" className="relative min-h-screen w-full flex flex-col justify-center items-center text-center pt-20 overflow-hidden">
      <div className="relative z-10 w-full flex flex-col items-center px-4 md:px-6 max-w-6xl mx-auto mt-10">
        <div className="sparkle w-4 h-4 top-[10%] right-[25%]" style={{ animationDelay: '0.2s' }} />
        <div className="sparkle w-2 h-2 top-[40%] left-[25%]" style={{ animationDelay: '1.5s' }} />

        <div className="w-full flex justify-center mb-4 md:mb-5 relative">
          <Image 
            src="/1.png" 
            alt="SERA MC Logo" 
            width={480} 
            height={200}
            className="w-[300px] md:w-[480px] object-contain animate-float mix-blend-screen drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]"
            priority
          />
        </div>

        <h1 className="text-[28px] sm:text-[32px] md:text-[54px] font-bold text-white tracking-tight leading-tight font-poppins drop-shadow-lg relative">
          Welcome to SERA MC
        </h1>

        <p className="text-gray-200 text-[13px] md:text-[15px] max-w-[760px] mx-auto font-medium mt-3 md:mt-4 leading-[1.7] drop-shadow-md px-2 relative">
          Selamat datang! Di sini, kamu bukan sekadar bertahan hidup (survive), melainkan membangun peradaban, menguasai pasar ekonomi, dan mengukir reputasimu. Jalin aliansi, dirikan tokomu, dan jadilah legenda di dunia kotak-kotak ini.
        </p>

        {/* HERO BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mt-6 md:mt-8 relative w-full px-2">
          <button 
            onClick={() => onOpenModal('feedback')} 
            className="glass-pill text-white font-semibold px-6 md:px-10 py-3 md:py-[14px] text-[12px] md:text-[14.5px] active:scale-95 transition-all duration-300 ease-in-out hover:bg-white/20 hover:border-white/30"
          >
            Kritik & Saran
          </button>
          
          <button 
            onClick={() => onOpenModal('ip')} 
            className="bg-[#f2e28a] hover:bg-[#e6d680] text-gray-900 font-bold px-8 sm:px-10 md:px-14 py-3.5 md:py-[18px] text-[14px] md:text-[17px] rounded-full shadow-xl active:scale-95 transition-all duration-300 ease-in-out hover:scale-105 w-full sm:w-auto order-first sm:order-none"
          >
            Play Now
          </button>

          <button 
            onClick={() => onOpenModal('rules')} 
            className="glass-pill text-white font-semibold px-6 md:px-10 py-3 md:py-[14px] text-[12px] md:text-[14.5px] active:scale-95 transition-all duration-300 ease-in-out hover:bg-white/20 hover:border-white/30"
          >
            Rules
          </button>
        </div>

        {/* HELPER REGISTRATION - PROMINENT */}
        {isHelperOpen && (
          <div className="mt-8 relative w-full max-w-sm mx-auto px-4">
            <button 
              onClick={() => onOpenModal('helperReq')} 
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-8 py-4 text-[15px] md:text-[17px] rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-cyan-400/30 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="animate-pulse">✨</span> 
                Daftar Sebagai Helper!
                <span className="animate-pulse">✨</span>
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
