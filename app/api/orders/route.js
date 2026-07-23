import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { ign, whatsapp, items, totalAmount, paymentMethod } = body;

    if (!ign || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare order transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create or find user
      const user = await tx.user.upsert({
        where: { ign },
        update: { whatsapp: whatsapp || null },
        create: { ign, whatsapp: whatsapp || null }
      });

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount: totalAmount,
          paymentMethod: paymentMethod || 'QRIS',
          status: 'PENDING',
          items: {
            create: items.map(item => ({
              productId: item.productId || item.id,
              quantity: item.quantity,
              price: item.price,
              duration: item.duration || 'Permanen'
            }))
          }
        }
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
