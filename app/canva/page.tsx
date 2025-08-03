'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function CanvaProPage() {
  const [selected, setSelected] = useState(false);
  const router = useRouter();

  const handleSelect = () => setSelected((v) => !v);

  const handleBuyNow = () => {
    router.push(
      '/topup/payment?platform=canva&type=pro&amount=1%20year&price=1500'
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-12 items-center">
      {/* Left: Canva Branding */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end">
        <Image
          src="/canva-pro.jpg" // Place a nice canva-pro logo/banner in public/
          alt="Canva Pro"
          width={500}
          height={500}
          className="rounded-3xl shadow-xl object-contain"
          priority
        />
      </div>

      {/* Right: Package Card */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
        <h1 className="text-4xl font-extrabold mb-2 text-[#00c4cc] flex items-center gap-3">
          Canva <span className="text-[#8b3dff]">Pro</span>
        </h1>
        <p className="text-gray-700 mb-6">
          Upgrade to Canva Pro for unlimited premium access.
          <br />
          <span className="text-[#8b3dff] font-medium">
            1 year license only NPR 1500
          </span>
        </p>
        <button
          type="button"
          onClick={handleSelect}
          className={`group border-2 rounded-2xl px-7 py-6 text-center font-bold text-lg transition-all duration-300
            shadow-md relative bg-white
            ${
              selected
                ? 'border-[#00c4cc] ring-2 ring-[#00c4cc]/30 scale-[1.04]'
                : 'hover:border-[#00c4cc] hover:scale-105'
            }
          `}
        >
          <span className="block text-[#00c4cc] text-xl">Canva Pro 1 Year</span>
          <span className="block mt-2 text-gray-700 font-semibold text-lg">
            NPR 899
          </span>
          {selected && (
            <span className="absolute top-3 right-4 text-xs font-semibold text-[#00c4cc] bg-[#e6fcff] rounded-full px-3 py-1 shadow">
              Selected
            </span>
          )}
        </button>
        <Button
          onClick={handleBuyNow}
          disabled={!selected}
          className="mt-8 w-full bg-gradient-to-r from-[#00c4cc] to-[#8b3dff] text-white hover:from-[#03a5ab] hover:to-[#6941c6] text-lg rounded-xl shadow-md py-3 transition-all"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
