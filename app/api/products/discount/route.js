import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// PUT: Update discount for all products
export async function PUT(request) {
  try {
    const { discount, target = 'ALL', category, productIds = [] } = await request.json();

    if (typeof discount !== 'number' || discount < 0 || discount > 100) {
      return NextResponse.json({ error: 'Discount must be a number between 0 and 100' }, { status: 400 });
    }

    let query = supabaseAdmin.from('Product').update({ discount });

    if (target === 'SELECTED') {
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return NextResponse.json({ error: 'No products selected' }, { status: 400 });
      }
      query = query.in('id', productIds);
    } else if (target === 'CATEGORY') {
      if (!category) {
        return NextResponse.json({ error: 'Category is required' }, { status: 400 });
      }
      query = query.eq('category', category);
    } else {
      // ALL
      query = query.neq('id', '0');
    }

    const { error } = await query;

    if (error) {
      console.error('Supabase bulk update discount error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, discount });
  } catch (error) {
    console.error('API PUT bulk discount error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
