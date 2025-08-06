'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Microsoft365Variant {
  label: string;
  duration: string;
  price: number;
}

interface Microsoft365Product {
  _id: string;
  name: string;
  platform: string;
  type: string;
  description: string;
  image: string;
  variants: Microsoft365Variant[];
  isActive: boolean;
}

export default function Microsoft365Page() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [product, setProduct] = useState<Microsoft365Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMicrosoft365Product = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/microsoft-365');

        if (!response.ok) {
          throw new Error('Failed to fetch Microsoft 365 product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching Microsoft 365 product:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    fetchMicrosoft365Product();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    if (!product || selectedPackage === null) return;

    const selectedVariant = product.variants[selectedPackage - 1]; // Convert to 0-based index
    if (!selectedVariant) return;

    // Determine storage type based on variant label
    const isWithStorage = selectedVariant.label.includes('100GB');
    const storageType = isWithStorage ? 'with-storage' : 'without-storage';
    const storageValue = isWithStorage ? '100GB' : 'No Extra';

    const query = new URLSearchParams({
      platform: 'microsoft-365',
      type: storageType,
      duration: selectedVariant.duration,
      price: selectedVariant.price.toString(),
      storage: storageValue,
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Microsoft 365 packages...</p>
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
          {product.name} (1 Year)
        </h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="mt-6 flex justify-center">
          <Image
            src={product.image || '/microsoft-365.jpg'}
            alt="Microsoft 365"
            width={500}
            height={500}
            className="rounded-xl shadow-lg bg-white"
          />
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-2 gap-6">
        {product.variants.map((variant, index) => {
          const isWithStorage = variant.label.includes('100GB');
          return (
            <div
              key={index + 1}
              onClick={() => handleSelect(index + 1)}
              className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                selectedPackage === index + 1
                  ? 'bg-purple-100 border-purple-600 scale-[1.02]'
                  : 'hover:shadow-md'
              }`}
            >
              <h3 className="text-lg font-semibold text-purple-700">
                {variant.label}
              </h3>
              <p className="text-gray-700 mt-2 font-medium">
                NPR {variant.price.toLocaleString('en-US')}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {isWithStorage
                  ? 'Includes 100GB OneDrive Storage'
                  : 'No Extra Cloud Storage'}
              </div>
              {selectedPackage === index + 1 && (
                <div className="mt-3 text-sm text-purple-700 font-medium">
                  ✅ Selected
                </div>
              )}
            </div>
          );
        })}
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
