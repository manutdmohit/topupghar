'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Wallet,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Download,
  Filter,
  Search,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Transaction {
  transactionId: string;
  userId: string;
  type: string;
  amount: number;
  balance: number;
  description: string;
  status: string;
  paymentMethod: string;
  receiptUrl: string;
  createdAt: string;
  notes?: string;
  user?: {
    email: string;
    name: string;
  };
}

export default function AdminWalletManagement() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    cancelledRequests: 0,
    failedRequests: 0,
    totalAmount: 0,
    pendingAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTransactions = async (page = 1, status = selectedStatus) => {
    if (!session?.user?.id || session?.user?.role !== 'admin') return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/wallet/pending?page=${page}&status=${status}`
      );
      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions);
        setTotalPages(data.pagination.pages);
        setCurrentPage(page);
      } else {
        throw new Error(data.error || 'Failed to fetch transactions');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!session?.user?.id || session?.user?.role !== 'admin') return;

    setIsLoadingStats(true);
    try {
      const response = await fetch('/api/admin/wallet/stats');
      const data = await response.json();

      if (response.ok) {
        setStats(data.stats);
      } else {
        throw new Error(data.error || 'Failed to fetch statistics');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch statistics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id && session?.user?.role === 'admin') {
      // Add a small delay to prevent excessive API calls
      const timer = setTimeout(() => {
        fetchTransactions(1, selectedStatus);
        fetchStats();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [session?.user?.id, session?.user?.role, selectedStatus]);

  // Memoize the fetchTransactions function to prevent infinite loops
  const memoizedFetchTransactions = useCallback(fetchTransactions, [
    session?.user?.id,
    session?.user?.role,
  ]);

  const handleAction = async (
    transaction: Transaction,
    action: 'approve' | 'reject'
  ) => {
    if (!session?.user?.id || session?.user?.role !== 'admin') return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/wallet/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transaction.transactionId,
          action,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setSelectedTransaction(null);
        setNotes('');
        // Refresh the list and statistics
        memoizedFetchTransactions(currentPage, selectedStatus);
        fetchStats();
      } else {
        throw new Error(data.error || 'Failed to process request');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process request');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Failed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {status}
          </Badge>
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

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.transactionId
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.user?.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!session?.user?.id || session?.user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Admin Access Required
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          You need administrator privileges to access the wallet management
          system
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Wallet Management</h1>
            <p className="text-blue-100 text-lg">
              Monitor and manage wallet top-up requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                memoizedFetchTransactions(1, selectedStatus);
                fetchStats();
              }}
              disabled={isLoading || isLoadingStats}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  isLoading || isLoadingStats ? 'animate-spin' : ''
                }`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {isLoadingStats ? (
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    stats.totalRequests
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">
                  Pending
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {isLoadingStats ? (
                    <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    stats.pendingRequests
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 mb-1">
                  Completed
                </p>
                <p className="text-2xl font-bold text-emerald-900">
                  {isLoadingStats ? (
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    stats.completedRequests
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              {['pending', 'completed', 'cancelled', 'all'].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="text-xs"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by ID, email, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Grid */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            Top-up Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium mb-2">
                No {selectedStatus} transactions found
              </p>
              <p className="text-sm">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTransactions.map((transaction) => (
                <Card
                  key={transaction.transactionId}
                  className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-xs font-mono text-gray-500 mb-1">
                          {transaction.transactionId}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          {formatAmount(transaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          User
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.user?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {transaction.user?.email || 'N/A'}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          Payment Method
                        </p>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {transaction.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(transaction.receiptUrl, '_blank')
                        }
                        className="text-xs h-8"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = transaction.receiptUrl;
                          link.download = `receipt-${transaction.transactionId}.jpg`;
                          link.click();
                        }}
                        className="text-xs h-8"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      {transaction.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTransaction(transaction)}
                          className="text-xs h-8 border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  memoizedFetchTransactions(currentPage - 1, selectedStatus)
                }
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  memoizedFetchTransactions(currentPage + 1, selectedStatus)
                }
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Review Top-up Request
              </h3>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Transaction ID
                  </p>
                  <p className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">
                    {selectedTransaction.transactionId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Amount
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {formatAmount(selectedTransaction.amount)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">User</p>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedTransaction.user?.name} (
                  {selectedTransaction.user?.email})
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Payment Method
                </p>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded capitalize">
                  {selectedTransaction.paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Notes (Optional)
                </p>
                <Textarea
                  placeholder="Add notes about this transaction..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleAction(selectedTransaction, 'approve')}
                disabled={isProcessing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => handleAction(selectedTransaction, 'reject')}
                disabled={isProcessing}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTransaction(null);
                  setNotes('');
                }}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
