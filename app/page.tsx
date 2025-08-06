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
import PopularNow from '@/components/special-offers';
// import { popularItems } from '@/components/special-offers';

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

  const testimonials = [
    {
      name: 'Giyan Bahadur',
      avatar: 'giyan-bahadur.jpg',
      rating: 5,
      comment:
        'NextGen Digital Store le malai game logo design garera diyeko thiyo. Design ekdam ramro, professional ra budget ma. Aba ma sabai graphic design ka kaam yahi bata garauchhu. Thank you ❤️❤️',
    },
    {
      name: 'Lokndar Raikal',
      avatar: '/lokndar-raikal.jpg',
      rating: 5,
      comment:
        'Maile NextGen Digital Store bata Free Fire ko diamond kinẽ, ekdam sasto ma ra instant mero ID ma aayo! Yo store ekdam reliable chha. Aba ma sabai game item yaha bata nai kinchhu. Dhanyabaad NextGen team',
    },
    {
      name: 'Rohit Rauniyar',
      avatar: 'rohit-rauniyar.jpg',
      rating: 5,
      comment:
        'Best topop center❤️. Fast service and trusted. Dhukka vayara topop garda hunxa.',
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
      <PopularNow />

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
