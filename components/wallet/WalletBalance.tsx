'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';

interface WalletData {
  balance: number;
  totalTopups: number;
  totalSpent: number;
  lastTransactionDate?: string;
}

interface Transaction {
  transactionId: string;
  type: 'topup' | 'payment' | 'refund' | 'admin_adjustment';
  amount: number;
  balance: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod?: string;
  createdAt: string;
  orderId?: string;
}

export default function WalletBalance() {
  const { data: session } = useSession();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWalletData = async (page = 1) => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/wallet/balance?page=${page}&limit=10`);
      const data = await response.json();

      if (response.ok) {
        setWalletData(data.wallet);
        setTransactions(data.transactions);
        setTotalPages(data.pagination.pages);
        setCurrentPage(page);
      } else {
        throw new Error(data.error || 'Failed to fetch wallet data');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchWalletData();
    }
  }, [session?.user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 text-xs">Failed</Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-gray-100 text-gray-800 text-xs">Cancelled</Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 text-xs">{status}</Badge>
        );
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!session?.user?.id) {
    return (
      <div className="text-center py-8">
        <Wallet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Login Required
        </h3>
        <p className="text-gray-500">Please login to view your wallet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Wallet Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {walletData ? formatAmount(walletData.balance) : 'NPR 0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Topups</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {walletData ? formatAmount(walletData.totalTopups) : 'NPR 0'}
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {walletData ? formatAmount(walletData.totalSpent) : 'NPR 0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">
              Transaction History
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchWalletData(1)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wallet className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No transactions found</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.transactionId}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <div className="flex items-start gap-3 mb-3">
                      {getStatusIcon(transaction.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {transaction.transactionId}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {transaction.type === 'refund' && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            💰 Refund
                          </Badge>
                        )}
                        {transaction.paymentMethod && (
                          <Badge variant="outline" className="text-xs">
                            {transaction.paymentMethod}
                          </Badge>
                        )}
                        {getStatusBadge(transaction.status)}
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-semibold text-sm ${
                            transaction.amount > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.amount > 0 ? '+' : ''}
                          {formatAmount(Math.abs(transaction.amount))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Balance: {formatAmount(transaction.balance)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">
                            {transaction.transactionId}
                          </span>
                          {transaction.type === 'refund' && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              💰 Refund
                            </Badge>
                          )}
                          {transaction.paymentMethod && (
                            <Badge variant="outline" className="text-xs">
                              {transaction.paymentMethod}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${
                            transaction.amount > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.amount > 0 ? '+' : ''}
                          {formatAmount(Math.abs(transaction.amount))}
                        </span>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Balance: {formatAmount(transaction.balance)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchWalletData(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchWalletData(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
