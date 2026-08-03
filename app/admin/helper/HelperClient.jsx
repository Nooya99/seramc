'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Power, PowerOff, Loader2 } from 'lucide-react';

export default function HelperClient() {
  const [applications, setApplications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const router = useRouter();

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('sera_admin_auth');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      const res = await fetch('/api/admin/helper', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
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
      const token = localStorage.getItem('sera_admin_auth');
      const res = await fetch('/api/admin/helper/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isOpen: !isOpen })
      });
      
      if (!res.ok) throw new Error('Failed to toggle');
      
      const data = await res.json();
      setIsOpen(data.isOpen);
    } catch (err) {
      console.error(err);
      alert('Gagal mengubah status pendaftaran');
    } finally {
      setIsToggling(false);
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    Belum ada yang mendaftar.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{app.nickname}</div>
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
                      <div className="space-y-2 max-w-sm">
                        <div className="text-xs">
                          <span className="font-medium text-slate-400">Tau SERA MC:</span> {app.discovery}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-slate-400">Server sblm:</span> {app.previousServer}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-slate-400">Keahlian:</span> <p className="line-clamp-2 mt-0.5">{app.skills}</p>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-slate-400">Alasan:</span> <p className="line-clamp-2 mt-0.5">{app.reason}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                      {new Date(app.createdAt).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
