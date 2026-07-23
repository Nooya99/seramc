'use client';

import { useState } from 'react';
import PixelIcon from '@/components/PixelIcon';

export default function PlayerLoginModal({ isOpen, onClose, onSave }) {
  const [nickname, setNickname] = useState('');
  const [edition, setEdition] = useState('java'); // 'java' or 'bedrock'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    let finalNickname = nickname.trim();
    if (edition === 'bedrock' && !finalNickname.startsWith('_')) {
      finalNickname = '_' + finalNickname;
    }

    const avatarUrl = `https://minotar.net/helm/${finalNickname}/100.png`;

    onSave({
      nickname: finalNickname,
      edition,
      avatarUrl
    });
    
    onClose();
  };

  return (
    <div 
      className="modal fixed inset-0 bg-black/70 backdrop-blur-md z-[110] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="modal-content bubble-glass w-full max-w-md rounded-[2rem] p-6 md:p-8 relative"
        style={{ background: 'rgba(11,17,33,0.95)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 md:top-5 left-4 md:left-5 text-gray-400 hover:text-white glass-pill px-3 h-10 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ease-in-out active:scale-95"
        >
          <PixelIcon name="arrow-left" className="w-5 h-5" />
          <span className="font-bold text-sm hidden sm:block">Back</span>
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 mt-12 sm:mt-8 font-poppins text-center">Data Pemain</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">Nickname Minecraft</label>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Masukkan Nickname Anda"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f2e28a] focus:ring-1 focus:ring-[#f2e28a] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-3">Pilih Platform</label>
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setEdition('java')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-300 ${edition === 'java' ? 'bg-[#f2e28a]/20 border-[#f2e28a] text-[#f2e28a]' : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30'}`}
              >
                <PixelIcon name="monitor" className="w-5 h-5" />
                <span className="font-bold text-sm">Java Edition</span>
              </div>
              <div 
                onClick={() => setEdition('bedrock')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-300 ${edition === 'bedrock' ? 'bg-[#f2e28a]/20 border-[#f2e28a] text-[#f2e28a]' : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30'}`}
              >
                <PixelIcon name="device-phone" className="w-5 h-5" />
                <span className="font-bold text-sm">Bedrock Edition</span>
              </div>
            </div>
            {edition === 'bedrock' && (
              <p className="text-xs text-yellow-400/80 mt-2 text-center">
                *Simbol _ (underscore) akan otomatis ditambahkan di awal nama.
              </p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-[#f2e28a] hover:bg-[#e6d680] text-gray-900 font-bold py-3.5 rounded-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg mt-2"
          >
            Simpan Nickname
          </button>
        </form>
      </div>
    </div>
  );
}
