'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Gamepad2, 
  Tv, 
  Music, 
  Camera, 
  Globe, 
  Heart, 
  Star, 
  Zap,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import Link from 'next/link';

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

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryResponse = await fetch(`/api/categories?search=${categorySlug}`);
        const categoryData = await categoryResponse.json();
        const foundCategory = categoryData.categories?.find((cat: Category) => 
          cat.value === categorySlug
        );

        if (!foundCategory) {
          throw new Error('Category not found');
        }

        setCategory(foundCategory);

        // Fetch products for this category
        const productsResponse = await fetch(`/api/products?category=${categorySlug}`);
        const productsData = await productsResponse.json();
        setProducts(productsData.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching category data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategoryData();
    }
  }, [categorySlug]);

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
      isPopular: product.platform === 'freefire',
      rating: 4.8 + Math.random() * 0.2, // Random rating between 4.8-5.0
      deliveryTime: 'Instant',
      inStock: product.inStock,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-600">Loading category...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The requested category could not be found.'}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(category.value);
  const gradientColors = getCategoryColor(category.value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Category Header */}
      <div className={`bg-gradient-to-r ${gradientColors} py-16`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <CategoryIcon className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{category.label}</h1>
              {category.description && (
                <p className="text-white/80 text-lg">{category.description}</p>
              )}
              <p className="text-white/60 mt-2">{products.length} products available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-8 bg-white rounded-2xl shadow-lg">
              <CategoryIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any products in the {category.label} category at the moment.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse Other Categories
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product._id || index}
                {...transformProductToCardProps(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
