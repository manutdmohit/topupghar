'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  ArrowLeft,
  Star,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  ShoppingCart,
  Heart,
  Share2,
  TrendingUp,
} from 'lucide-react';
import { calculateDiscountedPrice } from '@/lib/price-utils';

interface Variant {
  label: string;
  duration: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  platform: string;
  category: string;
  type: string;
  description?: string;
  image?: string;
  variants: Variant[];
  discountPercentage?: number;
  inStock: boolean;
  isActive: boolean;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/slug/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to fetch product data');
        }

        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleSelect = (index: number) => {
    setSelectedPackage((prev) => (prev === index ? null : index));
  };

  const handleBuyNow = async () => {
    if (!product || selectedPackage === null) return;

    const selectedVariant = product.variants[selectedPackage];
    if (!selectedVariant) return;

    try {
      // Calculate discounted price
      const priceInfo = calculateDiscountedPrice(
        selectedVariant.price,
        product.discountPercentage || 0
      );

      // Create secure order session
      const response = await fetch('/api/orders/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: product.platform,
          type: product.type,
          duration: selectedVariant.duration,
          price: priceInfo.discountedPrice,
          originalPrice: selectedVariant.price,
          discountPercentage: product.discountPercentage || 0,
          amount: selectedVariant.label,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order session');
      }

      const data = await response.json();

      // Navigate with secure token instead of URL parameters
      router.push(`/topup/payment?token=${encodeURIComponent(data.token)}`);
    } catch (error) {
      console.error('Error creating order session:', error);
      // Fallback to old method for now
      const priceInfo = calculateDiscountedPrice(
        selectedVariant.price,
        product.discountPercentage || 0
      );

      const query = new URLSearchParams({
        platform: product.platform,
        type: product.type,
        duration: selectedVariant.duration,
        price: priceInfo.discountedPrice.toString(),
        amount: selectedVariant.label,
      });
      router.push(`/topup/payment?${query.toString()}`);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      gaming: 'bg-blue-100 text-blue-800 border-blue-200',
      'social-media': 'bg-green-100 text-green-800 border-green-200',
      subscription: 'bg-purple-100 text-purple-800 border-purple-200',
      'load-balance': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return (
      colors[category as keyof typeof colors] ||
      'bg-gray-100 text-gray-800 border-gray-200'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto"
              style={{ animationDelay: '-0.5s' }}
            ></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Loading product...
          </p>
          <div className="mt-4 flex space-x-2 justify-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                      product.category
                    )}`}
                  >
                    {product.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {product.type}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isWishlisted
                    ? 'text-red-500 bg-red-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Content - Optimized for immediate purchase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image - Smaller, more compact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm sticky top-24">
              <div className="relative group">
                <img
                  src={product.image || `/${product.platform}.jpg`}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-500"
                />
                {product.inStock && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    In Stock
                  </div>
                )}
              </div>

              {/* Quick Features */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 text-xs font-medium">
                    Secure
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 text-xs font-medium">
                    Instant
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Package Selection & Purchase - Prominent Position */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                Select Your Package
              </h2>

              {/* Package Options - 2 columns on all devices for better visibility */}
              {product.variants && product.variants.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {product.variants.map((variant, index) => (
                    <div
                      key={index}
                      className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        selectedPackage === index
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSelect(index)}
                    >
                      {selectedPackage === index && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="text-center">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {variant.label}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {variant.duration}
                        </p>
                        <div className="text-center">
                          {product.discountPercentage &&
                          product.discountPercentage > 0 ? (
                            <>
                              <p className="text-lg font-bold text-red-600">
                                NPR{' '}
                                {calculateDiscountedPrice(
                                  variant.price,
                                  product.discountPercentage
                                ).discountedPrice.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500 line-through">
                                NPR {variant.price.toLocaleString()}
                              </p>
                              <p className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-medium mt-1">
                                {product.discountPercentage}% OFF
                              </p>
                            </>
                          ) : (
                            <p className="text-2xl font-bold text-blue-600">
                              NPR {variant.price.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Packages Available
                  </h3>
                  <p className="text-gray-500 text-sm">
                    This product currently has no available packages.
                  </p>
                </div>
              )}

              {/* Purchase Button - Prominent */}
              <button
                onClick={handleBuyNow}
                disabled={
                  selectedPackage === null ||
                  !product.inStock ||
                  !product.variants ||
                  product.variants.length === 0
                }
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  selectedPackage === null ||
                  !product.inStock ||
                  !product.variants ||
                  product.variants.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                }`}
              >
                {!product.inStock ||
                !product.variants ||
                product.variants.length === 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                      />
                    </svg>
                    {!product.variants || product.variants.length === 0
                      ? 'No Packages Available'
                      : 'Out of Stock'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Buy Now - Secure Checkout
                  </span>
                )}
              </button>

              {(!product.inStock ||
                !product.variants ||
                product.variants.length === 0) && (
                <p className="text-red-600 text-sm mt-3 text-center flex items-center justify-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  {!product.variants || product.variants.length === 0
                    ? 'This product has no available packages'
                    : 'This product is currently out of stock'}
                </p>
              )}

              {selectedPackage !== null &&
                product.inStock &&
                product.variants &&
                product.variants.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Package Selected!</span>
                    </div>
                    <p className="text-green-600 text-sm mt-1">
                      {product.variants[selectedPackage]?.label} - NPR{' '}
                      {product.discountPercentage &&
                      product.discountPercentage > 0
                        ? calculateDiscountedPrice(
                            product.variants[selectedPackage]?.price || 0,
                            product.discountPercentage
                          ).discountedPrice.toLocaleString()
                        : product.variants[
                            selectedPackage
                          ]?.price.toLocaleString()}
                    </p>
                  </div>
                )}

              {/* Trust Indicators - Compact */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-xs font-medium">
                    10K+ Happy Customers
                  </span>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-xs font-medium">
                    SSL Secured
                  </span>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700 text-xs font-medium">
                    24/7 Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* YouTube Video Section - Strategic Placement for Reassurance */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <svg
              className="w-8 h-8 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            See How It Works
          </h3>
          <div className="w-full max-w-4xl mx-auto">
            <div
              className="relative w-full cursor-pointer group"
              style={{ paddingBottom: '56.25%' }}
              onClick={(e) => {
                const video = e.currentTarget.querySelector('video');
                if (video) {
                  video.play();
                  e.currentTarget
                    .querySelector('.video-overlay')
                    ?.classList.add('hidden');
                }
              }}
            >
              <video
                className="absolute top-0 left-0 w-full h-full rounded-xl border-0 object-contain"
                controls
                preload="auto"
                poster="/video-poster.jpg"
                crossOrigin="anonymous"
                onPlay={(e) => {
                  e.currentTarget.parentElement
                    ?.querySelector('.video-overlay')
                    ?.classList.add('hidden');
                }}
                onPause={(e) => {
                  e.currentTarget.parentElement
                    ?.querySelector('.video-overlay')
                    ?.classList.remove('hidden');
                }}
              >
                <source src="/topup-ghar.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* YouTube-like Thumbnail Overlay */}
              <div className="video-overlay absolute top-0 left-0 w-full h-full rounded-xl bg-black bg-opacity-20 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-30">
                {/* Play Button */}
                <div className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg transform transition-transform duration-200 group-hover:scale-110">
                  <svg
                    className="w-8 h-8 text-gray-800 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                {/* Video Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  2:30
                </div>

                {/* Video Title */}
                <div className="absolute top-3 left-3 bg-black bg-opacity-75 text-white text-sm px-3 py-1 rounded">
                  How to Use Topup Ghar
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-center mt-4 max-w-2xl mx-auto">
            Watch our quick demo to see how easy it is to get started with your
            purchase
          </p>
        </div>

        {/* Additional Information - Below the fold */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Features */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Why Choose This Product?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">100% Secure</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 font-medium">
                  Instant Delivery
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-700 font-medium">
                  Premium Quality
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">Best Value</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
