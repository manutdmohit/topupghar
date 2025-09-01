'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Wallet, Plus } from 'lucide-react';
import Link from 'next/link';

interface WalletData {
  balance: number;
  totalTopups: number;
  totalSpent: number;
}

export default function WalletBalanceDisplay() {
  const { data: session } = useSession();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWalletBalance = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/wallet/balance');
      if (response.ok) {
        const data = await response.json();
        setWalletData(data.wallet);
      }
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchWalletBalance();
    }
  }, [session?.user?.id]);

  if (!session?.user?.id) return null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex items-center gap-3 text-white">
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-purple-300" />
        <span className="text-sm font-medium">
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            formatAmount(walletData?.balance || 0)
          )}
        </span>
      </div>
      <Link
        href="/wallet?tab=topup"
        className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded-md text-xs font-medium transition-colors"
        title="Top Up Wallet"
      >
        <Plus className="w-3 h-3" />
        Top Up
      </Link>
    </div>
  );
}
