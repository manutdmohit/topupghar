'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const levelPackages = [
  { id: 1, label: 'Level 6 (120💎)', level: 6, diamonds: 120, price: 70 },
  { id: 2, label: 'Level 10 (200💎)', level: 10, diamonds: 200, price: 115 },
  { id: 3, label: 'Level 15 (200💎)', level: 15, diamonds: 200, price: 115 },
  { id: 4, label: 'Level 20 (200💎)', level: 20, diamonds: 200, price: 115 },
  { id: 5, label: 'Level 25 (200💎)', level: 25, diamonds: 200, price: 115 },
  { id: 6, label: 'Level 30 (350💎)', level: 30, diamonds: 350, price: 140 },
  { id: 7, label: 'Level 30+ (1270💎)', level: 31, diamonds: 1270, price: 660 },
];

export default function FreeFireLevelUpPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const router = useRouter();

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
            src="/freefire-level-pass.jpg"
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
