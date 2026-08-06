import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const statusSetting = await prisma.setting.findUnique({
      where: { key: 'isHelperRegistrationOpen' }
    });

    const isOpen = statusSetting ? statusSetting.value === 'true' : false;

    return NextResponse.json({ isOpen });
  } catch (error) {
    console.error('Error fetching helper status:', error);
    return NextResponse.json({ isOpen: false });
  }
}
