import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const { data: updatedOrder, error } = await supabaseAdmin
      .from('Order')
      .update({ status, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select('*, user:User(*), items:OrderItem(*, product:Product(*))')
      .single();

    if (error) {
      console.error('Supabase error updating order:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Delete order items first, then order
    await supabaseAdmin.from('OrderItem').delete().eq('orderId', id);
    const { error } = await supabaseAdmin.from('Order').delete().eq('id', id);

    if (error) {
      console.error('Supabase error deleting order:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order', details: error.message }, { status: 500 });
  }
}
