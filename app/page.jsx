'use client';

import { useState, useRef } from 'react';
import PixelIcon from '@/components/PixelIcon';
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
  const [toasts, setToasts] = useState([]);
  const loginTimeoutRef = useRef(null);

  const addToast = (title, description, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

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
          addToast('Gagal Menambahkan', `Item ${item.name} (${item.duration}) maksimal 1 per akun.`, 'error');
          return prev;
        }
        
        addToast('Berhasil Ditambahkan', `${item.name} x${(prev[existingItemIndex].quantity || 1) + 1} masuk ke keranjang!`, 'success');
        // Increment quantity
        const newCart = [...prev];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: (newCart[existingItemIndex].quantity || 1) + 1
        };
        return newCart;
      }

      addToast('Berhasil Ditambahkan', `${item.name} masuk ke keranjang!`, 'success');
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
        addToast('Batas Maksimal', `Item ${item.name} (${item.duration}) maksimal 1 per akun.`, 'error');
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

      {/* TOAST NOTIFICATIONS */}
      <div className="fixed top-6 right-4 md:right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`pointer-events-auto max-w-[320px] w-full bg-[#0b1120] border ${toast.type === 'error' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-[#f2e28a]/50 shadow-[0_0_15px_rgba(242,226,138,0.2)]'} rounded-xl p-4 flex items-start gap-3 backdrop-blur-md bg-opacity-95 transition-all duration-300`}
            style={{ animation: 'slideInRight 0.3s ease-out forwards' }}
          >
            <div className={`mt-0.5 shrink-0 rounded-full p-1 border ${toast.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-[#f2e28a]/10 text-[#f2e28a] border-[#f2e28a]/30'}`}>
               <PixelIcon name={toast.type === 'error' ? 'close' : 'check'} className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-[13px] md:text-[14px] mb-0.5 font-poppins">{toast.title}</h4>
              <p className="text-gray-400 text-[11px] md:text-xs leading-relaxed">{toast.description}</p>
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} 
              className="text-gray-500 hover:text-white transition-colors shrink-0 p-1"
            >
              <PixelIcon name="close" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
