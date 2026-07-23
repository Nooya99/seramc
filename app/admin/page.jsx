'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('sera_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    }
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
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'seramc123') {
      localStorage.setItem('sera_admin_auth', 'true');
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      alert('Password salah!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sera_admin_auth');
    setIsAuthenticated(false);
    setOrders([]);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('id-ID');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl max-w-sm w-full">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f2e28a]"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#f2e28a] hover:bg-[#e6d680] text-gray-900 font-bold py-3 rounded-xl transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter(o => o.status === 'PAID' || o.status === 'PENDING') // Assuming PENDING are expected revenue or you can change to only PAID
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Selamat Datang, Admin</h1>
          <p className="text-gray-400">Ini adalah panel kontrol utama untuk mengelola pesanan SERA MC.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-bold hover:bg-red-500/30 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Pendapatan</h3>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            Rp {formatPrice(totalRevenue)}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Pesanan</h3>
          <p className="text-3xl font-bold text-white">{orders.length}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Daftar Pesanan</h2>
          <button 
            onClick={fetchOrders}
            className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-500/30 transition-colors"
          >
            Refresh
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading data...</div>
          ) : orders.length === 0 ? (
            <div className="p-10 text-center text-gray-400">Belum ada pesanan.</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-black/20 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Tanggal</th>
                  <th className="p-4 font-medium">Player (IGN)</th>
                  <th className="p-4 font-medium">WhatsApp</th>
                  <th className="p-4 font-medium">Pesanan</th>
                  <th className="p-4 font-medium">Total Harga</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-gray-300">
                      {new Date(order.createdAt).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {order.user?.ign}
                    </td>
                    <td className="p-4 text-gray-300">
                      {order.user?.whatsapp}
                    </td>
                    <td className="p-4">
                      <ul className="text-sm text-gray-300 list-disc list-inside">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.quantity}x {item.product?.name || 'Custom Item'} <span className="text-gray-500">({item.duration})</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 font-bold text-[#f2e28a]">
                      Rp {formatPrice(order.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' :
                        order.status === 'PENDING' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
