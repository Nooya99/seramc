'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function AdminChatBox({ orderId, orderStatus }) {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const fetchChats = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/chat`);
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
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
        body: JSON.stringify({ message: message.trim(), sender: 'ADMIN' })
      });
      if (res.ok) {
        setMessage('');
        fetchChats();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800">
        <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-900/80 rounded-2xl border border-slate-800 h-[350px] overflow-hidden">
      <div className="p-3 bg-slate-800/80 border-b border-slate-700/50 flex justify-between items-center">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Chat Pemain
        </h4>
        <span className="text-xs text-slate-400">{chats.length} Pesan</span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3">
        {chats.length === 0 ? (
          <div className="text-center text-slate-500 text-sm mt-8">
            Belum ada pesan. Ketik pesan pertama Anda di bawah.
          </div>
        ) : (
          chats.map((chat) => {
            const isAdmin = chat.sender === 'ADMIN';
            return (
              <div key={chat.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2.5 rounded-xl max-w-[85%] text-sm shadow-md break-words ${
                  isAdmin 
                    ? 'bg-cyan-600 text-white rounded-tr-sm border border-cyan-500/50' 
                    : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
                }`}>
                  {chat.message.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                    part.match(/https?:\/\/[^\s]+/) ? (
                      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-300 hover:text-emerald-200 break-all">
                        {part}
                      </a>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                  <div className={`text-[9px] mt-1 text-right ${isAdmin ? 'text-cyan-200' : 'text-slate-400'}`}>
                    {new Date(chat.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 bg-slate-800/50 border-t border-slate-700/50 flex gap-2">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ketik pesan..." 
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
          disabled={sending || orderStatus === 'CANCELLED'}
        />
        <button 
          type="submit" 
          disabled={sending || !message.trim() || orderStatus === 'CANCELLED'}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
