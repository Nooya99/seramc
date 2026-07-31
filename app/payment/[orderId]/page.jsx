'use client';
import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import PixelIcon from '@/components/PixelIcon';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentChatPage({ params }) {
  const { orderId } = params;
  const router = useRouter();
  
  const [order, setOrder] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { cache: 'no-store' });
      if (res.ok) {
        const orderData = await res.json();
        setOrder(orderData);
      } else {
        router.push('/');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center text-white">
        <div className="animate-spin text-sky-500">
          <Icon icon="lucide:loader-2" className="w-12 h-12" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col items-center py-8 px-4 font-poppins relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-900/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none z-0"></div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 z-10 h-[calc(100vh-4rem)]">
        
        {/* Left Side: Order Info */}
        <div className="w-full md:w-1/3 neo-glass rounded-2xl p-6 flex flex-col h-fit">
          <Link href="/" className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 mb-6 font-bold text-sm transition-colors w-fit">
            <Icon icon="lucide:arrow-left" className="w-4 h-4" /> Kembali ke Web
          </Link>
          
          <h2 className="text-xl font-black text-white mb-2 uppercase tracking-wide border-b border-white/10 pb-4">
            Rincian Pesanan
          </h2>
          
          <div className="py-4 space-y-4">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              }`}>
                {order.status === 'PAID' ? 'LUNAS' : order.status === 'CANCELLED' ? 'DIBATALKAN' : 'MENUNGGU PEMBAYARAN'}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">In-Game Name</p>
              <p className="text-white font-medium">{order.user.ign}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Item</p>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="bg-black/30 p-2 rounded-lg border border-white/5 flex justify-between items-center text-sm">
                    <span className="text-gray-300">{item.quantity}x {item.product?.name || 'Item'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Pembayaran</p>
            <p className="text-2xl font-black text-[#f2e28a]">{formatPrice(order.totalAmount)}</p>
          </div>
        </div>

        {/* Right Side: Chat */}
        <div className="w-full md:w-2/3 neo-glass rounded-2xl flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 border border-sky-500/30">
              <Icon icon="lucide:headset" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold">Admin Live Chat</h3>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                Admin siap membantu
              </p>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4 bg-black/10">
            {/* Initial System Message */}
            <div className="flex justify-start">
              <div className="bg-[#1e293b] border border-white/10 text-gray-200 p-3 rounded-2xl rounded-tl-sm max-w-[85%] text-sm shadow-md">
                Halo <b>{order.user.ign}</b>! Pesanan Anda dengan ID <b>{order.id.split('-')[0].toUpperCase()}</b> telah kami terima.
                <br/><br/>
                Silakan lakukan pembayaran sebesar <b>{formatPrice(order.totalAmount)}</b> dan kirimkan bukti pembayarannya di sini (Anda dapat menempelkan/memasukkan link gambar).
              </div>
            </div>

            {chats.map((chat) => {
              const isAdmin = chat.sender === 'ADMIN';
              return (
                <div key={chat.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-md break-words ${
                    isAdmin 
                      ? 'bg-[#1e293b] border border-white/10 text-gray-200 rounded-tl-sm' 
                      : 'bg-sky-600 text-white rounded-tr-sm border border-sky-500'
                  }`}>
                    {/* Render URLs as links automatically (simple regex) */}
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

          <form onSubmit={sendMessage} className="p-3 border-t border-white/10 bg-black/20 flex gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ketik pesan atau paste link bukti gambar..." 
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-colors"
              disabled={sending}
            />
            <button 
              type="submit" 
              disabled={sending || !message.trim()}
              className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:hover:bg-sky-500 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              {sending ? (
                <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
              ) : (
                <Icon icon="lucide:send" className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
