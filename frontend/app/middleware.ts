// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    
    if (pathname === '/page/login') {
        if (token) {
          
            return NextResponse.redirect(new URL('/page/dashboard', request.url));
        }
        return NextResponse.next();
    }

   
    if (pathname.startsWith('/page')) {
        if (!token) {
     
            return NextResponse.redirect(new URL('/page/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/page/:path*'],
};