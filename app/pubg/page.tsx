'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const pubgPackages = [
  { id: 1, uc: 60, label: '60 UC', price: 150 },
  { id: 2, uc: 120, label: '120 UC', price: 280 },
  { id: 3, uc: 325, label: '325 UC', price: 710 },
  { id: 4, uc: 660, label: '660 UC', price: 1420 },
  { id: 5, uc: 1800, label: '1800 UC', price: 3450 },
];

export default function PUBGTopupPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const selected = pubgPackages.find((p) => p.id === selectedId);
    if (!selected) return;

    const query = new URLSearchParams({
      platform: 'pubg',
      type: 'uc',
      amount: selected.uc.toString(),
      price: selected.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-yellow-600">
          PUBG Mobile UC Top-Up
        </h1>
        <p className="text-gray-600 mt-2">
          Recharge UC instantly using local payment methods. Only PUBG ID
          required 🤩
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/pubg-banner.jpg"
            alt="PUBG"
            width={600}
            height={300}
            className="rounded-xl shadow-lg"
            priority // Ensures hydration safety
          />
        </div>
      </div>

      {/* Packages */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pubgPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.id)}
            className={`border p-5 rounded-xl text-center cursor-pointer transition-all duration-300 ${
              selectedId === pkg.id
                ? 'bg-yellow-100 border-yellow-600 scale-[1.02]'
                : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-xl font-semibold text-yellow-700">
              {pkg.label}
            </h3>
            <p className="text-gray-600 mt-2 font-medium">रू {pkg.price}</p>
            {selectedId === pkg.id && (
              <div className="mt-3 text-sm text-yellow-700 font-medium">
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
          className="bg-yellow-600 text-white hover:bg-yellow-700 px-6 py-3 text-lg rounded-xl transition-all duration-300"
        >
          {selectedId === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
