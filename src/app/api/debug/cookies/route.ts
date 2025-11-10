import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const allCookies = request.cookies.getAll();
  const authToken = request.cookies.get('auth-token');
  
  return NextResponse.json({
    message: 'Cookie debug endpoint',
    allCookies: allCookies.map(cookie => ({ name: cookie.name, hasValue: !!cookie.value })),
    authToken: authToken ? { hasValue: true, preview: authToken.value.substring(0, 20) + '...' } : null,
    headers: Object.fromEntries(request.headers.entries())
  });
}