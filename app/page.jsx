'use client';

import { useState, useRef, useEffect } from 'react';
import PixelIcon from '@/components/PixelIcon';
import Navbar from '@/components/Navbar';
import NoticeToast from '@/components/NoticeToast';
import { playSound } from '@/utils/sound';
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
import OrderStatusModal from '@/components/modals/OrderStatusModal';
import LiveChatWidget from '@/components/LiveChatWidget';
import HelperRequirementsModal from '@/components/modals/HelperRequirementsModal';
import HelperRegistrationModal from '@/components/modals/HelperRegistrationModal';

export default function Home() {
  const [activeModal, setActiveModal] = useState(null);
  const [pendingModal, setPendingModal] = useState(null);
  const [cart, setCart] = useState([]);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [playerContext, setPlayerContext] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activeChatOrderId, setActiveChatOrderId] = useState(null);
  const loginTimeoutRef = useRef(null);

  // Restore nickname from browser cache (localStorage) on initial mount
  useEffect(() => {
    try {
      const savedContext = localStorage.getItem('sera_player_context');
      if (savedContext) {
        const parsed = JSON.parse(savedContext);
        if (parsed && parsed.nickname) {
          setPlayerContext(parsed);
        }
      }

      const savedOrderId = localStorage.getItem('sera_active_chat_order_id');
      if (savedOrderId) {
        setActiveChatOrderId(savedOrderId);
      }
    } catch (err) {
      console.error('Error restoring from localStorage:', err);
    }
  }, []);

  // Save active chat order id to localStorage when it changes
  useEffect(() => {
    if (activeChatOrderId) {
      localStorage.setItem('sera_active_chat_order_id', activeChatOrderId);
    }
  }, [activeChatOrderId]);

  const addToast = (title, description, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleOpenModal = (modalName) => {
    playSound('click');
    if ((modalName === 'shop' || modalName === 'checkout') && !playerContext) {
      if (modalName === 'shop') setActiveModal('shop');
      setPendingModal(modalName);
      
      if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current);
      loginTimeoutRef.current = setTimeout(() => {
        setIsLoginOpen(true);
      }, 800);
      
      return;
    }
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    playSound('pop');
    if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current);
    setActiveModal(null);
    setIsLoginOpen(false);
  };

  const handleAddToCart = (item) => {
    setCart((prev) => {
      if (item.category === 'rank') {
        const hasDifferentRank = prev.some(cartItem => cartItem.category === 'rank' && (cartItem.name !== item.name || cartItem.duration !== item.duration));
        if (hasDifferentRank) {
          playSound('error');
          addToast('Gagal Menambahkan', 'Anda hanya bisa membeli 1 jenis Rank dalam satu pesanan.', 'error');
          return prev;
        }
      }

      const existingItemIndex = prev.findIndex(
        (cartItem) => cartItem.name === item.name && cartItem.duration === item.duration
      );

      if (existingItemIndex !== -1) {
        if (item.duration && item.duration.includes('Permanen')) {
          playSound('error');
          addToast('Gagal Menambahkan', `Item ${item.name} (${item.duration}) maksimal 1 per akun.`, 'error');
          return prev;
        }
        
        playSound('success');
        addToast('Berhasil Ditambahkan', `${item.name} x${(prev[existingItemIndex].quantity || 1) + 1} masuk ke keranjang!`, 'success');
        const newCart = [...prev];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: (newCart[existingItemIndex].quantity || 1) + 1
        };
        return newCart;
      }

      playSound('success');
      addToast('Berhasil Ditambahkan', `${item.name} masuk ke keranjang!`, 'success');
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (indexToUpdate, delta) => {
    setCart((prev) => {
      const newCart = [...prev];
      const item = newCart[indexToUpdate];
      const newQuantity = (item.quantity || 1) + delta;
      
      if (newQuantity < 1) {
        return prev;
      }



      if (item.duration && item.duration.includes('Permanen') && newQuantity > 1) {
        playSound('error');
        addToast('Batas Maksimal', `Item ${item.name} (${item.duration}) maksimal 1 per akun.`, 'error');
        return prev;
      }

      playSound('click');
      newCart[indexToUpdate] = { ...item, quantity: newQuantity };
      return newCart;
    });
  };

  const handleRemoveFromCart = (indexToRemove) => {
    playSound('pop');
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <main className="w-full relative z-20 min-h-screen">
      <Navbar onOpenModal={handleOpenModal} />
      <NoticeToast />
      
      <div className="sticky top-0 h-screen w-full z-0 flex items-center justify-center">
        <Hero onOpenModal={handleOpenModal} />
      </div>

      <div className="w-full relative z-20">
        
        {/* ABOUT SECTION */}
        <div className="sticky top-0 w-full bg-[#0b1121] shadow-[0_-20px_50px_rgba(0,0,0,0.7)] pt-8 z-10">
          <About />
        </div>

        {/* FEATURES SECTION */}
        <div className="sticky top-0 w-full bg-[#0b1121] shadow-[0_-20px_50px_rgba(0,0,0,0.7)] z-20">
          <Features onOpenModal={handleOpenModal} />
        </div>

        {/* SHOP SECTION */}
        <div className="sticky top-0 w-full bg-[#0b1121] shadow-[0_-20px_50px_rgba(0,0,0,0.7)] z-30">
          <ShopCoverflow onOpenModal={handleOpenModal} />
        </div>

        {/* REVIEWS SECTION */}
        <div className="sticky top-0 w-full bg-[#0b1121] shadow-[0_-20px_50px_rgba(0,0,0,0.7)] z-40">
          <ReviewsMarquee />
        </div>

        {/* FAQ SECTION */}
        <div className="sticky top-0 w-full bg-[#0b1121] shadow-[0_-20px_50px_rgba(0,0,0,0.7)] z-50">
          <FaqAccordion />
        </div>

        {/* FOOTER SECTION */}
        <div className="sticky top-0 w-full bg-[#070b15] shadow-[0_-20px_50px_rgba(0,0,0,0.7)] z-[60] pb-10">
          <Footer />
        </div>

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
        onViewStatus={() => setActiveModal('status')}
      />
      <CartModal
        isOpen={activeModal === 'cart'}
        onClose={() => setActiveModal('shop')}
        cart={cart}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={() => handleOpenModal('checkout')}
        appliedVoucher={appliedVoucher}
        setAppliedVoucher={setAppliedVoucher}
      />
      <CheckoutModal
        isOpen={activeModal === 'checkout'}
        onClose={() => setActiveModal('cart')}
        onSuccess={() => {
          setCart([]);
          setAppliedVoucher(null);
          setActiveModal('shop');
        }}
        onCheckoutSuccess={(id) => {
          setActiveChatOrderId(id);
          setActiveModal(null);
          setCart([]);
          setAppliedVoucher(null);
        }}
        cart={cart}
        playerContext={playerContext}
        appliedVoucher={appliedVoucher}
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
          if (!data) {
            setActiveChatOrderId(null);
            localStorage.removeItem('sera_active_chat_order_id');
          }
          setIsLoginOpen(false);
          if (pendingModal === 'checkout' && data) {
            setActiveModal('checkout');
          } else if (pendingModal === 'checkout' && !data) {
            setActiveModal('cart');
          }
          setPendingModal(null);
        }}
      />
      <OrderStatusModal
        isOpen={activeModal === 'status'}
        onClose={() => setActiveModal('shop')}
        playerContext={playerContext}
      />
      <HelperRequirementsModal
        isOpen={activeModal === 'helperReq'}
        onClose={handleCloseModal}
        onUnderstood={() => setActiveModal('helperForm')}
      />
      <HelperRegistrationModal
        isOpen={activeModal === 'helperForm'}
        onClose={handleCloseModal}
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

      <LiveChatWidget 
        orderId={activeChatOrderId} 
        onClose={() => {
          setActiveChatOrderId(null);
          localStorage.removeItem('sera_active_chat_order_id');
        }} 
      />

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
