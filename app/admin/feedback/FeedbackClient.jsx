'use client';

import { useState } from 'react';
import { MessageSquare, Calendar, User, CheckCircle2, Trash2, X } from 'lucide-react';
import { markAsReadAction, deleteFeedbacksAction } from './actions';

export default function FeedbackClient({ initialFeedbacks }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'identity', 'anonymous'
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredFeedbacks = initialFeedbacks.filter(fb => {
    if (activeTab === 'identity') return fb.ign && fb.ign.trim() !== '';
    if (activeTab === 'anonymous') return !fb.ign || fb.ign.trim() === '';
    return true;
  });

  const handleToggleSelect = (id, e) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredFeedbacks.length && filteredFeedbacks.length > 0) {
      setSelectedIds(new Set());
    } else {
      const allIds = filteredFeedbacks.map(fb => fb.id);
      setSelectedIds(new Set(allIds));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Yakin ingin menghapus ${selectedIds.size} masukan?`)) return;
    
    setIsDeleting(true);
    await deleteFeedbacksAction(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsDeleteMode(false);
    setIsDeleting(false);
  };

  const handleCardClick = (fb) => {
    if (isDeleteMode) {
      handleToggleSelect(fb.id, { stopPropagation: () => {} });
    } else {
      setSelectedFeedback(fb);
      if (!fb.isRead) {
        markAsReadAction(fb.id);
      }
    }
  };

  const closeModal = () => setSelectedFeedback(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            Kritik & Saran
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Lihat semua masukan dari pemain SERA MC.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-[#0b101d] border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3">
            <div className="text-xs text-slate-400">Total Masukan</div>
            <div className="text-lg font-bold text-cyan-400">{initialFeedbacks.length}</div>
          </div>
          
          <button 
            onClick={() => {
              setIsDeleteMode(!isDeleteMode);
              if (isDeleteMode) setSelectedIds(new Set());
            }}
            className={`p-2.5 rounded-xl border transition-colors ${isDeleteMode ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-[#0b101d] border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30'}`}
            title="Mode Hapus"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex bg-[#0b101d] p-1 rounded-xl border border-slate-800 w-full max-w-md">
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'all' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          Semua
        </button>
        <button 
          onClick={() => setActiveTab('identity')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'identity' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          Beridentitas
        </button>
        <button 
          onClick={() => setActiveTab('anonymous')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'anonymous' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          Anonim
        </button>
      </div>

      {isDeleteMode && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm text-red-300 ml-2 font-medium">{selectedIds.size} dipilih</span>
            <button
              onClick={handleSelectAll}
              className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
            >
              {selectedIds.size === filteredFeedbacks.length && filteredFeedbacks.length > 0 ? 'Batal Pilih Semua' : 'Pilih Semua'}
            </button>
          </div>
          {selectedIds.size > 0 && (
            <button 
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Menghapus...' : 'Hapus Terpilih'}
            </button>
          )}
        </div>
      )}

      {filteredFeedbacks.length === 0 ? (
        <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
          <MessageSquare className="w-12 h-12 text-slate-700 mb-4" />
          <p>Belum ada kritik dan saran di kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFeedbacks.map((fb) => (
            <div 
              key={fb.id} 
              onClick={() => handleCardClick(fb)}
              className={`bg-[#0b101d] border rounded-2xl p-5 transition-colors group relative overflow-hidden cursor-pointer ${
                selectedIds.has(fb.id) ? 'border-red-500 bg-red-500/5' : 
                fb.isRead ? 'border-slate-800/60 opacity-80 hover:border-slate-600' : 'border-cyan-500/40 hover:border-cyan-500'
              }`}
            >
              {!fb.isRead && !selectedIds.has(fb.id) && (
                <div className="absolute top-0 right-0 w-1.5 h-full bg-cyan-500"></div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(fb.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
                
                {isDeleteMode && (
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedIds.has(fb.id) ? 'bg-red-500 border-red-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                    {selectedIds.has(fb.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">
                    {fb.ign ? fb.ign : <span className="text-slate-500 italic">Anonim</span>}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">Pemain</div>
                </div>
              </div>
              
              <div className="bg-[#070b14] rounded-xl p-4 border border-slate-800/50">
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {fb.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFeedback && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeModal}>
          <div 
            className="bg-[#0b101d] border border-slate-700 w-full max-w-lg rounded-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4 mb-6 pr-8">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedFeedback.ign ? selectedFeedback.ign : <span className="text-slate-400 italic">Anonim</span>}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedFeedback.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-xl p-5 border border-slate-800 max-h-[50vh] overflow-y-auto custom-scrollbar">
              <h4 className="text-xs font-semibold text-cyan-400 mb-2 uppercase tracking-wider">Isi Masukan</h4>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                {selectedFeedback.message}
              </p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={closeModal}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
