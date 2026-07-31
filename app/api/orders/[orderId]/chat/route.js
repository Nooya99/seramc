import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { orderId } = params;
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const chats = await prisma.orderChat.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { orderId } = params;
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { message, sender } = body;

    if (!message || !sender) {
      return NextResponse.json({ error: 'Message and sender are required' }, { status: 400 });
    }

    const newChat = await prisma.orderChat.create({
      data: {
        orderId,
        sender,
        message,
      }
    });

    return NextResponse.json(newChat, { status: 201 });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
