'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  User,
  Tag,
  FolderOpen,
  Monitor,
  Layers,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adminUser, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Products', href: '/admin/dashboard/products', icon: Package },
    {
      name: 'Categories',
      href: '/admin/dashboard/categories',
      icon: FolderOpen,
    },
    { name: 'Platforms', href: '/admin/dashboard/platforms', icon: Monitor },
    {
      name: 'Product Types',
      href: '/admin/dashboard/product-types',
      icon: Layers,
    },
    { name: 'Promocodes', href: '/admin/dashboard/promocodes', icon: Tag },
    { name: 'Orders', href: '/admin/dashboard/orders', icon: ShoppingCart },
    { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${
            sidebarOpen
              ? 'translate-x-0 w-64'
              : '-translate-x-full lg:translate-x-0 lg:w-20'
          }
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div
            className={`font-bold text-xl text-gray-800 transition-opacity duration-300 ${
              !sidebarOpen && 'lg:hidden'
            }`}
          >
            Admin Panel
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              <Menu
                className={`w-6 h-6 transition-all duration-300 ${
                  !sidebarOpen && 'lg:w-8 lg:h-8'
                }`}
              />
            </button>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className="flex items-center px-3 py-4 text-sm font-medium text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                    title={item.name}
                  >
                    <Icon
                      className={`w-8 h-8 mr-4 lg:mr-0 lg:group-hover:mr-4 transition-all duration-300 ${
                        !sidebarOpen ? 'w-12 h-12' : 'lg:w-8 lg:h-8'
                      }`}
                    />
                    <span
                      className={`ml-4 transition-opacity duration-300 ${
                        !sidebarOpen && 'lg:hidden'
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info and logout at bottom */}
        <div className="p-4 border-t">
          <div className="flex items-center px-3 py-4">
            <User
              className={`w-6 h-6 mr-4 lg:mr-0 lg:group-hover:mr-4 text-gray-400 transition-all duration-300 ${
                !sidebarOpen ? 'w-12 h-12' : 'lg:w-6 lg:h-6'
              }`}
            />
            <div
              className={`flex-1 min-w-0 transition-opacity duration-300 ${
                !sidebarOpen && 'lg:hidden'
              }`}
            >
              <p className="text-sm font-medium text-gray-700 truncate">
                {adminUser?.email || 'Admin'}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-3 flex items-center px-3 py-4 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors group"
            title="Logout"
          >
            <LogOut
              className={`w-6 h-6 mr-4 lg:mr-0 lg:group-hover:mr-4 transition-all duration-300 ${
                !sidebarOpen ? 'w-12 h-12' : 'lg:w-6 lg:h-6'
              }`}
            />
            <span
              className={`transition-opacity duration-300 ${
                !sidebarOpen && 'lg:hidden'
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-0' : 'lg:ml-20'
        }`}
      >
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center px-4 lg:px-6 border-b justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 mr-2 transition-colors"
            >
              <Menu className="w-7 h-7" />
            </button>
            <span className="font-semibold text-lg text-gray-800">
              Dashboard
            </span>
          </div>

          {/* Desktop user info */}
          <div className="hidden lg:flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Hello, {adminUser?.email || 'Admin'}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile user info */}
          <div className="lg:hidden flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
