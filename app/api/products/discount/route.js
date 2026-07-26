import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// PUT: Update discount for all products
export async function PUT(request) {
  try {
    const { discount } = await request.json();

    if (typeof discount !== 'number' || discount < 0 || discount > 100) {
      return NextResponse.json({ error: 'Discount must be a number between 0 and 100' }, { status: 400 });
    }

    // Since Supabase doesn't easily support update all without a filter that matches everything, 
    // we can use `.neq('id', '0')` which is always true.
    const { error } = await supabaseAdmin
      .from('Product')
      .update({ discount })
      .neq('id', '0');

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
