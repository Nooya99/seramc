'use client';

import { 
  Dna, 
  ArrowRight, 
  Globe, 
  Sword, 
  Coins, 
  Gift, 
  Home, 
  Users,
  Check
} from 'lucide-react';

export default function Features({ onOpenModal }) {
  return (
    <section id="features" className="py-16 md:py-24 px-4 md:px-6 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3 font-poppins drop-shadow-lg">
          Fitur Unggulan Server
        </h2>
        <p className="text-gray-200 font-medium text-[14px] md:text-[15px] max-w-2xl mx-auto">
          Kami menghadirkan ekosistem bermain yang kaya. Temukan berbagai fitur canggih yang dirancang khusus untuk meningkatkan petualanganmu di SERA MC.
        </p>
      </div>

      {/* CARD SISTEM RAS (HOT) */}
      <div 
        onClick={() => onOpenModal('races')}
        className="feature-card-solid p-6 md:p-8 group cursor-pointer mb-8 md:mb-12 flex flex-col md:flex-row items-center text-center md:text-left gap-6 transition-all duration-400 w-full"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-[#f2e28a]/10 text-[#f2e28a] border border-[#f2e28a]/50 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-[inset_0_0_15px_rgba(242,226,138,0.2),0_0_15px_rgba(242,226,138,0.2)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <Dna className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-xl md:text-2xl mb-2 text-white flex items-center justify-center md:justify-start gap-3">
            Sistem Ras Karakter 
            <span className="bg-red-500 text-white text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]">
              Hot
            </span>
          </h3>
          <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed max-w-3xl">
            Pilih jalan hidupmu dari 10 ras berbeda (Vampire, Elf, Dwarf, dll) dengan kemampuan dan kelemahan unik masing-masing. Temukan yang paling cocok dengan gaya bermainmu!
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-[#f2e28a] text-gray-900 font-bold px-6 py-3.5 rounded-xl shadow-lg group-hover:bg-[#e6d680] transition-all duration-300 ease-in-out whitespace-nowrap flex items-center gap-2 group-hover:scale-105 text-[14px] md:text-[15px]">
            Lihat Daftar Ras <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
          </button>
        </div>
      </div>

      {/* 6 FITUR UTAMA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* 1 */}
        <div className="feature-card-solid p-6 md:p-8 group">
          <div className="w-12 h-12 bg-cyan-400/10 text-cyan-400 border border-cyan-400/40 rounded-xl flex items-center justify-center text-xl mb-5 shadow-[inset_0_0_12px_rgba(34,211,238,0.2)] transition-transform duration-300 group-hover:scale-110">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg md:text-xl mb-4 text-white font-poppins">Eksplorasi Tanpa Batas</h3>
          <ul className="text-gray-300 text-[13px] md:text-[14px] space-y-2.5">
            <li className="flex items-start"><Check className="w-4 h-4 text-cyan-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Custom World:</strong> Jelajahi dunia dengan generasi terrain memukau.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-cyan-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>RTP GUI:</strong> Teleportasi ke alam liar secara instan & aman.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-cyan-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Player Warp:</strong> Buat lokasi teleportasi kustom milikmu.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-cyan-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Warp Mine & AFK:</strong> Area khusus mencari resource dan bersantai.</span></li>
          </ul>
        </div>

        {/* 2 */}
        <div className="feature-card-solid p-6 md:p-8 group">
          <div className="w-12 h-12 bg-rose-400/10 text-rose-400 border border-rose-400/40 rounded-xl flex items-center justify-center text-xl mb-5 shadow-[inset_0_0_12px_rgba(251,113,133,0.2)] transition-transform duration-300 group-hover:scale-110">
            <Sword className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg md:text-xl mb-4 text-white font-poppins">Senjata & Equipment</h3>
          <ul className="text-gray-300 text-[13px] md:text-[14px] space-y-2.5">
            <li className="flex items-start"><Check className="w-4 h-4 text-rose-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Legendary Level Up Sword:</strong> Pedang andalan yang kekuatannya bertumbuh.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-rose-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Custom Enchant:</strong> Tingkatkan item melebihi batasan Minecraft Vanilla.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-rose-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Custom Crafting:</strong> Temukan resep rahasia untuk merakit item unik.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-rose-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Backpack:</strong> Ekstra ruang kantong untuk menyimpan hasil jarahan.</span></li>
          </ul>
        </div>

        {/* 3 */}
        <div className="feature-card-solid p-6 md:p-8 group">
          <div className="w-12 h-12 bg-yellow-400/10 text-yellow-400 border border-yellow-400/40 rounded-xl flex items-center justify-center text-xl mb-5 shadow-[inset_0_0_12px_rgba(250,204,21,0.2)] transition-transform duration-300 group-hover:scale-110">
            <Coins className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg md:text-xl mb-4 text-white font-poppins">Ekonomi & Perdagangan</h3>
          <ul className="text-gray-300 text-[13px] md:text-[14px] space-y-2.5">
            <li className="flex items-start"><Check className="w-4 h-4 text-yellow-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Player Shop:</strong> Jual beli barang dengan pemain lain di pasar.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-yellow-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Chest Shop:</strong> Dirikan tokomu sendiri hanya menggunakan sebuah peti.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-yellow-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Trade System:</strong> Fitur barter item antar player dengan aman.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-yellow-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Gacha System:</strong> Uji keberuntunganmu untuk hadiah prestisius.</span></li>
          </ul>
        </div>

        {/* 4 */}
        <div className="feature-card-solid p-6 md:p-8 group">
          <div className="w-12 h-12 bg-purple-400/10 text-purple-400 border border-purple-400/40 rounded-xl flex items-center justify-center text-xl mb-5 shadow-[inset_0_0_12px_rgba(192,132,252,0.2)] transition-transform duration-300 group-hover:scale-110">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg md:text-xl mb-4 text-white font-poppins">Misi & Hadiah Melimpah</h3>
          <ul className="text-gray-300 text-[13px] md:text-[14px] space-y-2.5">
            <li className="flex items-start"><Check className="w-4 h-4 text-purple-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Quest System:</strong> Selesaikan berbagai tantangan seru secara berkala.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-purple-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Battle Pass:</strong> Naikkan tier dan klaim hadiah eksklusif musiman.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-purple-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Daily Reward:</strong> Jangan lupa login setiap hari untuk klaim hadiah gratis!</span></li>
          </ul>
        </div>

        {/* 5 */}
        <div className="feature-card-solid p-6 md:p-8 group">
          <div className="w-12 h-12 bg-green-400/10 text-green-400 border border-green-400/40 rounded-xl flex items-center justify-center text-xl mb-5 shadow-[inset_0_0_12px_rgba(74,222,128,0.2)] transition-transform duration-300 group-hover:scale-110">
            <Home className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg md:text-xl mb-4 text-white font-poppins">Otomatisasi & Basis</h3>
          <ul className="text-gray-300 text-[13px] md:text-[14px] space-y-2.5">
            <li className="flex items-start"><Check className="w-4 h-4 text-green-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Claimland:</strong> Klaim wilayah agar hasil build/harta kamu terbebas dari maling.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-green-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Smart Spawner:</strong> Mob spawner yang lebih cerdas dan menguntungkan.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-green-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Generator:</strong> Bangun mesin untuk memproduksi resource secara otomatis.</span></li>
          </ul>
        </div>

        {/* 6 */}
        <div className="feature-card-solid p-6 md:p-8 group">
          <div className="w-12 h-12 bg-blue-400/10 text-blue-400 border border-blue-400/40 rounded-xl flex items-center justify-center text-xl mb-5 shadow-[inset_0_0_12px_rgba(96,165,250,0.2)] transition-transform duration-300 group-hover:scale-110">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg md:text-xl mb-4 text-white font-poppins">Komunitas Solid</h3>
          <ul className="text-gray-300 text-[13px] md:text-[14px] space-y-2.5">
            <li className="flex items-start"><Check className="w-4 h-4 text-blue-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Team System:</strong> Bentuk aliansi atau party tangguh bersama teman-temanmu.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-blue-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Friendly Environment:</strong> Bermain di lingkungan bebas dari cheater dan aman.</span></li>
            <li className="flex items-start"><Check className="w-4 h-4 text-blue-400 mt-1 mr-2 flex-shrink-0" /> <span><strong>Dan Masih Banyak Lagi:</strong> Kejutan lain menunggu di dalam game!</span></li>
          </ul>
        </div>

      </div>
    </section>
  );
}
