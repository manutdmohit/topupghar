'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
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
  Wallet,
  ChevronDown,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adminUser, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Set sidebar to open by default on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

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
    { name: 'Customers', href: '/admin/dashboard/customers', icon: User },
    { name: 'Wallet', href: '/admin/dashboard/wallet', icon: Wallet },
    { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  // Touch gesture handlers for mobile sidebar
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    
    if (isLeftSwipe && sidebarOpen && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
              {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
            onClick={closeSidebar}
          />
        )}

        {/* Mobile swipe indicator */}
        {sidebarOpen && (
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 lg:hidden">
            <div className="w-1 h-16 bg-white bg-opacity-30 rounded-full"></div>
          </div>
        )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`
          fixed inset-y-0 left-0 z-50 bg-white shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${
            sidebarOpen
              ? 'translate-x-0 w-72 lg:w-64'
              : '-translate-x-full lg:translate-x-0 lg:w-20'
          }
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b">
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
              className="lg:hidden p-3 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors touch-manipulation"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 lg:p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className="flex items-center px-4 py-4 lg:px-3 lg:py-4 text-base lg:text-sm font-medium text-gray-700 rounded-lg lg:rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors group touch-manipulation"
                    title={item.name}
                  >
                    <Icon
                      className={`w-6 h-6 lg:w-8 lg:h-8 mr-4 lg:mr-0 lg:group-hover:mr-4 transition-all duration-300 ${
                        !sidebarOpen ? 'w-12 h-12' : 'lg:w-8 lg:h-8'
                      }`}
                    />
                    <span
                      className={`ml-2 lg:ml-4 transition-opacity duration-300 ${
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
        <div className="p-4 lg:p-4 border-t">
          <div className="flex items-center px-4 lg:px-3 py-4">
            <User
              className={`w-8 h-8 lg:w-6 lg:h-6 mr-4 lg:mr-0 lg:group-hover:mr-4 text-gray-400 transition-all duration-300 ${
                !sidebarOpen ? 'w-12 h-12' : 'lg:w-6 lg:h-6'
              }`}
            />
            <div
              className={`flex-1 min-w-0 transition-opacity duration-300 ${
                !sidebarOpen && 'lg:hidden'
              }`}
            >
              <p className="text-base lg:text-sm font-medium text-gray-700 truncate">
                {adminUser?.email || 'Admin'}
              </p>
              <p className="text-sm lg:text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-3 flex items-center px-4 lg:px-3 py-4 text-base lg:text-sm font-medium text-red-600 rounded-lg lg:rounded-md hover:bg-red-50 hover:text-red-700 transition-colors group touch-manipulation"
            title="Logout"
          >
            <LogOut
              className={`w-6 h-6 lg:w-6 lg:h-6 mr-4 lg:mr-0 lg:group-hover:mr-4 transition-all duration-300 ${
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
              className="p-3 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 mr-3 transition-colors lg:hidden touch-manipulation"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
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

          {/* Mobile user dropdown */}
          <div className="lg:hidden relative" ref={mobileMenuRef}>
            <button
              onClick={toggleMobileMenu}
              className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-all duration-200 touch-manipulation"
              aria-label="Open admin menu"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  mobileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Mobile dropdown menu */}
            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="py-2">
                  {/* User info */}
                  <div className="px-4 py-4 border-b border-gray-100">
                    <p className="text-base font-medium text-gray-900">
                      {adminUser?.email || 'Admin'}
                    </p>
                    <p className="text-sm text-gray-500">Administrator</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <Link
                      href="/admin/dashboard/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
                    >
                      <Settings className="w-5 h-5 mr-3 text-gray-400" />
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-base text-red-600 hover:bg-red-50 transition-colors touch-manipulation"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
