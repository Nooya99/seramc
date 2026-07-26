import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    keys: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES')),
  });
}
