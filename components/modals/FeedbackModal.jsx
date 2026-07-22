'use client';

import { useState } from 'react';
import { Send, Check, X } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [ign, setIgn] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setTimeout(() => {
        setSubmitted(false);
        setIgn('');
        setMessage('');
      }, 300);
    }, 1500);
  };

  return (
    <div 
      className="modal fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="modal-content bubble-glass w-full max-w-md rounded-3xl p-6 md:p-8 relative text-left"
        style={{ background: 'rgba(11,17,33,0.9)', border: '1px solid rgba(255,255,255,0.3)' }}
      >
        <button 
          onClick={onClose} 
          className="modal-close-btn absolute top-4 md:top-5 right-4 md:right-5 text-gray-400 hover:text-white glass-pill w-12 h-12 flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ease-in-out active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 font-poppins text-center flex items-center justify-center gap-2">
          <Send className="w-5 h-5 text-[#f2e28a]" /> Kritik & Saran
        </h2>
        <p className="text-gray-400 text-xs md:text-sm mb-6 text-center">
          Bantu kami membangun SERA MC menjadi lebih baik!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-20">
          <div>
            <label className="block text-gray-300 text-xs font-bold mb-2 pl-1">In-Game Name (Opsional)</label>
            <input 
              type="text" 
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#f2e28a] transition-colors" 
              placeholder="Masukkan IGN kamu..."
            />
          </div>
          <div>
            <label className="block text-gray-300 text-xs font-bold mb-2 pl-1">Pesan / Masukan <span className="text-red-400">*</span></label>
            <textarea 
              required 
              rows={4} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#f2e28a] transition-colors resize-none" 
              placeholder="Tulis kritik, saran, atau ide kamu di sini..."
            />
          </div>

          <button 
            type="submit" 
            className={`w-full font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-all duration-300 ease-in-out text-[14px] md:text-[15px] shadow-lg mt-2 cursor-pointer active:scale-95 flex items-center justify-center gap-2 ${
              submitted ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-[#f2e28a] hover:bg-[#e6d680] text-gray-900'
            }`}
          >
            {submitted ? (
              <>
                <Check className="w-5 h-5" /> Terkirim!
              </>
            ) : (
              'Kirim Pesan'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
