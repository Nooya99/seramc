'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Eye, 
  Trash2, 
  MessageCircle,
  TrendingUp,
  Package,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Optimistic Status Update
  const handleUpdateStatus = async (orderId, newStatus) => {
    const previousOrders = [...orders];

    // 1. Instant Optimistic State Update (0ms)
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status: newStatus };
        if (selectedOrder && selectedOrder.id === orderId) setSelectedOrder(updated);
        return updated;
      }
      return o;
    }));

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        alert('Gagal mengupdate status pesanan.');
        setOrders(previousOrders); // Revert
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Terjadi kesalahan jaringan.');
      setOrders(previousOrders); // Revert
    }
  };

  // Optimistic Order Delete
  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesanan ini secara permanen?')) return;

    const previousOrders = [...orders];

    // 1. Instant Optimistic State Update (0ms)
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (selectedOrder?.id === orderId) setSelectedOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        alert('Gagal menghapus pesanan.');
        setOrders(previousOrders); // Revert
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Terjadi kesalahan saat menghapus.');
      setOrders(previousOrders); // Revert
    }
  };

  const formatPrice = (price) => {
    return (price || 0).toLocaleString('id-ID');
  };

  // Calculations
  const paidOrders = orders.filter(o => o.status === 'PAID');
  const pendingOrders = orders.filter(o => o.status === 'PENDING');

  const totalRevenue = paidOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const potentialRevenue = pendingOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  // Filtered list
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.user?.ign || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.whatsapp || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-slate-900/60 p-6 md:p-8 rounded-3xl border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Overview Dashboard
            </span>
            <span className="text-xs text-slate-400">Live Data Supabase DB</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Ringkasan Transaksi & Performa
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Kelola pesanan rank, race, dan statistik pendapatan server SERA MC secara real-time.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-sm border border-cyan-500/30 transition-all duration-200 shadow-lg shadow-cyan-500/5 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Revenue */}
        <div className="bg-[#0b101d]/80 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pendapatan</p>
              <h3 className="text-2xl md:text-3xl font-black text-emerald-400 mt-1">
                Rp {formatPrice(totalRevenue)}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Potential (Pending): <strong className="text-slate-200">Rp {formatPrice(potentialRevenue)}</strong></span>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-[#0b101d]/80 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pesanan</p>
              <h3 className="text-2xl md:text-3xl font-black text-white mt-1">
                {orders.length} <span className="text-sm font-normal text-slate-400">order</span>
              </h3>
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Tercatat di Database Supabase
          </p>
        </div>

        {/* Metric 3: Paid Orders */}
        <div className="bg-[#0b101d]/80 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lunas (PAID)</p>
              <h3 className="text-2xl md:text-3xl font-black text-blue-400 mt-1">
                {paidOrders.length}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${orders.length ? (paidOrders.length / orders.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Pending Action */}
        <div className="bg-[#0b101d]/80 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menunggu Konfirmasi</p>
              <h3 className="text-2xl md:text-3xl font-black text-amber-400 mt-1">
                {pendingOrders.length}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-amber-400/80 font-medium flex items-center gap-1">
            {pendingOrders.length > 0 ? (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                Perlu tindakan verifikasi payment
              </>
            ) : (
              <span className="text-slate-400">Semua pesanan terproses</span>
            )}
          </p>
        </div>
      </div>

      {/* Main Table & Filters */}
      <div className="bg-[#0b101d]/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white tracking-wide">Daftar Transaksi</h2>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredOrders.length} Result
            </span>
          </div>

          {/* Search & Filter Inputs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Player / WA / ID..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="flex items-center p-1 bg-slate-900/90 border border-slate-700/80 rounded-xl w-full sm:w-auto overflow-x-auto">
              {['ALL', 'PENDING', 'PAID', 'CANCELLED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                    statusFilter === tab
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'ALL' ? 'Semua' : tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
              <p className="text-sm font-medium">Memuat data pesanan dari Supabase Database...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-16 text-center text-slate-400 space-y-3">
              <Package className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-base font-semibold text-slate-300">Tidak ada pesanan ditemukan.</p>
              <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau filter status.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-900/60 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="p-4 pl-6">Tanggal & ID</th>
                  <th className="p-4">Pemain (IGN)</th>
                  <th className="p-4">Kontak WhatsApp</th>
                  <th className="p-4">Ringkasan Item</th>
                  <th className="p-4">Total Harga</th>
                  <th className="p-4">Status Transaksi</th>
                  <th className="p-4 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4 pl-6 font-mono text-xs">
                      <p className="text-slate-200 font-semibold">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-slate-400 text-[11px] font-normal truncate max-w-[120px]">
                        ID: #{order.id.slice(0, 8)}
                      </p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300 text-xs">
                          {(order.user?.ign || 'P')[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {order.user?.ign || 'Anonim'}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      {order.user?.whatsapp ? (
                        <a
                          href={`https://wa.me/${order.user.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg hover:bg-emerald-500/20 transition-colors font-medium"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {order.user.whatsapp}
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs">-</span>
                      )}
                    </td>

                    <td className="p-4 max-w-[220px]">
                      <div className="space-y-1">
                        {(order.items || []).slice(0, 2).map((item, idx) => (
                          <div key={idx} className="text-xs text-slate-300 flex items-center justify-between">
                            <span className="truncate max-w-[140px] font-medium">
                              {item.quantity}x {item.product?.name || 'Custom Rank'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">({item.duration})</span>
                          </div>
                        ))}
                        {(order.items || []).length > 2 && (
                          <span className="text-[11px] text-cyan-400 font-medium">
                            +{(order.items || []).length - 2} item lainnya
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-emerald-400 font-mono">
                      Rp {formatPrice(order.totalAmount)}
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none transition-all cursor-pointer ${
                          order.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : order.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                      >
                        <option value="PENDING" className="bg-slate-900 text-amber-400">PENDING</option>
                        <option value="PAID" className="bg-slate-900 text-emerald-400">PAID</option>
                        <option value="CANCELLED" className="bg-slate-900 text-rose-400">CANCELLED</option>
                      </select>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 border border-slate-700/60 hover:border-cyan-500/30 transition-all"
                          title="Lihat Detail Pesanan"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-700/60 hover:border-rose-500/30 transition-all"
                          title="Hapus Pesanan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Detail Pesanan */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Detail Pesanan #{selectedOrder.id.slice(0, 8)}</h3>
                <p className="text-xs text-slate-400">
                  {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 border border-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Player IGN:</span>
                <span className="font-bold text-cyan-300">{selectedOrder.user?.ign}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">WhatsApp:</span>
                <span className="font-medium text-white">{selectedOrder.user?.whatsapp || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Metode Pembayaran:</span>
                <span className="font-bold text-slate-200">{selectedOrder.paymentMethod || 'QRIS'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400">Status Pembayaran:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedOrder.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  selectedOrder.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Item Dipesan</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-sm">
                    <div>
                      <p className="font-bold text-white">{item.quantity}x {item.product?.name || 'Item Store'}</p>
                      <p className="text-xs text-slate-400">Durasi: {item.duration}</p>
                    </div>
                    <p className="font-mono font-bold text-emerald-400">
                      Rp {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <span className="text-slate-300 font-semibold">Total Pembayaran</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                Rp {formatPrice(selectedOrder.totalAmount)}
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              {selectedOrder.user?.whatsapp && (
                <a
                  href={`https://wa.me/${selectedOrder.user.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(selectedOrder.user.ign)},%20mengenai%20pesanan%20SERA%20MC%20kamu...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi WA Pemain
                </a>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-colors"
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
