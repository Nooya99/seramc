import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, category, price, duration, isPopular, image } = body;

    const updatePayload = {
      updatedAt: new Date().toISOString()
    };
    if (name !== undefined) updatePayload.name = name;
    if (description !== undefined) updatePayload.description = description;
    if (category !== undefined) updatePayload.category = category;
    if (price !== undefined) updatePayload.price = parseInt(price);
    if (duration !== undefined) updatePayload.duration = duration;
    if (image !== undefined) updatePayload.image = image;
    if (isPopular !== undefined) updatePayload.isPopular = Boolean(isPopular);

    const { data: updatedProduct, error } = await supabaseAdmin
      .from('Product')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating product:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const { error } = await supabaseAdmin
      .from('Product')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting product:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 });
  }
}
