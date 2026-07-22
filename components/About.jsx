'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  '/slide 1.png',
  '/slide 2.png',
  '/slide 3.png',
  '/slide 4.png',
];

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const moveSlide = (direction) => {
    setCurrentSlide((prev) => (prev + direction + slides.length) % slides.length);
  };

  return (
    <section id="about" className="py-16 md:py-24 px-4 md:px-6 max-w-6xl mx-auto relative z-10">
      <div className="bubble-glass p-6 md:p-10 backdrop-blur-xl">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* SLIDER CONTAINER */}
          <div className="w-full h-[250px] md:h-[350px] rounded-2xl overflow-hidden shadow-2xl relative border border-white/20 group">
            <div 
              className="flex w-full h-full transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((img, idx) => (
                <div key={idx} className="w-full h-full flex-shrink-0 relative">
                  <Image 
                    src={img} 
                    alt={`Slide ${idx + 1}`} 
                    fill 
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={() => moveSlide(-1)} 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-20 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => moveSlide(1)} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-20 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-3 z-20 p-2">
              {slides.map((_, idx) => (
                <div 
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                    idx === currentSlide ? 'bg-white/80 scale-125' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-xs md:text-sm font-bold text-[#f2e28a] tracking-widest uppercase mb-2">About Our Server</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 font-poppins">A New Journey Begins</h2>
            <div className="space-y-3 md:space-y-4 text-gray-200 leading-relaxed text-[14px] md:text-[15px]">
              <p>SERA MC adalah server Minecraft Survival Multiplayer (SMP) modern yang dirancang bagi para pemain yang mencari kreativitas, tantangan, dan komunitas solid.</p>
              <p>Server kami dilengkapi dengan beragam fitur luar biasa, ekonomi pasar yang aktif, hingga misi dan pertarungan seru. Bersiaplah untuk membangun peradaban dan reputasimu di sini!</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
