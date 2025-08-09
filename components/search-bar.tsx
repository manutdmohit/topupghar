'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  X,
  ChevronDown,
  Loader2,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
// TODO: Fix import below. If "@/hooks/use-debounce" does not exist, provide a fallback or implement useDebounce here.
import { useDebounce } from '../hooks/use-debounce';

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

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState([
    'Netflix',
    'Free Fire',
    'Instagram Followers',
    'ChatGPT Plus',
    'YouTube Premium',
    'PUBG',
    'TikTok Followers',
    'Microsoft 365',
  ]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle search input changes
  useEffect(() => {
    console.log('Debounced query:', debouncedQuery); // Debug log
    if (debouncedQuery.trim().length >= 2) {
      console.log('Triggering search for:', debouncedQuery); // Debug log
      performSearch(debouncedQuery);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [debouncedQuery]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    console.log('Performing search for:', query); // Debug log
    setIsSearching(true);
    setShowResults(true);

    try {
      const params = new URLSearchParams({
        q: query,
        limit: '10',
        sortBy: 'searchScore',
        sortOrder: 'desc',
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedType) params.append('type', selectedType);

      console.log('Search API URL:', `/api/search?${params}`); // Debug log
      const response = await fetch(`/api/search?${params}`);
      const data: SearchResponse = await response.json();

      console.log('Search response:', data); // Debug log

      if (data.success) {
        setSearchResults(data.data.products);
        console.log('Search results count:', data.data.products.length); // Debug log
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    addToRecentSearches(result.name);
    router.push(`/${result.slug}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    addToRecentSearches(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setShowResults(false);
  };

  const addToRecentSearches = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5
    );
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    searchInputRef.current?.focus();
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

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="flex w-full relative">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            {isSearching ? (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search for games, subscriptions, social media services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            className="pl-12 pr-12 py-4 text-lg border-0 bg-white/95 backdrop-blur-sm shadow-lg rounded-full focus:ring-4 focus:ring-purple-300/50 focus:bg-white transition-all duration-300"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
            </button>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSearching}
          className="ml-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Search
        </Button>

        {/* <Button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className={`ml-2 px-4 py-4 bg-white/95 backdrop-blur-sm border-white/50 hover:bg-white rounded-full shadow-lg transition-all duration-300 ${
            showFilters ? 'ring-2 ring-purple-300' : ''
          }`}
        >
          <Filter className="w-5 h-5" />
        </Button> */}
      </form>

      {/* Filters Panel */}

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {(showResults || searchQuery.trim().length >= 2 || isSearching) && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 max-h-96 overflow-y-auto z-[9999] shadow-2xl"
          >
            {searchQuery.trim().length < 2 ? (
              <div className="p-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => handleQuickSearch(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors"
                        onClick={() => handleQuickSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500 mr-2" />
                    <span className="text-gray-600">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <motion.div
                        key={result._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex-shrink-0">
                          {result.image && (
                            <img
                              src={result.image}
                              alt={result.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {result.name}
                            </h4>
                            <Badge
                              className={`text-xs ${getCategoryColor(
                                result.category
                              )}`}
                            >
                              {result.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            NPR {result.lowestPrice}
                            {result.highestPrice !== result.lowestPrice &&
                              ` - ${result.highestPrice}`}
                          </p>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {result.searchScore}
                        </div>
                      </motion.div>
                    ))}
                    <div className="pt-3 border-t border-gray-200">
                      <button
                        onClick={() => {
                          router.push(
                            `/search?q=${encodeURIComponent(searchQuery)}`
                          );
                          setShowResults(false);
                        }}
                        className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        View all {searchResults.length} results
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      No results found for "{searchQuery}"
                    </p>
                    <p className="text-sm text-gray-500">
                      Try different keywords or check spelling
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
