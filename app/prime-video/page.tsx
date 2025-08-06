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
  _id: string;
  name: string;
  platform: string;
  type: string;
  description?: string;
  image?: string;
  variants: Variant[];
  inStock: boolean;
  isActive: boolean;
}

export default function PrimeVideoPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products/prime-video');
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
      platform: 'prime-video',
      type: product.type,
      duration: selectedVariant.duration,
      price: selectedVariant.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Prime Video packages...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">
            {error ||
              'Failed to load Prime Video packages. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700">
          {product.name} 4K HD Subscription
        </h1>
        <p className="text-gray-600 mt-2">
          {product.description ||
            'No shopping. Up to 5 device access. Choose your preferred plan below and top up instantly!'}
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src={product.image || '/prime-video.jpg'}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-xl shadow-lg bg-white"
          />
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-2 gap-6">
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
            <h3 className="text-lg font-semibold text-purple-700">
              {variant.label} Plan
            </h3>
            <p className="text-gray-700 mt-2 font-medium">
              NPR {variant.price.toLocaleString('en-US')}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              4K HD, No Shopping, <b>5 Device Access</b>
            </div>
            {selectedPackage === index && (
              <div className="mt-3 text-sm text-purple-700 font-medium">
                ✅ Selected
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-10 text-center">
        <Button
          disabled={selectedPackage === null || !product.inStock}
          onClick={handleBuyNow}
          className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-3 text-lg rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!product.inStock
            ? 'Out of Stock'
            : selectedPackage === null
            ? 'Select Package'
            : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
