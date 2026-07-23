'use client';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#050810] text-white font-poppins flex">
      {/* Sidebar (Very basic for now) */}
      <aside className="w-64 border-r border-white/10 bg-black/50 p-6 flex flex-col hidden md:flex">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            SERA MC Admin
          </h2>
        </div>
        <nav className="flex flex-col gap-2 flex-grow">
          <a href="/admin" className="p-3 bg-white/5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
            Dashboard
          </a>
          <a href="/admin/products" className="p-3 rounded-xl text-sm font-medium hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            Kelola Produk
          </a>
          <a href="/admin/orders" className="p-3 rounded-xl text-sm font-medium hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            Daftar Pesanan
          </a>
        </nav>
        <button 
          onClick={() => {
            document.cookie = "admin_token=; path=/; max-age=0";
            window.location.href = '/admin/login';
          }}
          className="p-3 mt-auto rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
