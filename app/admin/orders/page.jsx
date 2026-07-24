'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  RefreshCw, 
  Search, 
  Trash2, 
  CheckSquare,
  Square
} from 'lucide-react';
import { ConfirmModal, Toast } from '@/components/admin/NotificationModal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  // Select / Delete Mode state (OFF by default)
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal & Toast states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    count: 0,
    onConfirm: null
  });
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
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      showToast('Gagal memuat daftar pesanan', 'error');
    } finally {
      setLoading(false);
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

  // Click Trash Icon on row -> Activates select mode & selects this order
  const handleTrashClick = (id) => {
    if (!selectMode) {
      setSelectMode(true);
      setSelectedIds([id]);
    } else {
      toggleSelect(id);
    }
  };

  // Toggle single selection
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      if (next.length === 0) setSelectMode(false);
      return next;
    });
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
      setSelectMode(false);
    } else {
      setSelectedIds(filtered.map(o => o.id));
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    const previousOrders = [...orders];
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast('Status pesanan berhasil diperbarui!');
      } else {
        showToast('Gagal mengupdate status pesanan.', 'error');
        setOrders(previousOrders);
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan.', 'error');
      setOrders(previousOrders);
    } finally {
      setUpdatingId(null);
    }
  };

  // Bulk / Selected Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    const count = selectedIds.length;
    const isSingle = count === 1;
    const singleOrder = isSingle ? orders.find(o => o.id === selectedIds[0]) : null;

    setConfirmModal({
      isOpen: true,
      title: isSingle ? 'Hapus Pesanan' : 'Hapus Pesanan Terpilih',
      message: isSingle
        ? `Apakah Anda yakin ingin menghapus pesanan dari player "${singleOrder?.user?.ign || 'Unknown'}"?`
        : `Apakah Anda yakin ingin menghapus ${count} pesanan yang dipilih secara permanen?`,
      count,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        const idsToDelete = [...selectedIds];
        const previousOrders = [...orders];

        setOrders(prev => prev.filter(o => !idsToDelete.includes(o.id)));
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

  const allSelected = filtered.length > 0 && selectedIds.length === filtered.length;

  return (
    <div className="space-y-6 pb-24 relative">
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
                <th className={`p-4 ${selectMode ? '' : 'pl-6'}`}>IGN Player</th>
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
                  <td colSpan={selectMode ? 8 : 7} className="p-12 text-center text-slate-400">Loading pesanan...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={selectMode ? 8 : 7} className="p-12 text-center text-slate-400">Belum ada data pesanan.</td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const isSelected = selectedIds.includes(order.id);
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => {
                        if (selectMode) toggleSelect(order.id);
                      }}
                      className={`hover:bg-slate-800/40 transition-colors ${
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
                      <td className={`p-4 font-bold text-white ${selectMode ? '' : 'pl-6'}`}>
                        {order.user?.ign || 'Unknown'}
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        {order.user?.whatsapp || '-'}
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        {(order.items || []).map((i, idx) => (
                          <div key={idx}>{i.quantity}x {i.product?.name || 'Item'} ({i.duration})</div>
                        ))}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        Rp {(order.totalAmount || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
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
                      <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleTrashClick(order.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isSelected 
                              ? 'bg-rose-600 text-white' 
                              : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                          }`}
                          title="Klik untuk memilih & hapus pesanan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
              {allSelected ? 'Unselect All' : 'Select All (' + filtered.length + ')'}
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
    </div>
  );
}
