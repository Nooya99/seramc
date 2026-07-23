'use client';

import Image from 'next/image';
import PixelIcon from '@/components/PixelIcon';

const reviewsRow1 = [
  { name: 'CraftySteve', skin: 'Steve', text: '"Gokil sih custom enchant-nya banyak pilihan! Capek-capek nyari resource berharga jadi makin worth it gara-gara efek pedangnya."', rating: 5 },
  { name: 'MinerGirl99', skin: 'Alex', text: '"Komunitasnya ramah banget, gak ada yang toxic. Fitur Chest Shop-nya ngebantu banget buat bikin minimarket sendiri deket base."', rating: 5 },
  { name: 'Zeld_Ono', skin: 'Herobrine', text: '"Sistem ekonominya stabil banget, perdagangan antar player hidup. Battle pass-nya juga ngasih hadiah banyak meskipun gratisan."', rating: 4.5 },
  { name: 'KingCrown', skin: 'Notch', text: '"Dunia custom terrain-nya beneran estetik dan manjain mata. Enak buat dieksplor sekaligus nyari spot foto-foto aesthetic."', rating: 5 },
];

const reviewsRow2 = [
  { name: 'VortexBuilder', skin: 'Dream', text: '"Sistem claim wilayah aman abis, gak perlu takut dimaling pas lagi offline. Server andalan buat mabar bareng temen tongkrongan."', rating: 5 },
  { name: 'RizkyGamerz', skin: 'Technoblade', text: '"Main dari Pojav/HP lancar jaya, ping-nya stabil banget gak delay. Misi hariannya juga bikin nagih buat dapet kunci gacha."', rating: 5 },
  { name: 'ProSlayer', skin: 'Pigman', text: '"Sistem PvP dan mob kustom-nya ngasih tantangan beda. Level up pedang bener-bener butuh dedikasi, rasanya bangga kalau udah max level!"', rating: 4.5 },
  { name: 'IndoMine', skin: 'Enderman', text: '"Staff aktif dan fast respon kalau ada masalah atau bug di server. Sangat peduli sama saran dari player. Sukses terus SERA MC!"', rating: 5 },
];

export default function ReviewsMarquee() {
  const renderStars = (rating) => {
    return (
      <div className="flex text-[#f2e28a] text-[10px] md:text-xs gap-0.5">
        {[...Array(Math.floor(rating))].map((_, i) => (
          <PixelIcon key={i} name="star" className="w-3 h-3" />
        ))}
        {rating % 1 !== 0 && <PixelIcon name="star" className="w-3 h-3 opacity-50" />}
      </div>
    );
  };

  return (
    <section id="reviews" className="py-16 md:py-24 px-4 md:px-6 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-10 md:mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3 font-poppins drop-shadow-lg">
          What Players Say
        </h2>
        <p className="text-gray-200 font-medium text-[14px] md:text-[15px]">
          Ulasan jujur dari komunitas setia petualang SERA MC.
        </p>
      </div>

      <div 
        className="w-full bubble-glass rounded-[2rem] md:rounded-[3rem] py-8 md:py-12 relative overflow-hidden flex flex-col gap-6 backdrop-blur-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
          boxShadow: 'inset 0 20px 50px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.2)'
        }}
      >
        <div className="fade-edges w-full flex flex-col gap-6 md:gap-8 px-2">
          
          {/* ROW 1 */}
          <div className="w-full relative">
            <div className="flex gap-5 md:gap-6 w-max animate-marquee">
              {[...reviewsRow1, ...reviewsRow1].map((rev, idx) => (
                <div key={idx} className="bubble-glass p-5 md:p-6 w-[280px] md:w-[340px] flex-shrink-0 bg-black/10 hover:bg-black/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Image 
                      src={`https://minotar.net/helm/${rev.skin}/100.png`} 
                      alt={rev.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border border-white/30"
                    />
                    <div>
                      <h4 className="font-bold text-white text-[13px] md:text-sm">{rev.name}</h4>
                      {renderStars(rev.rating)}
                    </div>
                  </div>
                  <p className="text-gray-200 text-[12px] md:text-[13px] italic leading-relaxed">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ROW 2 */}
          <div className="w-full relative">
            <div className="flex gap-5 md:gap-6 w-max animate-marquee-reverse">
              {[...reviewsRow2, ...reviewsRow2].map((rev, idx) => (
                <div key={idx} className="bubble-glass p-5 md:p-6 w-[280px] md:w-[340px] flex-shrink-0 bg-black/10 hover:bg-black/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Image 
                      src={`https://minotar.net/helm/${rev.skin}/100.png`} 
                      alt={rev.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border border-white/30"
                    />
                    <div>
                      <h4 className="font-bold text-white text-[13px] md:text-sm">{rev.name}</h4>
                      {renderStars(rev.rating)}
                    </div>
                  </div>
                  <p className="text-gray-200 text-[12px] md:text-[13px] italic leading-relaxed">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
