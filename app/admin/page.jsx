export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Selamat Datang, Admin</h1>
      <p className="text-gray-400 mb-8">Ini adalah panel kontrol utama untuk mengelola SERA MC.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Pendapatan</h3>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            Rp 0
          </p>
          <div className="mt-4 text-xs text-yellow-400">
            *Menunggu integrasi Database
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Pesanan Masuk</h3>
          <p className="text-3xl font-bold text-white">0</p>
          <div className="mt-4 text-xs text-yellow-400">
            *Menunggu integrasi Database
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Produk</h3>
          <p className="text-3xl font-bold text-white">0</p>
          <div className="mt-4 text-xs text-yellow-400">
            *Menunggu integrasi Database
          </div>
        </div>
      </div>

      <div className="mt-12 bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl">
        <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
          <span>⚠️</span> Status Database: Belum Terhubung
        </h3>
        <p className="text-sm text-gray-300">
          Silakan hubungkan proyek ke database (Supabase / Vercel Postgres) terlebih dahulu dan berikan URL koneksi (DATABASE_URL) agar data asli bisa dimunculkan di halaman ini.
        </p>
      </div>
    </div>
  );
}
