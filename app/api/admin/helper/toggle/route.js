import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { isOpen } = await req.json();

    await prisma.setting.upsert({
      where: { key: 'isHelperRegistrationOpen' },
      update: { value: isOpen ? 'true' : 'false' },
      create: { key: 'isHelperRegistrationOpen', value: isOpen ? 'true' : 'false' }
    });

    return NextResponse.json({ success: true, isOpen });
  } catch (error) {
    console.error('Error toggling helper registration:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
