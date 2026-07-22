'use client';

import { Megaphone, MessageSquare, Swords, ShieldAlert, Gavel, Info, X } from 'lucide-react';

export default function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="modal fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="modal-content bubble-glass w-full max-w-2xl rounded-3xl p-6 md:p-8 relative text-center"
        style={{ background: 'rgba(11,17,33,0.9)', border: '1px solid rgba(255,255,255,0.3)' }}
      >
        <button 
          onClick={onClose} 
          className="modal-close-btn absolute top-4 md:top-5 right-4 md:right-5 text-gray-400 hover:text-white glass-pill w-12 h-12 flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ease-in-out active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 font-poppins flex items-center justify-center gap-2">
          <Megaphone className="w-6 h-6 text-[#f2e28a]" /> Peraturan Server
        </h2>
        <p className="text-gray-400 text-xs md:text-sm mb-5">Mohon dibaca, dipahami, dan dipatuhi demi kenyamanan bersama!</p>

        <div className="text-left space-y-5 mb-6 text-[12px] md:text-[13px] text-gray-200 glass-pill p-5 md:p-6 rounded-2xl max-h-[60vh] overflow-y-auto border-white/10 relative z-20">
          <div>
            <h4 className="font-bold text-[#f2e28a] mb-2 pb-1 border-b border-white/10 text-[13px] md:text-[14px] flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Komunikasi & Sikap
            </h4>
            <ul className="text-gray-400 space-y-1.5 pl-1">
              <li><span className="text-white font-semibold">• Hormati Sesama:</span> Dilarang melakukan perundungan (bullying), pelecehan, rasisme, atau ujaran kebencian.</li>
              <li><span class="text-white font-semibold">• Bahasa Sopan:</span> Dilarang spamming, menggunakan CAPS LOCK berlebihan, atau promosi server lain.</li>
              <li><span className="text-white font-semibold">• Patuhi Staff:</span> Keputusan Admin/Moderator mutlak. Laporkan masalah via Discord.</li>
              <li><span className="text-white font-semibold">• Nickname & Skin:</span> Dilarang mengandung unsur SARA atau pornografi.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#f2e28a] mb-2 pb-1 border-b border-white/10 text-[13px] md:text-[14px] flex items-center gap-2">
              <Swords className="w-4 h-4" /> Gameplay (In-Game)
            </h4>
            <ul className="text-gray-400 space-y-1.5 pl-1">
              <li><span className="text-white font-semibold">• No Griefing:</span> Dilarang merusak, mengubah, atau mengambil block milik pemain lain.</li>
              <li><span className="text-white font-semibold">• No Stealing:</span> Dilarang mengambil barang dari peti atau item drop milik pemain lain.</li>
              <li><span className="text-white font-semibold">• Aturan PvP:</span> Hanya di area khusus atau kesepakatan bersama. Spawn killing sangat dilarang!</li>
              <li><span className="text-white font-semibold">• Hargai Wilayah:</span> Jangan membangun base terlalu dekat dengan base pemain lain tanpa izin.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#f2e28a] mb-2 pb-1 border-b border-white/10 text-[13px] md:text-[14px] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Teknis & Fair Play
            </h4>
            <ul className="text-gray-400 space-y-1.5 pl-1">
              <li><span className="text-white font-semibold">• No Mod Ilegal:</span> Penggunaan X-ray, Fly, KillAura, dll = BAN PERMANEN.</li>
              <li><span className="text-white font-semibold">• No Bug Abuse:</span> Segera lapor staff jika menemukan bug. Memanfaatkannya akan disanksi tegas.</li>
              <li><span className="text-white font-semibold">• Lag-Free Farm:</span> Dilarang membuat mesin redstone/mob farm berlebihan.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-red-400 mb-2 pb-1 border-b border-white/10 text-[13px] md:text-[14px] flex items-center gap-2">
              <Gavel className="w-4 h-4" /> Tingkatan Sanksi
            </h4>
            <ul className="text-gray-400 space-y-2 pl-1">
              <li><strong className="text-yellow-400">1. Ringan:</strong> Peringatan (Warn) 1-3 ➜ Mute beberapa jam/hari.</li>
              <li><strong className="text-orange-400">2. Sedang:</strong> Penjara (Jail) / Temp-ban 3-7 hari + Rollback bangunan.</li>
              <li><strong className="text-red-500">3. Berat:</strong> BANNED PERMANEN (IP Ban jika diperlukan).</li>
            </ul>
          </div>

          <div className="bg-black/30 p-3 rounded-xl border border-white/5 mt-4">
            <p className="text-gray-300 text-xs text-center italic flex items-center justify-center gap-1">
              <Info className="w-4 h-4 text-[#f2e28a]" /> Dengan bermain di server ini, kamu dianggap telah membaca dan menyetujui seluruh peraturan di atas.
            </p>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="w-full bg-[#f2e28a] hover:bg-[#e6d680] text-gray-900 font-bold py-3 md:py-3.5 rounded-xl hover:scale-[1.02] transition-all duration-300 ease-in-out text-[14px] md:text-[15px] shadow-lg relative z-50 cursor-pointer active:scale-95"
        >
          Saya Mengerti & Setuju
        </button>
      </div>
    </div>
  );
}
