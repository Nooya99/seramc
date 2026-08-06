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

    const body = await req.json();
    const { registrationTitle, registrationInterviewText, registrationRequirements } = body;

    // Update settings in parallel
    await prisma.$transaction([
      prisma.setting.upsert({
        where: { key: 'registrationTitle' },
        update: { value: registrationTitle },
        create: { key: 'registrationTitle', value: registrationTitle }
      }),
      prisma.setting.upsert({
        where: { key: 'registrationInterviewText' },
        update: { value: registrationInterviewText },
        create: { key: 'registrationInterviewText', value: registrationInterviewText }
      }),
      prisma.setting.upsert({
        where: { key: 'registrationRequirements' },
        update: { value: registrationRequirements },
        create: { key: 'registrationRequirements', value: registrationRequirements }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating registration settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
