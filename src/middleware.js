import { NextResponse } from 'next/server';

export async function middleware(request) {
    // Temporarily allow all requests to test
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|images/).*)',
    ],
};
