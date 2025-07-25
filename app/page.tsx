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
      title: 'Free Fire Diamonds',
      image: '/free-fire.jpg',
      badge: 'TRENDING',
      price: '$5.99',
      originalPrice: '$8.99',
      rating: 4.8,
      reviews: 3421,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'PUBG UC Credits',
      image: '/esports.jpg',
      badge: 'POPULAR',
      price: '$7.99',
      originalPrice: '$11.99',
      rating: 4.7,
      reviews: 2156,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'Gaming Controller Pro',
      image: '/gaming-controller.jpg',
      badge: 'NEW',
      price: '$9.99',
      originalPrice: '$13.99',
      isPopular: true,
      rating: 4.9,
      reviews: 1834,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'Netflix Premium Access',
      image: '/mobile-gaming.jpg',
      badge: 'PREMIUM',
      price: '$15.99',
      originalPrice: '$19.99',
      rating: 4.6,
      reviews: 987,
      deliveryTime: 'Instant',
      inStock: false,
    },
    {
      title: 'Steam Wallet Code',
      image: '/gaming-setup.jpg',
      badge: 'VERIFIED',
      price: '$10.00',
      originalPrice: '$12.00',
      rating: 4.8,
      reviews: 2743,
      deliveryTime: 'Instant',
      inStock: true,
    },
    {
      title: 'Discord Nitro Premium',
      image: '/esports.jpg',
      badge: 'FEATURED',
      price: '$9.99',
      originalPrice: '$14.99',
      isPopular: true,
      rating: 4.7,
      reviews: 1567,
      deliveryTime: 'Instant',
      inStock: true,
    },
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Delivery',
      description:
        'Get your gaming credits delivered instantly to your account',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: '100% Secure',
      description: 'All transactions are protected with bank-level security',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Trusted by Millions',
      description: 'Over 2 million satisfied gamers worldwide',
      color: 'from-purple-400 to-pink-500',
    },
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
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white px-4 py-4 sticky top-0 z-50 shadow-2xl backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                GAME SHOP
              </span>
              <div className="text-xs text-purple-300">
                Premium Gaming Store
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#"
              className="hover:text-purple-300 transition-all duration-300 font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <div className="relative group">
              <div className="flex items-center space-x-1 hover:text-purple-300 transition-all duration-300 cursor-pointer font-medium relative group">
                <span>Shop</span>
                <ChevronDown className="w-4 h-4" />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </div>
              <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-purple-500/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link
                  href="#"
                  className="block px-4 py-3 text-sm text-gray-200 hover:bg-purple-500/20 hover:text-purple-300 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                >
                  Gaming
                </Link>
                <Link
                  href="#"
                  className="block px-4 py-3 text-sm text-gray-200 hover:bg-purple-500/20 hover:text-purple-300 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                >
                  Gift Cards
                </Link>
                <Link
                  href="#"
                  className="block px-4 py-3 text-sm text-gray-200 hover:bg-purple-500/20 hover:text-purple-300 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                >
                  Subscription
                </Link>
              </div>
            </div>
            <Link
              href="#"
              className="hover:text-purple-300 transition-all duration-300 font-medium relative group"
            >
              Contact Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* <ShoppingCartComponent /> */}
            <MobileMenu />
          </div>
        </div>
      </header>

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
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-blue-600/80 to-purple-600/90 z-10"></div>
          <Image
            src="/hero-gaming.jpg"
            alt="Gaming Hero"
            width={1200}
            height={500}
            className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
            <div className="max-w-4xl px-6">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Level Up Your
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Gaming Experience
                </span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get instant access to premium gaming credits, exclusive content,
                and the best deals on your favorite games
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Shop Now
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Why Choose GameShop?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide the most reliable and secure platform for all your gaming
            needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* Special Offer Section */}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialOffers.map((offer, index) => (
            <ProductCard key={index} {...offer} />
          ))}
        </div>
      </section>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {popularItems.map((item, index) => (
              <ProductCard key={index} {...item} compact />
            ))}
          </div>
        </div>
      </section>

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

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Gamepad2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    GAME SHOP
                  </span>
                  <div className="text-sm text-purple-300">
                    Premium Gaming Store
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Your ultimate destination for gaming credits, premium services,
                and exclusive content. Trusted by millions of gamers worldwide
                with instant delivery and 24/7 support.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'discord'].map(
                  (social) => (
                    <div
                      key={social}
                      className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center cursor-pointer hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-300 border border-purple-500/20 hover:border-purple-400/40"
                    >
                      <span className="text-sm font-bold capitalize">
                        {social[0]}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 text-purple-300">
                Quick Links
              </h3>
              <ul className="space-y-4">
                {['Home', 'Shop', 'About Us', 'Contact', 'FAQ', 'Support'].map(
                  (link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-gray-300 hover:text-purple-300 transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        {link}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 text-purple-300">
                Services
              </h3>
              <ul className="space-y-4">
                {[
                  'Game Top-ups',
                  'Premium Accounts',
                  'Gift Cards',
                  'Streaming Services',
                  'Mobile Credits',
                  'Console Games',
                ].map((service) => (
                  <li key={service}>
                    <Link
                      href="#"
                      className="text-gray-300 hover:text-purple-300 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-500/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2024 GameShop. All rights reserved. | Instant delivery
                guaranteed worldwide
              </p>
              <div className="flex space-x-6 text-sm">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-purple-300 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-purple-300 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-purple-300 transition-colors"
                >
                  Refund Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
