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

export default function Home() {
  const [activeModal, setActiveModal] = useState(null);
  const [pendingPurchase, setPendingPurchase] = useState(null);

  const handleOpenModal = (modalName) => {
    if (modalName !== 'contact') {
      setPendingPurchase(null);
    }
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleBuyRank = (rankName, duration, price) => {
    setPendingPurchase({ rank: rankName, duration, price });
    setActiveModal('contact');
  };

  return (
    <main className="w-full relative z-20 min-h-screen">
      <Navbar onOpenModal={handleOpenModal} />
      <NoticeToast />
      
      <Hero onOpenModal={handleOpenModal} />

      <div className="w-full relative z-20 bg-gradient-to-b from-[#0b1121] via-[#0b1121] to-[#070b15] shadow-[0_-20px_50px_rgba(11,17,33,1)] pb-10 pt-8">
        <About />
        <Features onOpenModal={handleOpenModal} />
        <ShopCoverflow onBuyRank={handleBuyRank} />
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
        pendingPurchase={pendingPurchase} 
      />
      <RacesModal 
        isOpen={activeModal === 'races'} 
        onClose={handleCloseModal} 
      />
    </main>
  );
}
