'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const evoAccessPackages = [
  {
    id: 1,
    label: '3 Days Evo Access',
    type: 'evo-access',
    duration: '3 Days',
    price: 95,
  },
  {
    id: 2,
    label: '7 Days Evo Access',
    type: 'evo-access',
    duration: '7 Days',
    price: 135,
  },
  {
    id: 3,
    label: '30 Days Evo Access',
    type: 'evo-access',
    duration: '30 Days',
    price: 370,
  },
];

export default function FreeFireEvoAccessPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const pkg = evoAccessPackages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'freefire',
      type: pkg.type,
      duration: pkg.duration,
      price: pkg.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-xl text-left font-bold text-purple-700">
          Get Free Fire Evo Access instantly at the best price in Nepal! Unlock
          exclusive features and rewards with Evo Access membership.
        </h1>
        <p className="text-gray-600 mt-2">
          Select a duration below and pay using your preferred method. Only UID
          required 🤩
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/free-fire.jpg"
            alt="Free Fire Evo Access"
            width={600}
            height={300}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {evoAccessPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.id)}
            className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
              selectedPackage === pkg.id
                ? 'bg-purple-100 border-purple-600 scale-[1.02]'
                : 'hover:shadow-md'
            }`}
          >
            <div className="mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-700">
                {pkg.label}
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 font-medium">
                Duration: {pkg.duration}
              </p>
              <p className="text-2xl font-bold text-purple-700">
                NPR {pkg.price.toLocaleString('en-US')}
              </p>
              <p className="text-sm text-gray-500">
                Exclusive Evo Access benefits
              </p>
            </div>
            {selectedPackage === pkg.id && (
              <div className="mt-4 text-sm text-purple-700 font-medium">
                ✅ Selected
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-purple-700 mb-4 text-center">
          Evo Access Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">Exclusive Evo Rewards</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">Premium Battle Pass</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">Special Evo Events</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">Unique Character Skins</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">Bonus Diamonds</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">✓</span>
            <span className="text-gray-700">Priority Support</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-10 text-center">
        <Button
          disabled={selectedPackage === null}
          onClick={handleBuyNow}
          className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-4 text-lg rounded-xl transition-all duration-300"
        >
          {selectedPackage === null ? 'Select a Package' : 'Buy Evo Access Now'}
        </Button>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>• Instant activation after payment</p>
        <p>• 24/7 customer support</p>
        <p>• Secure payment processing</p>
      </div>
    </div>
  );
}
