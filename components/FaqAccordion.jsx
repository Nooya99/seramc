'use client';

import { useState } from 'react';
import PixelIcon from '@/components/PixelIcon';

const faqs = [
  {
    q: 'Bagaimana cara bergabung ke SERA MC?',
    a: 'Buka Minecraft, pilih Multiplayer, klik "Add Server", dan masukkan IP: play.seramc.top. Pastikan versimu adalah 1.21.11 (Latest).'
  },
  {
    q: 'Apakah saya butuh mod untuk bermain?',
    a: 'Tidak perlu! Server kami sepenuhnya vanilla-based dengan tambahan plugin. Kamu bisa langsung bermain menggunakan client Minecraft standar (Bedrock / Java).'
  },
  {
    q: 'Apakah server ini Cracked atau Premium?',
    a: 'Server kami mendukung pemain Cracked (seperti TLauncher, Pojav) maupun Minecraft Premium resmi. Siapa saja bebas bergabung!'
  },
  {
    q: 'Apakah ada rank khusus Streamer?',
    a: 'Ya! Jika kamu adalah Content Creator (YouTube/TikTok/Twitch) yang rutin bermain di server, kamu bisa membuat tiket di Discord untuk mengajukan Streamer Rank.'
  },
  {
    q: 'Apakah ada server Discord resmi?',
    a: 'Tentu! Kami memiliki komunitas Discord yang aktif untuk info update, diskusi, dan laporan. Kamu bisa ketik /discord saat di dalam game untuk mendapatkan linknya.'
  },
  {
    q: 'Game mode apa saja yang tersedia?',
    a: 'Fokus utama kami adalah Survival Multiplayer (SMP) dipadukan dengan ekonomi pasar, sistem clan, fitur custom enchant, dan elemen RPG ringan.'
  },
  {
    q: 'Bagaimana cara daftar menjadi Staff?',
    a: 'Pendaftaran Staff (Helper/Moderator) terkadang kami buka saat server membutuhkan. Info open recruitment selalu diumumkan secara resmi melalui Discord.'
  },
  {
    q: 'Apakah bisa dimainkan di HP (Bedrock)?',
    a: 'Bisa banget! SERA MC mensupport fitur crossplay. Gunakan IP play.seramc.top dan pastikan mengisi kolom Port dengan 19132.'
  }
];

export default function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleFaq = (index) => {
    setOpenIdx(openIdx === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 px-4 md:px-6 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-poppins drop-shadow-lg">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-200 font-medium text-[14px] md:text-[15px]">
          Semua yang perlu kamu ketahui tentang bermain di SERA MC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
        {faqs.map((faq, index) => {
          const isOpen = openIdx === index;
          return (
            <div 
              key={index}
              className={`faq-item bubble-glass overflow-hidden h-fit transition-all duration-300 ${isOpen ? 'active' : ''}`}
            >
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full px-5 md:px-6 py-4 md:py-5 text-left font-bold text-white flex justify-between items-center text-[14px] md:text-[15px] outline-none hover:text-[#f2e28a] transition-colors relative z-50 cursor-pointer active:scale-95"
              >
                {faq.q}
                <PixelIcon name="chevron-down" className={`w-4 h-4 text-gray-400 faq-icon transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#f2e28a]' : ''}`} />
              </button>

              <div 
                className={`faq-answer px-5 md:px-6 text-gray-300 text-[13px] md:text-[14px] transition-all duration-400 ${
                  isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <p>{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
