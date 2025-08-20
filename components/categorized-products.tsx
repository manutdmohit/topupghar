'use client';

import React, { useEffect, useState } from 'react';
import {
  Gamepad2,
  Tv,
  Music,
  Camera,
  Globe,
  Heart,
  Star,
  Zap,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ProductCard } from './product-card';
import Link from 'next/link';
import {
  calculatePriceRange,
  formatPrice,
  formatDiscount,
} from '@/lib/price-utils';

interface Product {
  _id: string;
  name: string;
  slug: string;
  platform: string;
  type: string;
  category: string;
  description?: string;
  image?: string;
  variants: Array<{
    label: string;
    duration: string;
    price: number;
  }>;
  discountPercentage?: number;
  inStock: boolean;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
}

interface CategoryWithProducts {
  category: Category;
  products: Product[];
}

// Icon mapping for categories
const getCategoryIcon = (categoryValue: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    gaming: Gamepad2,
    streaming: Tv,
    music: Music,
    social: Heart,
    design: Camera,
    productivity: Zap,
    education: Globe,
    entertainment: Star,
  };

  return iconMap[categoryValue] || TrendingUp;
};

// Color mapping for categories
const getCategoryColor = (categoryValue: string) => {
  const colorMap: { [key: string]: string } = {
    gaming: 'from-red-500 to-purple-600',
    streaming: 'from-blue-500 to-indigo-600',
    music: 'from-green-500 to-emerald-600',
    social: 'from-pink-500 to-rose-600',
    design: 'from-purple-500 to-violet-600',
    productivity: 'from-yellow-500 to-orange-600',
    education: 'from-indigo-500 to-blue-600',
    entertainment: 'from-cyan-500 to-teal-600',
  };

  return colorMap[categoryValue] || 'from-gray-500 to-gray-600';
};

const CategorizedProducts = () => {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<
    CategoryWithProducts[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorizedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/by-categories?limit=6');

        if (!response.ok) {
          throw new Error('Failed to fetch categorized products');
        }

        const data = await response.json();
        setCategoriesWithProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching categorized products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorizedProducts();
  }, []);

  // Transform API data to match ProductCard props
  const transformProductToCardProps = (product: Product) => {
    const hasDiscount =
      product.discountPercentage && product.discountPercentage > 0;

    let formattedPrice: string;
    let formattedOriginalPrice: string | undefined;
    let formattedDiscount: string | undefined;

    if (hasDiscount) {
      // Product has a discount - show discounted price
      const priceRange = calculatePriceRange(
        product.variants,
        product.discountPercentage || 0
      );
      formattedPrice = formatPrice(priceRange.lowestDiscountedPrice);
      formattedOriginalPrice = formatPrice(priceRange.lowestOriginalPrice);
      formattedDiscount = formatDiscount(product.discountPercentage || 0);
    } else {
      // No discount - show regular price range
      const minPrice = Math.min(...product.variants.map((v) => v.price));
      const maxPrice = Math.max(...product.variants.map((v) => v.price));

      if (minPrice === maxPrice) {
        formattedPrice = formatPrice(minPrice);
      } else {
        formattedPrice = `From ${formatPrice(minPrice)}`;
      }
      formattedOriginalPrice = undefined;
      formattedDiscount = undefined;
    }

    // Determine badge based on platform and type
    let badge = 'TRENDING';
    if (product.platform === 'freefire') {
      badge = 'BESTSELLER';
    } else if (product.platform === 'pubg') {
      badge = 'HOT DEAL';
    } else if (product.platform === 'netflix') {
      badge = 'POPULAR';
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
      originalPrice: formattedOriginalPrice,
      discount: formattedDiscount,
      isPopular: product.platform === 'freefire',
      rating: 4.8 + Math.random() * 0.2, // Random rating between 4.8-5.0
      deliveryTime: 'Instant',
      inStock: product.inStock,
    };
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-600">
              Loading categorized products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-8">
            <p className="text-red-600">Error loading products: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-300"></div>
            <div className="flex items-center gap-3 px-8">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h2 className="text-4xl font-bold text-gray-800">
                Explore by Category
              </h2>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-300"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing products organized by your favorite categories
          </p>
        </div>

        <div className="space-y-16">
          {categoriesWithProducts.map(({ category, products }) => {
            const CategoryIcon = getCategoryIcon(category.value);
            const gradientColors = getCategoryColor(category.value);

            return (
              <div
                key={category._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Category Header */}
                <div
                  className={`bg-gradient-to-r ${gradientColors} p-6 text-white`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <CategoryIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{category.label}</h3>
                        {category.description && (
                          <p className="text-white/80 mt-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/category/${category.value}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all backdrop-blur-sm"
                    >
                      <span className="font-medium">View All</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                      <ProductCard
                        key={product._id || index}
                        {...transformProductToCardProps(product)}
                        compact
                      />
                    ))}
                  </div>

                  {/* Show More Button */}
                  {products.length >= 6 && (
                    <div className="text-center mt-8">
                      <Link
                        href={`/category/${category.value}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                      >
                        View All {category.label} Products
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorizedProducts;
