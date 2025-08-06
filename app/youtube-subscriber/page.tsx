'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface YouTubeVariant {
  label: string;
  duration: string;
  price: number;
}

interface YouTubeProduct {
  _id: string;
  name: string;
  platform: string;
  type: string;
  description: string;
  image: string;
  variants: YouTubeVariant[];
  isActive: boolean;
}

export default function YouTubeSubscribersPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [product, setProduct] = useState<YouTubeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchYouTubeProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/youtube-subscriber');

        if (!response.ok) {
          throw new Error('Failed to fetch YouTube subscribers product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching YouTube subscribers product:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    fetchYouTubeProduct();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  // Helper function to format amount display (e.g., 50000 -> "50000 (50k)")
  const formatAmountDisplay = (amount: string) => {
    const num = parseInt(amount);
    if (num >= 1000) {
      const kValue = Math.floor(num / 1000);
      return `${num.toLocaleString()} (${kValue}k)`;
    }
    return num.toLocaleString();
  };

  const handleBuyNow = () => {
    if (!product || selectedPackage === null) return;

    const selectedVariant = product.variants[selectedPackage - 1]; // Convert to 0-based index
    if (!selectedVariant) return;

    console.log('Selected variant:', selectedVariant);
    console.log('Label:', selectedVariant.label);
    console.log('Duration:', selectedVariant.duration);

    // Extract amount from the label (e.g., "1k Subscribers" -> "1000", "1,000 Subscribers" -> "1000")
    let amount = selectedVariant.label
      .replace(/[^\d,k]/g, '') // Keep digits, commas, and 'k'
      .replace(/,/g, ''); // Remove commas

    // Handle 'k' suffix (multiply by 1000)
    if (amount.includes('k')) {
      const number = amount.replace('k', '');
      amount = (parseInt(number) * 1000).toString();
    }

    console.log('Extracted amount:', amount);

    const query = new URLSearchParams({
      platform: 'youtube',
      type: 'subscribers',
      amount: amount,
      price: selectedVariant.price.toString(),
    });

    console.log('Query string:', query.toString());
    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            Loading YouTube subscriber packages...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-red-600">{product.name}</h1>
        <p className="text-gray-700 mt-2">{product.description}</p>
        <div className="mt-6 flex justify-center">
          <Image
            src={product.image || '/youtube-subscriber.jpg'}
            alt="YouTube Subscribers"
            width={300}
            height={300}
            className="rounded-xl shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {product.variants.map((variant, index) => (
          <div
            key={index + 1}
            onClick={() => handleSelect(index + 1)}
            className={`border p-5 rounded-xl text-center cursor-pointer transition-all duration-200
              ${
                selectedPackage === index + 1
                  ? 'bg-red-100 border-red-500 scale-105'
                  : 'hover:shadow-md'
              }
            `}
          >
            <h3 className="text-lg font-semibold text-red-700">
              {variant.label}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatAmountDisplay(
                variant.label
                  .replace(/[^\d,k]/g, '')
                  .replace(/,/g, '')
                  .includes('k')
                  ? (
                      parseInt(
                        variant.label
                          .replace(/[^\d,k]/g, '')
                          .replace(/,/g, '')
                          .replace('k', '')
                      ) * 1000
                    ).toString()
                  : variant.label.replace(/[^\d,k]/g, '').replace(/,/g, '')
              )}
            </p>
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

      {/* CTA */}
      <div className="mt-10 text-center">
        <Button
          disabled={selectedPackage === null}
          onClick={handleBuyNow}
          className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-lg rounded-xl transition-all duration-200"
        >
          {selectedPackage === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
