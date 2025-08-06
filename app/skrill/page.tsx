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
  usd: number;
  price: number;
}

export default function SkrillPage() {
  const [skrillPackages, setSkrillPackages] = useState<Package[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSkrillProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/skrill');

        if (!response.ok) {
          throw new Error('Failed to fetch Skrill product');
        }

        const product: Product = await response.json();

        // Transform product variants to packages
        const packages: Package[] = product.variants.map((variant, index) => {
          // Extract USD amount from label (e.g., "$5 USD" -> 5)
          const usdMatch = variant.label.match(/\$(\d+)/);
          const usd = usdMatch ? parseInt(usdMatch[1]) : 0;

          return {
            id: index + 1,
            usd,
            price: variant.price,
          };
        });

        setSkrillPackages(packages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching Skrill product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkrillProduct();
  }, []);

  const handleSelect = (id: number) => setSelected(id === selected ? null : id);

  const handleBuyNow = () => {
    const pkg = skrillPackages.find((p) => p.id === selected);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'skrill',
      type: 'usd',
      amount: pkg.usd.toString() + ' ',
      price: pkg.price.toString(),
    });
    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7225a3]"></div>
          <p className="mt-2 text-gray-600">Loading Skrill packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading Skrill packages: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="md:text-4xl font-bold text-[#7225a3] flex items-center justify-center gap-2">
          <Image
            src="/skrill-logo.jpg"
            width={100}
            height={100}
            alt="Skrill"
            className="inline-block"
          />
          Skrill Balance Load
        </h1>
        <p className="text-gray-600 mt-2">
          Instantly load your Skrill balance. Just select an amount.
        </p>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        {skrillPackages.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => handleSelect(pkg.id)}
            className={`
              border-2 rounded-2xl px-7 py-6 text-center font-bold text-lg transition-all duration-300
              shadow-md bg-white relative
              ${
                selected === pkg.id
                  ? 'border-[#7225a3] ring-2 ring-[#7225a3]/30 scale-[1.04]'
                  : 'hover:border-[#7225a3] hover:scale-105'
              }
            `}
          >
            <span className="text-[#7225a3] text-xl">${pkg.usd} USD</span>
            <span className="block mt-2 text-gray-700 font-semibold text-lg">
              NPR {pkg.price.toLocaleString('en-US')}
            </span>
            {selected === pkg.id && (
              <span className="absolute top-1 right-4 text-xs font-semibold text-[#7225a3] bg-[#f3e8fd] rounded-full px-3 py-1 shadow">
                Selected
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Button
          disabled={!selected}
          onClick={handleBuyNow}
          className="bg-gradient-to-r from-[#7225a3] to-[#a78bfa] text-white hover:from-[#581c87] hover:to-[#a21caf] text-lg rounded-xl shadow-md px-6 py-3 transition-all"
        >
          {selected === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
