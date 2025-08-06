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

export default function TikTokCoinPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products/tiktok-coin');
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

    // Extract amount from duration (e.g., "400 Coins" -> "400")
    const amount = selectedVariant.duration.replace(/[^\d]/g, '');

    const query = new URLSearchParams({
      platform: 'tiktok',
      type: 'coins',
      amount: amount,
      price: selectedVariant.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-2 sm:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff0050] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto px-2 sm:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600">
            Error: {error || 'Failed to load product data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: TikTok Banner */}
        <div className="w-full flex justify-center md:justify-end">
          <Image
            src={product.image || '/tiktok-banner.jpg'}
            alt="TikTok Coins"
            width={500}
            height={500}
            className="rounded-3xl shadow-2xl object-cover border-4 border-black/10"
            priority
          />
        </div>

        {/* Right: Product Details & Grid */}
        <div className="w-full">
          <h1 className="text-4xl font-black text-black mb-2 tracking-tight flex items-center gap-2">
            <span className="text-[#ff0050]">{product.name}</span>
          </h1>
          <p className="text-gray-700 mb-3">{product.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-10">
            {product.variants.map((variant, index) => (
              <button
                type="button"
                key={index}
                onClick={() => handleSelect(index)}
                className={`
                  group border 
                  rounded-2xl 
                  p-5 
                  text-center 
                  font-semibold
                  transition-all duration-300
                  shadow-sm
                  focus-visible:ring-2 focus-visible:ring-[#ff0050]
                  ${
                    selectedPackage === index
                      ? 'border-[#ff0050] ring-2 ring-[#ff0050]/30 bg-[#fff1f5] scale-[1.04] shadow-lg'
                      : 'hover:scale-105 hover:border-[#ff0050]'
                  }
                `}
              >
                <span className="text-lg font-bold text-[#ff0050]">
                  {variant.label}
                </span>
                <div className="text-gray-700 mt-2 text-base font-medium tracking-wide">
                  NPR {variant.price.toLocaleString('en-US')}
                </div>
                {selectedPackage === index && (
                  <span className="absolute top-1 right-4 text-xs font-semibold text-[#ff0050] bg-[#fff1f5] rounded-full px-3 py-1 shadow">
                    Selected
                  </span>
                )}
              </button>
            ))}
          </div>
          <div>
            <Button
              disabled={selectedPackage === null}
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-[#ff0050] to-[#00f2ea] text-white hover:from-[#e60046] hover:to-[#06d8da] text-lg rounded-xl shadow-md py-3 transition-all"
            >
              {selectedPackage === null ? 'Select a Package' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
