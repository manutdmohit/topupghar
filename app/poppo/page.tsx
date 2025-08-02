'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const poppoPackages = [
  { id: 1, coins: 1000, label: '1,000 Coins', price: 80 },
  { id: 2, coins: 10000, label: '10,000 Coins', price: 220 },
  { id: 3, coins: 20000, label: '20,000 Coins', price: 380 },
  { id: 4, coins: 24600, label: '24,600 Coins', price: 460 },
  { id: 5, coins: 25500, label: '25,500 Coins', price: 490 },
  { id: 6, coins: 50000, label: '50,000 Coins', price: 850 },
  { id: 7, coins: 83000, label: '83,000 Coins', price: 1320 },
  { id: 8, coins: 100000, label: '100,000 Coins', price: 1630 },
  { id: 9, coins: 200000, label: '200,000 Coins', price: 3250 },
];

export default function PoppoLiveCoinPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = () => {
    const selected = poppoPackages.find((p) => p.id === selectedId);
    if (!selected) return;

    const query = new URLSearchParams({
      platform: 'poppo',
      type: 'coins',
      amount: selected.coins.toString(),
      price: selected.price.toString(),
    });

    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Poppo Banner */}
        <div className="w-full flex justify-center md:justify-end animate-fade-in">
          <Image
            src="/poppo-banner.jpg"
            alt="Poppo Live Coins"
            width={340}
            height={340}
            className="rounded-3xl shadow-2xl object-cover border-4 border-pink-200"
            priority
          />
        </div>

        {/* Right: Product Grid & Details */}
        <div className="w-full">
          <div className="mb-7">
            <h1 className="text-4xl font-bold text-pink-700 mb-2 drop-shadow-[0_1px_2px_rgba(219,39,119,0.1)]">
              Poppo Live Coin Top-Up
            </h1>
            <p className="text-gray-700 text-base mb-2">
              Secure, instant top-up for Poppo Live. <br />
              <span className="font-semibold text-pink-500">
                Only User ID required. No password needed.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-10">
            {poppoPackages.map((pkg) => (
              <button
                type="button"
                key={pkg.id}
                onClick={() => handleSelect(pkg.id)}
                className={`
                  group border 
                  rounded-2xl 
                  p-6 
                  text-center 
                  font-medium
                  relative 
                  transition-all duration-300
                  shadow-sm
                  outline-none
                  focus-visible:ring-2 focus-visible:ring-pink-400
                  ${
                    selectedId === pkg.id
                      ? 'border-pink-600 ring-2 ring-pink-300 bg-pink-50 scale-[1.04] shadow-lg'
                      : 'hover:scale-105 hover:border-pink-400'
                  }
                `}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg sm:text-xl font-bold text-pink-700 mb-1">
                    {pkg.label}
                  </span>
                  <span className="text-gray-700 font-medium tracking-wide">
                    NPR {pkg.price.toLocaleString('en-US')}
                  </span>
                  {selectedId === pkg.id && (
                    <span className="absolute top-3 right-4 text-xs font-semibold text-pink-700 bg-pink-100 rounded-full px-3 py-1 shadow">
                      Selected
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="sticky bottom-0 bg-white/90 pt-2 pb-6 sm:pt-0 sm:pb-0 z-30">
            <Button
              disabled={selectedId === null}
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white hover:from-pink-700 hover:to-pink-600 text-lg rounded-xl shadow-md py-3 transition-all"
            >
              {selectedId === null ? 'Select a Package' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
