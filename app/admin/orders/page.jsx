'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  RefreshCw, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  XCircle,
  ArrowUpDown
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

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
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === id ? updated : o));
      }
    } catch (err) {
      alert('Gagal mengupdate status pesanan.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus pesanan ini?')) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== id));
      }
    } catch (err) {
      alert('Gagal menghapus pesanan.');
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch = 
      (o.user?.ign || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.whatsapp || '').toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101d] p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-cyan-400" />
            Kelola Daftar Pesanan
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pantau dan proses semua transaksi pembayaran pemain SERA MC.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0b101d] p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari IGN / Nomor WhatsApp..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PENDING', 'PAID', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid/Table */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="p-4 pl-6">IGN Player</th>
                <th className="p-4">WhatsApp</th>
                <th className="p-4">Pesanan Item</th>
                <th className="p-4">Total</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">Loading pesanan...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">Belum ada data pesanan.</td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 pl-6 font-bold text-white">
                      {order.user?.ign || 'Unknown'}
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      {order.user?.whatsapp || '-'}
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      {order.items.map((i, idx) => (
                        <div key={idx}>{i.quantity}x {i.product?.name || 'Item'} ({i.duration})</div>
                      ))}
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      Rp {(order.totalAmount || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border ${
                          order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <option value="PENDING" className="bg-slate-900">PENDING</option>
                        <option value="PAID" className="bg-slate-900">PAID</option>
                        <option value="CANCELLED" className="bg-slate-900">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
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
    </div>
  );
}
