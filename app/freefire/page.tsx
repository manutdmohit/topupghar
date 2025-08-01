'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const diamondPackages = [
  { id: 1, label: '25💎', diamonds: 25, price: 30 },
  { id: 2, label: '50💎', diamonds: 50, price: 55 },
  { id: 3, label: '115💎', diamonds: 115, price: 95 },
  { id: 4, label: '240💎', diamonds: 240, price: 185 },
  { id: 5, label: '355💎', diamonds: 355, price: 285 },
  { id: 6, label: '480💎', diamonds: 480, price: 385 },
  { id: 7, label: '530💎', diamonds: 530, price: 425 },
  { id: 8, label: '610💎', diamonds: 610, price: 465 },
  { id: 9, label: '725💎', diamonds: 725, price: 570 },
  { id: 10, label: '850💎', diamonds: 850, price: 660 },
  { id: 11, label: '1090💎', diamonds: 1090, price: 860 },
  { id: 12, label: '1240💎', diamonds: 1240, price: 940 },
  { id: 13, label: '1355💎', diamonds: 1355, price: 1090 },
  { id: 14, label: '1480💎', diamonds: 1480, price: 1190 },
  { id: 15, label: '1595💎', diamonds: 1595, price: 1290 },
  { id: 16, label: '1720💎', diamonds: 1720, price: 1390 },
  { id: 17, label: 'Weekly Membership (455💎)', diamonds: 455, price: 185 },
  { id: 18, label: 'Monthly Membership (2500💎)', diamonds: 2500, price: 930 },
  { id: 19, label: 'Airdrop', diamonds: 0, price: 150 },
];

export default function FreeFireDiamondPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const pkg = diamondPackages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'freefire',
      type: 'diamonds',
      amount: pkg.diamonds.toString(),
      price: pkg.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700">
          Free Fire Diamond Top-Up
        </h1>
        <p className="text-gray-600 mt-2">
          Select a package below and pay using your preferred method. Only UID
          required 🤩
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/free-fire.jpg"
            alt="Free Fire"
            width={600}
            height={300}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-2  md:grid-cols-3 gap-6">
        {diamondPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.id)}
            className={`border p-5 rounded-xl text-center cursor-pointer transition-all duration-300 ${
              selectedPackage === pkg.id
                ? 'bg-purple-100 border-purple-600 scale-[1.02]'
                : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-xl font-semibold text-purple-700">
              {pkg.label}
            </h3>
            <p className="text-gray-600 mt-2 font-medium">
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
