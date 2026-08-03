import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import PixelIcon from '@/components/PixelIcon';
import { playSound } from '@/utils/sound';

export default function HelperRegistrationModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    platform: 'java',
    nickname: '',
    whatsapp: '',
    discord: '',
    discovery: '',
    previousServer: '',
    skills: '',
    reason: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'platform' && value === 'bedrock') {
      if (!formData.nickname.startsWith('_')) {
        setFormData(prev => ({ ...prev, [name]: value, nickname: '_' + prev.nickname }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'platform' && value === 'java') {
      if (formData.nickname.startsWith('_')) {
        setFormData(prev => ({ ...prev, [name]: value, nickname: prev.nickname.substring(1) }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playSound('click');
    setErrorMsg('');
    setSuccessMsg('');
    
    if (formData.platform === 'bedrock' && !formData.nickname.startsWith('_')) {
      setErrorMsg('Nickname Bedrock harus diawali dengan "_"');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/helper/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim pendaftaran');
      }
      
      playSound('success');
      setSuccessMsg('Pendaftaran berhasil dikirim! Semoga beruntung.');
      setFormData({
        platform: 'java',
        nickname: '',
        whatsapp: '',
        discord: '',
        discovery: '',
        previousServer: '',
        skills: '',
        reason: ''
      });
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 3000);
    } catch (err) {
      playSound('error');
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-[#0b101d] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
              <PixelIcon name="edit" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Formulir Pendaftaran</h2>
              <p className="text-sm text-slate-400">Isi data di bawah ini dengan benar.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-rose-500/20 hover:border-rose-500/30 rounded-xl border border-transparent transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
              {successMsg}
            </div>
          )}
          
          <form id="helper-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-300">Nickname Minecraft</label>
              <input 
                type="text" 
                name="nickname"
                required
                value={formData.nickname}
                onChange={handleChange}
                placeholder="Masukkan Nickname Anda"
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-300">Pilih Platform</label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => handleChange({ target: { name: 'platform', value: 'java' }})}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-300 ${formData.platform === 'java' ? 'bg-[#f2e28a]/20 border-[#f2e28a] text-[#f2e28a]' : 'bg-slate-900/50 border-slate-700/50 text-gray-400 hover:border-slate-500/50'}`}
                >
                  <PixelIcon name="monitor" className="w-5 h-5" />
                  <span className="font-bold text-sm">Java Edition</span>
                </div>
                <div 
                  onClick={() => handleChange({ target: { name: 'platform', value: 'bedrock' }})}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-300 ${formData.platform === 'bedrock' ? 'bg-[#f2e28a]/20 border-[#f2e28a] text-[#f2e28a]' : 'bg-slate-900/50 border-slate-700/50 text-gray-400 hover:border-slate-500/50'}`}
                >
                  <PixelIcon name="device-phone" className="w-5 h-5" />
                  <span className="font-bold text-sm">Bedrock Edition</span>
                </div>
              </div>
              {formData.platform === 'bedrock' && (
                <p className="text-xs text-yellow-400/80 mt-2 text-center">
                  *Simbol _ (underscore) akan otomatis ditambahkan di awal nama.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">No. WhatsApp</label>
                <input 
                  type="text" 
                  name="whatsapp"
                  required
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="08123456789"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Username Discord</label>
                <input 
                  type="text" 
                  name="discord"
                  required
                  value={formData.discord}
                  onChange={handleChange}
                  placeholder="username#1234"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Tau SERA MC dari mana?</label>
              <input 
                type="text" 
                name="discovery"
                required
                value={formData.discovery}
                onChange={handleChange}
                placeholder="TikTok, Teman, YouTube, dll"
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Main server apa sebelum SERA MC?</label>
              <input 
                type="text" 
                name="previousServer"
                required
                value={formData.previousServer}
                onChange={handleChange}
                placeholder="Sebutkan server sebelumnya"
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Memiliki keahlian di bidang apa seputar server?</label>
              <textarea 
                name="skills"
                required
                value={formData.skills}
                onChange={handleChange}
                placeholder="Contoh: Building, Redstone, Moderasi, dll"
                rows="3"
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Alasan mendaftar</label>
              <textarea 
                name="reason"
                required
                value={formData.reason}
                onChange={handleChange}
                placeholder="Berikan alasan yang jelas mengapa Anda ingin menjadi Helper"
                rows="4"
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button 
            type="submit"
            form="helper-form"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] hover:shadow-[0_0_20px_rgba(8,145,178,0.5)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Kirim Formulir
          </button>
        </div>
      </div>
    </div>
  );
}
