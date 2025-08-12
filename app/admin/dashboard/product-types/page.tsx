'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Power,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductType {
  _id: string;
  name: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProductTypes: number;
  totalActiveProductTypes: number;
  totalInactiveProductTypes: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export default function ProductTypesPage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [selectedProductType, setSelectedProductType] =
    useState<ProductType | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    label: '',
    description: '',
    icon: '',
    color: '#8B5CF6',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch product types
  const fetchProductTypes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        status: statusFilter,
      });

      const response = await fetch(`/api/product-types?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProductTypes(data.productTypes);
        setPagination(data.pagination);
      } else {
        toast.error(data.message || 'Failed to fetch product types');
      }
    } catch (error) {
      console.error('Error fetching product types:', error);
      toast.error('Failed to fetch product types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, [currentPage, searchTerm, statusFilter]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      value: '',
      label: '',
      description: '',
      icon: '',
      color: '#8B5CF6',
    });
    setFormErrors({});
  };

  // Open create modal
  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  // Open edit modal
  const openEditModal = (productType: ProductType) => {
    setSelectedProductType(productType);
    setFormData({
      name: productType.name,
      value: productType.value,
      label: productType.label,
      description: productType.description || '',
      icon: productType.icon || '',
      color: productType.color || '#8B5CF6',
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (productType: ProductType) => {
    setSelectedProductType(productType);
    setShowDeleteModal(true);
  };

  // Open toggle modal
  const openToggleModal = (productType: ProductType) => {
    setSelectedProductType(productType);
    setShowToggleModal(true);
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.value.trim()) {
      errors.value = 'Value is required';
    }

    if (!formData.label.trim()) {
      errors.label = 'Label is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create product type
  const handleCreateProductType = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch('/api/product-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Product type created successfully');
        setShowCreateModal(false);
        fetchProductTypes();
      } else {
        toast.error(data.message || 'Failed to create product type');
      }
    } catch (error) {
      console.error('Error creating product type:', error);
      toast.error('Failed to create product type');
    }
  };

  // Update product type
  const handleUpdateProductType = async () => {
    if (!validateForm() || !selectedProductType) return;

    try {
      const response = await fetch(
        `/api/product-types/${selectedProductType._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Product type updated successfully');
        setShowEditModal(false);
        fetchProductTypes();
      } else {
        toast.error(data.message || 'Failed to update product type');
      }
    } catch (error) {
      console.error('Error updating product type:', error);
      toast.error('Failed to update product type');
    }
  };

  // Delete product type
  const handleDeleteProductType = async () => {
    if (!selectedProductType) return;

    try {
      const response = await fetch(
        `/api/product-types/${selectedProductType._id}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Product type deleted successfully');
        setShowDeleteModal(false);
        fetchProductTypes();
      } else {
        toast.error(data.message || 'Failed to delete product type');
      }
    } catch (error) {
      console.error('Error deleting product type:', error);
      toast.error('Failed to delete product type');
    }
  };

  // Toggle product type status
  const handleToggleStatus = async () => {
    if (!selectedProductType) return;

    try {
      const response = await fetch(
        `/api/product-types/${selectedProductType._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isActive: !selectedProductType.isActive }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setShowToggleModal(false);
        fetchProductTypes();
      } else {
        toast.error(data.message || 'Failed to update product type status');
      }
    } catch (error) {
      console.error('Error updating product type status:', error);
      toast.error('Failed to update product type status');
    }
  };

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Product Types
                </h1>
                <p className="text-gray-600">Manage your product types</p>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product Type
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Layers className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Product Types
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination?.totalProductTypes || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Product Types
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination?.totalActiveProductTypes || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Inactive Product Types
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination?.totalInactiveProductTypes || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search product types..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Types Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product types...</p>
            </div>
          ) : productTypes.length === 0 ? (
            <div className="p-8 text-center">
              <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No product types found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productTypes.map((productType) => (
                    <tr key={productType._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                            style={{
                              backgroundColor: productType.color || '#8B5CF6',
                            }}
                          >
                            {productType.icon || '📦'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {productType.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {productType.label}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {productType.value}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {productType.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            productType.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {productType.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(productType.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(productType)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openToggleModal(productType)}
                            className={`p-1 ${
                              productType.isActive
                                ? 'text-orange-600 hover:text-orange-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={
                              productType.isActive ? 'Deactivate' : 'Activate'
                            }
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(productType)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
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
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {(pagination.currentPage - 1) * pagination.limit + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(
                          pagination.currentPage * pagination.limit,
                          pagination.totalProductTypes
                        )}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">
                        {pagination.totalProductTypes}
                      </span>{' '}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.currentPage
                              ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Create New Product Type
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product type name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value *
                </label>
                <input
                  type="text"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    formErrors.value ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product type value"
                />
                {formErrors.value && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.value}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    formErrors.label ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter display label"
                />
                {formErrors.label && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.label}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter product type description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 📦, 💎, 👤"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProductType}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Product Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Product Type</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product type name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value *
                </label>
                <input
                  type="text"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    formErrors.value ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product type value"
                />
                {formErrors.value && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.value}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    formErrors.label ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter display label"
                />
                {formErrors.label && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.label}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter product type description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 📦, 💎, 👤"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProductType}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Update Product Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProductType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold">Delete Product Type</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the product type "
              {selectedProductType.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProductType}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Product Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Status Confirmation Modal */}
      {showToggleModal && selectedProductType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Power className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold">
                {selectedProductType.isActive ? 'Deactivate' : 'Activate'}{' '}
                Product Type
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to{' '}
              {selectedProductType.isActive ? 'deactivate' : 'activate'} the
              product type "{selectedProductType.name}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowToggleModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  selectedProductType.isActive
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {selectedProductType.isActive ? 'Deactivate' : 'Activate'}{' '}
                Product Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
