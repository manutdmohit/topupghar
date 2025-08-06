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
  level: number | string;
  diamonds: number;
  price: number;
}

export default function FreeFireLevelUpPage() {
  const [levelPackages, setLevelPackages] = useState<Package[]>([]);
  const [image, setImage] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLevelPassProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/freefire-level-pass');

        if (!response.ok) {
          throw new Error('Failed to fetch Free Fire Level Pass product');
        }

        const product: Product = await response.json();

        setImage(product.image ?? '');

        // Transform product variants to packages
        const packages: Package[] = product.variants.map((variant, index) => {
          // Extract level and diamonds from label (e.g., "Level 30 (350💎)" -> level: 30, diamonds: 350)
          const levelMatch = variant.label.match(/Level (\d+)/);
          const diamondMatch = variant.label.match(/\((\d+)💎\)/);

          const level = levelMatch ? parseInt(levelMatch[1]) : 0;
          const diamonds = diamondMatch ? parseInt(diamondMatch[1]) : 0;

          return {
            id: index + 1,
            label: variant.label,
            level: variant.label.includes('Level 30+') ? '30(+)' : level,
            diamonds,
            price: variant.price,
          };
        });

        setLevelPackages(packages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching Free Fire Level Pass product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelPassProduct();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const pkg = levelPackages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'freefire',
      type: 'level-up',
      level: pkg.level.toString(),
      diamonds: pkg.diamonds.toString(),
      price: pkg.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <p className="mt-2 text-gray-600">
            Loading Free Fire Level Pass packages...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <p className="text-red-600">
            Error loading Free Fire Level Pass packages: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700">
          Free Fire Level-Up Packages
        </h1>
        <p className="text-gray-600 mt-2">
          Choose your desired level-up package and pay securely. Only UID
          required.
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src={image || '/freefire-level-pass.jpg'}
            alt="Free Fire Level Up"
            width={500}
            height={250}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Level Packages */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {levelPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.id)}
            className={`border p-5 rounded-xl text-center cursor-pointer transition-all duration-300 ${
              selectedPackage === pkg.id
                ? 'bg-purple-100 border-purple-600 scale-[1.02]'
                : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-lg font-semibold text-purple-700">
              {pkg.label}
            </h3>
            <p className="text-gray-600 mt-2 text-base">
              NPR {pkg.price.toLocaleString('en-US')}
            </p>
            {selectedPackage === pkg.id && (
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
          className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 text-lg rounded-xl transition-all duration-300"
        >
          {selectedPackage === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
