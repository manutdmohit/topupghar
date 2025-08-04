'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Eye,
  Settings,
  Plus,
  BarChart3,
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  totalRevenue: number;
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
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Fetch orders data
        const ordersRes = await fetch('/api/orders?limit=5');
        const ordersData = await ordersRes.json();

        // Fetch products data
        const productsRes = await fetch('/api/products');
        const productsData = await productsRes.json();

        // Calculate stats
        const totalOrders = ordersData.pagination?.totalOrders || 0;
        const totalProducts = Array.isArray(productsData)
          ? productsData.length
          : 0;
        const pendingOrders =
          ordersData.orders?.filter((order: any) => order.status === 'pending')
            .length || 0;
        const totalRevenue =
          ordersData.orders?.reduce((sum: number, order: any) => {
            return sum + (order.status === 'approved' ? order.price || 0 : 0);
          }, 0) || 0;

        setStats({
          totalOrders,
          totalProducts,
          pendingOrders,
          totalRevenue,
          recentOrders: ordersData.orders || [],
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

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
    {
      title: 'Total Revenue',
      value: `NPR ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
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

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading recent orders...</p>
            </div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {order.platform} - {order.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      NPR {order.price}
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
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Status</span>
              <span className="text-green-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Tips
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
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
