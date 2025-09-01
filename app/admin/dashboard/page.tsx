'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Clock,
  Eye,
  Settings,
  Plus,
  BarChart3,
  LogOut,
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  recentOrders: Array<{
    _id: string;
    platform: string;
    type: string;
    price: number;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const { adminUser, loading: authLoading, logout } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (adminUser && !authLoading) {
      async function fetchDashboardData() {
        setLoading(true);
        try {
          // Fetch orders data with pagination
          const ordersRes = await fetch('/api/orders?limit=5&page=1');
          const ordersData = await ordersRes.json();

          // Fetch pending orders count specifically
          const pendingOrdersRes = await fetch(
            '/api/orders?status=pending&limit=1'
          );
          const pendingOrdersData = await pendingOrdersRes.json();

          // Fetch products data with pagination
          const productsRes = await fetch('/api/products?limit=1');
          const productsData = await productsRes.json();

          // Calculate stats (excluding total revenue)
          const totalOrders = ordersData.pagination?.totalOrders || 0;
          const totalProducts = productsData.pagination?.totalProducts || 0;
          const pendingOrders = pendingOrdersData.pagination?.totalOrders || 0;

          setStats({
            totalOrders,
            totalProducts,
            pendingOrders,
            recentOrders: ordersData.orders || [],
          });
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
        setLoading(false);
      }

      fetchDashboardData();
    }
  }, [adminUser, authLoading]);

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

  const quickActions = [
    {
      title: 'View Orders',
      description: 'Manage all orders',
      icon: ShoppingCart,
      href: '/admin/dashboard/orders',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Manage Products',
      description: 'Add or edit products',
      icon: Package,
      href: '/admin/dashboard/products',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Add Product',
      description: 'Create new product',
      icon: Plus,
      href: '/admin/dashboard/products/new',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Analytics',
      description: 'View detailed reports',
      icon: BarChart3,
      href: '/admin/dashboard/analytics',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-500',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
      bgColor: 'bg-yellow-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Welcome back, {adminUser.email}! Here's an overview of your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className={`p-2 sm:p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div
                  className={`p-2 sm:p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    {action.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              href="/admin/dashboard/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2 text-sm">
                Loading recent orders...
              </p>
            </div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 text-sm sm:text-base">
                No orders yet
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize text-sm sm:text-base">
                        {order.platform} - {order.type}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:space-y-1">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      NPR {Math.round(order.price || 0)}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            System Status
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm sm:text-base">
                Database
              </span>
              <span className="text-green-600 font-medium text-sm sm:text-base">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm sm:text-base">
                API Status
              </span>
              <span className="text-green-600 font-medium text-sm sm:text-base">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm sm:text-base">
                Last Updated
              </span>
              <span className="text-gray-900 text-sm sm:text-base">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Quick Tips
          </h3>
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
            <p>• Use the Quick Actions to navigate to different sections</p>
            <p>• Monitor pending orders regularly</p>
            <p>• Keep product information up to date</p>
            <p>• Check analytics for business insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}
