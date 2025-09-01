'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}

export function useAdminAuth() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      // User is authenticated as admin via NextAuth
      const user: AdminUser = {
        id: session.user.id,
        email: session.user.email || '',
        role: session.user.role,
        isActive: true,
      };

      // Store in localStorage for consistency with existing admin system
      localStorage.setItem('adminUser', JSON.stringify(user));
      setAdminUser(user);
      setLoading(false);
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      // User is authenticated but not admin
      localStorage.removeItem('adminUser');
      setAdminUser(null);
      setLoading(false);
      router.push('/admin/login');
    } else if (status === 'unauthenticated') {
      // User is not authenticated
      localStorage.removeItem('adminUser');
      setAdminUser(null);
      setLoading(false);
      router.push('/admin/login');
    }
  }, [session, status, router]);

  const logout = async () => {
    // Clear local state and localStorage
    localStorage.removeItem('adminUser');
    setAdminUser(null);

    // Sign out from NextAuth with redirect to admin login
    await signOut({
      callbackUrl: '/admin/login',
    });
  };

  return { adminUser, loading, logout };
}
