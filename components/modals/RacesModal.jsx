'use client';

import { useState } from 'react';
import PixelIcon from '@/components/PixelIcon';

const races = [
  {
    name: 'Bard (Penyair)',
    icon: 'music',
    color: 'text-pink-400 border-pink-400/40 bg-pink-400/10 shadow-[inset_0_0_12px_rgba(244,113,182,0.2)]',
    perks: [
      'Damage makin sakit jika darah sedang sekarat',
      'Dapat regenerasi darah jika ada Note Block berbunyi di dekatmu',
      'Bisa duplikat Allay tanpa membutuhkan Jukebox',
      'Klik kanan menggunakan Amethyst Shard memberikan regenerasi darah',
      'Membunuh Creeper memiliki peluang 25% menjatuhkan Music Disc'
    ]
  },
  {
    name: 'Centaur (Manusia Kuda)',
    icon: 'fire',
    color: 'text-orange-400 border-orange-400/40 bg-orange-400/10 shadow-[inset_0_0_12px_rgba(251,146,60,0.2)]',
    perks: [
      'Selamanya berwujud menunggang kuda',
      'Lompat lebih tinggi dan lari lebih kencang dari kuda biasa',
      'Kekuatan meningkat saat malam bulan purnama',
      'Akurasi tembakan panah 100% sempurna'
    ]
  },
  {
    name: 'Dragonborn',
    icon: 'fire',
    color: 'text-purple-400 border-purple-400/40 bg-purple-400/10 shadow-[inset_0_0_12px_rgba(192,132,252,0.2)]',
    perks: [
      'Klik kanan menggunakan botol kosong untuk menyimpan Dragon\'s Breath',
      'Darah lebih tebal dan kekuatan meningkat di dimensi The End',
      'Dapat memulihkan darah menggunakan End Crystal',
      'Klik kanan menggunakan pedang untuk menembakkan Dragon Fireball',
      'Damage dari panah musuh berkurang'
    ]
  },
  {
    name: 'Dwarf (Kurcaci)',
    icon: 'script',
    color: 'text-yellow-500 border-yellow-500/40 bg-yellow-500/10 shadow-[inset_0_0_12px_rgba(234,179,8,0.2)]',
    perks: [
      'Efek Haste dan Night Vision permanen',
      'Menambang ore mendapatkan hasil mineral lebih banyak',
      'Kebal dari racun dan ramuan pelemah',
      'Tinggi badan hanya setinggi 1 blok'
    ]
  },
  {
    name: 'Elf (Peri)',
    icon: 'leaf',
    color: 'text-green-400 border-green-400/40 bg-green-400/10 shadow-[inset_0_0_12px_rgba(74,222,128,0.2)]',
    perks: [
      'Akurasi panah 100% sempurna',
      'Panah memberikan kerusakan lebih tinggi dan melesat lebih cepat',
      'Efek ramuan pada panah menjadi jauh lebih kuat',
      'Klik kiri menggunakan bow untuk menembakkan 3 panah sekaligus (Cooldown 7 detik)'
    ]
  },
  {
    name: 'Giant (Raksasa)',
    icon: 'image',
    color: 'text-red-500 border-red-500/40 bg-red-500/10 shadow-[inset_0_0_12px_rgba(239,68,68,0.2)]',
    perks: [
      'Darah dua kali lipat lebih tebal dari manusia',
      'Kerusakan pukulan lebih besar, tetapi jeda pukulan lebih lama',
      'Kurang efektif dalam memanah',
      'Memiliki pelindung bawaan dan tinggi badan setinggi 3 blok'
    ]
  },
  {
    name: 'Gargoyle',
    icon: 'building',
    color: 'text-gray-400 border-gray-400/40 bg-gray-400/10 shadow-[inset_0_0_12px_rgba(156,163,175,0.2)]',
    perks: [
      'Kebal Knockback, Api, dan semua efek status atau ramuan',
      'Kulit terbuat dari batu (membutuhkan SkinsRestorer untuk visual)',
      'Kecepatan berjalan lebih lambat',
      'Pukulan memberikan kerusakan besar tetapi jeda pukulan lama',
      'Memiliki poin pelindung alami'
    ]
  },
  {
    name: 'Naiad (Peri Air)',
    icon: 'drop',
    color: 'text-blue-400 border-blue-400/40 bg-blue-400/10 shadow-[inset_0_0_12px_rgba(96,165,250,0.2)]',
    perks: [
      'Mendapatkan bonus darah dan kerusakan saat berada di air atau hujan',
      'Menjadi lebih lemah dan berjalan lambat saat berada di darat',
      'Dapat bernapas, melihat dengan jelas, dan menambang cepat di dalam air',
      'Tidak dapat bernapas di darat',
      'Hanya tenggelam jika Anda menginginkannya'
    ]
  },
  {
    name: 'Vampire',
    icon: 'user-x',
    color: 'text-rose-500 border-rose-500/40 bg-rose-500/10 shadow-[inset_0_0_12px_rgba(244,63,94,0.2)]',
    perks: [
      'Mengubah pemain lain menjadi Vampir dengan cara mengalahkan mereka',
      'Terbakar sinar matahari dan menerima kerusakan saat di air',
      'Mendapatkan sedikit pemulihan darah setiap berhasil mengalahkan musuh',
      'Kerusakan pukulan lebih besar',
      'Monster Undead tidak akan menyerang terlebih dahulu'
    ]
  },
  {
    name: 'Human (Manusia)',
    icon: 'human',
    color: 'text-slate-300 border-slate-300/40 bg-slate-300/10 shadow-[inset_0_0_12px_rgba(203,213,225,0.2)]',
    perks: [
      'Ras manusia biasa. Tidak memiliki kelemahan khusus maupun kekuatan spesial, cocok untuk pengalaman bermain murni Vanilla.'
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
          <PixelIcon name="close" className="w-5 h-5" />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 mt-4 font-poppins flex items-center justify-center gap-2">
          <PixelIcon name="human" className="w-7 h-7 text-[#f2e28a]" /> Sistem Ras SERA MC
        </h2>
        <p className="text-gray-400 text-xs md:text-sm mb-6">Pilih ras yang paling cocok dengan gaya bermainmu!</p>

        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
          <button 
            onClick={() => moveRace(-1)} 
            className="absolute left-0 md:left-6 z-[60] p-4 text-gray-400 hover:text-[#f2e28a] transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
          >
            <PixelIcon name="chevron-left" className="w-12 h-12 md:w-16 md:h-16" />
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
                    <PixelIcon name={race.icon} className="w-8 h-8 md:w-10 md:h-10" />
                  </div>

                  <h3 className="text-center font-bold text-xl md:text-2xl mb-4 text-white font-poppins border-b border-white/10 pb-4">
                    {race.name}
                  </h3>

                  <ul className="text-gray-300 text-[13px] md:text-[14px] space-y-2.5 overflow-y-auto pr-2 custom-scrollbar text-left max-h-[35vh]">
                    {race.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-start">
                        <PixelIcon name="check" className="w-4 h-4 text-[#f2e28a] mt-1 mr-2.5 flex-shrink-0" />
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
            <PixelIcon name="chevron-right" className="w-12 h-12 md:w-16 md:h-16" />
          </button>
        </div>
      </div>
    </div>
  );
}
