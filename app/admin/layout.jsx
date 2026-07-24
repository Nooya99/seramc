'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState('connecting');

  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (res.ok) setDbStatus('online');
        else setDbStatus('error');
      })
      .catch(() => setDbStatus('error'));
  }, []);

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; max-age=0";
    localStorage.removeItem('sera_admin_auth');
    router.push('/admin/login');
  };

  const navItems = [
    {
      name: 'Dashboard Overview',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin'
    },
    {
      name: 'Kelola Pesanan',
      href: '/admin/orders',
      icon: ShoppingBag,
      active: pathname === '/admin/orders'
    },
    {
      name: 'Katalog Produk & Rank',
      href: '/admin/products',
      icon: Package,
      active: pathname === '/admin/products'
    }
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-[#0b101d]/90 border-r border-slate-800/80 backdrop-blur-xl sticky top-0 h-screen z-30 shadow-2xl">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <img 
              src="/LOGO.png" 
              alt="SERA MC Logo" 
              className="h-11 w-auto object-contain drop-shadow-md"
            />
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide flex items-center gap-1.5">
                SERA MC
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  dbStatus === 'online' ? 'bg-emerald-500 animate-pulse' :
                  dbStatus === 'connecting' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                {dbStatus === 'online' ? 'Supabase Connected' : dbStatus === 'connecting' ? 'Connecting DB...' : 'DB Disconnected'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-2">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  item.active
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    item.active ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  <span>{item.name}</span>
                </div>
                {item.active && (
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors mb-2 border border-slate-800"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Lihat Website Main
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Admin</span>
          </button>
        </div>
      </aside>

      {/* Header Mobile */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#0b101d] border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img 
            src="/LOGO.png" 
            alt="SERA MC Logo" 
            className="h-8 w-auto object-contain drop-shadow-md"
          />
          <span className="font-bold text-white tracking-wide text-sm">SERA MC Admin</span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-white bg-slate-800/60 rounded-lg border border-slate-700"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Drawer Mobile */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-[#070b14]/95 backdrop-blur-2xl z-30 p-6 flex flex-col justify-between border-t border-slate-800">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                    item.active
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5 text-cyan-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 pt-6 border-t border-slate-800">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-slate-300 bg-slate-800/60 border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Lihat Website Server
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
