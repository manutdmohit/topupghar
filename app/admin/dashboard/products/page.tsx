'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import Pagination from '@/components/Pagination';
import {
  Eye,
  Plus,
  Search,
  Filter,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';

interface IVariant {
  label: string;
  duration: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  platform: string;
  type: string;
  category: string;
  description?: string;
  image?: string;
  variants: IVariant[];
  inStock: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProductListPage() {
  const { adminUser, loading: authLoading } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });

  useEffect(() => {
    if (adminUser && !authLoading) {
      fetchProducts();
    }
  }, [adminUser, authLoading]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    if (adminUser && !authLoading) {
      setCurrentPage(1); // Reset to first page when filters change
      fetchProducts(1);
    }
  }, [searchTerm, categoryFilter, statusFilter, adminUser, authLoading]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page);
  };

  // Get unique categories (we'll need to fetch this separately or use a different approach)
  const categories = ['streaming', 'gaming', 'software', 'social', 'other']; // Default categories

  // Calculate stats from pagination
  const totalProducts = pagination.totalProducts;
  const activeProducts = products.filter((p) => p.isActive).length; // This will be per page, consider fetching separately
  const inStockProducts = products.filter((p) => p.inStock).length; // This will be per page, consider fetching separately

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Product Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage all your products, variants, and inventory
            </p>
          </div>
          <Link
            href="/admin/dashboard/products/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {totalProducts}
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-blue-100 text-blue-600">
              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Active Products
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {activeProducts}
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-green-100 text-green-600">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                In Stock
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {inStockProducts}
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-yellow-100 text-yellow-600">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3 lg:gap-4">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>

          {/* Clear Filters */}
          {(searchTerm || categoryFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setStatusFilter('');
              }}
              className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block sm:hidden">
          {products.map((product) => (
            <div key={product._id} className="p-4 border-b border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {product.platform} • {product.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <Link
                    href={`/admin/dashboard/products/${product._id}`}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                    title="View Product"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/dashboard/products/${product._id}/edit`}
                    className="text-green-600 hover:text-green-800 p-1 rounded"
                    title="Edit Product"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    className="text-red-600 hover:text-red-800 p-1 rounded"
                    title="Delete Product"
                    onClick={() => {
                      if (
                        confirm('Are you sure you want to delete this product?')
                      ) {
                        console.log('Delete product:', product._id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {product.category}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Variants:</span>{' '}
                  {product.variants?.length || 0}
                </div>
                <div className="text-right">
                  <span className="font-medium">From:</span> NPR{' '}
                  {Math.min(...(product.variants?.map((v) => v.price) || [0]))}
                </div>
                <div>
                  <span className="font-medium">Stock:</span>
                  <span
                    className={`ml-1 ${
                      product.inStock ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(product.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover mr-2 sm:mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 capitalize">
                          {product.platform} • {product.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="text-sm text-gray-900">
                      {product.variants?.length || 0} variants
                    </div>
                    <div className="text-xs text-gray-500">
                      From NPR{' '}
                      {Math.min(
                        ...(product.variants?.map((v) => v.price) || [0])
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                      <Link
                        href={`/admin/dashboard/products/${product._id}`}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="View/Edit Product"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/dashboard/products/${product._id}/edit`}
                        className="text-green-600 hover:text-green-800 p-1 rounded"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                        title="Delete Product"
                        onClick={() => {
                          if (
                            confirm(
                              'Are you sure you want to delete this product?'
                            )
                          ) {
                            console.log('Delete product:', product._id);
                          }
                        }}
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

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm || categoryFilter || statusFilter
                ? 'No products match your filters.'
                : 'No products found.'}
            </p>
            {searchTerm ||
              categoryFilter ||
              (statusFilter && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('');
                    setStatusFilter('');
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          className="bg-white rounded-lg shadow-sm border p-4"
        />
      </div>

      {/* Results Summary */}
      {products.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {products.length} of {pagination.totalProducts} products
          {pagination.totalPages > 1 &&
            ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
        </div>
      )}
    </div>
  );
}
