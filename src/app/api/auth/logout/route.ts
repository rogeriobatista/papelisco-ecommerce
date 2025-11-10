import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      
      // Verify and decode token
      const payload = verifyToken(token);
      
      if (payload) {
        // Delete session from database
        await prisma.session.deleteMany({
          where: {
            sessionToken: token,
            userId: payload.userId,
          }
        });
      }
    }

    // Return success response (client will remove token from localStorage)
    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}