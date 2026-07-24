'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  RefreshCw, 
  Sparkles
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

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
    } fontally: {
      setLoading(false);
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
      alert('Nama dan Harga wajib diisi!');
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

    // 1. Instant Optimistic State Update
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
        // Replace temp item with real saved product
        setProducts(prev => prev.map(p => p.id === tempId || p.id === editingProduct?.id ? savedProduct : p));
      } else {
        const errData = await res.json();
        alert('Gagal menyimpan produk: ' + (errData.error || 'Unknown error'));
        setProducts(previousProducts); // Revert state on error
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
      setProducts(previousProducts); // Revert state
    } finally {
      setSaving(false);
    }
  };

  // Optimistic Delete
  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    const previousProducts = [...products];
    // 1. Instant Optimistic State Update
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('Gagal menghapus produk dari database.');
        setProducts(previousProducts); // Revert
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan saat menghapus.');
      setProducts(previousProducts); // Revert
    }
  };

  const seedDefaultRanks = async () => {
    if (!confirm('Tambahkan rank default SERA MC (VIP, MVP, MVP+, VIP LORD) ke Supabase?')) return;
    setSaving(true);
    const defaultRanks = [
      { name: 'VIP Rank', category: 'Rank', price: 15000, duration: 'Permanen', description: 'Prefix [VIP], Kit VIP, Fly di Lobby', isPopular: false },
      { name: 'MVP Rank', category: 'Rank', price: 35000, duration: 'Permanen', description: 'Prefix [MVP], Kit MVP, Fly Survival, 2 Home', isPopular: true },
      { name: 'MVP+ Rank', category: 'Rank', price: 60000, duration: 'Permanen', description: 'Prefix [MVP+], Kit MVP+, Multi Home, Access Disguise', isPopular: false },
      { name: 'VIP LORD', category: 'Rank', price: 100000, duration: 'Permanen', description: 'Rank Kasta Tertinggi! Fitur Penuh, Custom Title & Glow', isPopular: true }
    ];

    for (const item of defaultRanks) {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    }
    fetchProducts();
    setSaving(false);
  };

  const formatPrice = (p) => (p || 0).toLocaleString('id-ID');

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b101d] p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-cyan-400" />
            Kelola Produk & Rank Toko
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Tambah, edit harga, atau sesuaikan item rank yang dijual di toko SERA MC.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {products.length === 0 && (
            <button
              onClick={seedDefaultRanks}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-bold border border-amber-500/30 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate Default Ranks
            </button>
          )}

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Tambah Produk Baru
          </button>
        </div>
      </div>

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
            Klik &quot;Generate Default Ranks&quot; untuk mengisi otomatis atau tambahkan produk baru secara manual.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#0b101d] border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300 shadow-xl"
            >
              {product.isPopular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg shadow-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  POPULER
                </div>
              )}

              <div className="space-y-3">
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
                  <p className="text-[11px] text-slate-500 font-medium">Durasi: {product.duration}</p>
                  <p className="text-2xl font-black text-emerald-400 font-mono">
                    Rp {formatPrice(product.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    title="Edit Produk"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                    title="Hapus Produk"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                  placeholder="Misal: VIP Rank, Custom Race..."
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
                  <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Durasi</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Permanen / 30 Hari"
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
                  <option value="Race">Race</option>
                  <option value="Key / Crate">Key / Crate</option>
                  <option value="Lainnya">Lainnya</option>
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
