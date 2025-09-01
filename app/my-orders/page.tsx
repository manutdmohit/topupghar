'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Order {
  _id: string;
  orderId: string;
  platform: string;
  type: string;
  amount?: string | number;
  quantity?: number;
  price?: number;
  finalPrice?: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  phone: string;
  paymentMethod?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Authentication check
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(window.location.href)}`
      );
      return;
    }
  }, [status, router]);

  // Fetch orders
  const fetchOrders = async (page: number = 1) => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/orders/user?page=${page}&limit=10`);

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.data.orders);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchOrders(currentPage);
    }
  }, [session?.user?.id, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200 shadow-sm';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200 shadow-sm';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      case 'pending':
      default:
        return '⏳';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return `NPR ${Math.round(price)}`;
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">My Orders</h1>
        <p className="text-gray-600">
          View and track all your orders from Topup Ghar
        </p>
      </div>

      {/* User Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-green-800">Authenticated User</p>
            <p className="text-sm text-green-600">
              Logged in as:{' '}
              {session?.user?.email || session?.user?.name || 'User'}
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't placed any orders yet. Start shopping to see your order
            history here!
          </p>
          <Button
            onClick={() => router.push('/')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-2xl hover:border-purple-300 hover:scale-[1.02] transition-all duration-300 overflow-hidden h-full"
            >
              {/* Gradient background overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-blue-50/30 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Main content */}
              <div className="relative z-10">
                {/* Header with platform icon and status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* Platform Icon */}
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <span className="text-white font-bold text-base">
                        {order.platform.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Order Title */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors duration-200">
                        {order.platform.charAt(0).toUpperCase() +
                          order.platform.slice(1)}{' '}
                        {order.type.charAt(0).toUpperCase() +
                          order.type.slice(1)}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        Order #{order.orderId}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border-2 shadow-md hover:shadow-lg transition-all duration-200 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}{' '}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Amount */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                        Amount
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {order.amount || 'N/A'}
                      {order.quantity && order.quantity > 1 && (
                        <span className="text-xs text-green-600 ml-1 font-medium">
                          × {order.quantity}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-3 border border-purple-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                        Price
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(order.finalPrice || order.price)}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                        Phone
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 font-mono">
                      {order.phone}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                        Payment
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {order.paymentMethod || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Footer with date */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <svg
                      className="w-3 h-3 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  {/* Order ID badge */}
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full px-2 py-1 border border-gray-300">
                    <span className="text-xs font-mono text-gray-700 font-semibold">
                      {order.orderId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-12">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="px-6 py-2 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </Button>

            <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-4 py-2 shadow-sm">
              <span className="text-sm font-medium text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className="px-6 py-2 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              Next
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* Order Summary */}
      {pagination && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-600">
              Showing {orders.length} of {pagination.totalOrders} orders
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
