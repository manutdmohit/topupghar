'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  platform: string;
  type: string;
  inStock: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        // Calculate inStock from variants if not present at top level

        console.log(data);

        const filtered = data.map((p: any) => ({
          _id: p._id,
          name: p.name,
          platform: p.platform,
          type: p.type,
          // If your product has no top-level inStock, check if any variant is in stock
          inStock:
            typeof p.inStock === 'boolean'
              ? p.inStock
              : Array.isArray(p.variants)
              ? p.variants.some((v: any) => v.inStock)
              : false,
          isActive: p.isActive,
          createdAt: p.createdAt,
        }));
        setProducts(filtered);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-lg">Loading products...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-gray-700">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Platform</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">In Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 font-medium">{product.name}</td>
                <td className="py-3 px-4 capitalize">{product.platform}</td>
                <td className="py-3 px-4">{product.type}</td>
                <td className="py-3 px-4">
                  <span
                    className={
                      product.inStock
                        ? 'text-green-600 bg-green-50 px-2 py-1 rounded text-xs'
                        : 'text-red-600 bg-red-50 px-2 py-1 rounded text-xs'
                    }
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={
                      product.isActive
                        ? 'text-green-600 bg-green-50 px-2 py-1 rounded text-xs'
                        : 'text-red-600 bg-red-50 px-2 py-1 rounded text-xs'
                    }
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 flex justify-center">
                  <Link
                    href={`/admin/dashboard/products/${product._id}`}
                    title="View/Edit Product"
                  >
                    <Eye className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer" />
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 px-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
