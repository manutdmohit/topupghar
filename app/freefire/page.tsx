'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const diamondPackages = [
  { id: 1, diamonds: 100, price: 120 },
  { id: 2, diamonds: 310, price: 360 },
  { id: 3, diamonds: 530, price: 600 },
  { id: 4, diamonds: 1080, price: 1150 },
  { id: 5, diamonds: 2200, price: 2200 },
  { id: 6, diamonds: 5600, price: 5400 },
];

export default function FreeFireDiamondPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [formattedPrices, setFormattedPrices] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Format prices on the client to avoid SSR/client mismatch
    const formatted = diamondPackages.map((pkg) =>
      pkg.price.toLocaleString('ne-NP')
    );
    setFormattedPrices(formatted);
  }, []);

  const handleBuyNow = () => {
    if (selectedPackage === null) return;

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
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700">
          Free Fire Diamond Top-Up
        </h1>
        <p className="text-gray-600 mt-2">
          Top-up instantly using local payment methods
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

      {/* Diamond Packages */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {diamondPackages.map((pkg, index) => (
          <div
            key={pkg.id}
            onClick={() => setSelectedPackage(pkg.id)}
            className={`border p-5 rounded-xl text-center cursor-pointer transition-all ${
              selectedPackage === pkg.id
                ? 'bg-purple-100 border-purple-600'
                : 'hover:shadow-lg'
            }`}
          >
            <h3 className="text-xl font-semibold">{pkg.diamonds} Diamonds</h3>
            <p className="text-gray-500 mt-2">
              रू {formattedPrices[index] ?? pkg.price}
            </p>
            {selectedPackage === pkg.id && (
              <div className="mt-3 text-sm text-purple-700 font-medium">
                Selected
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Button
          disabled={selectedPackage === null}
          onClick={handleBuyNow}
          className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 text-lg rounded-xl"
        >
          {selectedPackage === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
