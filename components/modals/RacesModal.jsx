'use client';

import { useState } from 'react';
import { 
  Dna, 
  ChevronLeft, 
  ChevronRight, 
  Music, 
  Flame, 
  Hammer, 
  Leaf, 
  Mountain, 
  Building, 
  Droplet, 
  Skull, 
  User, 
  Check, 
  X 
} from 'lucide-react';

const races = [
  {
    name: 'Bard (Penyair)',
    icon: Music,
    color: 'text-pink-400 border-pink-400/40 bg-pink-400/10 shadow-[inset_0_0_12px_rgba(244,113,182,0.2)]',
    perks: [
      'Damage makin sakit kalau darah lagi sekarat 💔',
      'Dapat regenerasi darah kalau ada Note Block bunyi di dekatmu 🎵',
      'Bisa duplikat Allay tanpa butuh Jukebox 🧚',
      'Klik kanan pakai Amethyst Shard bakal ngasih regen darah 💎',
      'Bunuh Creeper ada peluang 25% drop Music Disc 💿'
    ]
  },
  {
    name: 'Centaur (Manusia Kuda)',
    icon: Flame,
    color: 'text-orange-400 border-orange-400/40 bg-orange-400/10 shadow-[inset_0_0_12px_rgba(251,146,60,0.2)]',
    perks: [
      'Selamanya berwujud menunggang kuda 🐎',
      'Lompat lebih tinggi & lari lebih kencang dari kuda biasa 💨',
      'Makin kuat pas malam bulan purnama 🌕',
      'Akurasi tembakan panah 100% sempurna 🏹'
    ]
  },
  {
    name: 'Dragonborn',
    icon: Flame,
    color: 'text-purple-400 border-purple-400/40 bg-purple-400/10 shadow-[inset_0_0_12px_rgba(192,132,252,0.2)]',
    perks: [
      'Klik kanan pakai botol kosong buat nyimpen Dragon\'s Breath 🧪',
      'Darah lebih tebal & makin kuat di dimensi The End 🌌',
      'Bisa nge-heal pakai End Crystal 🔮',
      'Klik kanan pakai pedang buat nembak Dragon Fireball 🔥',
      'Damage dari panah musuh berkurang 🛡️'
    ]
  },
  {
    name: 'Dwarf (Kurcaci)',
    icon: Hammer,
    color: 'text-yellow-500 border-yellow-500/40 bg-yellow-500/10 shadow-[inset_0_0_12px_rgba(234,179,8,0.2)]',
    perks: [
      'Efek Haste & Night Vision permanen! ⛏️👁️',
      'Nambang ore dapet hasil mineral lebih banyak 💎',
      'Kebal dari racun (Poison) & potion pelemah (Harming) ☠️🚫',
      'Tinggi badan cuma 1 blok 📏'
    ]
  },
  {
    name: 'Elf (Peri)',
    icon: Leaf,
    color: 'text-green-400 border-green-400/40 bg-green-400/10 shadow-[inset_0_0_12px_rgba(74,222,128,0.2)]',
    perks: [
      'Akurasi panah 100% sempurna 🏹',
      'Panah lebih sakit & melesat lebih cepat ⚡',
      'Efek Potion di panah jadi jauh lebih kuat 🧪',
      'Klik kiri pakai bow buat nembak 3 panah sekaligus (CD 7 detik) 🎯'
    ]
  },
  {
    name: 'Giant (Raksasa)',
    icon: Mountain,
    color: 'text-red-500 border-red-500/40 bg-red-500/10 shadow-[inset_0_0_12px_rgba(239,68,68,0.2)]',
    perks: [
      'Darah 2x lipat lebih tebal dari manusia ❤️',
      'Damage pukulan lebih sakit, tapi cooldown mukul lebih lama 👊⏳',
      'Buruk banget dalam urusan memanah 🏹❌',
      'Punya Armor bawaan & tinggi badan 3 blok 🧱'
    ]
  },
  {
    name: 'Gargoyle',
    icon: Building,
    color: 'text-gray-400 border-gray-400/40 bg-gray-400/10 shadow-[inset_0_0_12px_rgba(156,163,175,0.2)]',
    perks: [
      'Kebal Knockback, Api, dan semua efek status/potion! 🔥🛡️',
      'Kulit dari batu (butuh SkinsRestorer untuk visual) 🪨',
      'Jalan lebih lambat 🐢',
      'Pukulan sakit tapi cooldown lama 👊',
      'Punya poin Armor alami 🛡️'
    ]
  },
  {
    name: 'Naiad (Peri Air)',
    icon: Droplet,
    color: 'text-blue-400 border-blue-400/40 bg-blue-400/10 shadow-[inset_0_0_12px_rgba(96,165,250,0.2)]',
    perks: [
      'Bonus darah & damage pas di air atau hujan 🌧️💧',
      'Di darat jadi lemah & jalan lambat 🏜️',
      'Bisa napas, lihat jelas, & nambang cepat di dalam air 🌊',
      'Nggak bisa napas di darat ❌',
      'Cuma tenggelam kalau kamu mau ⚓'
    ]
  },
  {
    name: 'Vampire',
    icon: Skull,
    color: 'text-rose-500 border-rose-500/40 bg-rose-500/10 shadow-[inset_0_0_12px_rgba(244,63,94,0.2)]',
    perks: [
      'Ubah player lain jadi Vampir dengan cara ngebunuh mereka 🩸',
      'Terbakar matahari ☀️ Pas di air kena damage 💧',
      'Dapet heal dikit tiap berhasil nge-kill 🦇',
      'Damage pukulan lebih sakit ⚔️',
      'Mob Undead gak bakal nyerang duluan 🧟‍♂️'
    ]
  },
  {
    name: 'Human (Manusia)',
    icon: User,
    color: 'text-slate-300 border-slate-300/40 bg-slate-300/10 shadow-[inset_0_0_12px_rgba(203,213,225,0.2)]',
    perks: [
      'Cuma ras manusia biasa dengan deskripsi kustom. Tidak ada kelemahan khusus maupun kekuatan spesial, cocok untuk pengalaman bermain murni Vanilla! 📝'
    ]
  }
];

