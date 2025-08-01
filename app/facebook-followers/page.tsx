'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const fbPackages = [
  { id: 1, followers: 1000, label: '1K Followers', price: 499 },
  { id: 2, followers: 5000, label: '5K Followers', price: 3999 },
];

export default function FacebookFollowersPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const selected = fbPackages.find((p) => p.id === selectedId);
    if (!selected) return;

    const query = new URLSearchParams({
      platform: 'facebook',
      type: 'followers',
      amount: selected.followers.toString(),
      price: selected.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Facebook image */}
        <div className="w-full flex justify-center md:justify-end">
          <Image
            src="/facebook-banner.jpg"
            alt="Facebook Followers"
            width={320}
            height={320}
            className="rounded-2xl shadow-2xl object-cover"
            priority
          />
        </div>

        {/* Right: Product grid */}
        <div>
          <h1 className="text-center text-xl md:text-3xl font-bold text-blue-700 mb-3">
            Facebook Followers Top-Up
          </h1>
          <p className="text-gray-600 mb-8">
            Instantly boost your Facebook profile with real followers!
          </p>
          <div className="grid grid-cols-2 gap-6">
            {fbPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => handleSelect(pkg.id)}
                className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                  selectedId === pkg.id
                    ? 'bg-blue-100 border-blue-700 scale-[1.03]'
                    : 'hover:shadow-lg'
                }`}
              >
                <h3 className="text-xl font-semibold text-blue-700">
                  {pkg.label}
                </h3>
                <p className="text-gray-600 mt-2 font-medium">
                  NPR {pkg.price.toLocaleString('en-US')}
                </p>
                {selectedId === pkg.id && (
                  <div className="mt-3 text-sm text-blue-700 font-medium">
                    ✅ Selected
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              disabled={selectedId === null}
              onClick={handleBuyNow}
              className="bg-blue-700 text-white hover:bg-blue-800 px-6 py-3 text-lg rounded-xl transition-all duration-300 w-full"
            >
              {selectedId === null ? 'Select a Package' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
