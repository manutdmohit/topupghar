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
  label: string;
  duration: string;
  price: number;
}

export default function NetflixPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [netflixPackages, setNetflixPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNetflixData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/netflix');

        if (!response.ok) {
          throw new Error('Failed to fetch Netflix data');
        }

        const product: Product = await response.json();

        // Transform product variants to packages
        const packages: Package[] = product.variants.map((variant, index) => {
          return {
            id: index + 1,
            label: variant.label,
            duration: variant.duration,
            price: variant.price,
          };
        });

        setNetflixPackages(packages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching Netflix data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNetflixData();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const selected = netflixPackages.find((p: Package) => p.id === selectedId);
    if (!selected) return;

    const query = new URLSearchParams({
      platform: 'netflix',
      type: 'account',
      duration: selected.duration,
      price: selected.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Image Left */}
        <div className="w-full flex justify-center md:justify-end">
          <Image
            src="/netflix-banner.jpg"
            alt="Netflix"
            width={440}
            height={260}
            className="rounded-2xl shadow-2xl object-cover"
            priority
          />
        </div>

        {/* Grid & Info Right */}
        <div>
          <h1 className="text-4xl font-bold text-red-600 mb-3">
            Netflix Account Pricing
          </h1>
          <p className="text-gray-600 mb-8">
            Choose your subscription period and enjoy Netflix instantly!
          </p>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              <p className="mt-2 text-gray-600">Loading Netflix packages...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading packages: {error}</p>
            </div>
          )}

          {/* Packages Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-6">
              {netflixPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => handleSelect(pkg.id)}
                  className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                    selectedId === pkg.id
                      ? 'bg-red-100 border-red-600 scale-[1.03]'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <h3 className="text-xl font-semibold text-red-700">
                    {pkg.label}
                  </h3>
                  <p className="text-gray-600 mt-2 font-medium">
                    NPR {pkg.price}
                  </p>
                  {selectedId === pkg.id && (
                    <div className="mt-3 text-sm text-red-700 font-medium">
                      ✅ Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 text-center">
            <Button
              disabled={selectedId === null}
              onClick={handleBuyNow}
              className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-lg rounded-xl transition-all duration-300 w-full"
            >
              {selectedId === null ? 'Select a Package' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
