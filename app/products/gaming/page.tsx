'use client';

import React, { useEffect, useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  TrendingUp,
  Zap,
  Star,
  Users,
  Clock,
} from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  platform: string;
  type: string;
  slug?: string;
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

export default function GamingPage() {
  const [gamingProducts, setGamingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchGamingProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/gaming');

        if (!response.ok) {
          throw new Error('Failed to fetch gaming products');
        }

        const data = await response.json();
        setGamingProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching gaming products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGamingProducts();
  }, []);

  // Transform API data to match ProductCard props
  const transformProductToCardProps = (product: Product) => {
    const lowestPrice = Math.min(...product.variants.map((v) => v.price));
    const highestPrice = Math.max(...product.variants.map((v) => v.price));

    // Determine badge based on platform and type
    let badge = 'GAMING';
    if (product.platform.includes('freefire')) {
      badge = 'BESTSELLER';
    } else if (product.platform.includes('pubg')) {
      badge = 'HOT DEAL';
    } else if (
      product.platform.includes('garena') ||
      product.platform.includes('shell')
    ) {
      badge = 'POPULAR';
    }

    // Use slug as href if available, otherwise fallback to platform
    const generateHref = (product: Product) => {
      if (product.slug) {
        return `/${product.slug}`;
      }
      return `/${product.platform}`;
    };

    return {
      title: product.name,
      href: generateHref(product),
      image: product.image || `/${product.platform}.jpg`,
      badge,
      price: `NPR ${lowestPrice}`,
      originalPrice:
        highestPrice !== lowestPrice
          ? `NPR ${highestPrice}`
          : `NPR ${lowestPrice}`,
      discount:
        highestPrice !== lowestPrice
          ? `${Math.round(
              ((highestPrice - lowestPrice) / highestPrice) * 100
            )}% OFF`
          : undefined,
      isPopular: product.platform.includes('freefire'),
      rating: 4.8 + Math.random() * 0.2,
      deliveryTime: 'Instant',
      inStock: product.inStock,
    };
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? gamingProducts
      : gamingProducts.filter(
          (product) => product.platform === selectedCategory
        );

  // Generate only "All" category
  const generateCategories = () => {
    return [
      {
        id: 'all',
        name: 'All Games',
        icon: Gamepad2,
        count: gamingProducts.length,
      },
    ];
  };

  const categories = generateCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Category Filter */}
      <div className="max-w-7xl mx-auto p-10 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-300
                ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105 backdrop-blur-sm'
                }
              `}
            >
              <category.icon className="w-5 h-5" />
              <span>{category.name}</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div
                  className="absolute inset-0 w-16 h-16 border-4 border-pink-500 border-b-transparent rounded-full animate-spin mx-auto"
                  style={{ animationDelay: '0.5s' }}
                ></div>
              </div>
              <p className="mt-6 text-gray-300 text-lg">
                Loading gaming products...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-red-400 text-lg mb-4">
                  Error loading gaming products
                </p>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 font-medium"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <AnimatePresence>
          {!loading && !error && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {filteredProducts.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-20"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-white/10">
                    <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Gamepad2 className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-gray-400">
                      No gaming products available in this category at the
                      moment.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product._id || index}
                      variants={itemVariants}
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard
                        {...transformProductToCardProps(product)}
                        compact
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      {/* <div className="max-w-7xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Level Up?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of gamers who trust us for their gaming needs. Get
              instant delivery and exclusive deals!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
                Explore All Games
              </button>
              <button className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                View Special Offers
              </button>
            </div>
          </div>
        </motion.div>
      </div> */}
    </div>
  );
}
