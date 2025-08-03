'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const perplexityPackages = [
  {
    id: 1,
    label: 'Perplexity AI Pro (1 Year)',
    duration: '1 Year',
    price: 1600,
  },
];

export default function PerplexityYearlyPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const pkg = perplexityPackages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'perplexity',
      type: 'pro',
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
          Perplexity AI 1 Year Pro
        </h1>
        <p className="text-gray-600 mt-2">
          Get Perplexity Pro for a full year at the best price. Fast, reliable
          delivery after payment.
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/perplexity.jpg"
            alt="Perplexity AI"
            width={300}
            height={300}
            className="rounded-xl shadow-lg bg-white"
          />
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 gap-6">
        {perplexityPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.id)}
            className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
              selectedPackage === pkg.id
                ? 'bg-purple-100 border-purple-600 scale-[1.02]'
                : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-xl font-semibold text-purple-700">
              {pkg.label}
            </h3>
            <p className="text-gray-600 mt-2 text-base font-medium">
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
          className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-3 text-lg rounded-xl transition-all duration-300"
        >
          {selectedPackage === null ? 'Select Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
