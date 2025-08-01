'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const paypalPackages = [
  { id: 1, usd: 5, price: 790 },
  { id: 2, usd: 10, price: 1470 },
  { id: 3, usd: 15, price: 2170 },
  { id: 4, usd: 20, price: 2850 },
  { id: 5, usd: 25, price: 3520 },
  { id: 6, usd: 30, price: 4190 },
];

export default function PayPalPage() {
  const [selected, setSelected] = useState<number | null>(null);

  const router = useRouter();

  const handleSelect = (id: number) => setSelected(id === selected ? null : id);

  const handleBuyNow = () => {
    const pkg = paypalPackages.find((p) => p.id === selected);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'paypal',
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
        <h1 className="md:text-4xl font-bold text-blue-600 flex items-center justify-center gap-2">
          <Image
            src="/paypal-logo.jpg"
            width={100}
            height={100}
            alt="PayPal"
            className="inline-block"
          />
          PayPal Balance Load
        </h1>
        <p className="text-gray-600 mt-2">
          Instantly load your PayPal balance. Only PayPal email needed.
        </p>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        {paypalPackages.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => handleSelect(pkg.id)}
            className={`
              border-2 rounded-2xl px-7 py-6 text-center font-bold text-lg transition-all duration-300
              shadow-md bg-white relative
              ${
                selected === pkg.id
                  ? 'border-blue-500 ring-2 ring-blue-400/30 scale-[1.04]'
                  : 'hover:border-blue-500 hover:scale-105'
              }
            `}
          >
            <span className="text-blue-600 text-xl">${pkg.usd} USD</span>
            <span className="block mt-2 text-gray-700 font-semibold text-lg">
              NPR {pkg.price.toLocaleString('en-US')}
            </span>
            {selected === pkg.id && (
              <span className="absolute top-3 right-4 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full px-3 py-1 shadow">
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
          className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-700 hover:to-cyan-500 text-lg rounded-xl shadow-md px-6 py-3 transition-all"
        >
          {selected === null ? 'Select a Package' : 'Buy Now'}
        </Button>
      </div>
    </div>
  );
}
