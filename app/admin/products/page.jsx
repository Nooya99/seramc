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
  Square,
  X,
  Crown,
  Key,
  Layers,
  Grid,
  CheckCircle2
} from 'lucide-react';
import { ConfirmModal, Toast } from '@/components/admin/NotificationModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Category Filter state (Default: 'ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Select / Delete Mode state (OFF by default)
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

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Rank',
    price: '',
    duration: 'Permanen',
    isPopular: false,
    image: ''
  });

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

  // Check how many default items already exist in current products list
  const existingDefaultCount = defaultShopItems.filter(d => 
    products.some(p => p.name.trim().toLowerCase() === d.name.trim().toLowerCase())
  ).length;

  const isAllDefaultGenerated = existingDefaultCount === defaultShopItems.length;

  // Click Trash Icon on Card -> Activates Select Mode & selects this product
  const handleTrashClick = (id) => {
    if (!selectMode) {
      setSelectMode(true);
      setSelectedIds([id]);
    } else {
      toggleSelect(id);
    }
  };

  // Toggle single product selection
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      if (next.length === 0) setSelectMode(false); // Auto exit select mode if all unselected
      return next;
    });
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
      setSelectMode(false);
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
        if (Array.isArray(savedProduct)) {
          setProducts(savedProduct);
        } else {
          setProducts(prev => prev.map(p => p.id === tempId || p.id === editingProduct?.id ? savedProduct : p));
        }
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

  // Bulk / Selected Delete Confirmation
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    const count = selectedIds.length;
    const isSingle = count === 1;
    const singleProduct = isSingle ? products.find(p => p.id === selectedIds[0]) : null;

    setConfirmModal({
      isOpen: true,
      title: isSingle ? 'Hapus Produk' : 'Hapus Produk Terpilih',
      message: isSingle 
        ? `Apakah Anda yakin ingin menghapus produk "${singleProduct?.name || 'ini'}"?`
        : `Apakah Anda yakin ingin menghapus ${count} produk yang dipilih secara masal?`,
      count,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        const idsToDelete = [...selectedIds];
        const previousProducts = [...products];

        setProducts(prev => prev.filter(p => !idsToDelete.includes(p.id)));
        setSelectedIds([]);
        setSelectMode(false);

        try {
          const res = await fetch('/api/products', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: idsToDelete })
          });

          if (res.ok) {
            showToast(isSingle ? 'Produk berhasil dihapus!' : `${count} produk berhasil dihapus secara bersamaan!`);
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

  // Generate All Default Shop Items (Only inserts missing items, prevents duplicates)
  const seedDefaultShopItems = async () => {
    if (isAllDefaultGenerated) {
      showToast('Seluruh 21 item default toko sudah ter-generate!', 'error');
      return;
    }

    const missingItems = defaultShopItems.filter(d => 
      !products.some(p => p.name.trim().toLowerCase() === d.name.trim().toLowerCase())
    );

    setConfirmModal({
      isOpen: true,
      title: 'Generate Default Shop Items',
      message: `Tambahkan ${missingItems.length} item default Toko SERA MC yang belum ada ke Database Supabase?`,
      count: missingItems.length,
      onConfirm: async () => {
        setConfirmModal({ isOpen: false });
        setSaving(true);

        try {
          const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(missingItems)
          });

          if (res.ok) {
            const updatedProductsList = await res.json();
            setProducts(updatedProductsList);
            showToast(`Berhasil menggenerate ${missingItems.length} item toko baru!`);
          } else {
            showToast('Gagal memproses generate item.', 'error');
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

  // Filter Categories logic
  const rankItems = products.filter(p => p.category === 'Rank');
  const keyItems = products.filter(p => p.category === 'Key / Crate');
  const otherItems = products.filter(p => p.category !== 'Rank' && p.category !== 'Key / Crate');

  const categories = [
    { id: 'ALL', label: 'Semua Katalog (ALL)', icon: <Grid className="w-4 h-4" />, count: products.length },
    { id: 'Rank', label: '👑 Rank Packages', icon: <Crown className="w-4 h-4" />, count: rankItems.length },
    { id: 'Key / Crate', label: '🔑 Key / Crate', icon: <Key className="w-4 h-4" />, count: keyItems.length },
    { id: 'Others', label: '📦 Others & Booster', icon: <Layers className="w-4 h-4" />, count: otherItems.length }
  ];

  // Helper component to render product card
  const renderProductCard = (product) => {
    const isSelected = selectedIds.includes(product.id);
    return (
      <div
        key={product.id}
        onClick={() => {
          if (selectMode) toggleSelect(product.id);
        }}
        className={`bg-[#0b101d] border rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-xl ${
          selectMode ? 'cursor-pointer' : ''
        } ${
          isSelected 
            ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-cyan-950/20' 
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        {/* Select Checkbox (Shown ONLY when selectMode === true) */}
        {selectMode && (
          <div className="absolute top-4 left-4 z-10">
            {isSelected ? (
              <CheckSquare className="w-6 h-6 text-cyan-400 fill-cyan-500/20" />
            ) : (
              <Square className="w-6 h-6 text-slate-600 group-hover:text-slate-400" />
            )}
          </div>
        )}

        {product.isPopular && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg shadow-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-slate-950" />
            POPULER
          </div>
        )}

        <div className={`space-y-3 ${selectMode ? 'pt-6' : ''}`}>
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

            {/* RED TRASH CAN ICON: Activates select mode & selects this item! */}
            <button
              onClick={() => handleTrashClick(product.id)}
              className={`p-2.5 rounded-xl transition-all ${
                isSelected 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' 
                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
              }`}
              title="Klik untuk memilih & hapus item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

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
          {/* Generate All Button (Disabled if all 21 items generated) */}
          <button
            onClick={seedDefaultShopItems}
            disabled={saving || isAllDefaultGenerated}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold border transition-colors ${
              isAllDefaultGenerated
                ? 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}
          >
            {isAllDefaultGenerated ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Shop Items Complete (21/21)
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                Generate All Shop Items ({existingDefaultCount}/21)
              </>
            )}
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

      {/* Category Selection Tabs Bar (Under Header) */}
      <div className="flex items-center gap-2 p-2 bg-[#0b101d] border border-slate-800 rounded-2xl overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-extrabold tracking-wider transition-all whitespace-nowrap ${
              categoryFilter === cat.id
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              categoryFilter === cat.id ? 'bg-slate-950 text-cyan-300' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Select All Bar with Close (X) Button on Far Right */}
      {selectMode && products.length > 0 && (
        <div className="flex items-center justify-between bg-rose-950/20 p-4 rounded-2xl border border-rose-500/30 animate-in fade-in duration-200">
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

          {/* Close X Button at far right */}
          <button
            onClick={() => {
              setSelectedIds([]);
              setSelectMode(false);
            }}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/80 transition-colors flex items-center justify-center"
            title="Batal Select / Tutup"
          >
            <X className="w-5 h-5" />
          </button>
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
      ) : categoryFilter === 'ALL' ? (
        /* Render Category Separators when ALL is selected */
        <div className="space-y-10">
          {/* RANK SECTION */}
          {rankItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <Crown className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-black text-white tracking-wide">👑 PAKET RANK SERAMC</h2>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {rankItems.length} Rank
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rankItems.map(renderProductCard)}
              </div>
            </div>
          )}

          {/* KEY SECTION */}
          {keyItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <Key className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-black text-white tracking-wide">🔑 DAFTAR KEY & CRATE</h2>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {keyItems.length} Key
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {keyItems.map(renderProductCard)}
              </div>
            </div>
          )}

          {/* OTHERS SECTION */}
          {otherItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <Layers className="w-5 h-5 text-fuchsia-400" />
                <h2 className="text-lg font-black text-white tracking-wide">📦 PAKET LAINNYA & BOOSTER</h2>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
                  {otherItems.length} Item
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherItems.map(renderProductCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Filtered Grid View for specific category */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products
            .filter(p => {
              if (categoryFilter === 'Others') return p.category !== 'Rank' && p.category !== 'Key / Crate';
              return p.category === categoryFilter;
            })
            .map(renderProductCard)}
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectMode && selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-[#0b101d]/95 border border-cyan-500/40 p-4 rounded-2xl backdrop-blur-2xl shadow-2xl shadow-cyan-500/10 flex items-center gap-4 sm:gap-6 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-sm border border-cyan-500/30">
              {selectedIds.length}
            </div>
            <span className="text-xs font-bold text-white whitespace-nowrap">Produk Terpilih</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
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
