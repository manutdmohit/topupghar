'use client';

import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { ProductCard } from './product-card';

interface Product {
  _id: string;
  name: string;
  slug: string;
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

const PopularNow = () => {
  const [popularItems, setPopularItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/popular-now');

        if (!response.ok) {
          throw new Error('Failed to fetch popular items');
        }

        const data = await response.json();
        setPopularItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching popular items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularItems();
  }, []);

  // Transform API data to match ProductCard props
  const transformProductToCardProps = (product: Product) => {
    const lowestPrice = Math.min(...product.variants.map((v) => v.price));
    const highestPrice = Math.max(...product.variants.map((v) => v.price));

    // Determine badge based on platform and type
    let badge = 'TRENDING';
    if (product.platform === 'freefire') {
      badge = 'BESTSELLER';
    } else if (product.platform === 'pubg') {
      badge = 'HOT DEAL';
    } else if (product.platform === 'netflix') {
      badge = 'POPULAR';
    }

    // Format price correctly - show price range, not fake discounts
    let formattedPrice: string;
    if (lowestPrice === highestPrice) {
      formattedPrice = `NPR ${lowestPrice}`;
    } else {
      formattedPrice = `From NPR ${lowestPrice}`;
    }

    return {
      title: product.name,
      href: `/${
        product.platform === 'freefire' && product.type === 'evo-access'
          ? 'freefire-evo-access'
          : product.platform === 'youtube' && product.type === 'subscribers'
          ? 'youtube-subscriber'
          : product.platform === 'facebook' && product.type === 'views'
          ? 'facebook-views'
          : product.platform === 'facebook' && product.type === 'likes'
          ? 'facebook-likes'
          : product.platform === 'facebook' && product.type === 'followers'
          ? 'facebook-followers'
          : product.platform === 'instagram' && product.type === 'views'
          ? 'instagram-views'
          : product.platform === 'instagram' && product.type === 'likes'
          ? 'instagram-likes'
          : product.platform === 'instagram' && product.type === 'followers'
          ? 'instagram-followers'
          : product.platform === 'tiktok' && product.type === 'followers'
          ? 'tiktok-followers'
          : product.platform === 'tiktok' && product.type === 'views'
          ? 'tiktok-views'
          : product.platform === 'tiktok' && product.type === 'likes'
          ? 'tiktok-likes'
          : product.platform === 'tiktok' && product.type === 'coins'
          ? 'tiktok-coin'
          : product.platform === 'twitter' && product.type === 'followers'
          ? 'twitter-followers'
          : product.platform === 'youtube' && product.type === 'views'
          ? 'youtube-views'
          : product.platform === 'youtube' && product.type === 'likes'
          ? 'youtube-likes'
          : product.platform === 'youtube' && product.type === 'comments'
          ? 'youtube-comments'
          : product.slug
      }`,
      image: product.image || `/${product.platform}.jpg`,
      badge,
      price: formattedPrice,
      originalPrice: undefined, // No fake discounts
      discount: undefined, // No fake discounts
      isPopular: product.platform === 'freefire',
      rating: 4.8 + Math.random() * 0.2, // Random rating between 4.8-5.0
      deliveryTime: 'Instant',
      inStock: product.inStock,
    };
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-300"></div>
            <div className="flex items-center gap-3 px-8">
              <Trophy className="w-8 h-8 text-purple-600" />
              <h2 className="text-4xl font-bold text-gray-800">Popular Now</h2>
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-300"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Most loved products by our gaming community worldwide
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-600">Loading popular items...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">Error loading popular items: {error}</p>
          </div>
        )}

        {/* Popular Items Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {popularItems.map((product, index) => (
              <ProductCard
                key={product._id || index}
                {...transformProductToCardProps(product)}
                compact
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularNow;
