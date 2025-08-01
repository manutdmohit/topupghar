'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const ytPackages = [
  { id: 1, label: '1 Month', duration: '1 Month', price: 159 },
  { id: 2, label: '1 Year', duration: '1 Year', price: 1699 },
];

export default function YouTubePremiumPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const selected = ytPackages.find((p) => p.id === selectedId);
    if (!selected) return;

    const query = new URLSearchParams({
      platform: 'youtube-premium',
      type: 'account',
      duration: selected.duration,
      price: selected.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left: YouTube Premium Image */}
        <div className="w-full flex justify-center md:justify-end">
          <Image
            src="/youtube-premium-banner.jpg"
            alt="YouTube Premium"
            width={360}
            height={220}
            className="rounded-2xl shadow-2xl object-cover"
            priority
          />
        </div>

        {/* Right: Product grid */}
        <div>
          <h1 className="text-3xl font-bold text-red-700 mb-3">
            YouTube Premium Top-Up
          </h1>
          <p className="text-gray-600 mb-8">
            Enjoy ad-free YouTube, background play, and more!
          </p>
          <div className="grid grid-cols-2 gap-6">
            {ytPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => handleSelect(pkg.id)}
                className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                  selectedId === pkg.id
                    ? 'bg-red-100 border-red-700 scale-[1.03]'
                    : 'hover:shadow-lg'
                }`}
              >
                <h3 className="text-xl font-semibold text-red-700">
                  {pkg.label}
                </h3>
                <p className="text-gray-600 mt-2 font-medium">
                  NPR {pkg.price.toLocaleString('en-US')}
                </p>
                {selectedId === pkg.id && (
                  <div className="mt-3 text-sm text-red-700 font-medium">
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
              className="bg-red-700 text-white hover:bg-red-800 px-6 py-3 text-lg rounded-xl transition-all duration-300 w-full"
            >
              {selectedId === null ? 'Select a Package' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
