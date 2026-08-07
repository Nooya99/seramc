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
import AdminChatBox from '@/components/admin/AdminChatBox';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [readChats, setReadChats] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_read_chats');
      if (saved) setReadChats(JSON.parse(saved));
    } catch(e) {}
  }, []);

  const markChatAsRead = (orderId, totalChats) => {
    setReadChats(prev => {
      const newReadChats = { ...prev, [orderId]: totalChats };
      localStorage.setItem('admin_read_chats', JSON.stringify(newReadChats));
      return newReadChats;
    });
  };

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

  // When an order is selected, or its chats update while it's selected, mark it as read
  useEffect(() => {
    if (selectedOrder) {
      const updatedOrder = orders.find(o => o.id === selectedOrder.id) || selectedOrder;
      if (updatedOrder.chats && updatedOrder.chats.length > 0) {
        const currentRead = readChats[updatedOrder.id] || 0;
        if (currentRead !== updatedOrder.chats.length) {
          markChatAsRead(updatedOrder.id, updatedOrder.chats.length);
        }
      }
    }
  }, [selectedOrder, orders, readChats]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?t=${Date.now()}`, { cache: 'no-store' });
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
    <div className="flex flex-col h-[calc(100vh-96px)] md:h-[calc(100vh-48px)] lg:h-[calc(100vh-80px)] space-y-4 sm:space-y-6 lg:space-y-8 relative">
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
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-slate-900/60 p-6 md:p-8 rounded-3xl border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden">
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
      <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
      <div className="flex-1 min-h-0 bg-[#0b101d]/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col">
        {/* Table Toolbar */}
        <div className="shrink-0 p-6 border-b border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 md:p-6">
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
            <div className="flex flex-col gap-3 w-full max-w-4xl mx-auto">
              {selectMode && (
                <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-2xl mb-2">
                  <div className="flex items-center gap-3">
                    <button onClick={toggleSelectAll} className="p-1">
                      {allSelected ? (
                        <CheckSquare className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                    <span className="text-sm font-bold text-slate-300">Pilih Semua</span>
                  </div>
                </div>
              )}
              {filteredOrders.map((order) => {
                const isSelected = selectedIds.includes(order.id);
                // Get latest chat if available
                const latestChat = order.chats && order.chats.length > 0 
                  ? [...order.chats].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] 
                  : null;

                return (
                  <div 
                    key={order.id} 
                    onClick={() => {
                      if (selectMode) {
                        toggleSelect(order.id);
                      } else {
                        setSelectedOrder(order);
                      }
                    }}
                    className={`relative flex items-center p-5 rounded-2xl cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-cyan-950/40 border border-cyan-500/50 shadow-lg shadow-cyan-900/20' 
                        : 'bg-slate-900/80 border border-slate-800/80 hover:bg-slate-800/80 hover:border-slate-700/80'
                    }`}
                  >
                    {/* Bulk Delete Checkbox */}
                    {selectMode && (
                      <div className="mr-4" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => toggleSelect(order.id)}>
                          {isSelected ? (
                            <CheckSquare className="w-6 h-6 text-cyan-400" />
                          ) : (
                            <Square className="w-6 h-6 text-slate-600" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Avatar */}
                    <img 
                      src={`https://minotar.net/helm/${order.user?.ign || 'steve'}/100.png`} 
                      alt="Avatar"
                      className="w-16 h-16 rounded-2xl border border-slate-700 object-cover mr-5 shrink-0 shadow-md"
                    />

                    {/* Content (Middle) */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-slate-100 text-lg truncate">
                          {order.user?.ign || 'Anonim'}
                        </h4>
                        {order.user?.whatsapp && (
                          <a
                            href={`https://wa.me/${order.user.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md hover:bg-emerald-500/20 transition-colors font-medium"
                            title="Hubungi WA"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </a>
                        )}
                        <span className="text-xs text-slate-500 font-medium ml-1">
                          {latestChat 
                            ? new Date(latestChat.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                            : new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
                          }
                        </span>
                      </div>
                      
                      <div className="text-sm text-slate-400 truncate max-w-full mt-1">
                        {latestChat 
                          ? (latestChat.message.startsWith('[IMAGE_BASE64]') ? '📷 Mengirim foto bukti pembayaran' : latestChat.message)
                          : <span className="italic text-slate-500">Belum ada chat.</span>}
                      </div>
                    </div>

                    {/* Right Side (Status & Notif) */}
                    <div className="flex items-center gap-4 shrink-0">


                      {/* Notification Badge */}
                      {(() => {
                        const totalChats = order.chats ? order.chats.length : 0;
                        const readCount = readChats[order.id] || 0;
                        const unreadCount = totalChats - readCount;
                        
                        if (unreadCount > 0) {
                          return (
                            <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 text-white font-bold text-lg rounded-full shadow-lg shadow-emerald-500/30">
                              {unreadCount}
                            </div>
                          );
                        }
                        return <div className="w-12 h-12 opacity-0" />;
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
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

      {/* Phone Chat Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-[450px] h-[80vh] max-h-[850px] bg-[#0b1121] rounded-3xl relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col border border-gray-800/50">


            {/* Header */}
            <div className="bg-[#1a2333] pt-10 pb-4 px-6 flex items-center justify-between border-b border-[#2a374a] shrink-0 z-10 relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={`https://minotar.net/helm/${selectedOrder.user?.ign || 'steve'}/100.png`} 
                    alt="Player" 
                    className="w-10 h-10 rounded-full border-2 border-[#2a374a] bg-[#0b1121] object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1a2333]"></div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm leading-tight">{selectedOrder.user?.ign || 'Anonim'}</h3>
                  <p className="text-[#f2e28a] text-[10px] flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none transition-all cursor-pointer ${
                    selectedOrder.status === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                      : selectedOrder.status === 'PENDING'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                  }`}
                >
                  <option value="PENDING" className="bg-slate-900 text-amber-400">PENDING</option>
                  <option value="PAID" className="bg-slate-900 text-emerald-400">PAID</option>
                  <option value="CANCELLED" className="bg-slate-900 text-rose-400">CANCELLED</option>
                </select>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white bg-[#0b1121] rounded-full transition-colors"
                  title="Tutup"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 bg-[#0b1121] relative flex flex-col min-h-0">
               <AdminChatBox order={selectedOrder} isPhoneMode={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
