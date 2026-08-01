import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const parsePrice = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  const num = parseInt(priceStr.replace(/[^0-9]/g, ''));
  if (isNaN(num)) return 0;
  return priceStr.toUpperCase().includes('K') ? num * 1000 : num;
};

async function createTestOrder() {
  const ign = "TestUser";
  const whatsapp = "08123456789";
  const items = [{ name: 'Test Product', price: '10k', quantity: 1 }];
  const totalAmount = 10000;
  const paymentMethod = "Live Chat";

  const nowIso = new Date().toISOString();

  try {
    const { data: existingUser } = await supabaseAdmin
      .from('User')
      .select('*')
      .eq('ign', ign)
      .single();

    let userId;
    if (!existingUser) {
      const newUserObj = {
        id: crypto.randomUUID(),
        ign,
        whatsapp,
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
    }

    const orderObj = {
      id: crypto.randomUUID(),
      userId,
      totalAmount,
      paymentMethod,
      status: 'PENDING',
      updatedAt: nowIso
    };

    const { data: order, error: orderErr } = await supabaseAdmin
      .from('Order')
      .insert([orderObj])
      .select()
      .single();

    if (orderErr) throw orderErr;

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

    console.log("Order created successfully:", order.id);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

createTestOrder();
