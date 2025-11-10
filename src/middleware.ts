import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthJWTPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// List of protected routes
const protectedRoutes = [
  '/profile',
  '/settings',
  '/orders',
  '/dashboard'
];

// Function to verify JWT token in middleware
function verifyTokenInMiddleware(token: string): AuthJWTPayload | null {
  try {
    // Get JWT secret from environment
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';

    // Verify the token
    const payload = jwt.verify(token, jwtSecret) as AuthJWTPayload;
    return payload;
  } catch (error) {
    console.error('❌ JWT verification error:', error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // TEMPORARY: Disable middleware protection for debugging
  console.log('🔍 Middleware called for:', pathname);
  
  // Let all requests through for now to test if pages work without middleware
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};