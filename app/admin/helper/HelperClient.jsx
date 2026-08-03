'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Power, PowerOff, Loader2, X, Trash2, Star } from 'lucide-react';

export default function HelperClient() {
  const [applications, setApplications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('sera_admin_auth');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      const res = await fetch('/api/admin/helper');
      
      if (!res.ok) {
        if (res.status === 401) router.push('/admin/login');
        throw new Error('Failed to fetch data');
      }
      
      const data = await res.json();
      setApplications(data.applications);
      setIsOpen(data.isOpen);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [router]);

  const toggleRegistration = async () => {
    if (!confirm(`Yakin ingin ${isOpen ? 'menutup' : 'membuka'} pendaftaran Helper?`)) return;
    
    setIsToggling(true);
    try {
      const res = await fetch('/api/admin/helper/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isOpen: !isOpen })
      });
      
      if (!res.ok) throw new Error('Failed to toggle');
      
      const data = await res.json();
      setIsOpen(data.isOpen);
      showToast(data.isOpen ? 'Pendaftaran berhasil dibuka' : 'Pendaftaran berhasil ditutup', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengubah status pendaftaran');
    } finally {
      setIsToggling(false);
    }
  };

  const deleteApplication = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Yakin ingin menghapus pendaftaran ini?')) return;
    
    try {
      const res = await fetch(`/api/admin/helper/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete');
      
      setApplications(prev => prev.filter(app => app.id !== id));
      if (selectedApp?.id === id) {
        setSelectedApp(null);
      }
      showToast('Pendaftaran berhasil dihapus', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus pendaftaran');
    }
  };

  const toggleStar = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/helper/${id}/star`, {
        method: 'POST',
      });
      
      if (!res.ok) throw new Error('Failed to toggle');
      
      const data = await res.json();
      setApplications(prev => prev.map(app => app.id === id ? { ...app, isStarred: data.isStarred } : app));
      if (selectedApp?.id === id) {
        setSelectedApp(prev => ({ ...prev, isStarred: data.isStarred }));
      }
      showToast(data.isStarred ? 'Pendaftaran ditandai' : 'Tanda dihapus', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menandai pendaftaran');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            Pendaftaran Helper
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola aplikasi pendaftaran Helper. Pendaftaran sampai tanggal 6, interview tanggal 7 & 8.
          </p>
        </div>
        
        <button
          onClick={toggleRegistration}
          disabled={isToggling}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
            isOpen 
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 shadow-rose-500/10'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 shadow-emerald-500/10'
          }`}
        >
          {isToggling ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isOpen ? (
            <PowerOff className="w-5 h-5" />
          ) : (
            <Power className="w-5 h-5" />
          )}
          {isOpen ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
        </button>
      </div>

      <div className="bg-[#0b101d]/80 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800/80">
              <tr>
                <th className="px-6 py-4 font-semibold">Nickname</th>
                <th className="px-6 py-4 font-semibold">Platform</th>
                <th className="px-6 py-4 font-semibold">Kontak</th>
                <th className="px-6 py-4 font-semibold w-1/3">Detail</th>
                <th className="px-6 py-4 font-semibold">Waktu Daftar</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                    Belum ada yang mendaftar.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr 
                    key={app.id} 
                    onClick={() => setSelectedApp(app)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => toggleStar(app.id, e)}
                          className="p-1.5 rounded hover:bg-slate-700 transition-colors group/star"
                        >
                          <Star className={`w-4 h-4 ${app.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-slate-500 group-hover/star:text-slate-300'}`} />
                        </button>
                        <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">{app.nickname}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        app.platform === 'java' 
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {app.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="text-xs"><span className="text-slate-500">WA:</span> {app.whatsapp}</div>
                      <div className="text-xs"><span className="text-slate-500">DC:</span> {app.discord}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-400 italic">
                        Klik baris ini untuk melihat detail lengkap pendaftaran...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                      {new Date(app.createdAt).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => deleteApplication(app.id, e)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Hapus Pendaftaran"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pendaftaran */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
          <div 
            className="bg-[#0b101d] border border-slate-700 w-full max-w-2xl rounded-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4 mb-6 pr-8 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <Users className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {selectedApp.nickname}
                  {selectedApp.isStarred && <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
                </h3>
                <div className="text-xs text-cyan-400 font-mono tracking-wider uppercase mt-0.5 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${selectedApp.platform === 'java' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {selectedApp.platform}
                  </span>
                  <span>{new Date(selectedApp.createdAt).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#070b14] border border-slate-800/80 rounded-xl p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">WhatsApp</div>
                  <div className="text-sm text-slate-200 font-mono">{selectedApp.whatsapp}</div>
                </div>
                <div className="bg-[#070b14] border border-slate-800/80 rounded-xl p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Discord</div>
                  <div className="text-sm text-slate-200 font-mono">{selectedApp.discord}</div>
                </div>
                <div className="bg-[#070b14] border border-slate-800/80 rounded-xl p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Umur</div>
                  <div className="text-sm text-slate-200 font-mono">{selectedApp.age} Tahun</div>
                </div>
                <div className="bg-[#070b14] border border-slate-800/80 rounded-xl p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Siap Interview?</div>
                  <div className={`text-sm font-bold ${selectedApp.interview ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedApp.interview ? 'YA, BERSEDIA' : 'TIDAK BERSEDIA'}
                  </div>
                </div>
              </div>

              <div className="bg-[#070b14] border border-slate-800/80 rounded-xl p-4 space-y-4">
                <div>
                  <div className="text-[10px] text-cyan-500 uppercase tracking-wider mb-1 font-semibold">Tau SERA MC Dari Mana?</div>
                  <div className="text-sm text-slate-300">{selectedApp.discovery}</div>
                </div>
                
                <div className="w-full h-px bg-slate-800/50"></div>
                
                <div>
                  <div className="text-[10px] text-cyan-500 uppercase tracking-wider mb-1 font-semibold">Server Sebelumnya</div>
                  <div className="text-sm text-slate-300">{selectedApp.previousServer}</div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div>
                  <div className="text-[10px] text-cyan-500 uppercase tracking-wider mb-2 font-semibold">Keahlian</div>
                  <div className="text-sm text-slate-300 bg-black/40 p-3 rounded-lg whitespace-pre-wrap">{selectedApp.skills}</div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div>
                  <div className="text-[10px] text-cyan-500 uppercase tracking-wider mb-2 font-semibold">Alasan Mendaftar</div>
                  <div className="text-sm text-slate-300 bg-black/40 p-3 rounded-lg whitespace-pre-wrap">{selectedApp.reason}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-xl z-[200] animate-in slide-in-from-top-5 fade-in duration-300 flex items-center gap-2 font-medium ${
          toast.type === 'success' 
            ? 'bg-emerald-500/90 text-white border border-emerald-400' 
            : 'bg-rose-500/90 text-white border border-rose-400'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
