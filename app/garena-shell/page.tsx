'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const garenaPackages = [
  { id: 1, shells: 200, label: '200 Shell', price: 550 },
  { id: 2, shells: 500, label: '500 Shell', price: 1390 },
  { id: 3, shells: 1000, label: '1000 Shell', price: 2780 },
  { id: 4, shells: 3000, label: '3000 Shell', price: 8270 },
];

export default function GarenaShellPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const selected = garenaPackages.find((p) => p.id === selectedId);
    if (!selected) return;

    const query = new URLSearchParams({
      platform: 'garena',
      type: 'shell',
      amount: selected.shells.toString(),
      price: selected.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-amber-600">
          Garena Shell Top-Up
        </h1>
        <p className="text-gray-600 mt-2">
          Buy Garena Shells instantly using local payment methods.
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/garena-banner.jpg"
            alt="Garena Shell"
            width={600}
            height={300}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Packages */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {garenaPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.id)}
            className={`border p-5 rounded-xl text-center cursor-pointer transition-all duration-300 ${
              selectedId === pkg.id
                ? 'bg-amber-100 border-amber-600 scale-[1.02]'
                : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-xl font-semibold text-amber-700">
              {pkg.label}
            </h3>
            <p className="text-gray-600 mt-2 font-medium">रू {pkg.price}</p>
            {selectedId === pkg.id && (
              <div className="mt-3 text-sm text-amber-700 font-medium">
                ✅ Selected
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Button
          disabled={selectedId === null}
          onClick={handleBuyNow}
          className="bg-amber-600 text-white hover:bg-amber-700 px-6 py-3 text-lg rounded-xl transition-all duration-300"
        >
          {selectedId === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
