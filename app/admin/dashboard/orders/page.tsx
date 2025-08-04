'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Check, X, Eye, RefreshCw } from 'lucide-react';

type OrderStatus = 'pending' | 'approved' | 'rejected';

interface Order {
  _id: string;
  platform: string;
  uid_email?: string;
  type: string;
  amount?: string | number;
  price?: number;
  duration?: string;
  level?: string;
  diamonds?: number | string;
  storage?: string;
  uid?: string;
  password?: string;
  phone: string;
  referredBy?: string;
  paymentMethod?: string;
  receiptUrl: string;
  tiktokLoginId?: string;
  tiktokPassword?: string;
  tiktokLoginMethod?: string;
  facebookLink?: string;
  garenaPassword?: string;
  createdAt: string;
  status: OrderStatus;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

const statusColors = {
  pending: 'bg-yellow-200 text-yellow-800',
  approved: 'bg-green-200 text-green-800',
  rejected: 'bg-red-200 text-red-800',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (statusFilter) params.append('status', statusFilter);
      if (filter) params.append('platform', filter);

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();

      if (data.orders) {
        setOrders(data.orders);
        setPagination(data.pagination);
      } else {
        setOrders([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setPagination(null);
    }
    setLoading(false);
  };

  // Handle filter changes
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleStatusFilterChange = (newStatus: OrderStatus | '') => {
    setStatusFilter(newStatus);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const refreshOrders = async () => {
    await fetchOrders();
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-700">
          Orders Management
        </h1>
        <button
          onClick={refreshOrders}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by platform..."
          className="border px-4 py-2 rounded-lg w-64"
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) =>
            handleStatusFilterChange(e.target.value as OrderStatus | '')
          }
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No orders found.</p>
          </div>
        ) : (
          orders.map((order: Order, i: number) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {order.platform} - {order.type}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.uid_email ||
                          order.uid ||
                          order.tiktokLoginId ||
                          'No ID provided'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-sm text-gray-600">{order.phone}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Amount/Details
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.amount ||
                          order.level ||
                          order.diamonds ||
                          order.duration ||
                          '-'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Price</p>
                      <p className="text-sm text-gray-600">
                        {order.price ? `NPR ${order.price}` : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">
                        Payment:{' '}
                      </span>
                      <span className="text-gray-600">
                        {order.paymentMethod || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Created:{' '}
                      </span>
                      <span className="text-gray-600">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Password:{' '}
                      </span>
                      <span className="text-gray-600">
                        {order.password ||
                          order.tiktokPassword ||
                          order.garenaPassword ||
                          '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Receipt View */}
                    {order.receiptUrl && (
                      <a
                        href={order.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Receipt"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}

                    {/* Approve Button */}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'approved')}
                        disabled={updatingStatus === order._id}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                        title="Approve Order"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}

                    {/* Reject Button */}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'rejected')}
                        disabled={updatingStatus === order._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Reject Order"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => goToPage(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 border rounded-lg ${
                    page === pagination.currentPage
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => goToPage(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Pagination Info */}
      {pagination && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{' '}
          {Math.min(
            pagination.currentPage * pagination.limit,
            pagination.totalOrders
          )}{' '}
          of {pagination.totalOrders} orders
        </div>
      )}
    </div>
  );
}
