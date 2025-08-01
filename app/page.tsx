import Image from 'next/image';
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
import { MobileMenu } from '@/components/mobile-menu';
import { SearchBar } from '@/components/search-bar';
import { ProductCard } from '@/components/product-card';
import { ShoppingCartComponent } from '@/components/shopping-cart';
import { FeatureCard } from '@/components/feature-card';
import { TestimonialCard } from '@/components/testimonial-card';
import Link from 'next/link';
import HeroSection from '@/components/hero-section';
import SpecialOfferSection from '@/components/special-offer-section';
import FeatureSection from '@/components/features';

export default function GameShopClone() {
  const specialOffers = [
    {
      title: 'Free Fire Diamond Package',
      image: '/free-fire.jpg',
      badge: 'BESTSELLER',
      price: '$9.99',
      originalPrice: '$14.99',
      discount: '33% OFF',
      isPopular: true,
      rating: 4.9,
      reviews: 2847,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'Mobile Legends Diamond Bundle',
      image: '/mobile-gaming.jpg',
      badge: 'HOT DEAL',
      price: '$12.99',
      originalPrice: '$19.99',
      discount: '35% OFF',
      rating: 4.8,
      reviews: 1923,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'Gaming Setup Premium Package',
      image: '/gaming-setup.jpg',
      badge: 'EXCLUSIVE',
      price: '$24.99',
      originalPrice: '$34.99',
      discount: '29% OFF',
      isPopular: true,
      rating: 4.9,
      reviews: 1456,
      deliveryTime: 'Instant',
      inStock: true,
    },
  ];

  const popularItems = [
    {
      title: 'Free Fire Level-Up Package',
      image: '/freefire-level-pass.jpg',
      href: '/freefire-level-pass',
      badge: 'TRENDING',
      price: '$9.99',
      originalPrice: '$14.99',
      rating: 4.8,
      reviews: 3421,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'TikTok Coins',
      image: '/tiktok-banner.jpg',
      href: '/tiktok-coin',
      badge: 'TRENDING',
      price: '$5.99',
      originalPrice: '$8.99',
      rating: 4.8,
      reviews: 3421,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'Garena Shells(my)',
      image: '/garena-banner.jpg',
      href: '/garena-shell',
      badge: 'TRENDING',
      price: '$5.99',
      originalPrice: '$8.99',
      rating: 4.8,
      reviews: 3421,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'Facebook Followers',
      image: '/facebook.jpg',
      href: '/facebook-followers',
      badge: 'TRENDING',
      price: '$5.99',
      originalPrice: '$8.99',
      rating: 4.8,
      reviews: 3421,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'Youtube Premium',
      image: '/youtube-premium-banner.jpg',
      href: '/youtube-premium',
      badge: 'TRENDING',
      price: '$5.99',
      originalPrice: '$8.99',
      rating: 4.8,
      reviews: 3421,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'Poppo Live Coins',
      image: '/poppo-banner.jpg',
      href: '/poppo',
      badge: 'TRENDING',
      price: '$5.99',
      originalPrice: '$8.99',
      rating: 4.8,
      reviews: 3421,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'Canva Pro',
      image: '/canva-banner.jpg',
      href: '/canva',
      badge: 'TRENDING',
      price: '$5.99',
      originalPrice: '$8.99',
      rating: 4.8,
      reviews: 3421,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'Paypal Balance Load',
      image: '/paypal-logo.jpg',
      href: '/paypal',
      badge: 'TRENDING',
      price: '$5.99',
      originalPrice: '$8.99',
      rating: 4.8,
      reviews: 3421,
    },
    {
      title: 'Skrill Balance Load',
      image: '/skrill-logo.jpg',
      href: '/skrill',
      badge: 'TRENDING',
      price: '$5.99',
      originalPrice: '$8.99',
      rating: 4.8,
      reviews: 3421,
      deliveryTime: 'Instant',
      inStock: true,
    },
    // {
    //   title: 'Free Fire Diamonds',
    //   image: '/free-fire.jpg',
    //   badge: 'TRENDING',
    //   price: '$5.99',
    //   originalPrice: '$8.99',
    //   rating: 4.8,
    //   reviews: 3421,
    //   deliveryTime: 'Instant',
    //   inStock: true,
    // },
    // {
    //   title: 'PUBG UC Credits',
    //   image: '/esports.jpg',
    //   badge: 'POPULAR',
    //   price: '$7.99',
    //   originalPrice: '$11.99',
    //   rating: 4.7,
    //   reviews: 2156,
    //   deliveryTime: 'Instant',
    //   inStock: true,
    // },
    // {
    //   title: 'Gaming Controller Pro',
    //   image: '/gaming-controller.jpg',
    //   badge: 'NEW',
    //   price: '$9.99',
    //   originalPrice: '$13.99',
    //   isPopular: true,
    //   rating: 4.9,
    //   reviews: 1834,
    //   deliveryTime: 'Instant',
    //   inStock: true,
    // },
    // {
    //   title: 'Netflix Premium Access',
    //   image: '/mobile-gaming.jpg',
    //   badge: 'PREMIUM',
    //   price: '$15.99',
    //   originalPrice: '$19.99',
    //   rating: 4.6,
    //   reviews: 987,
    //   deliveryTime: 'Instant',
    //   inStock: false,
    // },
    // {
    //   title: 'Steam Wallet Code',
    //   image: '/gaming-setup.jpg',
    //   badge: 'VERIFIED',
    //   price: '$10.00',
    //   originalPrice: '$12.00',
    //   rating: 4.8,
    //   reviews: 2743,
    //   deliveryTime: 'Instant',
    //   inStock: true,
    // },
    // {
    //   title: 'Discord Nitro Premium',
    //   image: '/esports.jpg',
    //   badge: 'FEATURED',
    //   price: '$9.99',
    //   originalPrice: '$14.99',
    //   isPopular: true,
    //   rating: 4.7,
    //   reviews: 1567,
    //   deliveryTime: 'Instant',
    //   inStock: true,
    // },
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face',
      rating: 5,
      comment:
        'Amazing service! Got my Free Fire diamonds instantly. Will definitely use again!',
      game: 'Free Fire Player',
    },
    {
      name: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face',
      rating: 5,
      comment:
        "Best prices I've found anywhere. Customer support is fantastic too!",
      game: 'PUBG Enthusiast',
    },
    {
      name: 'Mike Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face',
      rating: 5,
      comment: 'Reliable and fast. Been using GameShop for over a year now!',
      game: 'Mobile Legends Pro',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Search Section */}
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-blue-600/50"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Find Your Perfect Gaming Experience
            </h2>
            <p className="text-purple-100">
              Search from thousands of gaming products and services
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Hero Section */}
      {/* <HeroSection /> */}

      {/* Special Offer Section */}
      <SpecialOfferSection />

      {/* Popular Now Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-300"></div>
              <div className="flex items-center gap-3 px-8">
                <Trophy className="w-8 h-8 text-purple-600" />
                <h2 className="text-4xl font-bold text-gray-800">
                  Popular Now
                </h2>
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-300"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Most loved products by our gaming community worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {popularItems.map((item, index) => (
              <ProductCard key={index} {...item} compact />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What Our Gamers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join millions of satisfied customers who trust GameShop for their
            gaming needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay Ahead of the Game
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Get exclusive deals, early access to new products, and gaming tips
            delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full border-0 focus:outline-none focus:ring-4 focus:ring-purple-300/50 text-gray-800 font-medium"
            />
            <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Subscribe Now
            </button>
          </div>
          <p className="text-sm text-purple-200 mt-4">
            Join 500,000+ gamers already subscribed. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
