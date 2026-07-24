import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { ign, whatsapp } = body;

    if (!ign) {
      return NextResponse.json({ error: 'IGN (nickname) is required' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('User')
      .select('*')
      .eq('ign', ign)
      .single();

    if (existingUser) {
      // Update whatsapp if provided
      if (whatsapp && existingUser.whatsapp !== whatsapp) {
        const { data: updatedUser } = await supabaseAdmin
          .from('User')
          .update({ whatsapp, updatedAt: new Date().toISOString() })
          .eq('id', existingUser.id)
          .select()
          .single();
        return NextResponse.json(updatedUser || existingUser);
      }
      return NextResponse.json(existingUser);
    }

    // Create new user with generated UUID
    const newUser = {
      id: crypto.randomUUID(),
      ign,
      whatsapp: whatsapp || null,
      updatedAt: new Date().toISOString()
    };

    const { data: createdUser, error } = await supabaseAdmin
      .from('User')
      .insert([newUser])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    console.error('Error saving user nickname:', error);
    return NextResponse.json({ error: 'Failed to save nickname', details: error.message }, { status: 500 });
  }
}
