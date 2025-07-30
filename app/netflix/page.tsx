'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const netflixPackages = [
  { id: 1, label: '1 Month', duration: '1 Month', price: 425 },
  { id: 2, label: '3 Months', duration: '3 Months', price: 1175 },
  { id: 3, label: '6 Months', duration: '6 Months', price: 2200 },
  { id: 4, label: '12 Months', duration: '12 Months', price: 3450 },
];

export default function NetflixPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const selected = netflixPackages.find((p) => p.id === selectedId);
    if (!selected) return;

    const query = new URLSearchParams({
      platform: 'netflix',
      type: 'account',
      duration: selected.duration, // "3 Months", "1 Month", etc.
      price: selected.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Image Left */}
        <div className="w-full flex justify-center md:justify-end">
          <Image
            src="/netflix-banner.jpg"
            alt="Netflix"
            width={440}
            height={260}
            className="rounded-2xl shadow-2xl object-cover"
            priority
          />
        </div>

        {/* Grid & Info Right */}
        <div>
          <h1 className="text-4xl font-bold text-red-600 mb-3">
            Netflix Account Pricing
          </h1>
          <p className="text-gray-600 mb-8">
            Choose your subscription period and enjoy Netflix instantly!
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {netflixPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => handleSelect(pkg.id)}
                className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                  selectedId === pkg.id
                    ? 'bg-red-100 border-red-600 scale-[1.03]'
                    : 'hover:shadow-lg'
                }`}
              >
                <h3 className="text-xl font-semibold text-red-700">
                  {pkg.label}
                </h3>
                <p className="text-gray-600 mt-2 font-medium">₹ {pkg.price}</p>
                {selectedId === pkg.id && (
                  <div className="mt-3 text-sm text-red-700 font-medium">
                    ✅ Selected
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Button
              disabled={selectedId === null}
              onClick={handleBuyNow}
              className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-lg rounded-xl transition-all duration-300 w-full"
            >
              {selectedId === null ? 'Select a Package' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
