'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface CanvaVariant {
  label: string;
  duration: string;
  price: number;
}

interface CanvaProduct {
  _id: string;
  name: string;
  platform: string;
  type: string;
  description: string;
  image: string;
  variants: CanvaVariant[];
  isActive: boolean;
}

export default function CanvaProPage() {
  const [selected, setSelected] = useState(false);
  const [product, setProduct] = useState<CanvaProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCanvaProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/canva');

        if (!response.ok) {
          throw new Error('Failed to fetch Canva product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching Canva product:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    fetchCanvaProduct();
  }, []);

  const handleSelect = () => setSelected((v) => !v);

  const handleBuyNow = () => {
    const query = new URLSearchParams({
      platform: 'canva',
      type: 'pro',
      amount: '1 year ',
      price: '3199',
    });

    const url = `/topup/payment?${query.toString()}`;
    window.location.href = url;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 text-[#00c4cc] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Canva Pro packages...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-12 items-center">
      {/* Left: Canva Branding */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end">
        <Image
          src={product.image || '/canva-pro.jpg'}
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
          {product.name} <span className="text-[#8b3dff]">Pro</span>
        </h1>
        <p className="text-gray-700 mb-6">
          {product.description}
          <br />
          <span className="text-[#8b3dff] font-medium">
            1 year license only NPR{' '}
            {product.variants.find((v) => v.duration === '12 Months')?.price ||
              3199}
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
          <span className="block text-[#00c4cc] text-xl">
            {product.name} 1 Year
          </span>
          <span className="block mt-2 text-gray-700 font-semibold text-lg">
            NPR{' '}
            {product.variants.find((v) => v.duration === '12 Months')?.price ||
              3199}
          </span>
          {selected && (
            <span className="absolute top-3 right-4 text-xs font-semibold text-[#00c4cc] bg-[#e6fcff] rounded-full px-3 py-1 shadow">
              Selected
            </span>
          )}
        </button>
        <Button
          onClick={handleBuyNow}
          className="mt-8 w-full bg-gradient-to-r from-[#00c4cc] to-[#8b3dff] text-white hover:from-[#03a5ab] hover:to-[#6941c6] text-lg rounded-xl shadow-md py-3 transition-all"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
