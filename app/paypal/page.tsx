'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Zap, CreditCard, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ProductVariant {
  label: string;
  duration: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  platform: string;
  type: string;
  description?: string;
  image?: string;
  variants: ProductVariant[];
  inStock: boolean;
  isActive: boolean;
}

interface Package {
  id: number;
  usd: number;
  price: number;
}

const features = [
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description:
      'Your payment information is protected with bank-level security',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    description: 'Receive your PayPal balance within minutes of payment',
  },
  {
    icon: CreditCard,
    title: 'Easy Process',
    description:
      'Just provide your PayPal email address - no account access needed',
  },
  {
    icon: CheckCircle,
    title: '24/7 Support',
    description: 'Get help anytime with our dedicated customer support team',
  },
];

export default function PayPalPage() {
  const [paypalPackages, setPaypalPackages] = useState<Package[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPayPalProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/paypal');

        if (!response.ok) {
          throw new Error('Failed to fetch PayPal product');
        }

        const product: Product = await response.json();

        // Transform product variants to packages
        const packages: Package[] = product.variants.map((variant, index) => {
          // Extract USD amount from label (e.g., "NPR 500" -> 500)
          const amountMatch = variant.label.match(/(\d+(?:,\d+)?)/);
          const usd = amountMatch
            ? parseInt(amountMatch[1].replace(',', ''))
            : 0;

          return {
            id: index + 1,
            usd,
            price: variant.price,
          };
        });

        setPaypalPackages(packages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching PayPal product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayPalProduct();
  }, []);

  const handleSelect = (id: number) => setSelected(id === selected ? null : id);

  const handleBuyNow = () => {
    const pkg = paypalPackages.find((p) => p.id === selected);
    if (!pkg) return;

    const query = new URLSearchParams({
      platform: 'paypal',
      type: 'usd',
      amount: pkg.usd.toString() + ' ',
      price: pkg.price.toString(),
    });
    router.push(`/topup/payment?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading PayPal products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error loading PayPal packages: {error}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Image
              src="/paypal-logo.jpg"
              width={80}
              height={80}
              alt="PayPal"
              className="rounded-lg shadow-lg"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
                PayPal Balance
              </h1>
              <Badge variant="secondary" className="mt-2 text-sm">
                USD Balance Load
              </Badge>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Instantly load your PayPal balance with secure, fast, and reliable
            service. Perfect for online shopping, international transfers, and
            digital payments.
          </p>
        </div>

        {/* Package Selection */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Select Your Package
            </CardTitle>
            <CardDescription className="text-lg">
              Choose the amount you want to add to your PayPal balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {paypalPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => handleSelect(pkg.id)}
                  className={`
                     relative border-2 rounded-xl p-4 text-center transition-all duration-300
                     shadow-md bg-white hover:shadow-lg
                     ${
                       selected === pkg.id
                         ? 'border-blue-500 ring-2 ring-blue-400/30 scale-105 bg-blue-50'
                         : 'border-gray-200 hover:border-blue-300 hover:scale-102'
                     }
                   `}
                >
                  <div className="text-blue-600 font-bold text-xl mb-1">
                    ${pkg.usd} USD
                  </div>
                  <div className="text-gray-700 font-semibold text-sm">
                    NPR {pkg.price.toLocaleString('en-US')}
                  </div>
                  {selected === pkg.id && (
                    <div className="absolute -top-2 -right-2">
                      <CheckCircle className="w-6 h-6 text-blue-600 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Button
            disabled={!selected}
            onClick={handleBuyNow}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 text-xl rounded-xl shadow-lg px-8 py-4 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            size="lg"
          >
            {selected === null
              ? 'Select a Package'
              : 'Buy Now - Secure Payment'}
          </Button>

          <p className="text-gray-500 mt-4 text-sm">
            Secure payment powered by PayPal • Instant delivery • 24/7 support
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="pt-6">
                <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg bg-white/80">
            <CardHeader>
              <CardTitle className="text-blue-600">How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <p>Select your desired PayPal balance amount</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <p>Complete secure payment with your preferred method</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <p>Provide your PayPal email address for delivery</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <p>Receive your balance instantly in your PayPal account</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80">
            <CardHeader>
              <CardTitle className="text-blue-600">Why choose us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Instant delivery within minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>No account access required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>24/7 customer support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Competitive exchange rates</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
