'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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

const gptPackages = [
  {
    id: 1,
    label: 'On Mail',
    description: 'Delivered to your email',
    price: 700,
  },
  { id: 2, label: 'Shared', description: 'Shared access', price: 500 },
];

export default function ChatGPTPlusPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const router = useRouter();

  // Simulate fetch/loading skeleton on mount
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1100); // 1.1s skeleton
    return () => clearTimeout(timeout);
  }, []);

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBuyNow = async () => {
    if (selectedId === null) return;
    setBuying(true);

    // Simulate payment redirect/loading
    setTimeout(() => {
      const selected = gptPackages.find((p) => p.id === selectedId);
      if (!selected) return;
      const query = new URLSearchParams({
        platform: 'chatgpt',
        type: selected.label.toLowerCase().replace(' ', '-'),
        duration: '1 Month',
        price: selected.price.toString(),
      });
      router.push(`/topup/payment?${query.toString()}`);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* --- Banner and Title --- */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="w-full flex justify-center md:justify-end">
          {loading ? (
            <div className="w-[440px] h-[260px] rounded-2xl bg-gray-200 animate-pulse" />
          ) : (
            <Image
              src="/chatgpt-plus-banner.jpg"
              alt="ChatGPT Plus"
              width={440}
              height={260}
              className="rounded-2xl shadow-2xl object-cover"
              priority
            />
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold text-blue-700 mb-3">
            ChatGPT Plus (1 Month)
          </h1>
          <p className="text-gray-600 mb-8">
            Choose your preferred delivery mode and unlock ChatGPT Plus today!
          </p>

          {/* --- Skeleton or Grid --- */}
          {loading ? (
            <div className="grid grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="border p-6 rounded-xl text-center bg-gray-200 animate-pulse h-32"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {gptPackages.map((pkg) => (
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
          )}

          {/* --- CTA Skeleton or Real Button --- */}
          <div className="mt-8 text-center">
            {loading ? (
              <div className="w-full h-12 rounded-xl bg-gray-200 animate-pulse" />
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
