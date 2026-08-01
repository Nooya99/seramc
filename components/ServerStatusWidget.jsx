'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function ServerStatusWidget() {
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
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[9999] flex items-center gap-3 glass-pill px-4 md:px-5 py-2.5 rounded-full border border-white/10 shadow-lg shadow-black/50 transition-all duration-300 hover:bg-[#0b101d]/80 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl cursor-default animate-fade-in group">
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
  );
}
