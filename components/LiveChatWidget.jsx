'use client';
import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export default function LiveChatWidget({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Set mock phone time
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let mins = now.getMinutes();
      setCurrentTime(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      fetchChats();
      const interval = setInterval(() => {
        fetchChats();
        fetchOrderDetails();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  useEffect(() => {
    if (!isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, isMinimized]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { cache: 'no-store' });
      if (res.ok) {
        const orderData = await res.json();
        setOrder(orderData);
      } else {
        console.error('Failed to fetch order details');
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/chat`);
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), sender: 'USER' })
      });
      
      if (res.ok) {
        setMessage('');
        fetchChats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  if (!orderId) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 animate-in slide-in-from-bottom-5">
        <button 
          onClick={() => setIsMinimized(false)}
          className="bg-[#f2e28a] hover:bg-[#d1c272] text-[#0b1121] w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(242,226,138,0.4)] transition-all transform hover:scale-110 border-2 border-[#1a2333]"
        >
          <Icon icon="lucide:message-circle" className="w-7 h-7" />
          {chats.length > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-white border-2 border-[#f2e28a] rounded-full"></span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[320px] md:w-[360px] h-[80vh] md:h-[680px] z-[9999] flex flex-col bg-[#0b1121] rounded-[40px] overflow-hidden shadow-2xl border-[6px] border-[#1a2333] animate-in slide-in-from-bottom-full duration-300 font-sans">
      
      {/* Fake Phone Status Bar */}
      <div className="h-7 w-full flex justify-between items-center px-6 pt-1 text-[11px] font-medium text-white relative z-20">
        <span className="w-10 text-center">{currentTime}</span>
        {/* Dynamic Island */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-24 h-[22px] bg-black rounded-full z-30 shadow-[inset_0_0_2px_rgba(255,255,255,0.1)]"></div>
        <div className="flex gap-1.5 items-center w-10 justify-end">
          <Icon icon="lucide:bar-chart-2" className="w-3.5 h-3.5" />
          <Icon icon="lucide:wifi" className="w-3.5 h-3.5" />
          <Icon icon="lucide:battery-full" className="w-4 h-4" />
        </div>
      </div>

      {/* Header */}
      <div className="pt-4 pb-3 px-5 flex justify-between items-center relative z-10 border-b border-[#1a2333]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2a374a] flex items-center justify-center relative shadow-sm border border-[#333]">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=c0aede" alt="Admin" className="w-full h-full object-cover" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-[2px] border-[#0b1121] rounded-full"></span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-[15px] leading-tight">Admin SERAMC</h3>
            <p className="text-[11px] text-[#f2e28a] font-medium flex items-center gap-1">
              Typing...
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white bg-[#1a2333] rounded-full transition-colors"
            title="Minimize"
          >
            <Icon icon="lucide:minus" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative bg-[#0b1121] pb-4">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Icon icon="lucide:loader-2" className="w-8 h-8 text-[#f2e28a] animate-spin" />
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-4">
            
            {/* Date Separator */}
            <div className="flex justify-center my-1">
              <span className="text-[10px] font-medium text-gray-500 bg-[#1a2333] px-3 py-1 rounded-full">Today</span>
            </div>

            {/* Order Info Bubble */}
            {order && (
              <div className="flex justify-center mb-2">
                <div className="bg-[#1a2333] rounded-2xl p-3 max-w-[90%] w-full text-[11px] text-center shadow-sm">
                  <p className="text-gray-400 font-medium mb-1">ID: <span className="text-white font-bold">{order.id.split('-')[0].toUpperCase()}</span></p>
                  <p className="text-gray-400 mb-2">Tagihan: <span className="text-white font-bold">{formatPrice(order.totalAmount)}</span></p>
                  <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                    order.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' :
                    order.status === 'CANCELLED' ? 'bg-[#f2e28a] text-[#0b1121]/20 text-[#f2e28a]' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {order.status === 'PAID' ? 'LUNAS' : order.status === 'CANCELLED' ? 'DIBATALKAN' : 'MENUNGGU PEMBAYARAN'}
                  </div>
                </div>
              </div>
            )}

            {/* Initial System Message */}
            {order && (
              <>
                <div className="flex justify-start">
                  <div className="bg-[#2a374a] text-[#E0E0E0] px-4 py-3 rounded-3xl rounded-tl-sm max-w-[85%] text-[13px] shadow-sm leading-relaxed">
                    Halo <b>{order.user.ign}</b>! Pesanan Anda telah kami terima dengan rincian:
                    <ul className="mt-2 mb-3 list-disc pl-4 text-gray-300">
                      {order.items && order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.product?.name || 'Item'} (x{item.quantity}) - {formatPrice(item.price * item.quantity)}
                        </li>
                      ))}
                    </ul>
                    Silakan lakukan pembayaran sebesar <b className="text-white">{formatPrice(order.totalAmount)}</b> melalui metode QRIS.
                    <br/><br/>
                    Kirimkan bukti pembayarannya di obrolan ini ya!
                  </div>
                </div>
                <div className="flex justify-start mt-1">
                  <div className="bg-[#2a374a] p-2 rounded-3xl rounded-tl-sm max-w-[85%] shadow-sm">
                    <img src="/qris.jpg" alt="QRIS Payment" className="w-full max-w-[200px] rounded-2xl" />
                  </div>
                </div>
              </>
            )}

            {/* Chat Messages */}
            {chats.map((chat) => {
              const isAdmin = chat.sender === 'ADMIN';
              return (
                <div key={chat.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                  <div className={`relative px-4 py-3 rounded-3xl max-w-[85%] text-[13px] shadow-sm break-words ${
                    isAdmin 
                      ? 'bg-[#2a374a] text-[#E0E0E0] rounded-tl-sm' 
                      : 'bg-[#f2e28a] text-[#0b1121] rounded-tr-sm font-medium'
                  }`}>
                    {chat.message.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                      part.match(/https?:\/\/[^\s]+/) ? (
                        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-white break-all">
                          {part}
                        </a>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                    <div className={`text-[9px] mt-1.5 ${isAdmin ? 'text-gray-500' : 'text-[#0b1121]/60'} text-right`}>
                      {new Date(chat.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="px-4 py-3 bg-[#0b1121] border-t border-[#1a2333] flex items-center gap-3 relative z-10">
        <div className="flex-1 bg-[#1a2333] rounded-full flex items-center px-4 py-2 border border-[#2a374a]">
          <label className="text-gray-400 hover:text-white transition-colors mr-2 cursor-pointer" title="Kirim Bukti Pembayaran">
            <Icon icon="lucide:image" className="w-4 h-4" />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  alert('Fitur unggah gambar sedang dalam tahap pengembangan.');
                }
              }} 
            />
          </label>
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message" 
            className="flex-1 bg-transparent border-none text-[13px] text-white focus:outline-none focus:ring-0 placeholder-gray-500"
            disabled={sending || (order && order.status === 'CANCELLED')}
          />
        </div>
        <button 
          type="submit" 
          disabled={sending || !message.trim() || (order && order.status === 'CANCELLED')}
          className="bg-[#f2e28a] text-[#0b1121] hover:bg-[#d1c272] disabled:opacity-50 disabled:hover:bg-[#f2e28a] w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-sm"
        >
          {sending ? (
            <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
          ) : (
            <Icon icon="lucide:send" className="w-4 h-4" />
          )}
        </button>
      </form>
      
      {/* Fake Phone Home Indicator */}
      <div className="h-4 w-full bg-[#0b1121] flex items-center justify-center pb-2">
        <div className="w-[100px] h-[4px] bg-gray-500 rounded-full opacity-50"></div>
      </div>
    </div>
  );
}
