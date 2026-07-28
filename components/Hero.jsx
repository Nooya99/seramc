'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function Hero({ onOpenModal }) {
  const [serverData, setServerData] = useState({ status: 'Loading...', players: '0', maxPlayers: '0' });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/server-status');
        const data = await res.json();
        setServerData(data);
      } catch (err) {
        setServerData({ status: 'Offline', players: '0', maxPlayers: '0' });
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
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

        <h1 className="text-[32px] md:text-[54px] font-bold text-white tracking-tight leading-tight font-poppins drop-shadow-lg relative">
          Welcome to SERA MC
        </h1>

        <p className="text-gray-200 text-[13px] md:text-[15px] max-w-[760px] mx-auto font-medium mt-3 md:mt-4 leading-[1.7] drop-shadow-md px-2 relative">
          Selamat datang! Di sini, kamu bukan sekadar bertahan hidup (survive), melainkan membangun peradaban, menguasai pasar ekonomi, dan mengukir reputasimu. Jalin aliansi, dirikan tokomu, dan jadilah legenda di dunia kotak-kotak ini.
        </p>

        {/* HERO BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5 mt-6 md:mt-8 relative">
          <button 
            onClick={() => onOpenModal('feedback')} 
            className="glass-pill text-white font-semibold px-8 md:px-10 py-3 md:py-[14px] text-[13px] md:text-[14.5px] active:scale-95 transition-all duration-300 ease-in-out hover:bg-white/20 hover:border-white/30"
          >
            Kritik & Saran
          </button>
          
          <button 
            onClick={() => onOpenModal('ip')} 
            className="bg-[#f2e28a] hover:bg-[#e6d680] text-gray-900 font-bold px-10 md:px-14 py-4 md:py-[18px] text-[15px] md:text-[17px] rounded-full shadow-xl active:scale-95 transition-all duration-300 ease-in-out hover:scale-105"
          >
            Play Now
          </button>

          <button 
            onClick={() => onOpenModal('rules')} 
            className="glass-pill text-white font-semibold px-8 md:px-10 py-3 md:py-[14px] text-[13px] md:text-[14.5px] active:scale-95 transition-all duration-300 ease-in-out hover:bg-white/20 hover:border-white/30"
          >
            Rules
          </button>
        </div>

        {/* SERVER STATUS (FIXED WIDGET) */}
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-3 glass-pill px-4 md:px-5 py-2.5 rounded-full border border-white/10 shadow-lg shadow-black/50 transition-all duration-300 hover:bg-[#0b101d]/80 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl cursor-default animate-fade-in group">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
              {serverData.status === 'Online' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 ${serverData.status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-white text-xs md:text-sm font-semibold tracking-wide hidden sm:inline-block">{serverData.status}</span>
          </div>
          
          <div className="w-px h-4 bg-white/20 hidden sm:block"></div>
          
          <div className="flex items-center gap-2 text-gray-200" title="Players Online">
            <Icon icon="mdi:account-group" className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] text-[#f2e28a] group-hover:scale-110 transition-transform" />
            <span className="text-xs md:text-sm font-bold">
              {serverData.players} <span className="text-gray-400 font-normal">/ {serverData.maxPlayers}</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
