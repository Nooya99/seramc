'use client';

import { AlertTriangle, CheckCircle, XCircle, Info, Trash2, X } from 'lucide-react';

export function ConfirmModal({ isOpen, title, message, count, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101d] border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {title || 'Konfirmasi Hapus Data'}
              {count > 1 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {count} Item
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {message || 'Apakah Anda yakin ingin menghapus item ini dari database? Tindakan ini tidak dapat dibatalkan.'}
            </p>
          </div>

          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-bold border border-slate-700 transition-all"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-sm font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Menghapus...</span>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Hapus Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-[110] animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[300px] ${
        isSuccess 
          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10' 
          : isError 
          ? 'bg-rose-950/90 text-rose-300 border-rose-500/40 shadow-rose-500/10'
          : 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10'
      }`}>
        {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}

        <div className="flex-1 text-sm font-semibold">
          {toast.message}
        </div>

        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
