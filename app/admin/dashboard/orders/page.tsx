'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  X,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Phone,
  CreditCard,
  User,
  Tag,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  Download,
  Mail,
} from 'lucide-react';

type OrderStatus = 'pending' | 'approved' | 'rejected';

interface Order {
  _id: string;
  orderId: string;
  platform: string;
  uid_email?: string;
  type: string;
  amount?: string | number;
  price?: number;
  originalPrice?: number;
  discountAmount?: number;
  finalPrice?: number;
  promocode?: string;
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

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Clock,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  approved: {
    label: 'Approved',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
};

const platformColors = {
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  facebook: 'bg-gradient-to-r from-blue-500 to-blue-600',
  tiktok: 'bg-gradient-to-r from-black to-gray-800',
  freefire: 'bg-gradient-to-r from-orange-500 to-red-500',
  pubg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  default: 'bg-gradient-to-r from-gray-500 to-gray-600',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    orderId: string;
    newStatus: OrderStatus;
    orderTitle: string;
  } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, platformFilter, searchTerm]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });

      if (statusFilter) params.append('status', statusFilter);
      if (platformFilter) params.append('platform', platformFilter);
      if (searchTerm) params.append('search', searchTerm);

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

  const handleStatusUpdateClick = (
    orderId: string,
    newStatus: OrderStatus,
    orderTitle: string
  ) => {
    setPendingStatusUpdate({ orderId, newStatus, orderTitle });
    setShowConfirmModal(true);
  };

  const updateOrderStatus = async () => {
    if (!pendingStatusUpdate) return;

    const { orderId, newStatus } = pendingStatusUpdate;
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
        // Refresh orders to get updated data
        await fetchOrders();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    } finally {
      setUpdatingStatus(null);
      setShowConfirmModal(false);
      setPendingStatusUpdate(null);
    }
  };

  const cancelStatusUpdate = () => {
    setShowConfirmModal(false);
    setPendingStatusUpdate(null);
  };

  const refreshOrders = async () => {
    await fetchOrders();
  };

  const getPlatformColor = (platform: string) => {
    const key = platform.toLowerCase() as keyof typeof platformColors;
    return platformColors[key] || platformColors.default;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const approved = orders.filter((o) => o.status === 'approved').length;
    const rejected = orders.filter((o) => o.status === 'rejected').length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.finalPrice || order.price || 0),
      0
    );

    return { total, pending, approved, rejected, totalRevenue };
  };

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Orders Management
              </h1>
              <p className="text-slate-600 mt-1">
                Manage and track all customer orders
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={refreshOrders}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>

              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <div className="w-4 h-4 flex flex-col gap-0.5">
                    <div className="h-0.5 bg-current"></div>
                    <div className="h-0.5 bg-current"></div>
                    <div className="h-0.5 bg-current"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-amber-600">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Approved</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {stats.approved}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by ID, platform, or customer..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as OrderStatus | '')
              }
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Platform Filter */}
            <select
              className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
            >
              <option value="">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="freefire">Free Fire</option>
              <option value="pubg">PUBG</option>
            </select>
          </div>
        </div>

        {/* Orders Grid/List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No orders found
              </h3>
              <p className="text-slate-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold ${getPlatformColor(
                          order.platform
                        )}`}
                      >
                        {order.platform.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 capitalize">
                          {order.platform} - {order.type}
                        </h3>
                        <p className="text-sm text-slate-500">
                          #{order.orderId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          statusConfig[order.status].color
                        }`}
                      >
                        {(() => {
                          const IconComponent = statusConfig[order.status].icon;
                          return <IconComponent className="w-3 h-3 mr-1" />;
                        })()}
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">
                        {order.uid_email ||
                          order.uid ||
                          order.tiktokLoginId ||
                          'No ID provided'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{order.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">
                        {order.amount ||
                          order.level ||
                          order.diamonds ||
                          order.duration ||
                          '-'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">
                        {order.paymentMethod || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="p-6 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Total Amount</p>
                      <p className="text-xl font-bold text-slate-900">
                        {formatCurrency(order.finalPrice || order.price || 0)}
                      </p>
                      {order.originalPrice &&
                        order.originalPrice !== order.finalPrice && (
                          <p className="text-sm text-slate-500 line-through">
                            {formatCurrency(order.originalPrice)}
                          </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                      {order.receiptUrl && (
                        <a
                          href={order.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Receipt"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}

                      {/* Status Update Buttons - Always Visible */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            handleStatusUpdateClick(
                              order._id,
                              'approved',
                              `${order.platform} - ${order.type}`
                            )
                          }
                          disabled={updatingStatus === order._id}
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
                            order.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title="Approve Order"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdateClick(
                              order._id,
                              'rejected',
                              `${order.platform} - ${order.type}`
                            )
                          }
                          disabled={updatingStatus === order._id}
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
                            order.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                          title="Reject Order"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdateClick(
                              order._id,
                              'pending',
                              `${order.platform} - ${order.type}`
                            )
                          }
                          disabled={updatingStatus === order._id}
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
                            order.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'text-amber-600 hover:bg-amber-50'
                          }`}
                          title="Mark as Pending"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Promocode Information */}
                  {order.promocode && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-emerald-800">
                            Promocode: {order.promocode}
                          </p>
                          {order.discountAmount && order.discountAmount > 0 && (
                            <p className="text-emerald-600">
                              Saved: {formatCurrency(order.discountAmount)}
                            </p>
                          )}
                        </div>
                        <Tag className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(order.createdAt)}
                      </div>
                      {order.referredBy && (
                        <span className="text-slate-400">
                          Referred by: {order.referredBy}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-slate-600">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{' '}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalOrders
                )}{' '}
                of {pagination.totalOrders} orders
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 border rounded-lg text-sm transition-all ${
                            page === pagination.currentPage
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && pendingStatusUpdate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        pendingStatusUpdate.newStatus === 'approved'
                          ? 'bg-emerald-100'
                          : pendingStatusUpdate.newStatus === 'rejected'
                          ? 'bg-red-100'
                          : 'bg-amber-100'
                      }`}
                    >
                      {pendingStatusUpdate.newStatus === 'approved' ? (
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      ) : pendingStatusUpdate.newStatus === 'rejected' ? (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Update Order Status
                    </h2>
                    <p className="text-sm text-gray-600">
                      Confirm the status change for this order.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700">
                    Are you sure you want to mark the order{' '}
                    <span className="font-semibold text-gray-900">
                      "{pendingStatusUpdate.orderTitle}"
                    </span>{' '}
                    as{' '}
                    <span
                      className={`font-semibold ${
                        pendingStatusUpdate.newStatus === 'approved'
                          ? 'text-emerald-600'
                          : pendingStatusUpdate.newStatus === 'rejected'
                          ? 'text-red-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {pendingStatusUpdate.newStatus}
                    </span>
                    ?
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    This action will update the order status and refresh the
                    orders list.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={updateOrderStatus}
                    disabled={updatingStatus === pendingStatusUpdate.orderId}
                    className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-all disabled:opacity-50 ${
                      pendingStatusUpdate.newStatus === 'approved'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : pendingStatusUpdate.newStatus === 'rejected'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    {updatingStatus === pendingStatusUpdate.orderId ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      `Mark as ${pendingStatusUpdate.newStatus}`
                    )}
                  </button>
                  <button
                    onClick={cancelStatusUpdate}
                    disabled={updatingStatus === pendingStatusUpdate.orderId}
                    className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
