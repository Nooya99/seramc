import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token');
    if (!token || token.value !== 'authenticated') {
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
