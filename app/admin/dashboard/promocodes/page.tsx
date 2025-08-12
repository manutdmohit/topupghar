'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Users,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

interface Promocode {
  _id: string;
  name: string;
  maxCount: number;
  usedCount: number;
  expiry: string;
  isActive: boolean;
  discountPercentage?: number;
  discountAmount?: number;
  minimumOrderAmount?: number;
  createdAt: string;
  updatedAt: string;
  isExpired?: boolean;
  isUsageLimitReached?: boolean;
  isValid?: boolean;
}

export default function AdminPromocodesPage() {
  const { adminUser, loading: authLoading } = useAdminAuth();
  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPromocodes: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    maxCount: 1,
    expiry: '',
    discountPercentage: '',
    discountAmount: '',
    minimumOrderAmount: '',
  });

  useEffect(() => {
    if (adminUser && !authLoading) {
      fetchPromocodes();
    }
  }, [adminUser, authLoading]);

  const fetchPromocodes = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/promocodes?${params}`);
      const data = await response.json();

      setPromocodes(data.promocodes);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching promocodes:', error);
      toast.error('Failed to fetch promocodes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch promocodes when filters change
  useEffect(() => {
    if (adminUser && !authLoading) {
      setCurrentPage(1);
      fetchPromocodes(1);
    }
  }, [searchTerm, statusFilter, adminUser, authLoading]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPromocodes(page);
  };

  const handleCreatePromocode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.maxCount || !formData.expiry) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/promocodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          maxCount: parseInt(formData.maxCount.toString()),
          expiry: formData.expiry,
          discountPercentage: formData.discountPercentage
            ? parseFloat(formData.discountPercentage)
            : undefined,
          discountAmount: formData.discountAmount
            ? parseFloat(formData.discountAmount)
            : undefined,
          minimumOrderAmount: formData.minimumOrderAmount
            ? parseFloat(formData.minimumOrderAmount)
            : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create promocode');
      }

      toast.success('Promocode created successfully!');
      setShowCreateForm(false);
      setFormData({
        name: '',
        maxCount: 1,
        expiry: '',
        discountPercentage: '',
        discountAmount: '',
        minimumOrderAmount: '',
      });
      fetchPromocodes(currentPage);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create promocode'
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Promocode copied to clipboard!');
  };

  const getStatusBadge = (promocode: Promocode) => {
    if (!promocode.isActive) {
      return (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
          Inactive
        </span>
      );
    }
    if (promocode.isExpired) {
      return (
        <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
          Expired
        </span>
      );
    }
    if (promocode.isUsageLimitReached) {
      return (
        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
          Limit Reached
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
        Active
      </span>
    );
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, the hook will redirect to login
  if (!adminUser) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Promocode Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Create and manage promotional codes for discounts
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add Promocode</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Promocodes
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {pagination.totalPromocodes}
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-blue-100 text-blue-600">
              <Tag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Active Promocodes
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {promocodes.filter((p) => p.isValid).length}
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-green-100 text-green-600">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Expired Promocodes
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {promocodes.filter((p) => p.isExpired).length}
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-red-100 text-red-600">
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Usage
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {promocodes.reduce((sum, p) => sum + p.usedCount, 0)}
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-purple-100 text-purple-600">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search promocodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
              <option value="valid">Valid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Create New Promocode
              </h2>

              <form onSubmit={handleCreatePromocode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Promocode Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., SAVE20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Usage Count *
                  </label>
                  <input
                    type="number"
                    value={formData.maxCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxCount: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiry}
                    onChange={(e) =>
                      setFormData({ ...formData, expiry: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPercentage: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Amount (NPR)
                  </label>
                  <input
                    type="number"
                    value={formData.discountAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountAmount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order Amount (NPR)
                  </label>
                  <input
                    type="number"
                    value={formData.minimumOrderAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimumOrderAmount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create Promocode
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Promocodes List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading promocodes...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Promocode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {promocodes.map((promocode) => (
                    <tr key={promocode._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Tag className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {promocode.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Created{' '}
                              {new Date(
                                promocode.createdAt
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {promocode.usedCount} / {promocode.maxCount}
                        </div>
                        <div className="text-sm text-gray-500">
                          {(
                            (promocode.usedCount / promocode.maxCount) *
                            100
                          ).toFixed(1)}
                          % used
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {promocode.discountPercentage
                            ? `${promocode.discountPercentage}%`
                            : ''}
                          {promocode.discountAmount
                            ? `NPR ${promocode.discountAmount}`
                            : ''}
                        </div>
                        {promocode.minimumOrderAmount && (
                          <div className="text-sm text-gray-500">
                            Min: NPR {promocode.minimumOrderAmount}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(promocode.expiry).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(promocode.expiry).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(promocode)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(promocode.name)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Copy promocode"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit promocode"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Delete promocode"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={!pagination.hasPrevPage}
                      className="px-3 py-1 text-sm"
                    >
                      Previous
                    </Button>
                    <span className="px-3 py-1 text-sm text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={!pagination.hasNextPage}
                      className="px-3 py-1 text-sm"
                    >
                      Next
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Showing {promocodes.length} of {pagination.totalPromocodes}{' '}
                    promocodes
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
