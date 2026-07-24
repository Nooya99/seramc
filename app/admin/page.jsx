'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// Colors based on the mock image
const COLORS = {
  bg: '#11151c',
  card: '#1c212a',
  green: '#00d27a',
  red: '#e74c3c',
  textGray: '#8b9bb4',
  textWhite: '#e2e8f0'
};

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PROFIT (PAID), LOSS (CANCELLED)

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

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price || 0);

  // --- KPI CALCULATIONS ---
  const kpis = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    let monthPaid = 0;
    let monthCancelled = 0;
    let monthTotalOrders = 0;
    let monthPaidCount = 0;
    
    let todayPaid = 0;
    let todayCancelled = 0;
    let todayTotalOrders = 0;
    let todayPaidCount = 0;
    
    let allTimePaidCount = 0;
    let allTimePaid = 0;
    let allTimeCancelled = 0;

    orders.forEach(o => {
      const time = new Date(o.createdAt).getTime();
      const amount = o.totalAmount || 0;
      
      if (o.status === 'PAID') {
        allTimePaidCount++;
        allTimePaid += amount;
      } else if (o.status === 'CANCELLED') {
        allTimeCancelled += amount;
      }

      if (time >= startOfMonth) {
        monthTotalOrders++;
        if (o.status === 'PAID') {
          monthPaid += amount;
          monthPaidCount++;
        } else if (o.status === 'CANCELLED') {
          monthCancelled += amount;
        }
      }

      if (time >= startOfDay) {
        todayTotalOrders++;
        if (o.status === 'PAID') {
          todayPaid += amount;
          todayPaidCount++;
        } else if (o.status === 'CANCELLED') {
          todayCancelled += amount;
        }
      }
    });

    return {
      monthNetProfit: monthPaid,
      monthWinRate: monthTotalOrders ? ((monthPaidCount / monthTotalOrders) * 100).toFixed(1) : 0,
      todayProfit: todayPaid - todayCancelled,
      todayTotalEntries: todayTotalOrders,
      todayWinRate: todayTotalOrders ? ((todayPaidCount / todayTotalOrders) * 100).toFixed(1) : 0,
      allTimeWinRate: orders.length ? ((allTimePaidCount / orders.length) * 100).toFixed(1) : 0,
      allTimePaid,
      allTimeCancelled
    };
  }, [orders]);

  // --- CHART DATA (DAILY PROFIT VS LOSS) ---
  const chartData = useMemo(() => {
    const days = 15;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      const start = d.getTime();
      const end = start + 86400000;
      
      let profit = 0;
      let loss = 0;
      
      orders.forEach(o => {
        const time = new Date(o.createdAt).getTime();
        if (time >= start && time < end) {
          if (o.status === 'PAID') profit += (o.totalAmount || 0);
          if (o.status === 'CANCELLED') loss += (o.totalAmount || 0);
        }
      });
      
      data.push({
        name: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        Profit: profit,
        Loss: loss,
        dateObj: d,
        isWin: profit >= loss
      });
    }
    return data;
  }, [orders]);

  // --- CALENDAR HEATMAP DATA ---
  const calendarDays = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Get number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    let firstDayIndex = new Date(year, month, 1).getDay();
    // In our UI, grid starts with S M T W T F S, so 0 is Sunday.
    
    const days = [];
    
    // Fill leading empty days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    
    // Fill actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const startOfDay = new Date(year, month, i).getTime();
      const endOfDay = startOfDay + 86400000;
      
      let paidCount = 0;
      let totalCount = 0;
      
      orders.forEach(o => {
        const time = new Date(o.createdAt).getTime();
        if (time >= startOfDay && time < endOfDay) {
          totalCount++;
          if (o.status === 'PAID') paidCount++;
        }
      });
      
      const successRate = totalCount ? Math.round((paidCount / totalCount) * 100) : null;
      days.push({ day: i, successRate });
    }
    
    return days;
  }, [orders]);

  // --- FILTERED ORDERS FOR HISTORY ---
  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'PROFIT' && o.status !== 'PAID') return false;
    if (statusFilter === 'LOSS' && o.status !== 'CANCELLED') return false;
    return true;
  });

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center text-white" style={{ backgroundColor: COLORS.bg }}>Loading...</div>;
  }

  return (
    <div className="min-h-screen text-slate-200 p-4 md:p-6 lg:p-8 font-sans" style={{ backgroundColor: COLORS.bg }}>
      
      {/* 1. TOP KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        
        {/* MONTHLY NET PROFIT */}
        <div className="rounded-xl p-5 border border-white/5" style={{ backgroundColor: COLORS.card }}>
          <h3 className="text-[10px] font-bold text-slate-400 tracking-wider mb-2">MONTHLY REVENUE</h3>
          <p className="text-2xl font-black mb-1 truncate" style={{ color: COLORS.green }}>
            {formatPrice(kpis.monthNetProfit)}
          </p>
        </div>

        {/* MONTHLY WIN RATE */}
        <div className="rounded-xl p-5 border border-white/5" style={{ backgroundColor: COLORS.card }}>
          <h3 className="text-[10px] font-bold text-slate-400 tracking-wider mb-2">MONTHLY SUCCESS RATE</h3>
          <p className="text-2xl font-black mb-1 text-blue-400">
            {kpis.monthWinRate}%
          </p>
        </div>

        {/* TODAY'S PROFIT */}
        <div className="rounded-xl p-5 border border-white/5" style={{ backgroundColor: COLORS.card }}>
          <h3 className="text-[10px] font-bold text-slate-400 tracking-wider mb-2">TODAY'S REVENUE</h3>
          <p className="text-2xl font-black mb-1 truncate" style={{ color: kpis.todayProfit >= 0 ? COLORS.green : COLORS.red }}>
            {formatPrice(kpis.todayProfit)}
          </p>
        </div>

        {/* TODAY'S TOTAL ENTRIES */}
        <div className="rounded-xl p-5 border border-white/5" style={{ backgroundColor: COLORS.card }}>
          <h3 className="text-[10px] font-bold text-slate-400 tracking-wider mb-2">TODAY'S TOTAL ORDERS</h3>
          <p className="text-2xl font-black mb-1 text-blue-400">
            {kpis.todayTotalEntries}
          </p>
        </div>

        {/* TODAY'S WIN RATE */}
        <div className="rounded-xl p-5 border border-white/5" style={{ backgroundColor: COLORS.card }}>
          <h3 className="text-[10px] font-bold text-slate-400 tracking-wider mb-2">TODAY'S SUCCESS RATE</h3>
          <p className="text-2xl font-black mb-1 text-blue-400">
            {kpis.todayWinRate}%
          </p>
        </div>

        {/* ALL TIME WIN RATE */}
        <div className="rounded-xl p-5 border border-white/5" style={{ backgroundColor: COLORS.card }}>
          <h3 className="text-[10px] font-bold text-slate-400 tracking-wider mb-2">ALL TIME SUCCESS RATE</h3>
          <p className="text-2xl font-black mb-1 text-blue-400">
            {kpis.allTimeWinRate}%
          </p>
          <p className="text-[10px] mt-2 truncate" style={{ color: COLORS.green }}>+ {formatPrice(kpis.allTimePaid)}</p>
          <p className="text-[10px] truncate" style={{ color: COLORS.red }}>- {formatPrice(kpis.allTimeCancelled)}</p>
        </div>
      </div>

      {/* 2. MIDDLE SECTION (CHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* LINE CHART */}
        <div className="lg:col-span-6 xl:col-span-7 rounded-xl p-5 border border-white/5 flex flex-col" style={{ backgroundColor: COLORS.card, minHeight: '350px' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-white tracking-wider">DAILY REVENUE VS CANCELLED</h3>
            <div className="flex gap-2 bg-black/20 p-1 rounded-full border border-white/5">
              <button className="px-4 py-1 text-[10px] font-bold rounded-full bg-slate-700 text-white">DAILY</button>
              <button className="px-4 py-1 text-[10px] font-bold rounded-full text-slate-400 hover:text-white">MONTHLY</button>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[250px]">
            {orders.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 0, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a313e" vertical={false} />
                  <XAxis dataKey="name" stroke="#4a5568" tick={{fontSize: 10}} tickMargin={10} axisLine={false} />
                  <YAxis stroke="#4a5568" tick={{fontSize: 10}} axisLine={false} tickFormatter={(val) => (val/1000) + 'k'} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: COLORS.bg, border: '1px solid #2a313e', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ fontSize: '10px', color: '#8b9bb4', marginBottom: '4px' }}
                  />
                  <Line type="monotone" dataKey="Profit" stroke={COLORS.green} strokeWidth={2} dot={{ r: 3, fill: COLORS.bg, strokeWidth: 2 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Loss" stroke={COLORS.red} strokeWidth={2} dot={{ r: 3, fill: COLORS.bg, strokeWidth: 2 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* CALENDAR HEATMAP */}
        <div className="lg:col-span-3 xl:col-span-3 rounded-xl p-5 border border-white/5" style={{ backgroundColor: COLORS.card }}>
          <h3 className="text-xs font-bold text-white mb-1">Daily Success Rate</h3>
          <div className="flex gap-3 text-[10px] mb-6">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#00d27a]"></span> Win</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#e74c3c]"></span> Loss</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <button className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs">&lt;</button>
            <span className="text-xs font-bold text-white">
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs">&gt;</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-500 mb-2">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold">
             {calendarDays.map((d, i) => {
               if (!d) return <div key={i} className="aspect-square"></div>;
               
               let bgColor = 'transparent';
               let textColor = '#8b9bb4';
               
               if (d.successRate !== null) {
                 if (d.successRate >= 50) {
                   bgColor = COLORS.green;
                   textColor = '#11151c'; // dark text on bright green
                 } else {
                   bgColor = COLORS.red;
                   textColor = '#ffffff'; // white text on red
                 }
               }
               
               return (
                 <div 
                   key={i} 
                   className="aspect-square flex flex-col items-center justify-center rounded-sm transition-colors cursor-default"
                   style={{ backgroundColor: bgColor, color: textColor }}
                 >
                   <span>{d.day}</span>
                   {d.successRate !== null && <span className="text-[6px] opacity-90">{d.successRate}%</span>}
                 </div>
               );
             })}
          </div>
        </div>

        {/* PIE CHART */}
        <div className="lg:col-span-3 xl:col-span-2 rounded-xl p-5 border border-white/5 flex flex-col items-center" style={{ backgroundColor: COLORS.card }}>
           <div className="flex gap-2 bg-black/20 p-1 rounded-full border border-white/5 w-full justify-between mb-8">
              <button className="px-3 py-1 text-[9px] font-bold rounded-full bg-slate-700 text-white flex-1">DAILY</button>
              <button className="px-3 py-1 text-[9px] font-bold rounded-full text-slate-400 hover:text-white flex-1">MONTHLY</button>
            </div>
            
            <div className="w-full aspect-square relative flex items-center justify-center mt-4">
              {kpis.allTimePaid > 0 || kpis.allTimeCancelled > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Profit', value: kpis.allTimePaid },
                        { name: 'Loss', value: kpis.allTimeCancelled }
                      ]}
                      innerRadius="65%"
                      outerRadius="90%"
                      dataKey="value"
                      stroke="none"
                    >
                      {
                        [0,1].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.green : COLORS.red} />
                        ))
                      }
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-slate-500">No Data</div>
              )}
            </div>
        </div>

      </div>

      {/* 3. ORDERS HISTORY (BOTTOM ROW) */}
      <div className="rounded-xl p-6 border border-white/5" style={{ backgroundColor: COLORS.card }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-sm font-bold text-white">Orders History</h3>
          
          <div className="flex bg-black/30 rounded-full border border-white/5 p-1 w-full md:w-auto">
            <button 
              onClick={() => setStatusFilter('ALL')}
              className={`flex-1 md:w-24 py-1.5 text-xs font-bold rounded-full transition-colors ${statusFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >ALL</button>
            <button 
              onClick={() => setStatusFilter('PROFIT')}
              className={`flex-1 md:w-24 py-1.5 text-xs font-bold rounded-full transition-colors ${statusFilter === 'PROFIT' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >PROFIT</button>
            <button 
              onClick={() => setStatusFilter('LOSS')}
              className={`flex-1 md:w-24 py-1.5 text-xs font-bold rounded-full transition-colors ${statusFilter === 'LOSS' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >LOSS</button>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <div className="bg-[#00d27a]/10 text-[#00d27a] border border-[#00d27a]/30 px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap">
               + {formatPrice(kpis.monthNetProfit)}
             </div>
             <div className="bg-[#e74c3c]/10 text-[#e74c3c] border border-[#e74c3c]/30 px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap">
               - {formatPrice(kpis.allTimeCancelled)}
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="text-slate-500 uppercase tracking-widest border-b border-white/5">
                <th className="py-4 font-bold w-12 text-center">NO.</th>
                <th className="py-4 font-bold">TIME</th>
                <th className="py-4 font-bold">IGN / ID</th>
                <th className="py-4 font-bold text-center">STATUS</th>
                <th className="py-4 font-bold text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order, i) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 text-center font-bold text-slate-400">{i + 1}</td>
                  <td className="py-4 text-slate-300 font-mono">
                    <span className="block">{new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-[10px] text-slate-500">{new Date(order.createdAt).toLocaleDateString('id-ID', { month: 'short', day: '2-digit' })}</span>
                  </td>
                  <td className="py-4 text-slate-300 font-mono">
                    <span className="block text-white font-bold">{order.user?.ign || 'Anonim'}</span>
                    <span className="text-[10px] text-slate-500">{order.id.split('-')[0].toUpperCase()}</span>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`inline-block px-4 py-1 rounded-full border text-[10px] font-bold uppercase ${
                      order.status === 'PAID' ? 'bg-[#00d27a]/10 text-[#00d27a] border-[#00d27a]/30' :
                      order.status === 'CANCELLED' ? 'bg-[#e74c3c]/10 text-[#e74c3c] border-[#e74c3c]/30' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/30'
                    }`}>
                      {order.status === 'PAID' ? 'PROFIT' : order.status === 'CANCELLED' ? 'LOSS' : order.status}
                    </span>
                  </td>
                  <td className={`py-4 text-right font-bold font-mono ${order.status === 'PAID' ? 'text-[#00d27a]' : order.status === 'CANCELLED' ? 'text-[#e74c3c]' : 'text-slate-400'}`}>
                    {order.status === 'PAID' ? '+' : order.status === 'CANCELLED' ? '-' : ''} {formatPrice(order.totalAmount)}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">No data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
