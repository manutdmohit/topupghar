import { NextRequest, NextResponse } from 'next/server';
import { verifyOrderToken } from '@/lib/session-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Verify the token on the server-side
    const sessionData = verifyOrderToken(token);

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sessionData,
      message: 'Token verified successfully',
    });
  } catch (error) {
    console.error('Error verifying order session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
