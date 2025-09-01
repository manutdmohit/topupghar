'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell } from 'lucide-react';

export default function WalletNotificationBadge() {
  const { data: session } = useSession();
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(
        '/api/admin/wallet/pending?status=pending&limit=1'
      );
      if (response.ok) {
        const data = await response.json();
        setPendingCount(data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch pending count:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchPendingCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [session?.user?.id]);

  if (!session?.user?.id || pendingCount === 0) return null;

  return (
    <div className="relative">
      <Bell className="w-4 h-4 text-yellow-400" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
        {pendingCount > 99 ? '99+' : pendingCount}
      </span>
    </div>
  );
}
