import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('Product')
      .select('*')
      .order('createdAt', { ascending: true });

    if (error) {
      console.error('Supabase error fetching products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(products || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, category, price, duration, isPopular, image } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Nama dan Harga wajib diisi' }, { status: 400 });
    }

    const newProduct = {
      id: crypto.randomUUID(),
      name,
      description: description || '',
      category: category || 'Rank',
      price: parseInt(price),
      duration: duration || 'Permanen',
      image: image || null,
      isPopular: Boolean(isPopular),
      updatedAt: new Date().toISOString()
    };

    const { data: product, error } = await supabaseAdmin
      .from('Product')
      .insert([newProduct])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating product:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs array required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('Product')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Supabase error batch deleting products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: `${ids.length} products deleted successfully` });
  } catch (error) {
    console.error('Error batch deleting products:', error);
    return NextResponse.json({ error: 'Failed to batch delete products' }, { status: 500 });
  }
}
