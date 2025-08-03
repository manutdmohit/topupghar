'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const primeVideoPackages = [
  {
    id: 1,
    label: '4K 5 Device Access (No Shopping) (1 Month)',
    type: '5 device access',
    duration: '1 Month',
    price: 299,
  },
  {
    id: 2,
    label: '4K 5 Device Access (No Shopping) (3 Months)',
    type: '5 device access',
    duration: '3 Months',
    price: 699,
  },
  {
    id: 3,
    label: '4K 5 Device Access (No Shopping) (6 Months)',
    type: '5 device access',
    duration: '6 Months',
    price: 1499,
  },
  {
    id: 4,
    label: '4K 5 Device Access (No Shopping) (1 Year)',
    type: '5 device access',
    duration: '1 Year',
    price: 3199,
  },
];

export default function PrimeVideoPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const pkg = primeVideoPackages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'prime video',
      type: 'subscription',
      duration: pkg.duration,
      price: pkg.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700">
          Prime Video 4K HD Subscription
        </h1>
        <p className="text-gray-600 mt-2">
          No shopping. Up to 5 device access. Choose your preferred plan below
          and top up instantly!
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="prime-video.jpg"
            alt="Prime Video"
            width={500}
            height={500}
            className="rounded-xl shadow-lg bg-white"
          />
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-2 gap-6">
        {primeVideoPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.id)}
            className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
              selectedPackage === pkg.id
                ? 'bg-purple-100 border-purple-600 scale-[1.02]'
                : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-lg font-semibold text-purple-700">
              {pkg.label} Plan
            </h3>
            <p className="text-gray-700 mt-2 font-medium">
              NPR {pkg.price.toLocaleString('en-US')}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              4K HD, No Shopping, <b>5 Device Access</b>
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
