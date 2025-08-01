'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const tiktokPackages = [
  { id: 1, coins: 50, label: '50 Coins', price: 90 },
  { id: 2, coins: 100, label: '100 Coins', price: 185 },
  { id: 3, coins: 200, label: '200 Coins', price: 360 },
  { id: 4, coins: 300, label: '300 Coins', price: 550 },
  { id: 5, coins: 400, label: '400 Coins', price: 710 },
  { id: 6, coins: 500, label: '500 Coins', price: 880 },
  { id: 7, coins: 600, label: '600 Coins', price: 1050 },
  { id: 8, coins: 700, label: '700 Coins', price: 1230 },
  { id: 9, coins: 800, label: '800 Coins', price: 1400 },
  { id: 10, coins: 900, label: '900 Coins', price: 1580 },
  { id: 11, coins: 1000, label: '1000 Coins', price: 1770 },
];

export default function TikTokCoinPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const selected = tiktokPackages.find((p) => p.id === selectedId);
    if (!selected) return;

    const query = new URLSearchParams({
      platform: 'tiktok',
      type: 'coins',
      amount: selected.coins.toString(),
      price: selected.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: TikTok Banner */}
        <div className="w-full flex justify-center md:justify-end">
          <Image
            src="/tiktok-banner.jpg"
            alt="TikTok Coins"
            width={500}
            height={500}
            className="rounded-3xl shadow-2xl object-cover border-4 border-black/10"
            priority
          />
        </div>

        {/* Right: Product Details & Grid */}
        <div className="w-full">
          <h1 className="text-4xl font-black text-black mb-2 tracking-tight flex items-center gap-2">
            <span className="text-[#ff0050]">TikTok</span>
            <span className="text-[#00f2ea]">Coin</span>
            <span>Top-Up</span>
          </h1>
          <p className="text-gray-700 mb-3">
            Select your package. Login details will be required on the next
            step.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-10">
            {tiktokPackages.map((pkg) => (
              <button
                type="button"
                key={pkg.id}
                onClick={() => handleSelect(pkg.id)}
                className={`
                  group border 
                  rounded-2xl 
                  p-5 
                  text-center 
                  font-semibold
                  transition-all duration-300
                  shadow-sm
                  focus-visible:ring-2 focus-visible:ring-[#ff0050]
                  ${
                    selectedId === pkg.id
                      ? 'border-[#ff0050] ring-2 ring-[#ff0050]/30 bg-[#fff1f5] scale-[1.04] shadow-lg'
                      : 'hover:scale-105 hover:border-[#ff0050]'
                  }
                `}
              >
                <span className="text-lg font-bold text-[#ff0050]">
                  {pkg.label}
                </span>
                <div className="text-gray-700 mt-2 text-base font-medium tracking-wide">
                  NPR {pkg.price.toLocaleString('en-US')}
                </div>
                {selectedId === pkg.id && (
                  <span className="absolute top-1 right-4 text-xs font-semibold text-[#ff0050] bg-[#fff1f5] rounded-full px-3 py-1 shadow">
                    Selected
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="sticky bottom-0 bg-white/90 pt-2 pb-6 sm:pt-0 sm:pb-0 z-30">
            <Button
              disabled={selectedId === null}
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-[#ff0050] to-[#00f2ea] text-white hover:from-[#e60046] hover:to-[#06d8da] text-lg rounded-xl shadow-md py-3 transition-all"
            >
              {selectedId === null ? 'Select a Package' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
