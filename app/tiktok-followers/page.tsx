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

export default function TikTokFollowersPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products/tiktok-followers');
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

    // Extract amount from duration (e.g., "10k Followers" -> "10k")
    const amount = selectedVariant.duration.replace(' Followers', '');

    const query = new URLSearchParams({
      platform: 'tiktok',
      type: 'followers',
      amount: amount,
      price: selectedVariant.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff0050] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center">
          <p className="text-red-600">
            Error: {error || 'Failed to load product data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#ff0050]">{product.name}</h1>
        <p className="text-gray-700 mt-2">{product.description}</p>
        <div className="mt-6 flex justify-center">
          <Image
            src={product.image || '/tiktok-views.jpg'}
            alt="TikTok Followers"
            width={540}
            height={270}
            className="rounded-xl shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {product.variants.map((variant, index) => (
          <div
            key={index}
            onClick={() => handleSelect(index)}
            className={`border p-5 rounded-xl text-center cursor-pointer transition-all duration-200
              ${
                selectedPackage === index
                  ? 'bg-pink-100 border-pink-500 scale-105'
                  : 'hover:shadow-md'
              }
            `}
          >
            <h3 className="text-xl font-semibold text-[#ff0050]">
              {variant.label}
            </h3>
            <div className="text-xs text-gray-500 mb-2">TikTok Followers</div>
            <p className="text-gray-700 mt-2 font-medium">
              NPR {variant.price.toLocaleString('en-US')}
            </p>
            {selectedPackage === index && (
              <div className="mt-3 text-sm text-[#ff0050] font-medium">
                ✅ Selected
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-10 text-center">
        <Button
          disabled={selectedPackage === null}
          onClick={handleBuyNow}
          className="bg-[#ff0050] text-white hover:bg-pink-700 px-6 py-3 text-lg rounded-xl transition-all duration-200"
        >
          {selectedPackage === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
