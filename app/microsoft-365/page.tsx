'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const ms365Packages = [
  {
    id: 1,
    label: 'With 100GB Storage (1 Year)',
    storage: '100GB',
    duration: '1 Year',
    price: 2599,
    type: 'with-storage',
  },
  {
    id: 2,
    label: 'Without Storage (1 Year)',
    storage: 'No Extra',
    duration: '1 Year',
    price: 2099,
    type: 'without-storage',
  },
];

export default function Microsoft365Page() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const pkg = ms365Packages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'microsoft-365',
      type: pkg.type,
      duration: pkg.duration,
      price: pkg.price.toString(),
      storage: pkg.storage,
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700">
          Microsoft 365 (1 Year)
        </h1>
        <p className="text-gray-600 mt-2">
          Choose your preferred storage option for your annual Microsoft 365
          subscription. Instant delivery after payment!
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/microsoft-365.jpg"
            alt="Microsoft 365"
            width={500}
            height={500}
            className="rounded-xl shadow-lg bg-white"
          />
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-2 gap-6">
        {ms365Packages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.id)}
            className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
              selectedPackage === pkg.id
                ? 'bg-purple-100 border-purple-600 scale-[1.02]'
                : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-lg font-semibold text-purple-700">
              {pkg.label}
            </h3>
            <p className="text-gray-700 mt-2 font-medium">
              NPR {pkg.price.toLocaleString('en-US')}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              {pkg.storage === '100GB'
                ? 'Includes 100GB OneDrive Storage'
                : 'No Extra Cloud Storage'}
            </div>
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
