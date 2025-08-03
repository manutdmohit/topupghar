'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const facebookViewsPackages = [
  { id: 1, label: '100,000 Views', amount: 100000, price: 599 },
  { id: 2, label: '200,000 Views', amount: 200000, price: 1030 },
  { id: 3, label: '500,000 Views', amount: 500000, price: 2049 },
  { id: 4, label: '1 Million Views', amount: 1000000, price: 3069 },
];

export default function FacebookViewsPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const pkg = facebookViewsPackages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'facebook',
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
          Facebook Views Packages
        </h1>
        <p className="text-gray-600 mt-2">
          Instantly increase your Facebook reach with high-quality views.
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/facebook-views.jpg" // Replace with your own Facebook views promo image
            alt="Facebook Views"
            width={300}
            height={300}
            className="rounded-xl shadow-lg bg-white"
          />
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-2 gap-6">
        {facebookViewsPackages.map((pkg) => (
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
              Fast Delivery | Real Facebook Views
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
