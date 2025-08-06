'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface AdobeVariant {
  label: string;
  duration: string;
  price: number;
}

interface AdobeProduct {
  _id: string;
  name: string;
  platform: string;
  type: string;
  description: string;
  image: string;
  variants: AdobeVariant[];
  isActive: boolean;
}

export default function AdobeCreativeCloudPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [product, setProduct] = useState<AdobeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdobeProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/adobe-creative-cloud');

        if (!response.ok) {
          throw new Error('Failed to fetch Adobe Creative Cloud product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching Adobe Creative Cloud product:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdobeProduct();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    if (!product || selectedPackage === null) return;

    const selectedVariant = product.variants[selectedPackage - 1]; // Convert to 0-based index
    if (!selectedVariant) return;

    const query = new URLSearchParams({
      platform: 'adobe',
      type: 'creative-cloud',
      duration: selectedVariant.duration,
      price: selectedVariant.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            Loading Adobe Creative Cloud packages...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700">
          {product.name} – 1 Year
        </h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="mt-6 flex justify-center">
          <Image
            src={product.image || '/adobe-creative-cloud.jpg'}
            alt="Adobe Creative Cloud"
            width={500}
            height={500}
            className="rounded-xl shadow-lg bg-white"
          />
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 gap-6">
        {product.variants.map((variant, index) => (
          <div
            key={index + 1}
            onClick={() => handleSelect(index + 1)}
            className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
              selectedPackage === index + 1
                ? 'bg-purple-100 border-purple-600 scale-[1.02]'
                : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-xl font-semibold text-purple-700">
              {product.name} ({variant.label})
            </h3>
            <p className="text-gray-700 mt-2 font-medium">
              NPR {variant.price.toLocaleString('en-US')}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Full suite | {variant.duration} Access
            </div>
            {selectedPackage === index + 1 && (
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
          disabled={selectedPackage === null}
          onClick={handleBuyNow}
          className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-3 text-lg rounded-xl transition-all duration-300"
        >
          {selectedPackage === null ? 'Select Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
