'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const instagramViewsPackages = [
  {
    id: 1,
    label: '100,000 Views',
    amount: 100000,
    price: 599,
  },
  {
    id: 2,
    label: '200,000 Views',
    amount: 200000,
    price: 1049,
  },
  {
    id: 3,
    label: '500,000 Views',
    amount: 500000,
    price: 2049,
  },
  {
    id: 4,
    label: '1 Million Views',
    amount: 1000000,
    price: 3069,
  },
];

export default function InstagramViewsPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const pkg = instagramViewsPackages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'instagram',
      type: 'views',
      amount: pkg.amount.toString(),
      price: pkg.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700">
          Instagram Views Packages
        </h1>
        <p className="text-gray-600 mt-2">
          Boost your reach with real Instagram views. Fast & secure delivery.
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/instagram-views.jpg"
            alt="Instagram Views"
            width={400}
            height={400}
            className="rounded-xl shadow-lg bg-white"
          />
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-2 gap-6">
        {instagramViewsPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.id)}
            className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
              selectedPackage === pkg.id
                ? 'bg-purple-100 border-purple-600 scale-[1.02]'
                : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-xl font-semibold text-purple-700">
              {pkg.label}
            </h3>
            <p className="text-gray-700 mt-2 font-medium">
              NPR {pkg.price.toLocaleString('en-US')}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Quick Delivery | 100% Real Views
            </div>
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
          className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-3 text-lg rounded-xl transition-all duration-300"
        >
          {selectedPackage === null ? 'Select Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
