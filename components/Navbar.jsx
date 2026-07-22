'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function Navbar({ onOpenModal }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-4 md:top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-[1000px] z-50 transition-all duration-500">
      <nav 
        className="glass-pill px-4 md:px-6 py-2 md:py-2.5 flex justify-between items-center shadow-2xl transition-all duration-300"
        style={{
          background: isScrolled ? 'rgba(11,17,33,0.85)' : 'rgba(11,17,33,0.5)',
          border: isScrolled ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.15)'
        }}
      >
        <a href="#" className="relative flex items-center hover:opacity-80 transition-opacity active:scale-95">
          <Image 
            src="/2.png" 
            alt="SERA MC" 
            width={160} 
            height={50} 
            className="h-10 md:h-12 w-auto object-contain mix-blend-screen transform scale-[1.5] md:scale-[1.7] origin-left -translate-y-1 md:-translate-y-1.5"
            priority
          />
        </a>

        <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-[12px] xl:text-[13px] font-semibold tracking-wide">
          <a href="#about" className="nav-link text-gray-300 hover:text-white transition-colors px-2 py-1">About</a>
          <a href="#features" className="nav-link text-gray-300 hover:text-white transition-colors px-2 py-1">Features</a>
          <Link href="/shop" className="nav-link text-gray-300 hover:text-white transition-colors px-2 py-1 flex items-center gap-1">
            <ShoppingCart className="w-3.5 h-3.5" /> Shop
          </Link>
          <a href="#reviews" className="nav-link text-gray-300 hover:text-white transition-colors px-2 py-1">Reviews</a>
          <a href="#faq" className="nav-link text-gray-300 hover:text-white transition-colors px-2 py-1">FAQ</a>
          <button 
            onClick={() => onOpenModal('contact')} 
            className="nav-link text-gray-300 hover:text-white transition-colors focus:outline-none cursor-pointer px-2 py-1"
          >
            Contact
          </button>
        </div>

        <button 
          onClick={() => onOpenModal('ip')} 
          className="bg-[#f2e28a] hover:bg-[#e6d680] text-gray-900 font-bold px-5 py-2 md:px-6 md:py-2.5 rounded-full text-[12px] md:text-[13px] shadow-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          Play with us
        </button>
      </nav>
    </div>
  );
}
