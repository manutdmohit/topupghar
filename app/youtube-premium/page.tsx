'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface YouTubePremiumVariant {
  label: string;
  duration: string;
  price: number;
}

interface YouTubePremiumProduct {
  _id: string;
  name: string;
  platform: string;
  type: string;
  description: string;
  image: string;
  variants: YouTubePremiumVariant[];
  isActive: boolean;
}

export default function YouTubePremiumPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [product, setProduct] = useState<YouTubePremiumProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchYouTubePremiumProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/youtube-premium');

        if (!response.ok) {
          throw new Error('Failed to fetch YouTube Premium product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching YouTube Premium product:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    fetchYouTubePremiumProduct();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    if (!product || selectedPackage === null) return;

    const selectedVariant = product.variants[selectedPackage - 1]; // Convert to 0-based index
    if (!selectedVariant) return;

    const query = new URLSearchParams({
      platform: 'youtube-premium',
      type: 'account',
      duration: selectedVariant.duration,
      price: selectedVariant.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading YouTube Premium packages...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left: YouTube Premium Image */}
        <div className="w-full flex justify-center md:justify-end">
          <Image
            src={product.image || '/youtube-premium-banner.jpg'}
            alt="YouTube Premium"
            width={360}
            height={220}
            className="rounded-2xl shadow-2xl object-cover"
            priority
          />
        </div>

        {/* Right: Product grid */}
        <div>
          <h1 className="text-3xl font-bold text-red-700 mb-3">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-8">{product.description}</p>
          <div className="grid grid-cols-2 gap-6">
            {product.variants.map((variant, index) => (
              <div
                key={index + 1}
                onClick={() => handleSelect(index + 1)}
                className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                  selectedPackage === index + 1
                    ? 'bg-red-100 border-red-700 scale-[1.03]'
                    : 'hover:shadow-lg'
                }`}
              >
                <h3 className="text-xl font-semibold text-red-700">
                  {variant.label}
                </h3>
                <p className="text-gray-600 mt-2 font-medium">
                  NPR {variant.price.toLocaleString('en-US')}
                </p>
                {selectedPackage === index + 1 && (
                  <div className="mt-3 text-sm text-red-700 font-medium">
                    ✅ Selected
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              disabled={selectedPackage === null}
              onClick={handleBuyNow}
              className="bg-red-700 text-white hover:bg-red-800 px-6 py-3 text-lg rounded-xl transition-all duration-300 w-full"
            >
              {selectedPackage === null ? 'Select a Package' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
