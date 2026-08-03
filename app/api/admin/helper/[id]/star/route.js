import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || token !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // get current state
    const application = await prisma.helperApplication.findUnique({
      where: { id }
    });
    
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const updatedApp = await prisma.helperApplication.update({
      where: { id },
      data: { isStarred: !application.isStarred }
    });

    return NextResponse.json({ success: true, isStarred: updatedApp.isStarred });
  } catch (error) {
    console.error('Error toggling star:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
