'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ProductVariant {
  label: string;
  duration: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  platform: string;
  type: string;
  description?: string;
  image?: string;
  variants: ProductVariant[];
  inStock: boolean;
  isActive: boolean;
}

interface Package {
  id: number;
  uc: number;
  label: string;
  price: number;
}

export default function PUBGTopupPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pubgPackages, setPubgPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPUBGData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/pubg');

        if (!response.ok) {
          throw new Error('Failed to fetch PUBG data');
        }

        const product: Product = await response.json();

        // Transform product variants to packages
        const packages: Package[] = product.variants.map((variant, index) => {
          // Extract UC amount from label (e.g., "60 UC" -> 60)
          const ucMatch = variant.duration.match(/(\d+)/);
          const uc = ucMatch ? parseInt(ucMatch[1]) : 0;

          return {
            id: index + 1,
            uc,
            label: variant.label,
            price: variant.price,
          };
        });

        setPubgPackages(packages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching PUBG data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPUBGData();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const selected = pubgPackages.find((p: Package) => p.id === selectedId);
    if (!selected) return;

    const query = new URLSearchParams({
      platform: 'pubg',
      type: 'uc',
      amount: selected.uc.toString(),
      price: selected.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-yellow-600">
          PUBG Mobile UC Top-Up
        </h1>
        <p className="text-gray-600 mt-2">
          Recharge UC instantly using local payment methods. Only PUBG ID
          required 🤩
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/pubg-banner.jpg"
            alt="PUBG"
            width={600}
            height={300}
            className="rounded-xl shadow-lg"
            priority // Ensures hydration safety
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="mt-2 text-gray-600">Loading PUBG packages...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">Error loading packages: {error}</p>
        </div>
      )}

      {/* Packages */}
      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {pubgPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handleSelect(pkg.id)}
              className={`border p-5 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                selectedId === pkg.id
                  ? 'bg-yellow-100 border-yellow-600 scale-[1.02]'
                  : 'hover:shadow-md'
              }`}
            >
              <h3 className="text-xl font-semibold text-yellow-700">
                {pkg.label}
              </h3>
              <p className="text-gray-600 mt-2 font-medium">
                NPR {pkg.price.toLocaleString('en-US')}
              </p>

              {selectedId === pkg.id && (
                <div className="mt-3 text-sm text-yellow-700 font-medium">
                  ✅ Selected
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-10 text-center">
        <Button
          disabled={selectedId === null}
          onClick={handleBuyNow}
          className="bg-yellow-600 text-white hover:bg-yellow-700 px-6 py-3 text-lg rounded-xl transition-all duration-300"
        >
          {selectedId === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
