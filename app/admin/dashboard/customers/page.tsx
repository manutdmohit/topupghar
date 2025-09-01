'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  Search,
  Eye,
  Wallet,
  Calendar,
  Mail,
  TrendingDown,
  Filter,
  MoreHorizontal,
  RefreshCw,
  CheckCircle,
  Clock,
  Package,
} from 'lucide-react';
import Link from 'next/link';

interface Customer {
  _id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: string;
  wallet?: {
    balance: number;
    totalTopups: number;
    totalSpent: number;
  };
  topupCount?: number;
  pendingTopupCount?: number;
  lastTopupDate?: string;
  orderCounts?: {
    total: number;
    completed: number;
    pending: number;
  };
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  totalWalletBalance: number;
  totalTopups: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, [currentPage, searchTerm]);

  const fetchCustomers = async () => {
    try {
      if (searchTerm) {
        setSearching(true);
      }

      const response = await fetch(
        `/api/admin/customers?page=${currentPage}&limit=12&search=${searchTerm}`
      );
      const data = await response.json();

      if (response.ok) {
        setCustomers(data.customers);
        setTotalPages(data.pagination.totalPages);
        setTotalCustomers(data.pagination.totalCustomers);
      } else {
        console.error('Failed to fetch customers:', data.error);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/customers/stats');
      const data = await response.json();

      if (response.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
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
    });
  };

  const getInitials = (name: string, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse w-1/3"></div>
          </div>

          {/* Search Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* List Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Wallet
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Top-ups
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {[...Array(8)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                          <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                          <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Customer Management
              </h1>
              <p className="text-slate-600 text-lg">
                View and manage all registered customers and their activities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSearch}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Total Customers
              </h2>
              <p className="text-slate-600">Registered users in the system</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {totalCustomers || stats?.totalCustomers || 0}
                </div>
                <div className="text-sm text-slate-500">Active accounts</div>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search customers by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSearch}
                disabled={searching}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 h-12"
              >
                {searching ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {searching ? 'Searching...' : 'Search'}
              </Button>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="px-4 h-12"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                    Wallet
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                    Top-ups
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                    Orders
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden xl:table-cell">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* Customer Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10 ring-2 ring-slate-100">
                          <AvatarImage
                            src={customer.image}
                            alt={customer.name || customer.email}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {getInitials(customer.name || '', customer.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">
                            {customer.name || 'No Name'}
                          </h3>
                          <p className="text-sm text-slate-600 truncate">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Wallet Info */}
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm">
                        <div className="font-semibold text-green-600">
                          {customer.wallet
                            ? formatAmount(customer.wallet.balance)
                            : 'NPR 0'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {customer.wallet?.totalTopups
                            ? formatAmount(customer.wallet.totalTopups)
                            : 'NPR 0'}{' '}
                          total
                        </div>
                      </div>
                    </td>

                    {/* Top-ups Info */}
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-green-600">
                            {customer.topupCount || 0}
                          </span>
                        </div>
                        {(customer.pendingTopupCount || 0) > 0 && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-3 h-4 text-amber-500" />
                            <span className="text-xs text-amber-600">
                              {customer.pendingTopupCount} pending
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Orders Info */}
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm">
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-blue-600">
                            {customer.orderCounts?.completed || 0}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {customer.orderCounts?.total || 0} total
                        </div>
                      </div>
                    </td>

                    {/* Join Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 hidden xl:table-cell">
                      {formatDate(customer.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/dashboard/customers/${customer._id}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                        </Link>
                        <Link
                          href={`/admin/dashboard/wallet?userId=${customer._id}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                          >
                            <Wallet className="w-3 h-3 mr-1" />
                            Top-ups
                          </Button>
                        </Link>
                        <Link
                          href={`/admin/dashboard/orders?userId=${customer._id}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                          >
                            <TrendingDown className="w-3 h-3 mr-1" />
                            Orders
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                Showing {(currentPage - 1) * 12 + 1} to{' '}
                {Math.min(currentPage * 12, totalCustomers)} of {totalCustomers}{' '}
                customers
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2"
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {customers.length === 0 && !loading && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchTerm ? 'No customers found' : 'No customers found'}
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {searchTerm
                ? `No customers found matching "${searchTerm}". Try adjusting your search terms or clear the search to see all customers.`
                : 'No customers have registered yet. They will appear here once they sign up.'}
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
