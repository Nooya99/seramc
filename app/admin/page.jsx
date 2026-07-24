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
  AlertCircle,
  CheckSquare,
  Square
} from 'lucide-react';
import { ConfirmModal, Toast } from '@/components/admin/NotificationModal';

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Multi-select & Batch action state (OFF by default)
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    count: 0,
    onConfirm: null
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

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
      showToast('Gagal mengambil data pesanan', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtered list
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.user?.ign || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.whatsapp || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Click Trash Icon on row -> Activates select mode & selects this order
  const handleTrashClick = (id) => {
    if (!selectMode) {
      setSelectMode(true);
      setSelectedIds([id]);
    } else {
      toggleSelect(id);
    }
  };

  // Checkbox toggle
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      if (next.length === 0) setSelectMode(false);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
      setSelectMode(false);
    } else {
      setSelectedIds(filteredOrders.map(o => o.id));
    }
  };

  // Optimistic Status Update
  const handleUpdateStatus = async (orderId, newStatus) => {
    const previousOrders = [...orders];

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

      if (res.ok) {
        showToast('Status transaksi berhasil diperbarui!');
      } else {
        showToast('Gagal mengupdate status pesanan.', 'error');
        setOrders(previousOrders);
      }
    } catch (error) {
      showToast('Terjadi kesalahan jaringan.', 'error');
      setOrders(previousOrders);
    }
  };

  // Bulk Delete Confirmation
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    const count = selectedIds.length;
    const isSingle = count === 1;
    const singleOrder = isSingle ? orders.find(o => o.id === selectedIds[0]) : null;

    setConfirmModal({
      isOpen: true,
      title: isSingle ? 'Hapus Pesanan' : 'Hapus Pesanan Terpilih',
      message: isSingle
        ? `Apakah Anda yakin ingin menghapus pesanan dari player "${singleOrder?.user?.ign || 'Anonim'}"?`
        : `Apakah Anda yakin ingin menghapus ${count} pesanan yang dipilih secara permanen?`,
      count,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        const idsToDelete = [...selectedIds];
        const previousOrders = [...orders];

        setOrders(prev => prev.filter(o => !idsToDelete.includes(o.id)));
        if (selectedOrder && idsToDelete.includes(selectedOrder.id)) setSelectedOrder(null);
        setSelectedIds([]);
        setSelectMode(false);

        try {
          const res = await fetch('/api/orders', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: idsToDelete })
          });

          if (res.ok) {
            showToast(isSingle ? 'Pesanan berhasil dihapus!' : `${count} pesanan berhasil dihapus!`);
          } else {
            showToast('Gagal menghapus beberapa pesanan.', 'error');
            setOrders(previousOrders);
          }
        } catch (err) {
          showToast('Terjadi kesalahan jaringan.', 'error');
          setOrders(previousOrders);
        } finally {
          setConfirmModal({ isOpen: false });
        }
      }
    });
  };

  const formatPrice = (price) => (price || 0).toLocaleString('id-ID');

  // Calculations
  const paidOrders = orders.filter(o => o.status === 'PAID');
  const pendingOrders = orders.filter(o => o.status === 'PENDING');

  const totalRevenue = paidOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const potentialRevenue = pendingOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const allSelected = filteredOrders.length > 0 && selectedIds.length === filteredOrders.length;

  return (
    <div className="space-y-8 pb-24 relative">
      {/* Toast & Confirmation Modal */}
      <Toast toast={toast} onClose={() => setToast(null)} />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        count={confirmModal.count}
        loading={confirmModal.loading}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false })}
      />

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
                  {selectMode && (
                    <th className="p-4 pl-6 w-12">
                      <button onClick={toggleSelectAll} className="flex items-center">
                        {allSelected ? (
                          <CheckSquare className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-600" />
                        )}
                      </button>
                    </th>
                  )}
                  <th className={`p-4 ${selectMode ? '' : 'pl-6'}`}>Tanggal & ID</th>
                  <th className="p-4">Pemain (IGN)</th>
                  <th className="p-4">Kontak WhatsApp</th>
                  <th className="p-4">Ringkasan Item</th>
                  <th className="p-4">Total Harga</th>
                  <th className="p-4">Status Transaksi</th>
                  <th className="p-4 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredOrders.map((order) => {
                  const isSelected = selectedIds.includes(order.id);
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => {
                        if (selectMode) toggleSelect(order.id);
                      }}
                      className={`hover:bg-slate-800/30 transition-colors group ${
                        selectMode ? 'cursor-pointer' : ''
                      } ${isSelected ? 'bg-cyan-950/30' : ''}`}
                    >
                      {selectMode && (
                        <td className="p-4 pl-6" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => toggleSelect(order.id)}>
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-cyan-400" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-600" />
                            )}
                          </button>
                        </td>
                      )}

                      <td className={`p-4 font-mono text-xs ${selectMode ? '' : 'pl-6'}`}>
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

                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
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

                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
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

                      <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 border border-slate-700/60 hover:border-cyan-500/30 transition-all"
                            title="Lihat Detail Pesanan"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleTrashClick(order.id)}
                            className={`p-2 rounded-xl transition-all ${
                              isSelected 
                                ? 'bg-rose-600 text-white' 
                                : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-700/60 hover:border-rose-500/30'
                            }`}
                            title="Klik untuk memilih & hapus pesanan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectMode && selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-[#0b101d]/95 border border-cyan-500/40 p-4 rounded-2xl backdrop-blur-2xl shadow-2xl shadow-cyan-500/10 flex items-center gap-4 sm:gap-6 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-sm border border-cyan-500/30">
              {selectedIds.length}
            </div>
            <span className="text-xs font-bold text-white whitespace-nowrap">Pesanan Terpilih</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleSelectAll}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 whitespace-nowrap"
            >
              {allSelected ? 'Unselect All' : 'Select All (' + filteredOrders.length + ')'}
            </button>

            <button
              onClick={() => {
                setSelectedIds([]);
                setSelectMode(false);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Batal
            </button>

            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4" />
              Hapus ({selectedIds.length}) Terpilih
            </button>
          </div>
        </div>
      )}

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
