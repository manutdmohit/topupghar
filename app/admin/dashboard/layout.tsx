// /app/admin/dashboard/layout.tsx

import Link from 'next/link';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
          Admin Panel
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/dashboard"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/dashboard/products"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/admin/dashboard/orders"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                href="/admin/dashboard/settings"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center px-6 border-b justify-between">
          <span className="font-semibold text-lg">Dashboard</span>
          {/* Add profile/settings/logout/etc. here */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hello, Admin</span>
            <button className="px-3 py-1 bg-gray-200 rounded">Logout</button>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
