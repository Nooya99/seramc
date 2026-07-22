'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import NoticeToast from '@/components/NoticeToast';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Features from '@/components/Features';
import ShopCoverflow from '@/components/ShopCoverflow';
import ReviewsMarquee from '@/components/ReviewsMarquee';
import FaqAccordion from '@/components/FaqAccordion';
import Footer from '@/components/Footer';

// Modals
import IpModal from '@/components/modals/IpModal';
import RulesModal from '@/components/modals/RulesModal';
import FeedbackModal from '@/components/modals/FeedbackModal';
import ContactModal from '@/components/modals/ContactModal';
import RacesModal from '@/components/modals/RacesModal';
import ShopModal from '@/components/modals/ShopModal';

export default function Home() {
  const [activeModal, setActiveModal] = useState(null);
  const [cart, setCart] = useState([]);

  const handleOpenModal = (modalName) => {
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleAddToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  return (
    <main className="w-full relative z-20 min-h-screen">
      <Navbar onOpenModal={handleOpenModal} />
      <NoticeToast />
      
      <Hero onOpenModal={handleOpenModal} />

      <div className="w-full relative z-20 bg-gradient-to-b from-[#0b1121] via-[#0b1121] to-[#070b15] shadow-[0_-20px_50px_rgba(11,17,33,1)] pb-10 pt-8">
        <About />
        <Features onOpenModal={handleOpenModal} />
        <ShopCoverflow onOpenModal={handleOpenModal} />
        <ReviewsMarquee />
        <FaqAccordion />
        <Footer />
      </div>

      {/* ALL MODALS */}
      <IpModal 
        isOpen={activeModal === 'ip'} 
        onClose={handleCloseModal} 
      />
      <RulesModal 
        isOpen={activeModal === 'rules'} 
        onClose={handleCloseModal} 
      />
      <FeedbackModal 
        isOpen={activeModal === 'feedback'} 
        onClose={handleCloseModal} 
      />
      <ContactModal 
        isOpen={activeModal === 'contact'} 
        onClose={handleCloseModal} 
        cart={cart} 
      />
      <RacesModal 
        isOpen={activeModal === 'races'} 
        onClose={handleCloseModal} 
      />
      <ShopModal
        isOpen={activeModal === 'shop'}
        onClose={handleCloseModal}
        cart={cart}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}
