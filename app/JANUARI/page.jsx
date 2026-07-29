'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function JanuariPage() {
  const handleOpenModal = (modalName) => {
    // Fungsi sementara jika ingin pakai modal dari Navbar
    console.log('Open modal:', modalName);
  };

  return (
    <main className="w-full relative z-20 min-h-screen flex flex-col bg-gradient-to-b from-[#0b1121] via-[#0b1121] to-[#070b15]">
      <Navbar onOpenModal={handleOpenModal} />
      
      {/* Konten Utama */}
      <div className="flex-1 w-full relative z-20 pt-32 pb-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-black text-white font-poppins mb-6 drop-shadow-lg text-center">
          Tampilan <span className="text-[#f2e28a]">JANUARI</span>
        </h1>
        <p className="text-gray-400 text-lg text-center max-w-2xl px-6 leading-relaxed font-poppins">
          Halaman ini sekarang sudah berfungsi dan dapat diakses dari domain utama Anda di <span className="text-[#f2e28a]">/JANUARI</span>. Struktur Navbar dan Footer sudah disamakan dengan website utama.
        </p>
      </div>

      <Footer />
    </main>
  );
}
