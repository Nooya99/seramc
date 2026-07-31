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
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      fetchChats();
      const interval = setInterval(fetchChats, 3000);
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
          className="bg-sky-500 hover:bg-sky-400 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all transform hover:scale-110 border-2 border-white/20"
        >
          <Icon icon="lucide:message-circle" className="w-7 h-7" />
          {chats.length > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-[#0b1120] rounded-full"></span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 md:bottom-4 md:right-8 w-full md:w-[380px] h-[85vh] md:h-[600px] z-50 flex flex-col neo-glass rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl shadow-sky-900/20 border border-white/10 animate-in slide-in-from-bottom-full duration-300">
      
      {/* Header */}
      <div className="bg-slate-900 p-4 border-b border-white/10 flex justify-between items-center shadow-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 border border-sky-500/30 relative">
            <Icon icon="lucide:headset" className="w-5 h-5" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Live Chat SERA MC</h3>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              Admin siap membantu
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Minimize"
          >
            <Icon icon="lucide:minus" className="w-5 h-5" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
            title="Tutup Chat"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-[#0f172a] relative">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Icon icon="lucide:loader-2" className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-4">
            
            {/* Order Info Bubble */}
            {order && (
              <div className="flex justify-center mb-2">
                <div className="bg-black/40 border border-white/5 rounded-xl p-3 max-w-full w-full text-xs text-center backdrop-blur-md">
                  <p className="text-gray-400 font-medium mb-1">ID Pesanan: <span className="text-white font-bold">{order.id.split('-')[0].toUpperCase()}</span></p>
                  <p className="text-gray-400 mb-2">Total: <span className="text-[#f2e28a] font-bold">{formatPrice(order.totalAmount)}</span></p>
                  <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    order.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {order.status === 'PAID' ? 'LUNAS' : order.status === 'CANCELLED' ? 'DIBATALKAN' : 'MENUNGGU PEMBAYARAN'}
                  </div>
                </div>
              </div>
            )}

            {/* Initial System Message */}
            {order && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-white/5 text-gray-200 p-3 rounded-2xl rounded-tl-sm max-w-[85%] text-sm shadow-md">
                  Halo <b>{order.user.ign}</b>! Pesanan Anda telah kami terima.
                  <br/><br/>
                  Silakan lakukan pembayaran sebesar <b>{formatPrice(order.totalAmount)}</b> melalui QRIS (scan/upload QR di bawah).
                  <br/><br/>
                  Jika sudah, kirimkan bukti pembayarannya di chat ini (paste/ketik link gambar bukti transfer).
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {chats.map((chat) => {
              const isAdmin = chat.sender === 'ADMIN';
              return (
                <div key={chat.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-md break-words ${
                    isAdmin 
                      ? 'bg-slate-800 border border-white/5 text-gray-200 rounded-tl-sm' 
                      : 'bg-sky-600 text-white rounded-tr-sm border border-sky-500'
                  }`}>
                    {chat.message.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                      part.match(/https?:\/\/[^\s]+/) ? (
                        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-sky-200 break-all">
                          {part}
                        </a>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                    <div className={`text-[10px] mt-1 ${isAdmin ? 'text-gray-400' : 'text-sky-200'} text-right`}>
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
      <form onSubmit={sendMessage} className="p-3 bg-slate-900 border-t border-white/10 flex gap-2 relative z-10">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ketik pesan atau paste link..." 
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-colors"
          disabled={sending || (order && order.status === 'CANCELLED')}
        />
        <button 
          type="submit" 
          disabled={sending || !message.trim() || (order && order.status === 'CANCELLED')}
          className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:hover:bg-sky-500 text-white w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-95"
        >
          {sending ? (
            <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
          ) : (
            <Icon icon="lucide:send" className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
