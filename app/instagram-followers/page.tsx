'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const instagramFollowersPackages = [
  { id: 1, label: '1,000 Followers', amount: 1000, price: 689 },
  { id: 2, label: '2,000 Followers', amount: 2000, price: 1199 },
  { id: 3, label: '5,000 Followers', amount: 5000, price: 2399 },
  { id: 4, label: '10,000 Followers', amount: 10000, price: 5149 },
  { id: 5, label: '20,000 Followers', amount: 20000, price: 6549 },
  { id: 6, label: '50,000 Followers', amount: 50000, price: 15349 },
  { id: 7, label: '100,000 Followers', amount: 100000, price: 27300 },
];

export default function InstagramFollowersPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const pkg = instagramFollowersPackages.find(
      (p) => p.id === selectedPackage
    );
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'instagram',
      type: 'followers',
      amount: pkg.amount.toString(),
      price: pkg.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700">
          Instagram Followers Packages
        </h1>
        <p className="text-gray-600 mt-2">
          Instantly boost your Instagram profile with genuine followers. Select
          your plan below!
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/instagram-followers.jpg"
            alt="Instagram Followers"
            width={300}
            height={300}
            className="rounded-xl shadow-lg bg-white"
          />
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {instagramFollowersPackages.map((pkg) => (
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
            <p className="text-gray-700 mt-2 font-medium">
              NPR {pkg.price.toLocaleString('en-US')}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              100% Real Followers | Fast Delivery
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
