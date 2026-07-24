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

    // Check if payload is batch insert array or object with items
    const isBatch = Array.isArray(body) || (body.items && Array.isArray(body.items));
    const itemsToInsert = isBatch ? (Array.isArray(body) ? body : body.items) : [body];

    if (itemsToInsert.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const formattedPayload = itemsToInsert.map(item => ({
      id: crypto.randomUUID(),
      name: item.name,
      description: item.description || '',
      category: item.category || 'Rank',
      price: parseInt(item.price),
      duration: item.duration || 'Permanen',
      image: item.image || null,
      isPopular: Boolean(item.isPopular),
      updatedAt: nowIso,
      createdAt: nowIso
    }));

    const { data: products, error } = await supabaseAdmin
      .from('Product')
      .insert(formattedPayload)
      .select();

    if (error) {
      console.error('Supabase error creating product(s):', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(isBatch ? products : products[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product(s):', error);
    return NextResponse.json({ error: 'Failed to create product(s)', details: error.message }, { status: 500 });
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
