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
  coins: number;
  price: number;
}

export default function PoppoLiveCoinPage() {
  const [poppoPackages, setPoppoPackages] = useState<Package[]>([]);
  const [image, setImage] = useState<string>('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPoppoProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/poppo');

        if (!response.ok) {
          throw new Error('Failed to fetch Poppo product');
        }

        const product: Product = await response.json();

        setImage(product.image ?? '');

        // Transform product variants to packages
        const packages: Package[] = product.variants.map((variant, index) => {
          // Extract coin amount from label (e.g., "1,000 Coins" -> 1000)
          const coinMatch = variant.duration.match(/(\d+(?:,\d+)*)/);
          const coins = coinMatch
            ? parseInt(coinMatch[1].replace(/,/g, ''))
            : 0;

          return {
            id: index + 1,
            label: variant.label,
            coins,
            price: variant.price,
          };
        });

        setPoppoPackages(packages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching Poppo product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoppoProduct();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const selected = poppoPackages.find((p) => p.id === selectedId);
    if (!selected) return;

    const query = new URLSearchParams({
      platform: 'poppo',
      type: 'coins',
      amount: selected.coins.toString() + ' ',
      price: selected.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-2 sm:px-6 py-12">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <p className="mt-2 text-gray-600">Loading Poppo packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-2 sm:px-6 py-12">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading Poppo packages: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Poppo Product Graphic */}
        <div className="w-full flex justify-center md:justify-end animate-fade-in">
          <div className="relative w-[340px] h-[340px] rounded-3xl shadow-2xl overflow-hidden">
            {/* Gradient background */}

            {/* Poppo LIVE logo */}
            <Image
              src={image}
              alt="Poppo Live Coins"
              width={340}
              height={340}
              className="rounded-3xl shadow-2xl object-cover border-4 border-pink-200"
              priority
            />
          </div>
        </div>

        {/* Right: Product Grid & Details */}
        <div className="w-full">
          <div className="mb-7">
            <h1 className="text-4xl font-bold text-pink-700 mb-2 drop-shadow-[0_1px_2px_rgba(219,39,119,0.1)]">
              Poppo Live Coin Top-Up
            </h1>
            <p className="text-gray-700 text-base mb-2">
              Secure, instant top-up for Poppo Live. <br />
              <span className="font-semibold text-pink-500">
                Only User ID required. No password needed.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-10">
            {poppoPackages.map((pkg) => (
              <button
                type="button"
                key={pkg.id}
                onClick={() => handleSelect(pkg.id)}
                className={`
                  group border 
                  rounded-2xl 
                  p-6 
                  text-center 
                  font-medium
                  relative 
                  transition-all duration-300
                  shadow-sm
                  outline-none
                  focus-visible:ring-2 focus-visible:ring-pink-400
                  ${
                    selectedId === pkg.id
                      ? 'border-pink-600 ring-2 ring-pink-300 bg-pink-50 scale-[1.04] shadow-lg'
                      : 'hover:scale-105 hover:border-pink-400'
                  }
                `}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg sm:text-xl font-bold text-pink-700 mb-1">
                    {pkg.label}
                  </span>
                  <span className="text-gray-700 font-medium tracking-wide">
                    NPR {pkg.price.toLocaleString('en-US')}
                  </span>
                  {selectedId === pkg.id && (
                    <span className="absolute top-3 right-4 text-xs font-semibold text-pink-700 bg-pink-100 rounded-full px-3 py-1 shadow">
                      Selected
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div>
            <Button
              disabled={selectedId === null}
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white hover:from-pink-700 hover:to-pink-600 text-lg rounded-xl shadow-md py-3 transition-all"
            >
              {selectedId === null ? 'Select a Package' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
