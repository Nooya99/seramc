import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Check if column exists
    const checkQuery = await prisma.$queryRawUnsafe(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='Voucher' AND column_name='applicableProductIds';
    `);
    
    if (!checkQuery || checkQuery.length === 0) {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Voucher" ADD COLUMN "applicableProductIds" TEXT[] DEFAULT ARRAY[]::TEXT[];`);
      return NextResponse.json({ success: true, message: "Column added!" });
    }
    
    return NextResponse.json({ success: true, message: "Column already exists!" });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
