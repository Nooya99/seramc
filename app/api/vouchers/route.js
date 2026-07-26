import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all vouchers
export async function GET() {
  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(vouchers);
  } catch (error) {
    console.error('Failed to fetch vouchers:', error);
    return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 });
  }
}

// POST create a new voucher
export async function POST(request) {
  try {
    const { code, discount, maxUses, applicableProductIds, durationDays, durationHours, durationMinutes } = await request.json();

    if (!code || !discount) {
      return NextResponse.json({ error: 'Code and discount are required' }, { status: 400 });
    }

    if (discount < 1 || discount > 100) {
      return NextResponse.json({ error: 'Discount must be between 1 and 100' }, { status: 400 });
    }

    // Check if code already exists
    const existing = await prisma.voucher.findUnique({
      where: { code }
    });

    if (existing) {
      return NextResponse.json({ error: 'Voucher code already exists' }, { status: 400 });
    }

    let expiresAt = null;
    const days = durationDays ? parseInt(durationDays) : 0;
    const hrs = durationHours ? parseInt(durationHours) : 0;
    const mins = durationMinutes ? parseInt(durationMinutes) : 0;
    
    if (days > 0 || hrs > 0 || mins > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);
      expiresAt.setHours(expiresAt.getHours() + hrs);
      expiresAt.setMinutes(expiresAt.getMinutes() + mins);
    }

    const voucher = await prisma.voucher.create({
      data: {
        code,
        discount: parseInt(discount),
        maxUses: maxUses ? parseInt(maxUses) : null,
        applicableProductIds: applicableProductIds || [],
        expiresAt
      }
    });

    return NextResponse.json(voucher);
  } catch (error) {
    console.error('Failed to create voucher:', error);
    return NextResponse.json({ error: 'Failed to create voucher: ' + error.message, stack: error.stack }, { status: 500 });
  }
}

// DELETE a voucher
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Voucher ID is required' }, { status: 400 });
    }

    await prisma.voucher.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete voucher:', error);
    return NextResponse.json({ error: 'Failed to delete voucher' }, { status: 500 });
  }
}
