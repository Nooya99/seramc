import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

// GET: Fetch all products from Supabase
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('Product')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase GET products error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API GET products error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add new product(s) - Supports single object or array batch insert without duplicates
export async function POST(request) {
  try {
    const body = await request.json();

    // Fetch existing product names to prevent duplicates
    const { data: existingData } = await supabaseAdmin.from('Product').select('name');
    const existingNames = new Set((existingData || []).map(p => p.name.trim().toLowerCase()));

    // Batch Array Insert
    if (Array.isArray(body)) {
      const newItems = body.filter(item => item.name && !existingNames.has(item.name.trim().toLowerCase()));

      if (newItems.length === 0) {
        // Return existing list if all items already generated
        const { data: currentProducts } = await supabaseAdmin
          .from('Product')
          .select('*')
          .order('createdAt', { ascending: false });
        return NextResponse.json(currentProducts || []);
      }

      const formattedPayload = newItems.map(item => ({
        id: crypto.randomUUID(),
        name: item.name.trim(),
        category: item.category || 'Rank',
        price: parseInt(item.price) || 0,
        duration: item.duration || 'Permanen',
        description: item.description || null,
        image: item.image || null,
        isPopular: Boolean(item.isPopular),
        updatedAt: new Date().toISOString()
      }));

      const { error: insertError } = await supabaseAdmin
        .from('Product')
        .insert(formattedPayload);

      if (insertError) {
        console.error('Supabase batch insert error:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      const { data: updatedProducts } = await supabaseAdmin
        .from('Product')
        .select('*')
        .order('createdAt', { ascending: false });

      return NextResponse.json(updatedProducts || []);
    }

    // Single Product Insert
    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Nama dan Harga wajib diisi' }, { status: 400 });
    }

    if (existingNames.has(body.name.trim().toLowerCase())) {
      return NextResponse.json({ error: `Produk dengan nama "${body.name}" sudah ada!` }, { status: 400 });
    }

    const payload = {
      id: crypto.randomUUID(),
      name: body.name.trim(),
      category: body.category || 'Rank',
      price: parseInt(body.price) || 0,
      duration: body.duration || 'Permanen',
      description: body.description || null,
      image: body.image || null,
      isPopular: Boolean(body.isPopular),
      updatedAt: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('Product')
      .insert([payload])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase POST product error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API POST product error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Batch delete products by IDs
export async function DELETE(request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs array is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('Product')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Supabase DELETE products error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error) {
    console.error('API DELETE products error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
