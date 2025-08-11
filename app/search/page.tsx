'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Loader2,
  X,
  ChevronLeft,
} from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  _id: string;
  name: string;
  platform: string;
  category: string;
  type: string;
  image?: string;
  lowestPrice: number;
  highestPrice: number;
  searchScore: number;
  slug: string;
  description?: string;
}

interface SearchResponse {
  success: boolean;
  data: {
    products: SearchResult[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
    filters: {
      query: string;
      category: string;
      type: string;
      minPrice: number | null;
      maxPrice: number | null;
      sortBy: string;
      sortOrder: string;
    };
  };
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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('searchScore');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, selectedCategory, selectedType, sortBy, sortOrder, currentPage]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        page: currentPage.toString(),
        limit: '20',
        sortBy,
        sortOrder,
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedType) params.append('type', selectedType);

      const response = await fetch(`/api/search?${params}`);
      const data: SearchResponse = await response.json();

      if (data.success) {
        setSearchResults(data.data.products);
        setTotalPages(data.data.pagination.totalPages);
        setTotalCount(data.data.pagination.totalCount);
      } else {
        setError('Failed to perform search');
        setSearchResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedType('');
    setCurrentPage(1);
  };

  const transformProductToCardProps = (product: SearchResult) => {
    const generateHref = (product: SearchResult) => {
      if (product.slug) {
        return `/${product.slug}`;
      }
      return `/${product.platform}`;
    };

    // Determine badge based on category
    let badge = product.category.toUpperCase();
    if (product.platform.includes('netflix')) badge = 'BESTSELLER';
    else if (product.platform.includes('freefire')) badge = 'HOT DEAL';
    else if (product.platform.includes('instagram')) badge = 'POPULAR';

    return {
      title: product.name,
      href: generateHref(product),
      image: product.image || `/${product.platform}.jpg`,
      badge,
      price: `NPR ${product.lowestPrice}`,
      originalPrice:
        product.highestPrice !== product.lowestPrice
          ? `NPR ${product.highestPrice}`
          : undefined,
      discount:
        product.highestPrice !== product.lowestPrice
          ? `${Math.round(
              ((product.highestPrice - product.lowestPrice) /
                product.highestPrice) *
                100
            )}% OFF`
          : undefined,
      isPopular: product.searchScore > 8,
      rating: 4.8 + Math.random() * 0.2,
      deliveryTime: 'Instant',
      inStock: true,
    };
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      gaming: 'bg-blue-500',
      subscription: 'bg-purple-500',
      'social-media': 'bg-pink-500',
      'load-balance': 'bg-green-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            No Search Query
          </h1>
          <p className="text-gray-400 mb-6">
            Please enter a search term to find products
          </p>
          <Button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-purple-500 to-pink-500"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Search Results
            </h1>
            <p className="text-gray-300">
              {loading
                ? 'Searching...'
                : `${totalCount} results found for "${query}"`}
            </p>
          </div>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </motion.div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={`bg-white/10 text-white border-white/20 hover:bg-white/20 ${
                showFilters ? 'ring-2 ring-purple-300' : ''
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            {(selectedCategory || selectedType) && (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className=" text-white border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-300 bg-purple-900"
            >
              <option value="searchScore-desc">Most Relevant</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </motion.div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-4 pb-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">All Categories</option>
                    <option value="gaming">Gaming</option>
                    <option value="subscription">Subscriptions</option>
                    <option value="social-media">Social Media</option>
                    <option value="load-balance">Load Balance</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">All Types</option>
                    <option value="account">Account</option>
                    <option value="followers">Followers</option>
                    <option value="likes">Likes</option>
                    <option value="views">Views</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
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
                Searching for "{query}"...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

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
                <p className="text-red-400 text-lg mb-4">Search Error</p>
                <p className="text-gray-400 mb-6">{error}</p>
                <Button
                  onClick={performSearch}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!loading && !error && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {searchResults.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-20"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-white/10">
                    <Search className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                      No Results Found
                    </h3>
                    <p className="text-gray-400 mb-6">
                      No products found for "{query}". Try different keywords or
                      check your filters.
                    </p>
                    <Button
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Results Grid/List */}
                  <motion.div
                    variants={containerVariants}
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                        : 'space-y-4'
                    }
                  >
                    {searchResults.map((product, index) => (
                      <motion.div
                        key={product._id || index}
                        variants={itemVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProductCard
                          {...transformProductToCardProps(product)}
                          compact={viewMode === 'list'}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center justify-center gap-2 mt-12"
                    >
                      <Button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        variant="outline"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 disabled:opacity-50"
                      >
                        Previous
                      </Button>

                      <div className="flex items-center gap-2">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            const page = i + 1;
                            return (
                              <Button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                variant={
                                  currentPage === page ? 'default' : 'outline'
                                }
                                className={
                                  currentPage === page
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                }
                              >
                                {page}
                              </Button>
                            );
                          }
                        )}
                      </div>

                      <Button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        variant="outline"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 disabled:opacity-50"
                      >
                        Next
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
