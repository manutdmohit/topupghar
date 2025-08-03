'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const tiktokLikePackages = [
  { id: 1, label: '10k', amount: '10k', price: 699 },
  { id: 2, label: '25k', amount: '25k', price: 1549 },
  { id: 3, label: '50k', amount: '50k', price: 2599 },
];

export default function TikTokLikesPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const pkg = tiktokLikePackages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'tiktok',
      type: 'likes',
      amount: pkg.amount.toString(),
      price: pkg.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#ff0050]">TikTok Likes</h1>
        <p className="text-gray-700 mt-2">
          Boost your TikTok with real likes. Select a package and top up
          instantly.
        </p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/tiktok-views.jpg"
            alt="TikTok Likes"
            width={540}
            height={270}
            className="rounded-xl shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {tiktokLikePackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelect(pkg.id)}
            className={`border p-5 rounded-xl text-center cursor-pointer transition-all duration-200
              ${
                selectedPackage === pkg.id
                  ? 'bg-pink-100 border-pink-500 scale-105'
                  : 'hover:shadow-md'
              }
            `}
          >
            <h3 className="text-xl font-semibold text-[#ff0050]">
              {pkg.label}
            </h3>
            <div className="text-xs text-gray-500 mb-2">TikTok Likes</div>
            <p className="text-gray-700 mt-2 font-medium">
              NPR {pkg.price.toLocaleString('en-US')}
            </p>
            {selectedPackage === pkg.id && (
              <div className="mt-3 text-sm text-[#ff0050] font-medium">
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
          className="bg-[#ff0050] text-white hover:bg-pink-700 px-6 py-3 text-lg rounded-xl transition-all duration-200"
        >
          {selectedPackage === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
