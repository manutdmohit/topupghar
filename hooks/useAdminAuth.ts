'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    // Check for admin user in localStorage
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role === 'admin' && user.isActive) {
          setAdminUser(user);
        } else {
          // Invalid user data, redirect to login
          localStorage.removeItem('adminUser');
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error parsing admin user:', error);
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
      }
    } else {
      // No user found, redirect to login
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    router.push('/admin/login');
  };

  return { adminUser, loading, logout };
}
