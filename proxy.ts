import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    if (req.nextauth.token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/admin/login',
    },
  },
);

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin/telegram-test'],
};
