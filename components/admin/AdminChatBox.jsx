'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Download } from 'lucide-react';

export default function AdminChatBox({ orderId, orderStatus, isPhoneMode = false }) {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
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
    <div className={`flex flex-col ${isPhoneMode ? 'h-full bg-transparent' : 'bg-slate-900/80 rounded-2xl border border-slate-800 h-[350px] overflow-hidden'}`}>
      {!isPhoneMode && (
        <div className="p-3 bg-slate-800/80 border-b border-slate-700/50 flex justify-between items-center">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Chat Pemain
          </h4>
          <span className="text-xs text-slate-400">{chats.length} Pesan</span>
        </div>
      )}

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
                <div className={`px-4 py-3 max-w-[85%] text-[13px] shadow-sm break-words ${
                  isPhoneMode
                    ? (isAdmin ? 'bg-[#f2e28a] text-[#0b1121] rounded-3xl rounded-tr-sm font-medium' : 'bg-[#2a374a] text-[#E0E0E0] rounded-3xl rounded-tl-sm')
                    : (isAdmin ? 'bg-cyan-600 text-white rounded-xl rounded-tr-sm border border-cyan-500/50' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-xl rounded-tl-sm p-2.5')
                }`}>
                  {chat.message.startsWith('[IMAGE_BASE64]') ? (
                    <img 
                      src={chat.message.replace('[IMAGE_BASE64]', '')} 
                      alt="Uploaded" 
                      className="w-full max-w-[300px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setZoomedImage(chat.message.replace('[IMAGE_BASE64]', ''))}
                    />
                  ) : (
                    chat.message.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                      part.match(/https?:\/\/[^\s]+/) ? (
                        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-300 hover:text-emerald-200 break-all">
                          {part}
                        </a>
                      ) : (
                        <span key={i}>{part}</span>
                      )
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

      <div className={`p-3 ${isPhoneMode ? 'bg-[#0b1121] border-t border-gray-800/50' : 'bg-slate-800/50 border-t border-slate-700/50'}`}>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ketik pesan..." 
            className={`flex-1 rounded-full px-4 py-2 text-sm focus:outline-none ${
              isPhoneMode 
                ? 'bg-[#1a2333] text-white border border-transparent focus:border-gray-600 placeholder-gray-500' 
                : 'bg-slate-900 text-white border border-slate-700 focus:border-cyan-500 placeholder-slate-500'
            }`}
            disabled={sending || orderStatus === 'CANCELLED'}
          />
          <button 
            type="submit" 
            disabled={sending || !message.trim() || orderStatus === 'CANCELLED'}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
              isPhoneMode
                ? 'bg-[#f2e28a] text-[#0b1121] hover:bg-[#e0d070]'
                : 'bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-50'
            }`}
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-[99999] flex flex-col items-center justify-center p-6 animate-in fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <img src={zoomedImage} alt="Zoom" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          
          <div className="flex gap-4 mt-6" onClick={(e) => e.stopPropagation()}>
            <a 
              href={zoomedImage} 
              download="Bukti_Transfer_SERAMC.jpg"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Bukti
            </a>
            <button 
              onClick={() => setZoomedImage(null)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
