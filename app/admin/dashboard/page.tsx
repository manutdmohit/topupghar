'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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

const statusColors = {
  pending: 'bg-yellow-200 text-yellow-800',
  approved: 'bg-green-200 text-green-800',
  rejected: 'bg-red-200 text-red-800',
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (error) {
        setOrders([]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  // Filtering logic
  const filteredOrders = orders.filter((order) => {
    const matchPlatform =
      !filter || order.platform.toLowerCase().includes(filter.toLowerCase());
    const matchStatus = !statusFilter || order.status === statusFilter;
    return matchPlatform && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        Admin Dashboard
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by platform..."
          className="border px-4 py-2 rounded-lg w-64"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-purple-100 text-gray-800">
            <tr>
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Platform</th>
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">User/Email/UID</th>
              <th className="py-2 px-3">Phone</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Price</th>
              <th className="py-2 px-3">Receipt</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="py-8 text-center">
                  Loading orders...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, i) => (
                <tr
                  key={order._id}
                  className={`border-b hover:bg-purple-50 transition-all`}
                >
                  <td className="py-2 px-3">{i + 1}</td>
                  <td className="py-2 px-3 capitalize">{order.platform}</td>
                  <td className="py-2 px-3 capitalize">{order.type}</td>
                  <td className="py-2 px-3 break-all">
                    {order.uid_email || order.uid || order.tiktokLoginId || '-'}
                  </td>
                  <td className="py-2 px-3">{order.phone}</td>
                  <td className="py-2 px-3">
                    {order.amount || order.level || order.diamonds || '-'}
                  </td>
                  <td className="py-2 px-3">
                    {order.price ? `NPR ${order.price}` : '-'}
                  </td>
                  <td className="py-2 px-3">
                    {order.receiptUrl ? (
                      <a
                        href={order.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-600"
                      >
                        <Image
                          src={order.receiptUrl}
                          alt="Receipt"
                          width={40}
                          height={40}
                          className="inline-block rounded-lg shadow"
                        />
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 rounded ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
