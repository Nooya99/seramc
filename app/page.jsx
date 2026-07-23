'use client';

import { useState, useRef } from 'react';
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
import CartModal from '@/components/modals/CartModal';
import CheckoutModal from '@/components/modals/CheckoutModal';
import PlayerLoginModal from '@/components/modals/PlayerLoginModal';

export default function Home() {
  const [activeModal, setActiveModal] = useState(null);
  const [pendingModal, setPendingModal] = useState(null);
  const [cart, setCart] = useState([]);
  const [playerContext, setPlayerContext] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const loginTimeoutRef = useRef(null);

  const handleOpenModal = (modalName) => {
    if ((modalName === 'shop' || modalName === 'checkout') && !playerContext) {
      if (modalName === 'shop') setActiveModal('shop');
      setPendingModal(modalName);
      
      if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current);
      loginTimeoutRef.current = setTimeout(() => {
        setIsLoginOpen(true);
      }, 1000); // 1 second delay
      
      return;
    }
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current);
    setActiveModal(null);
    setIsLoginOpen(false);
  };

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (cartItem) => cartItem.name === item.name && cartItem.duration === item.duration
      );

      if (existingItemIndex !== -1) {
        // Item already in cart
        if (item.duration && item.duration.includes('Permanen')) {
          alert(`Anda sudah menambahkan ${item.name} (${item.duration}) ke keranjang! Maksimal 1.`);
          return prev;
        }
        
        // Increment quantity
        const newCart = [...prev];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: (newCart[existingItemIndex].quantity || 1) + 1
        };
        return newCart;
      }

      // Add new item with quantity 1
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (indexToUpdate, delta) => {
    setCart((prev) => {
      const newCart = [...prev];
      const item = newCart[indexToUpdate];
      const newQuantity = (item.quantity || 1) + delta;
      
      if (newQuantity < 1) {
        return prev; // Or we could remove the item, but let's keep min 1
      }

      if (item.duration && item.duration.includes('Permanen') && newQuantity > 1) {
        alert(`Maksimal 1 untuk item Permanen.`);
        return prev;
      }

      newCart[indexToUpdate] = { ...item, quantity: newQuantity };
      return newCart;
    });
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
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
        playerContext={playerContext}
        onLoginClick={() => {
          setPendingModal('shop');
          setIsLoginOpen(true);
        }}
        onAddToCart={handleAddToCart}
        onViewCart={() => setActiveModal('cart')}
      />
      <CartModal
        isOpen={activeModal === 'cart'}
        onClose={() => setActiveModal('shop')}
        cart={cart}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={() => handleOpenModal('checkout')}
      />
      <CheckoutModal
        isOpen={activeModal === 'checkout'}
        onClose={() => setActiveModal('cart')}
        cart={cart}
        playerContext={playerContext}
      />
      <PlayerLoginModal
        isOpen={isLoginOpen}
        playerContext={playerContext}
        onClose={() => {
          setIsLoginOpen(false);
          if (pendingModal === 'checkout') {
            setActiveModal('cart');
          }
          setPendingModal(null);
        }}
        onSave={(data) => {
          setPlayerContext(data);
          setIsLoginOpen(false);
          if (pendingModal === 'checkout' && data) {
            setActiveModal('checkout');
          } else if (pendingModal === 'checkout' && !data) {
            setActiveModal('cart');
          }
          setPendingModal(null);
        }}
      />
    </main>
  );
}
