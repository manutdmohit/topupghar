import { getServerSession, Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

type AuthResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse };

export async function requireAdmin(): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== 'admin') {
    return {
      ok: false,
      response: NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 },
      ),
    };
  }

  return { ok: true, session };
}

export async function requireAuth(): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 },
      ),
    };
  }

  return { ok: true, session };
}
