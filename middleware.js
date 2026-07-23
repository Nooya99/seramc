import { NextResponse } from 'next/server';

export function middleware(request) {
  // Hanya proses URL yang mengarah ke /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Abaikan halaman login itu sendiri agar tidak terjadi redirect loop
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    // Jika tidak ada token, arahkan ke halaman login
    if (token !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
