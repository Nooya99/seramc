import React from 'react';
import { X } from 'lucide-react';
import PixelIcon from '@/components/PixelIcon';
import { playSound } from '@/utils/sound';

export default function HelperRequirementsModal({ isOpen, onClose, onUnderstood }) {
  const [config, setConfig] = React.useState({ title: 'Helper', requirements: '' });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch('/api/helper/status', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          setConfig({ 
            title: data.title || 'Helper', 
            requirements: data.requirements || ''
          });
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUnderstoodClick = () => {
    playSound('click');
    onUnderstood();
  };

  const requirementsList = config.requirements 
    ? config.requirements.split('\n').filter(req => req.trim() !== '')
    : [
        'Minimal umur tahun ini 15 tahun',
        'Diutamakan player java / pc',
        'Dewasa secara pikiran',
        'Bersedia mengikuti arahan dari Admin',
        'Tidak menyalahgunakan kekuasaan',
        'Memiliki sikap ramah, sabar, jujur, dan bertanggungjawab',
        'Mampu berkomunikasi dengan baik dengan pemain dan staff',
        'Mampu membantu pemain baru dan menjawab pertanyaan dasar',
        'Mampu menangani konflik dengan tenang dan tidak memihak',
        'Sudah bergabung di server minimal 1 minggu',
        'Tidak memiliki riwayat terkena banned di dalam server',
        'Memahami dan menaati seluruh peraturan server',
        'Memahami konsep permainan minecraft dan server sera mc'
      ];

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
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Persyaratan {config.title}</h2>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <ul className="space-y-3 text-slate-300 text-sm md:text-base">
              {requirementsList.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span> {req}
                </li>
              ))}
            </ul>
          )}
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
