import React from 'react';
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
import { ProductCard } from '@/components/product-card';

const specialOffers = [
  {
    title: 'Free Fire Diamond Package(NP/BD Server)',
    href: '/freefire',
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
    title: 'PUBG Mobile UC',
    image: '/pubg.jpg',
    href: '/pubg',
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
    title: 'Netflix Subscription',
    image: '/netflix-banner.jpg',
    href: '/netflix',
    badge: 'BESTSELLER',
    price: '$9.99',
    originalPrice: '$14.99',
    rating: 4.9,
    reviews: 2847,
    deliveryTime: 'Instant',
    inStock: true,
  },

  //   {
  //     title: 'Gaming Setup Premium Package',
  //     image: '/gaming-setup.jpg',
  //     badge: 'EXCLUSIVE',
  //     price: '$24.99',
  //     originalPrice: '$34.99',
  //     discount: '29% OFF',
  //     isPopular: true,
  //     rating: 4.9,
  //     reviews: 1456,
  //     deliveryTime: 'Instant',
  //     inStock: true,
  //   },
];

const SpecialOfferSection = () => {
  return (
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {specialOffers.map((offer, index) => (
          <ProductCard key={index} {...offer} />
        ))}
      </div>
    </section>
  );
};

export default SpecialOfferSection;
