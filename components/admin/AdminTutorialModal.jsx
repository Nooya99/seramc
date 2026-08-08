'use client';

import React, { useState } from 'react';
import { X, BookOpen, ShieldCheck, ShoppingCart, Tag, Ticket, Users, MessageSquare } from 'lucide-react';

export default function AdminTutorialModal({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState('intro');

  if (!isOpen) return null;

  const sections = [
    {
      id: 'intro',
      title: 'Panduan Admin',
      icon: BookOpen,
      content: (
        <div className="space-y-4 text-slate-300">
          <p>
            Selamat datang di <strong>Pusat Bantuan Admin SERA MC</strong>. Panel admin ini adalah pusat kendali untuk mengelola seluruh ekosistem transaksi, produk, dan interaksi pemain di website.
          </p>
          <p>
            Gunakan navigasi di sebelah kiri (atau di atas pada layar kecil) untuk beralih antar panduan fitur yang tersedia.
          </p>
        </div>
      )
    },
    {
      id: 'auth',
      title: 'Keamanan & Akses',
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-slate-300">
          <h3 className="text-lg font-bold text-white text-cyan-400">Sistem Login Admin</h3>
          <p>Akses ke panel admin dilindungi oleh sistem otentikasi. Hanya admin dengan kredensial yang valid yang dapat mengakses panel ini, guna mencegah akses tidak sah ke data sensitif.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Endpoint:</strong> <code className="bg-slate-800 px-1 rounded text-cyan-300">/admin/login</code></li>
            <li>Keamanan dijaga melalui token dan <em>environment variables</em>.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'Dashboard & Pesanan',
      icon: ShoppingCart,
      content: (
        <div className="space-y-4 text-slate-300">
          <h3 className="text-lg font-bold text-cyan-400">Manajemen Transaksi Real-time</h3>
          
          <h4 className="font-semibold text-white mt-4">Ringkasan Metrik</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Total Pendapatan:</strong> Total uang dari pesanan berstatus <span className="text-emerald-400 font-bold">PAID</span>.</li>
            <li><strong>Potensi Pendapatan:</strong> Estimasi uang dari pesanan <span className="text-amber-400 font-bold">PENDING</span>.</li>
          </ul>

          <h4 className="font-semibold text-white mt-4">Kelola Pesanan</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Pencarian:</strong> Cari pesanan berdasarkan IGN, WhatsApp, atau ID Pesanan.</li>
            <li><strong>Ubah Status Instan:</strong> Klik status pesanan untuk langsung mengubahnya (Pending/Paid/Cancelled).</li>
            <li><strong>Hapus Massal:</strong> Gunakan mode seleksi (ikon tempat sampah) untuk memilih beberapa pesanan dan menghapusnya sekaligus.</li>
            <li><strong>Admin Chat Box:</strong> Klik baris pesanan untuk membuka chat dan mengirim pesan langsung ke widget pemain.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'products',
      title: 'Katalog & Diskon',
      icon: Tag,
      content: (
        <div className="space-y-4 text-slate-300">
          <h3 className="text-lg font-bold text-cyan-400">Katalog Produk & Rank</h3>
          <p>Kelola etalase barang yang dijual di halaman utama (*Shop*).</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Tambah/Edit Produk:</strong> Mengatur nama, harga (Rp), kategori (Rank/Shop Item), dan durasi.</li>
            <li><strong>Diskon Global:</strong> Gunakan tombol <strong className="text-emerald-400">Diskon Merdeka</strong> di atas daftar produk untuk menerapkan potongan harga ke semua produk secara otomatis (Flash Sale).</li>
          </ul>
        </div>
      )
    },
    {
      id: 'vouchers',
      title: 'Kupon Voucher',
      icon: Ticket,
      content: (
        <div className="space-y-4 text-slate-300">
          <h3 className="text-lg font-bold text-cyan-400">Manajemen Kupon Diskon</h3>
          <p>Fitur promosi untuk memberikan kode potongan harga.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Generate Otomatis:</strong> Buat kode random (misal: <code>SERA-XYZ</code>) dengan satu klik.</li>
            <li><strong>Batas Waktu (Timer):</strong> Atur kadaluarsa voucher berdasarkan hari, jam, atau menit.</li>
            <li><strong>Batas Kuota:</strong> Atur batas maksimum voucher dapat digunakan (misal: 50 kali pakai).</li>
            <li><strong>Fitur 1x Pakai/User:</strong> Centang opsi <em>"Batasi 1 Kali Pakai Per User"</em> agar pemain hanya bisa menggunakannya satu kali per akun (berdasarkan IGN).</li>
            <li><strong>Voucher Spesifik:</strong> Pilih produk tertentu saja yang bisa didiskon oleh voucher tersebut.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'helpers',
      title: 'Rekrutmen Helper',
      icon: Users,
      content: (
        <div className="space-y-4 text-slate-300">
          <h3 className="text-lg font-bold text-cyan-400">Pendaftaran Staf In-Game</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Buka/Tutup Pendaftaran:</strong> Ubah status perekrutan (Open/Closed) kapan saja lewat tombol toggle. Frontend pemain akan otomatis menyesuaikan.</li>
            <li><strong>Tinjau Pelamar:</strong> Baca alasan dan kelengkapan data pelamar.</li>
            <li><strong>Terima/Tolak:</strong> Proses status pelamar (Accept/Reject) langsung di dalam dashboard.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'feedback',
      title: 'Kritik & Saran',
      icon: MessageSquare,
      content: (
        <div className="space-y-4 text-slate-300">
          <h3 className="text-lg font-bold text-cyan-400">Ulasan Pemain (Player Feedback)</h3>
          <p>Kumpulkan testimoni, keluhan, dan penilaian (rating) dari pemain.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Review Bintang:</strong> Pantau rata-rata penilaian layanan toko dan server.</li>
            <li><strong>Masukan Terbuka:</strong> Baca kritik dan saran untuk meningkatkan kualitas (*Customer Satisfaction*).</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-[#070b14]/90 backdrop-blur-md z-[200] flex justify-center items-center p-4">
      <div 
        className="bg-[#121827] border border-cyan-500/30 w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl shadow-cyan-900/20 overflow-y-auto custom-scrollbar flex flex-col md:flex-row relative"
        style={{ animation: 'slideUp 0.3s ease-out forwards' }}
      >
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-[#0b101d] border-b md:border-b-0 md:border-r border-white/5 flex flex-col overflow-y-auto shrink-0">
          <div className="p-5 border-b border-white/5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Tutorial Fitur
            </h2>
          </div>
          <div className="p-3 space-y-1 flex-1">
            {sections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {section.title}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#121827]">
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-white/5 shrink-0">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {sections.find(s => s.id === activeSection)?.title}
            </h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar text-sm leading-relaxed" data-lenis-prevent>
            {sections.find(s => s.id === activeSection)?.content}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.4); }
      `}</style>
    </div>
  );
}
