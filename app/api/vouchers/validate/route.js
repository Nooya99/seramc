import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST validate a voucher
export async function POST(request) {
  try {
    const { code, ign } = await request.json();

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

    if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Voucher sudah kedaluwarsa (expired)' }, { status: 400 });
    }

    if (voucher.maxUses !== null && voucher.usedCount >= voucher.maxUses) {
      return NextResponse.json({ error: 'Batas penggunaan voucher telah habis' }, { status: 400 });
    }

    // Check per-user limit if enabled
    if (voucher.isOneTimePerUser && ign) {
      const pastOrder = await prisma.order.findFirst({
        where: {
          voucherCode: code,
          status: {
            not: 'CANCELLED' // Ignore cancelled orders
          },
          user: {
            ign: {
              equals: ign,
              mode: 'insensitive'
            }
          }
        }
      });

      if (pastOrder) {
        return NextResponse.json({ error: 'Anda sudah pernah menggunakan voucher ini' }, { status: 400 });
      }
    }

    return NextResponse.json({
      valid: true,
      discount: voucher.discount,
      code: voucher.code,
      applicableProductIds: voucher.applicableProductIds
    });
  } catch (error) {
    console.error('Failed to validate voucher:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat memvalidasi voucher' }, { status: 500 });
  }
}

