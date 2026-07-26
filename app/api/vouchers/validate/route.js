import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST validate a voucher
export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Kode voucher harus diisi' }, { status: 400 });
    }

    const voucher = await prisma.voucher.findUnique({
      where: { code }
    });

    if (!voucher) {
      return NextResponse.json({ error: 'Voucher tidak ditemukan' }, { status: 404 });
    }

    if (!voucher.isActive) {
      return NextResponse.json({ error: 'Voucher sudah tidak aktif' }, { status: 400 });
    }

    if (voucher.maxUses !== null && voucher.usedCount >= voucher.maxUses) {
      return NextResponse.json({ error: 'Batas penggunaan voucher telah habis' }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      discount: voucher.discount,
      code: voucher.code
    });
  } catch (error) {
    console.error('Failed to validate voucher:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat memvalidasi voucher' }, { status: 500 });
  }
}
