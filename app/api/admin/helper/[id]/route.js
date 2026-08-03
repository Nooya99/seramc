import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || token !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await prisma.helperApplication.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting helper application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