export default function RacesModal({ isOpen, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!isOpen) return null;

  const moveRace = (step) => {
    setCurrentIdx((prev) => (prev + step + races.length) % races.length);
  };

  const getCardClass = (index) => {
    if (index === currentIdx) return 'center';
    if (index === (currentIdx - 1 + races.length) % races.length) return 'left';
    if (index === (currentIdx + 1) % races.length) return 'right';
    return 'hidden-card';
  };

  return (
    <div 
      className="modal fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex justify-center items-center px-4 active"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="modal-content bubble-glass w-full max-w-6xl rounded-3xl p-4 md:p-8 relative text-center h-[85vh] md:h-[75vh] flex flex-col"
        style={{ background: 'rgba(11,17,33,0.9)', border: '1px solid rgba(255,255,255,0.3)' }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 md:top-5 right-4 md:right-5 text-gray-400 hover:text-white glass-pill w-12 h-12 flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ease-in-out active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 mt-4 font-poppins flex items-center justify-center gap-2">
          <Dna className="w-7 h-7 text-[#f2e28a]" /> Sistem Ras SERA MC
        </h2>
        <p className="text-gray-400 text-xs md:text-sm mb-6">Pilih ras yang paling cocok dengan gaya bermainmu!</p>

        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
          <button 
            onClick={() => moveRace(-1)} 
            className="absolute left-0 md:left-6 z-[60] p-4 text-gray-400 hover:text-[#f2e28a] transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-12 h-12 md:w-16 md:h-16" />
          </button>

          <div id="race-track" className="relative w-full max-w-4xl h-full flex justify-center items-center">
            {races.map((race, index) => {
              const Icon = race.icon;
              const cardState = getCardClass(index);

              return (
                <div 
                  key={index} 
                  className={`race-card p-6 md:p-8 flex flex-col ${cardState}`}
                  onClick={() => {
                    if (cardState === 'left') moveRace(-1);
                    if (cardState === 'right') moveRace(1);
                  }}
                >
                  <div className={`mx-auto w-16 h-16 md:w-20 md:h-20 border rounded-2xl flex items-center justify-center text-3xl md:text-4xl mb-5 ${race.color}`}>
                    <Icon className="w-8 h-8 md:w-10 md:h-10" />
                  </div>

                  <h3 className="text-center font-bold text-xl md:text-2xl mb-4 text-white font-poppins border-b border-white/10 pb-4">
                    {race.name}
                  </h3>

                  <ul className="text-gray-300 text-[13px] md:text-[14px] space-y-2.5 overflow-y-auto pr-2 custom-scrollbar text-left max-h-[35vh]">
                    {race.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-4 h-4 text-[#f2e28a] mt-1 mr-2.5 flex-shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => moveRace(1)} 
            className="absolute right-0 md:right-6 z-[60] p-4 text-gray-400 hover:text-[#f2e28a] transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-12 h-12 md:w-16 md:h-16" />
          </button>
        </div>
      </div>
    </div>
  );
}
