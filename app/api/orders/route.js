import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  const num = parseInt(priceStr.replace(/[^0-9]/g, ''));
  if (isNaN(num)) return 0;
  return priceStr.toUpperCase().includes('K') ? num * 1000 : num;
};

export async function GET() {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from('Order')
      .select('*, user:User(*), items:OrderItem(*, product:Product(*))')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase error fetching orders:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(orders || []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { ign, whatsapp, items, totalAmount, paymentMethod } = body;

    if (!ign || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();

    // 1. Find or Create User
    let { data: existingUser } = await supabaseAdmin
      .from('User')
      .select('*')
      .eq('ign', ign)
      .single();

    let userId;
    if (!existingUser) {
      const newUserObj = {
        id: crypto.randomUUID(),
        ign,
        whatsapp: whatsapp || null,
        updatedAt: nowIso
      };
      const { data: newUser, error: userErr } = await supabaseAdmin
        .from('User')
        .insert([newUserObj])
        .select()
        .single();
      
      if (userErr) throw userErr;
      userId = newUser.id;
    } else {
      userId = existingUser.id;
      if (whatsapp && existingUser.whatsapp !== whatsapp) {
        await supabaseAdmin
          .from('User')
          .update({ whatsapp, updatedAt: nowIso })
          .eq('id', userId);
      }
    }

    // 2. Create Order
    const orderObj = {
      id: crypto.randomUUID(),
      userId,
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || 'QRIS',
      status: 'PENDING',
      updatedAt: nowIso
    };

    const { data: order, error: orderErr } = await supabaseAdmin
      .from('Order')
      .insert([orderObj])
      .select()
      .single();

    if (orderErr) throw orderErr;

    // 3. Batch Process Products & Order Items
    const itemNames = items.map(i => i.name);
    const { data: existingProducts } = await supabaseAdmin
      .from('Product')
      .select('*')
      .in('name', itemNames);

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
          updatedAt: nowIso
        };
        newProductsToCreate.push(prod);
        productMap.set(item.name, prod);
      }
    }

    if (newProductsToCreate.length > 0) {
      await supabaseAdmin.from('Product').insert(newProductsToCreate);
    }

    // 4. Batch Insert Order Items
    const orderItemsData = items.map(item => ({
      id: crypto.randomUUID(),
      orderId: order.id,
      productId: productMap.get(item.name).id,
      quantity: item.quantity || 1,
      price: parsePrice(item.price),
      duration: item.duration || 'Permanen',
      updatedAt: nowIso
    }));

    if (orderItemsData.length > 0) {
      await supabaseAdmin.from('OrderItem').insert(orderItemsData);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 500 });
  }
}
