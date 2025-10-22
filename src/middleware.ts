// middleware.ts (place in root directory)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
);

interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

export async function middleware(request: NextRequest) {
    // Get token from cookies or authorization header
    const token = request.cookies.get('authToken')?.value;

    const { pathname } = request.nextUrl;

    // Protected routes that require ADMIN role
    const adminOnlyRoutes = ['/create', '/post'];
    const isAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));

    // If not an admin route, allow access
    if (!isAdminRoute) {
        return NextResponse.next();
    }

    // If no token, redirect to auth page
    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth';
        url.searchParams.set('redirect', pathname);
        url.searchParams.set('error', 'authentication_required');
        return NextResponse.redirect(url);
    }

    try {
        // Verify and decode the token using jose (Edge Runtime compatible)
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const decoded = payload as unknown as JWTPayload;

        // Check if user is trying to access admin-only routes
        if (decoded.role !== 'ADMIN') {
            // Redirect USER to home page with error message
            const url = request.nextUrl.clone();
            url.pathname = '/';
            url.searchParams.set('error', 'unauthorized');
            url.searchParams.set('message', 'Admin access required');
            return NextResponse.redirect(url);
        }

        // User is authenticated and authorized as ADMIN
        const response = NextResponse.next();

        // Add user info to headers for use in pages/API routes
        response.headers.set('x-user-id', decoded.userId);
        response.headers.set('x-user-role', decoded.role);
        response.headers.set('x-user-email', decoded.email);

        return response;
    } catch (error) {
        // Invalid or expired token, redirect to auth page
        console.error('Token verification failed:', error);
        const url = request.nextUrl.clone();
        url.pathname = '/auth';
        url.searchParams.set('redirect', pathname);
        url.searchParams.set('error', 'invalid_token');
        url.searchParams.set('message', 'Please login again');

        // Clear the invalid token
        const response = NextResponse.redirect(url);
        response.cookies.delete('authToken');

        return response;
    }
}

// Configure which routes the middleware runs on
export const config = {
    matcher: [
        '/create/:path*',
        '/post/:path*',
    ],
};