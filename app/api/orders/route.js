import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  const num = parseInt(priceStr.replace(/[^0-9]/g, ''));
  if (isNaN(num)) return 0;
  return priceStr.toUpperCase().includes('K') ? num * 1000 : num;
};

const sendDiscordNotification = async (order, items, ign, whatsapp) => {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.log('Discord notification skipped: Missing Webhook URL');
      return;
    }

    const itemsList = items.map(item => `**${item.quantity || 1}x ${item.name}** (${item.duration || 'Permanen'}) - Rp ${parsePrice(item.price).toLocaleString('id-ID')}`).join('\n');
    
    const embed = {
      title: '🛒 Pesanan Baru Masuk!',
      color: 0x00FF00, // Green color
      fields: [
        { name: 'Order ID', value: `\`${order.id}\``, inline: false },
        { name: 'IGN', value: `**${ign}**`, inline: true },
        { name: 'WhatsApp', value: whatsapp || '-', inline: true },
        { name: 'Total', value: `**Rp ${order.totalAmount.toLocaleString('id-ID')}**`, inline: true },
        { name: 'Metode Pembayaran', value: order.paymentMethod, inline: true },
        { name: 'Item', value: itemsList, inline: false },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'SERAMC Store Notification'
      }
    };

    const payload = {
      embeds: [embed]
    };

    const mentionString = process.env.DISCORD_MENTION_STRING;
    if (mentionString) {
      payload.content = mentionString; // Tag roles/users
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Failed to send Discord notification:', response.status, await response.text());
    } else {
      console.log('Discord notification sent successfully');
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
};

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        },
        chats: true
      },
      orderBy: { createdAt: 'desc' },
      take: 1000
    });

    return NextResponse.json(orders || []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { ign, whatsapp, items, totalAmount, paymentMethod, voucherCode } = body;

    if (!ign || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Find or Create User
    let existingUser = await prisma.user.findUnique({
      where: { ign }
    });

    let userId;
    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          ign,
          whatsapp: whatsapp || null,
        }
      });
      userId = newUser.id;
    } else {
      userId = existingUser.id;
      if (whatsapp && existingUser.whatsapp !== whatsapp) {
        await prisma.user.update({
          where: { id: userId },
          data: { whatsapp }
        });
      }
    }

    // 2. Create Order
    const order = await prisma.order.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        totalAmount: totalAmount || 0,
        paymentMethod: paymentMethod || 'QRIS',
        status: 'PENDING',
      }
    });

    // 3. Batch Process Products & Order Items
    const itemNames = items.map(i => i.name);
    const existingProducts = await prisma.product.findMany({
      where: { name: { in: itemNames } }
    });

    const productMap = new Map((existingProducts || []).map(p => [p.name, p]));
    const newProductsToCreate = [];

    for (const item of items) {
      if (!productMap.has(item.name)) {
        const prod = {
          id: crypto.randomUUID(),
          name: item.name,
          category: 'Shop Item',
          price: parsePrice(item.price),
          duration: item.duration || 'Permanen',
        };
        newProductsToCreate.push(prod);
        productMap.set(item.name, prod);
      }
    }

    if (newProductsToCreate.length > 0) {
      await prisma.product.createMany({
        data: newProductsToCreate
      });
    }

    // 4. Batch Insert Order Items
    const orderItemsData = items.map(item => ({
      id: crypto.randomUUID(),
      orderId: order.id,
      productId: productMap.get(item.name).id,
      quantity: item.quantity || 1,
      price: parsePrice(item.price),
      duration: item.duration || 'Permanen',
    }));

    if (orderItemsData.length > 0) {
      await prisma.orderItem.createMany({
        data: orderItemsData
      });
    }

    // 5. Process Voucher if provided
    if (voucherCode) {
      const voucher = await prisma.voucher.findUnique({ where: { code: voucherCode } });
      if (voucher && voucher.isActive) {
        if (voucher.maxUses === null || voucher.usedCount < voucher.maxUses) {
          await prisma.voucher.update({
            where: { id: voucher.id },
            data: { usedCount: { increment: 1 } }
          });
        }
      }
    }

    // 6. Send Discord Notification asynchronously
    sendDiscordNotification(order, items, ign, whatsapp);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs array required' }, { status: 400 });
    }

    await prisma.orderChat.deleteMany({
      where: { orderId: { in: ids } }
    });

    await prisma.orderItem.deleteMany({
      where: { orderId: { in: ids } }
    });

    await prisma.order.deleteMany({
      where: { id: { in: ids } }
    });

    return NextResponse.json({ message: `${ids.length} orders deleted successfully` });
  } catch (error) {
    console.error('Error batch deleting orders:', error);
    return NextResponse.json({ error: 'Failed to batch delete orders' }, { status: 500 });
  }
}
