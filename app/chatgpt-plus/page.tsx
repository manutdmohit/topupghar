'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

// --- SEO FOR APP DIRECTORY --- //
// export const metadata = {
//   title: 'Buy ChatGPT Plus (1 Month) - Best Price | On Mail & Shared',
//   description:
//     'Get ChatGPT Plus for 1 month at only ₹700 (On Mail) or ₹500 (Shared). Fast delivery, secure payment, and instant activation. Unlock premium AI today!',
//   openGraph: {
//     title: 'Buy ChatGPT Plus (1 Month)',
//     description:
//       'Get ChatGPT Plus for 1 month at the best price: ₹700 (On Mail) or ₹500 (Shared).',
//     images: [
//       {
//         url: '/chatgpt-plus-banner.jpg',
//         width: 800,
//         height: 420,
//         alt: 'ChatGPT Plus Banner',
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Buy ChatGPT Plus (1 Month)',
//     description:
//       'Get ChatGPT Plus for 1 month at only ₹700 (On Mail) or ₹500 (Shared).',
//     images: ['/chatgpt-plus-banner.jpg'],
//   },
//   keywords: [
//     'ChatGPT Plus',
//     'Buy ChatGPT',
//     'ChatGPT Plus India',
//     'GPT Plus',
//     'ChatGPT premium',
//     'OpenAI',
//     'Shared Account',
//     'On Mail',
//     'AI Subscription',
//   ],
// };

// --- If you use pages directory (not app directory), add this at the top instead --- //
// import Head from 'next/head';
/*
<Head>
  <title>Buy ChatGPT Plus (1 Month) - Best Price | On Mail & Shared</title>
  <meta name="description" content="Get ChatGPT Plus for 1 month at only ₹700 (On Mail) or ₹500 (Shared). Fast delivery, secure payment, and instant activation. Unlock premium AI today!" />
  <meta property="og:title" content="Buy ChatGPT Plus (1 Month)" />
  <meta property="og:description" content="Get ChatGPT Plus for 1 month at the best price: ₹700 (On Mail) or ₹500 (Shared)." />
  <meta property="og:image" content="/chatgpt-plus-banner.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Buy ChatGPT Plus (1 Month)" />
  <meta name="twitter:description" content="Get ChatGPT Plus for 1 month at only ₹700 (On Mail) or ₹500 (Shared)." />
  <meta name="twitter:image" content="/chatgpt-plus-banner.jpg" />
  <meta name="keywords" content="ChatGPT Plus, Buy ChatGPT, ChatGPT Plus India, GPT Plus, ChatGPT premium, OpenAI, Shared Account, On Mail, AI Subscription" />
</Head>
*/

interface ChatGptVariant {
  label: string;
  duration: string;
  price: number;
}

interface ChatGptProduct {
  _id: string;
  name: string;
  platform: string;
  type: string;
  description: string;
  image: string;
  variants: ChatGptVariant[];
  isActive: boolean;
}

// Helper function to transform API variants to packages
const transformVariantsToPackages = (variants: ChatGptVariant[]) => {
  return variants.map((variant, index) => ({
    id: index + 1,
    label: variant.label,
    description: `${variant.duration} subscription`,
    price: variant.price,
    type: variant.label.toLowerCase().replace(' ', '-'),
  }));
};

export default function ChatGPTPlusPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [product, setProduct] = useState<ChatGptProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchChatGptProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/chatgpt-plus');

        if (!response.ok) {
          throw new Error('Failed to fetch ChatGPT Plus product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching ChatGPT Plus product:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    fetchChatGptProduct();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = async () => {
    if (selectedId === null || !product) return;
    setBuying(true);

    // Simulate payment redirect/loading
    setTimeout(() => {
      const packages = transformVariantsToPackages(product.variants);
      const selected = packages.find((p) => p.id === selectedId);
      if (!selected) return;
      const query = new URLSearchParams({
        platform: 'chatgpt',
        type: selected.type,
        duration: selected.label,
        price: selected.price.toString(),
      });
      router.push(`/topup/payment?${query.toString()}`);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading ChatGPT Plus packages...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* --- Banner and Title --- */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="w-full flex justify-center md:justify-end">
          <Image
            src={product.image || '/chatgpt-plus-banner.jpg'}
            alt="ChatGPT Plus"
            width={440}
            height={260}
            className="rounded-2xl shadow-2xl object-cover"
            priority
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-blue-700 mb-3">
            {product.name} (1 Month)
          </h1>
          <p className="text-gray-600 mb-8">{product.description}</p>

          {/* --- Package Grid --- */}
          <div className="grid grid-cols-2 gap-6">
            {transformVariantsToPackages(product.variants).map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => handleSelect(pkg.id)}
                className={`border p-6 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                  selectedId === pkg.id
                    ? 'bg-blue-100 border-blue-700 scale-[1.03]'
                    : 'hover:shadow-lg'
                }`}
              >
                <h3 className="text-xl font-semibold text-blue-800">
                  {pkg.label}
                </h3>
                <p className="text-gray-600 mt-1">{pkg.description}</p>
                <p className="text-lg text-blue-600 mt-2 font-semibold">
                  NPR {pkg.price}
                </p>
                {selectedId === pkg.id && (
                  <div className="mt-3 text-sm text-blue-700 font-medium">
                    ✅ Selected
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* --- CTA Button --- */}
          <div className="mt-8 text-center">
            <Button
              disabled={selectedId === null || buying}
              onClick={handleBuyNow}
              className="bg-blue-700 text-white hover:bg-blue-800 px-6 py-3 text-lg rounded-xl transition-all duration-300 w-full flex items-center justify-center gap-2"
            >
              {buying ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Redirecting...
                </>
              ) : selectedId === null ? (
                'Select a Package'
              ) : (
                'Buy Now'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
