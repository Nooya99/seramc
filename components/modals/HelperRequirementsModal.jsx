import React from 'react';
import { X } from 'lucide-react';
import PixelIcon from '@/components/PixelIcon';
import { playSound } from '@/utils/sound';

export default function HelperRequirementsModal({ isOpen, onClose, onUnderstood }) {
  if (!isOpen) return null;

  const handleUnderstoodClick = () => {
    playSound('click');
    onUnderstood();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-[#0b101d] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
              <PixelIcon name="info" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Persyaratan Helper</h2>
              <p className="text-sm text-slate-400">Baca dengan teliti sebelum mendaftar.</p>
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
          <ul className="space-y-3 text-slate-300 text-sm md:text-base">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Minimal umur tahun ini 15 tahun
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Diutamakan player java / pc
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Dewasa secara pikiran
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Bersedia mengikuti arahan dari Admin
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Tidak menyalahgunakan kekuasaan
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Memiliki sikap ramah, sabar, jujur, dan bertanggungjawab
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Mampu berkomunikasi dengan baik dengan pemain dan staff
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Mampu membantu pemain baru dan menjawab pertanyaan dasar
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Mampu menangani konflik dengan tenang dan tidak memihak
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Sudah bergabung di server minimal 1 minggu
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Tidak memiliki riwayat terkena banned di dalam server
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Memahami dan menaati seluruh peraturan server
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span> Memahami konsep permainan minecraft dan server sera mc
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button 
            onClick={handleUnderstoodClick}
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] hover:shadow-[0_0_20px_rgba(8,145,178,0.5)] active:scale-95"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
