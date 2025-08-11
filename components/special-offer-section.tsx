'use client';

import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  Flame,
  Zap,
  Shield,
  Clock,
  Users,
  Trophy,
  Gamepad2,
} from 'lucide-react';
import { ProductCard } from '@/components/product-card';

interface Product {
  _id: string;
  name: string;
  platform: string;
  type: string;
  description?: string;
  image?: string;
  variants: Array<{
    label: string;
    duration: string;
    price: number;
  }>;
  inStock: boolean;
  isActive: boolean;
}

const SpecialOfferSection = () => {
  const [specialOffers, setSpecialOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialDeals = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/special-deals');

        if (!response.ok) {
          throw new Error('Failed to fetch special deals');
        }

        const data = await response.json();
        setSpecialOffers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching special deals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialDeals();
  }, []);

  // Transform API data to match ProductCard props
  const transformProductToCardProps = (product: Product) => {
    const lowestPrice = Math.min(...product.variants.map((v) => v.price));
    const highestPrice = Math.max(...product.variants.map((v) => v.price));

    // Determine badge based on platform and type
    let badge = 'SPECIAL';
    if (product.platform === 'freefire') {
      badge = 'BESTSELLER';
    } else if (product.platform === 'pubg') {
      badge = 'HOT DEAL';
    } else if (product.platform === 'netflix') {
      badge = 'POPULAR';
    }

    return {
      title: product.name,
      href: `/${product.platform}`,
      image: product.image || `/${product.platform}.jpg`,
      badge,
      price: `NPR ${lowestPrice}`,
      originalPrice:
        highestPrice !== lowestPrice ? `NPR ${highestPrice}` : undefined,
      discount:
        highestPrice !== lowestPrice
          ? `${Math.round(
              ((highestPrice - lowestPrice) / highestPrice) * 100
            )}% OFF`
          : undefined,
      isPopular: product.platform === 'freefire',
      rating: 4.8 + Math.random() * 0.2, // Random rating between 4.8-5.0
      deliveryTime: 'Instant',
      inStock: product.inStock,
    };
  };
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold text-lg mb-6 shadow-lg">
          <Flame className="w-6 h-6" />
          Limited Time Offers
          <Flame className="w-6 h-6" />
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Special Deals Just for You
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Grab these exclusive offers before they're gone! Limited stock
          available.
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="mt-2 text-gray-600">Loading special offers...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">Error loading special offers: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {specialOffers.map((product, index) => (
            <ProductCard
              key={product._id || index}
              {...transformProductToCardProps(product)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SpecialOfferSection;
