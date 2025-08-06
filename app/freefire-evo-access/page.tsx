'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Variant {
  label: string;
  duration: string;
  price: number;
}

interface Product {
  name: string;
  description: string;
  image: string;
  variants: Variant[];
}

export default function FreeFireEvoAccessPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products/freefire-evo-access');
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleSelect = (index: number) => {
    setSelectedPackage((prev) => (prev === index ? null : index));
  };

  const handleBuyNow = () => {
    if (!product || selectedPackage === null) return;

    const selectedVariant = product.variants[selectedPackage];
    if (!selectedVariant) return;

    const query = new URLSearchParams({
      platform: 'freefire',
      type: 'evo-access',
      duration: selectedVariant.duration,
      price: selectedVariant.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center">
          <p className="text-red-600">
            Error: {error || 'Failed to load product data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-xl text-left font-bold text-purple-700">
          {product.name}
        </h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="mt-6 flex justify-center">
          <Image
            src={product.image || '/free-fire.jpg'}
            alt="Free Fire Evo Access"
            width={600}
            height={300}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {product.variants.map((variant, index) => (
          <div
            key={index}
            onClick={() => handleSelect(index)}
            className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
              selectedPackage === index
                ? 'bg-purple-100 border-purple-600 scale-[1.02]'
                : 'hover:shadow-md'
            }`}
          >
            <div className="mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-700">
                {variant.label}
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 font-medium">
                Duration: {variant.duration}
              </p>
              <p className="text-2xl font-bold text-purple-700">
                NPR {variant.price.toLocaleString('en-US')}
              </p>
              <p className="text-sm text-gray-500">
                Exclusive Evo Access benefits
              </p>
            </div>
            {selectedPackage === index && (
              <div className="mt-4 text-sm text-purple-700 font-medium">
                ✅ Selected
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-purple-700 mb-4 text-center">
          Evo Access Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">Exclusive Evo Rewards</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">Premium Battle Pass</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">Special Evo Events</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">Unique Character Skins</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">Bonus Diamonds</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">Priority Support</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-10 text-center">
        <Button
          disabled={selectedPackage === null}
          onClick={handleBuyNow}
          className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-4 text-lg rounded-xl transition-all duration-300"
        >
          {selectedPackage === null ? 'Select a Package' : 'Buy Evo Access Now'}
        </Button>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>• Instant activation after payment</p>
        <p>• 24/7 customer support</p>
        <p>• Secure payment processing</p>
      </div>
    </div>
  );
}
