import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(req) {
  try {
    const { ign, message, edition } = await req.json();

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        ign: ign || null,
        edition: edition || 'java',
        message: message.trim(),
      },
    });

    revalidatePath('/admin/feedback');

    return NextResponse.json({ success: true, feedback }, { status: 201 });
  } catch (error) {
    console.error('Feedback creation error:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
