'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const skrillPackages = [
  { id: 1, usd: 5, price: 790 },
  { id: 2, usd: 10, price: 1470 },
  { id: 3, usd: 15, price: 2170 },
  { id: 4, usd: 20, price: 2850 },
  { id: 5, usd: 25, price: 3520 },
  { id: 6, usd: 30, price: 4190 },
];

export default function SkrillPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const router = useRouter();

  const handleSelect = (id: number) => setSelected(id === selected ? null : id);

  const handleBuyNow = () => {
    const pkg = skrillPackages.find((p) => p.id === selected);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'skrill',
      type: 'usd',
      amount: pkg.usd.toString(),
      price: pkg.price.toString(),
    });
    router.push(`/topup/payment?${query.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="md:text-4xl font-bold text-[#7225a3] flex items-center justify-center gap-2">
          <Image
            src="/skrill-logo.jpg"
            width={100}
            height={100}
            alt="Skrill"
            className="inline-block"
          />
          Skrill Balance Load
        </h1>
        <p className="text-gray-600 mt-2">
          Instantly load your Skrill balance. Just select an amount.
        </p>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        {skrillPackages.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => handleSelect(pkg.id)}
            className={`
              border-2 rounded-2xl px-7 py-6 text-center font-bold text-lg transition-all duration-300
              shadow-md bg-white relative
              ${
                selected === pkg.id
                  ? 'border-[#7225a3] ring-2 ring-[#7225a3]/30 scale-[1.04]'
                  : 'hover:border-[#7225a3] hover:scale-105'
              }
            `}
          >
            <span className="text-[#7225a3] text-xl">${pkg.usd} USD</span>
            <span className="block mt-2 text-gray-700 font-semibold text-lg">
              NPR {pkg.price.toLocaleString('en-US')}
            </span>
            {selected === pkg.id && (
              <span className="absolute top-1 right-4 text-xs font-semibold text-[#7225a3] bg-[#f3e8fd] rounded-full px-3 py-1 shadow">
                Selected
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Button
          disabled={!selected}
          onClick={handleBuyNow}
          className="bg-gradient-to-r from-[#7225a3] to-[#a78bfa] text-white hover:from-[#581c87] hover:to-[#a21caf] text-lg rounded-xl shadow-md px-6 py-3 transition-all"
        >
          {selected === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
