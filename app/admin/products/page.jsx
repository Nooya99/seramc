'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  RefreshCw, 
  Sparkles,
  CheckSquare,
  Square
} from 'lucide-react';
import { ConfirmModal, Toast } from '@/components/admin/NotificationModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Selection state
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

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Rank',
    price: '',
    duration: 'Permanen',
    isPopular: false,
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      showToast('Gagal mengambil data produk', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Toggle single product selection
  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category || 'Rank',
        price: product.price,
        duration: product.duration || 'Permanen',
        isPopular: product.isPopular || false,
        image: product.image || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: 'Rank',
        price: '',
        duration: 'Permanen',
        isPopular: false,
        image: ''
      });
    }
    setShowModal(true);
  };

  // Optimistic Product Save
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('Nama dan Harga wajib diisi!', 'error');
      return;
    }

    const tempId = editingProduct ? editingProduct.id : 'temp-' + Date.now();
    const optimisticProduct = {
      id: tempId,
      name: formData.name,
      description: formData.description || '',
      category: formData.category || 'Rank',
      price: parseInt(formData.price),
      duration: formData.duration || 'Permanen',
      image: formData.image || null,
      isPopular: Boolean(formData.isPopular),
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const previousProducts = [...products];
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? optimisticProduct : p));
    } else {
      setProducts(prev => [optimisticProduct, ...prev]);
    }

    setShowModal(false);
    setSaving(true);

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const savedProduct = await res.json();
        setProducts(prev => prev.map(p => p.id === tempId || p.id === editingProduct?.id ? savedProduct : p));
        showToast(editingProduct ? 'Produk berhasil diperbarui!' : 'Produk baru berhasil ditambahkan!');
      } else {
        const errData = await res.json();
        showToast('Gagal menyimpan produk: ' + (errData.error || 'Unknown error'), 'error');
        setProducts(previousProducts);
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan.', 'error');
      setProducts(previousProducts);
    } finally {
      setSaving(false);
    }
  };

  // Single Delete Confirmation
  const handleDeleteSingle = (id, name) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Produk',
      message: `Apakah Anda yakin ingin menghapus produk "${name}"?`,
      count: 1,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        const previousProducts = [...products];
        setProducts(prev => prev.filter(p => p.id !== id));
        setSelectedIds(prev => prev.filter(i => i !== id));

        try {
          const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showToast('Produk berhasil dihapus!');
          } else {
            showToast('Gagal menghapus produk.', 'error');
            setProducts(previousProducts);
          }
        } catch (err) {
          showToast('Terjadi kesalahan jaringan.', 'error');
          setProducts(previousProducts);
        } finally {
          setConfirmModal({ isOpen: false });
        }
      }
    });
  };

  // Bulk Delete Confirmation
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    setConfirmModal({
      isOpen: true,
      title: 'Hapus Produk Terpilih',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} produk yang dipilih secara masal?`,
      count: selectedIds.length,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        const idsToDelete = [...selectedIds];
        const previousProducts = [...products];

        setProducts(prev => prev.filter(p => !idsToDelete.includes(p.id)));
        setSelectedIds([]);

        try {
          const res = await fetch('/api/products', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: idsToDelete })
          });

          if (res.ok) {
            showToast(`${idsToDelete.length} produk berhasil dihapus secara bersamaan!`);
          } else {
            showToast('Gagal menghapus beberapa produk.', 'error');
            setProducts(previousProducts);
          }
        } catch (err) {
          showToast('Terjadi kesalahan jaringan.', 'error');
          setProducts(previousProducts);
        } finally {
          setConfirmModal({ isOpen: false });
        }
      }
    });
  };

  // Generate All Default Shop Items (21 Items: Ranks, Keys, & Others) in 1 Batch Request
  const seedDefaultShopItems = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Generate All Shop Items',
      message: 'Tambahkan seluruh 21 item default Toko SERA MC (RANK, KEY, & OTHERS) sekaligus ke Database Supabase?',
      count: 21,
      onConfirm: async () => {
        setConfirmModal({ isOpen: false });
        setSaving(true);

        const defaultShopItems = [
          // RANK PACKAGES
          { name: 'LUX Rank (1 Bulan)', category: 'Rank', price: 25000, duration: '1 Bulan', description: 'Prefix [LUX] 1 Bulan, Akses fitur khusus', isPopular: false },
          { name: 'LUX Rank (Permanen)', category: 'Rank', price: 45000, duration: 'Permanen', description: 'Prefix [LUX] Permanen, Akses fitur khusus', isPopular: false },
          { name: 'VEIL Rank (1 Bulan)', category: 'Rank', price: 40000, duration: '1 Bulan', description: 'Prefix [VEIL] 1 Bulan, Kit & Perks VEIL', isPopular: false },
          { name: 'VEIL Rank (Permanen)', category: 'Rank', price: 65000, duration: 'Permanen', description: 'Prefix [VEIL] Permanen, Kit & Perks VEIL', isPopular: false },
          { name: 'RIFT Rank (1 Bulan)', category: 'Rank', price: 65000, duration: '1 Bulan', description: 'Prefix [RIFT] 1 Bulan, Multi-home & Fly', isPopular: false },
          { name: 'RIFT Rank (Permanen)', category: 'Rank', price: 90000, duration: 'Permanen', description: 'Prefix [RIFT] Permanen, Multi-home & Fly', isPopular: false },
          { name: 'CORE Rank (1 Bulan)', category: 'Rank', price: 90000, duration: '1 Bulan', description: 'Prefix [CORE] 1 Bulan, Akses Komando Ekstra', isPopular: true },
          { name: 'CORE Rank (Permanen)', category: 'Rank', price: 120000, duration: 'Permanen', description: 'Prefix [CORE] Permanen, Akses Komando Ekstra', isPopular: true },
          { name: 'ARCH Rank (1 Bulan)', category: 'Rank', price: 120000, duration: '1 Bulan', description: 'Prefix [ARCH] 1 Bulan, Kasta Elit Server', isPopular: false },
          { name: 'ARCH Rank (Permanen)', category: 'Rank', price: 160000, duration: 'Permanen', description: 'Prefix [ARCH] Permanen, Kasta Elit Server', isPopular: false },
          { name: 'CUSTOM Rank (1 Bulan)', category: 'Rank', price: 300000, duration: '1 Bulan', description: 'Custom Title 1 Bulan', isPopular: true },
          { name: 'CUSTOM Rank (Permanen)', category: 'Rank', price: 450000, duration: 'Permanen', description: 'Custom Title Permanen', isPopular: true },

          // DAFTAR HARGA KEY
          { name: 'PEASANT Key', category: 'Key / Crate', price: 13000, duration: '5 Key', description: 'Paket 5 Key Peasant Crate', isPopular: false },
          { name: 'NOBLE Key', category: 'Key / Crate', price: 20000, duration: '5 Key', description: 'Paket 5 Key Noble Crate', isPopular: false },
          { name: 'IMPERIAL Key', category: 'Key / Crate', price: 24000, duration: '5 Key', description: 'Paket 5 Key Imperial Crate', isPopular: false },
          { name: 'SERA Key', category: 'Key / Crate', price: 28000, duration: '5 Key', description: 'Paket 5 Key SERA Special Crate', isPopular: true },
          { name: 'ULTIMATE Key', category: 'Key / Crate', price: 45000, duration: '9 Key', description: 'Paket 9 Key Ultimate Crate', isPopular: true },

          // OTHERS
          { name: 'Unlimited Claim', category: 'Others', price: 35000, duration: 'Permanen', description: 'Unlimited Claim Land Permanen', isPopular: false },
          { name: 'Premium Pass', category: 'Others', price: 30000, duration: '1 Bulan', description: 'Pass Bulanan dengan Hadiah Spesial', isPopular: true },
          { name: 'Max Skills', category: 'Others', price: 300000, duration: 'Per Season', description: 'Boost Seluruh Level Skill Ke 100 Max', isPopular: false },
          { name: 'Coin Bundle', category: 'Others', price: 1000, duration: '35 Coin', description: 'Bundle 35 Coin Server', isPopular: false }
        ];

        try {
          const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(defaultShopItems)
          });

          if (res.ok) {
            const inserted = await res.json();
            setProducts(inserted);
            showToast('Seluruh 21 item toko (RANK, KEY, OTHER) berhasil di-generate!');
          } else {
            showToast('Gagal memproses batch insert.', 'error');
          }
        } catch (err) {
          showToast('Terjadi kesalahan jaringan.', 'error');
        } finally {
          setSaving(false);
        }
      }
    });
  };

  const formatPrice = (p) => (p || 0).toLocaleString('id-ID');
  const allSelected = products.length > 0 && selectedIds.length === products.length;

  return (
    <div className="space-y-8 pb-20 relative">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101d] p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-cyan-400" />
            Kelola Produk & Rank Toko
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Tambah, edit harga, atau hapus item toko (RANK, KEY, OTHERS) di toko SERA MC.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={seedDefaultShopItems}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-bold border border-amber-500/30 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Generate All Shop Items
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Tambah Produk Baru
          </button>
        </div>
      </div>

      {/* Multi-Select Toolbar */}
      {products.length > 0 && (
        <div className="flex items-center justify-between bg-[#0b101d]/90 p-4 rounded-2xl border border-slate-800">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            {allSelected ? (
              <CheckSquare className="w-5 h-5 text-cyan-400" />
            ) : (
              <Square className="w-5 h-5 text-slate-500" />
            )}
            <span>{allSelected ? 'Batal Select Semua' : 'Select All (' + products.length + ' Produk)'}</span>
          </button>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">
                <strong className="text-cyan-400 font-bold">{selectedIds.length}</strong> produk dipilih
              </span>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Hapus ({selectedIds.length}) Terpilih
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product List Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
          <p className="text-sm font-medium">Memuat katalog produk...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#0b101d] border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Belum Ada Produk Terdaftar</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Klik &quot;Generate All Shop Items&quot; untuk mengisi otomatis seluruh Ranks, Keys, dan Others ke Database Supabase.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            return (
              <div
                key={product.id}
                onClick={() => toggleSelect(product.id)}
                className={`bg-[#0b101d] border rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-xl cursor-pointer ${
                  isSelected 
                    ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-cyan-950/20' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Select Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  {isSelected ? (
                    <CheckSquare className="w-6 h-6 text-cyan-400 fill-cyan-500/20" />
                  ) : (
                    <Square className="w-6 h-6 text-slate-600 group-hover:text-slate-400" />
                  )}
                </div>

                {product.isPopular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg shadow-amber-500/20">
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                    POPULER
                  </div>
                )}

                <div className="space-y-3 pt-6">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-slate-400 border border-slate-800 inline-block">
                    {product.category || 'Rank'}
                  </span>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {product.description || 'Tidak ada deskripsi.'}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Durasi / Item: {product.duration}</p>
                    <p className="text-2xl font-black text-emerald-400 font-mono">
                      Rp {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                      title="Edit Produk"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSingle(product.id, product.name)}
                      className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                      title="Hapus Produk"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-[#0b101d]/95 border border-cyan-500/40 p-4 rounded-2xl backdrop-blur-2xl shadow-2xl shadow-cyan-500/10 flex items-center gap-6 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-sm border border-cyan-500/30">
              {selectedIds.length}
            </div>
            <span className="text-xs font-bold text-white">Produk Terpilih</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              Hapus ({selectedIds.length}) Terpilih
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Nama Produk / Rank</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Misal: VIP Rank, SERA Key, Unlimited Claim..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Harga (Rp)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="15000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Durasi / Jumlah</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Permanen / 5 Key / 1 Bulan"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Rank">Rank</option>
                  <option value="Key / Crate">Key / Crate</option>
                  <option value="Others">Others</option>
                  <option value="Race">Race</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Deskripsi Fitur</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fitur rank / keunggulan..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="isPopular" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Tandai sebagai Rekomendasi / Populer ⭐
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold rounded-xl"
                >
                  {saving ? 'Simpan Produk...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
