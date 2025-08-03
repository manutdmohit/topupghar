'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const youtubeSubscriberPackages = [
  { id: 1, label: '1k Subscribers', amount: 1000, price: 859 },
  { id: 2, label: '5k Subscribers', amount: 5000, price: 3929 },
  { id: 3, label: '10k Subscribers', amount: 10000, price: 6829 },
  { id: 4, label: '50k Subscribers', amount: 50000, price: 25600 },
];

export default function YouTubeSubscribersPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const pkg = youtubeSubscriberPackages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'youtube',
      type: 'subscribers',
      amount: pkg.amount.toString(),
      price: pkg.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-red-600">YouTube Subscribers</h1>
        <p className="text-gray-700 mt-2">
          Grow your channel with real subscribers. Select a package below and
          pay instantly.
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/youtube-subscriber.jpg"
            alt="YouTube Subscribers"
            width={300}
            height={300}
            className="rounded-xl shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {youtubeSubscriberPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.id)}
            className={`border p-5 rounded-xl text-center cursor-pointer transition-all duration-200
              ${
                selectedPackage === pkg.id
                  ? 'bg-red-100 border-red-500 scale-105'
                  : 'hover:shadow-md'
              }
            `}
          >
            <h3 className="text-lg font-semibold text-red-700">{pkg.label}</h3>
            <p className="text-gray-600 mt-2 font-medium">
              NPR {pkg.price.toLocaleString('en-US')}
            </p>
            {selectedPackage === pkg.id && (
              <div className="mt-3 text-sm text-red-700 font-medium">
                ✅ Selected
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
          className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-lg rounded-xl transition-all duration-200"
        >
          {selectedPackage === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
