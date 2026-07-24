import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID parameter is required' }, { status: 400 });
    }

    // Ambil order berdasarkan ID (atau awalan ID jika user menggunakan ID singkat)
    const { data: orders, error: orderError } = await supabaseAdmin
      .from('Order')
      .select('*, items:OrderItem(*, product:Product(*))')
      .ilike('id', `${orderId}%`)
      .order('createdAt', { ascending: false });

    if (orderError) {
      console.error('Supabase error fetching orders for check:', orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    return NextResponse.json(orders || []);
  } catch (error) {
    console.error('API GET order check error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
