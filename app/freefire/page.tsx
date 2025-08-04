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
  type: string;
  diamonds: number;
  price: number;
}

export default function FreeFireDiamondPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [diamondPackages, setDiamondPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFreefireData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/freefire');

        if (!response.ok) {
          throw new Error('Failed to fetch Freefire data');
        }

        const product: Product = await response.json();

        // Transform product variants to packages
        const packages: Package[] = product.variants.map((variant, index) => {
          // Extract diamond amount from label (e.g., "25💎" -> 25)
          const diamondMatch = variant.duration.match(/(\d+)/);
          const diamonds = diamondMatch ? parseInt(diamondMatch[1]) : 0;

          // Determine type based on label
          let type = 'diamonds';
          if (variant.label.includes('Weekly Membership')) {
            type = 'weekly-membership';
          } else if (variant.label.includes('Monthly Membership')) {
            type = 'monthly-membership';
          } else if (variant.label.includes('Weekly Lite')) {
            type = 'weekly-lite';
          } else if (variant.label.includes('Airdrop')) {
            type = 'airdrop';
          }

          return {
            id: index + 1,
            label: variant.label,
            type,
            diamonds,
            price: variant.price,
          };
        });

        setDiamondPackages(packages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching Freefire data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreefireData();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const pkg = diamondPackages.find((p: Package) => p.id === selectedPackage);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'freefire',
      type: pkg.type,
      amount: pkg.diamonds.toString(),
      price: pkg.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-xl text-left font-bold text-purple-700">
          Get Free Fire Diamonds instantly at the best price in Nepal! Recharge
          your Free Fire account safely and securely through Topup Ghar.
        </h1>
        <p className="text-gray-600 mt-2">
          Select a package below and pay using your preferred method. Only UID
          required 🤩
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/free-fire.jpg"
            alt="Free Fire"
            width={600}
            height={300}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <p className="mt-2 text-gray-600">Loading Freefire packages...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">Error loading packages: {error}</p>
        </div>
      )}

      {/* Package Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {diamondPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handleSelect(pkg.id)}
              className={`border p-5 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                selectedPackage === pkg.id
                  ? 'bg-purple-100 border-purple-600 scale-[1.02]'
                  : 'hover:shadow-md'
              }`}
            >
              <h3 className="text-xl font-semibold text-purple-700">
                {pkg.label}
              </h3>
              <p className="text-gray-600 mt-2 font-medium">
                NPR {pkg.price.toLocaleString('en-US')}
              </p>
              {selectedPackage === pkg.id && (
                <div className="mt-3 text-sm text-purple-700 font-medium">
                  ✅ Selected
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-10 text-center">
        <Button
          disabled={selectedPackage === null}
          onClick={handleBuyNow}
          className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 text-lg rounded-xl transition-all duration-300"
        >
          {selectedPackage === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
