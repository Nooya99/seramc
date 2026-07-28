'use client';

import { useState } from 'react';
import PixelIcon from '@/components/PixelIcon';

export default function FeedbackModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [identityMode, setIdentityMode] = useState('nickname');
  const [nickname, setNickname] = useState('');
  const [edition, setEdition] = useState('java');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    let finalIgn = '';
    if (identityMode === 'nickname') {
      if (!nickname.trim()) {
        alert('Harap masukkan Nickname kamu!');
        return;
      }
      let rawIgn = nickname.trim();
      if (edition === 'bedrock' && !rawIgn.startsWith('_')) {
        rawIgn = '_' + rawIgn;
      }
      finalIgn = rawIgn;
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ign: finalIgn, message }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setTimeout(() => {
            setSubmitted(false);
            setNickname('');
            setMessage('');
          }, 300);
        }, 1500);
      } else {
        alert('Gagal mengirim pesan, silakan coba lagi.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Terjadi kesalahan koneksi.');
    }
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
          <PixelIcon name="close" className="w-5 h-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 font-poppins text-center flex items-center justify-center gap-2">
          <PixelIcon name="mail" className="w-5 h-5 text-[#f2e28a]" /> Kritik & Saran
        </h2>
        <p className="text-gray-400 text-xs md:text-sm mb-6 text-center">
          Bantu kami membangun SERA MC menjadi lebih baik!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-20">
          <div className="mb-2">
            <label className="block text-gray-300 text-xs font-bold mb-3 pl-1">Identitas Pengirim</label>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 mb-4">
              <button 
                type="button"
                onClick={() => setIdentityMode('nickname')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${identityMode === 'nickname' ? 'bg-[#f2e28a] text-gray-900 shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                Set Nickname
              </button>
              <button 
                type="button"
                onClick={() => setIdentityMode('anonymous')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${identityMode === 'anonymous' ? 'bg-white/20 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                Anonymous
              </button>
            </div>

            {identityMode === 'nickname' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 mb-4">
                <div>
                  <input 
                    type="text" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#f2e28a] transition-colors" 
                    placeholder="Masukkan IGN kamu..."
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-[11px] font-semibold mb-2 pl-1 uppercase tracking-wider">Edisi Minecraft</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setEdition('java')}
                      className={`py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all duration-300 ${
                        edition === 'java' 
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                          : 'bg-black/30 border-white/10 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      Java
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEdition('bedrock')}
                      className={`py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all duration-300 ${
                        edition === 'bedrock' 
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                          : 'bg-black/30 border-white/10 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      Bedrock
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                <PixelIcon name="check" className="w-5 h-5" /> Terkirim!
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
