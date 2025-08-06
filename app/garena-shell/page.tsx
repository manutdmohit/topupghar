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
  shells: number;
  price: number;
}

export default function GarenaShellPage() {
  const [garenaPackages, setGarenaPackages] = useState<Package[]>([]);
  const [image, setImage] = useState<string>('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGarenaProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/garena-shell');

        if (!response.ok) {
          throw new Error('Failed to fetch Garena Shell product');
        }

        const product: Product = await response.json();

        setImage(product.image ?? '');

        // Transform product variants to packages
        const packages: Package[] = product.variants.map((variant, index) => {
          // Extract shell amount from label (e.g., "200 Shell" -> 200)
          const shellMatch = variant.label.match(/(\d+)/);
          const shells = shellMatch ? parseInt(shellMatch[1]) : 0;

          return {
            id: index + 1,
            label: variant.label,
            shells,
            price: variant.price,
          };
        });

        setGarenaPackages(packages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching Garena Shell product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGarenaProduct();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const selected = garenaPackages.find((p) => p.id === selectedId);
    if (!selected) return;

    const query = new URLSearchParams({
      platform: 'garena',
      type: 'shell',
      amount: selected.shells.toString(),
      price: selected.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <p className="mt-2 text-gray-600">Loading Garena Shell packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <p className="text-red-600">
            Error loading Garena Shell packages: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className=" text-2xl md:text-4xl font-bold text-amber-600">
          Garena Shell(my) Top-Up
        </h1>
        <p className="text-gray-600 mt-2">
          Buy Garena Shells instantly using local payment methods.
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src={image || '/garena-banner.jpg'}
            alt="Garena Shell"
            width={600}
            height={300}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {garenaPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.id)}
            className={`border p-5 rounded-xl text-center cursor-pointer transition-all duration-300 ${
              selectedId === pkg.id
                ? 'bg-amber-100 border-amber-600 scale-[1.02]'
                : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-xl font-semibold text-amber-700">
              {pkg.label}
            </h3>
            <p className="text-gray-600 mt-2 font-medium">
              NPR {pkg.price.toLocaleString('en-US')}
            </p>

            {selectedId === pkg.id && (
              <div className="mt-3 text-sm text-amber-700 font-medium">
                ✅ Selected
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Button
          disabled={selectedId === null}
          onClick={handleBuyNow}
          className="bg-amber-600 text-white hover:bg-amber-700 px-6 py-3 text-lg rounded-xl transition-all duration-300"
        >
          {selectedId === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
