import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  const num = parseInt(priceStr.replace(/[^0-9]/g, ''));
  if (isNaN(num)) return 0;
  return priceStr.toUpperCase().includes('K') ? num * 1000 : num;
};

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

      const orderItemsData = [];
      for (const item of items) {
        let product = await tx.product.findFirst({
          where: { name: item.name }
        });

        if (!product) {
          product = await tx.product.create({
            data: {
              name: item.name,
              category: 'Shop Item',
              price: parsePrice(item.price),
              duration: item.duration || 'Permanen',
            }
          });
        }

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity || 1,
          price: parsePrice(item.price),
          duration: item.duration || 'Permanen'
        });
      }

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount: totalAmount,
          paymentMethod: paymentMethod || 'QRIS',
          status: 'PENDING',
          items: {
            create: orderItemsData
          }
        }
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 500 });
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
