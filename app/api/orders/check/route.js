import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ign = searchParams.get('ign');

    if (!ign) {
      return NextResponse.json({ error: 'IGN parameter is required' }, { status: 400 });
    }

    // 1. Cari user berdasarkan IGN
    const { data: user, error: userError } = await supabaseAdmin
      .from('User')
      .select('id')
      .ilike('ign', ign)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Supabase error fetching user for order check:', userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Jika user tidak ditemukan, berarti belum ada order sama sekali
    if (!user) {
      return NextResponse.json([]);
    }

    // 2. Ambil riwayat order milik user ini beserta detail itemnya
    const { data: orders, error: orderError } = await supabaseAdmin
      .from('Order')
      .select('*, items:OrderItem(*, product:Product(*))')
      .eq('userId', user.id)
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
