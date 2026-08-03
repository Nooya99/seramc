import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const applications = await prisma.helperApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const statusSetting = await prisma.setting.findUnique({
      where: { key: 'isHelperRegistrationOpen' }
    });

    const isOpen = statusSetting ? statusSetting.value === 'true' : false;

    return NextResponse.json({ applications, isOpen });
  } catch (error) {
    console.error('Error fetching helper applications:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
