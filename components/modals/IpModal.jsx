'use client';

import { useState } from 'react';
import { Gamepad2, X } from 'lucide-react';

export default function IpModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyText = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="modal fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="modal-content bubble-glass w-full max-w-sm rounded-3xl p-6 md:p-8 relative text-center"
        style={{ background: 'rgba(11,17,33,0.85)', border: '1px solid rgba(255,255,255,0.3)' }}
      >
        <button 
          onClick={onClose} 
          className="modal-close-btn absolute top-4 md:top-5 right-4 md:right-5 text-gray-400 hover:text-white glass-pill w-12 h-12 flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ease-in-out active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 md:w-16 h-14 md:h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xl md:text-2xl mx-auto mb-4 border border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          <Gamepad2 className="w-7 h-7" />
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 font-poppins">Server IP</h2>
        <p className="text-xs md:text-sm text-gray-300 mb-5 md:mb-6">Versi Minecraft: <strong>1.21.11 ---&gt; Latest</strong></p>

        <div className="text-left w-full space-y-4">
          <div>
            <span className="text-gray-400 text-xs uppercase font-bold tracking-widest pl-2">JAVA / POJAV</span>
            <div className="flex items-center glass-pill p-1.5 md:p-2 mt-1 border-white/20 relative overflow-hidden">
              <span className="flex-1 text-center font-mono font-bold text-white text-[13px] md:text-[15px] relative z-20">play.seramc.top</span>
              <button 
                onClick={() => copyText('play.seramc.top')} 
                className="bg-[#f2e28a] hover:bg-[#e6d680] text-gray-900 font-bold px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm transition-all duration-300 ease-in-out hover:scale-[1.05] shadow-md relative z-50 cursor-pointer active:scale-95"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <span className="text-gray-400 text-xs uppercase font-bold tracking-widest pl-2">MCPE / BEDROCK (Port: 19132)</span>
            <div className="flex items-center glass-pill p-1.5 md:p-2 mt-1 border-white/20 relative overflow-hidden">
              <span className="flex-1 text-center font-mono font-bold text-white text-[13px] md:text-[15px] relative z-20">play.seramc.top</span>
              <button 
                onClick={() => copyText('play.seramc.top')} 
                className="bg-[#f2e28a] hover:bg-[#e6d680] text-gray-900 font-bold px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm transition-all duration-300 ease-in-out hover:scale-[1.05] shadow-md relative z-50 cursor-pointer active:scale-95"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <p className={`text-green-400 text-[12px] md:text-[13px] font-bold mt-4 transition-opacity h-4 drop-shadow-md ${copied ? 'opacity-100' : 'opacity-0'}`}>
          IP Copied!
        </p>
      </div>
    </div>
  );
}
