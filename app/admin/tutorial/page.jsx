'use client';

import React, { useState } from 'react';
import { BookOpen, ShieldCheck, ShoppingCart, Tag, Ticket, Users, MessageSquare } from 'lucide-react';

export default function AdminTutorialPage() {
  const [activeSection, setActiveSection] = useState('intro');

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
          <h3 className="text-lg font-bold text-cyan-400">Sistem Login Admin</h3>
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
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-slate-900/60 p-6 md:p-8 rounded-3xl border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Dokumentasi Resmi
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            Tutorial & Panduan Admin
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Halaman ini berisi panduan lengkap tentang fitur-fitur yang ada di admin panel SERA MC. Baca panduan di bawah ini untuk memahami cara mengelola server secara efektif.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-72 flex flex-col gap-2 shrink-0">
          {sections.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/5' 
                    : 'bg-[#0b101d] text-slate-400 border border-slate-800 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                {section.title}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#0b101d] border border-slate-800 rounded-2xl p-6 md:p-8 min-h-[500px]">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
            {sections.find(s => s.id === activeSection)?.title}
          </h2>
          <div className="prose prose-invert prose-cyan max-w-none text-base leading-relaxed">
            {sections.find(s => s.id === activeSection)?.content}
          </div>
        </div>
      </div>
    </div>
  );
}
