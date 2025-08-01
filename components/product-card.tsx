'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  title: string;
  href?: string;
  image: string;
  badge: string;
  rating?: number;
  reviews?: number;
  isPopular?: boolean;
  deliveryTime?: string;
  compact?: boolean;
  inStock?: boolean;
}

export function ProductCard({
  title,
  href = '#',
  image,
  badge,
  rating = 4.8,
  reviews = 1250,
  isPopular = false,
  deliveryTime = 'Instant',
  compact = false,
  inStock = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href}>
      <Card
        className={`overflow-hidden transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl bg-white border-0 shadow-lg ${
          compact ? 'h-full' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden">
          <Image
            src={image || '/placeholder.svg'}
            alt={title}
            width={compact ? 200 : 400}
            height={compact ? 150 : 250}
            className={`w-full ${
              compact ? 'h-32' : 'h-48'
            } object-cover transition-transform duration-500`}
            style={{
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

          {/* Top Badges Row */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            <Badge
              className={`font-bold text-xs px-3 py-1 shadow-lg ${
                badge === 'BESTSELLER'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : badge === 'HOT DEAL'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500'
                  : badge === 'EXCLUSIVE'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                  : badge === 'TRENDING'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500'
              }`}
            >
              {badge}
            </Badge>

            {/* Stock / Popular */}
            <div className="flex gap-2">
              {isPopular && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 shadow-lg">
                  🔥 Hot
                </Badge>
              )}
              {inStock ? (
                <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-2 py-1 shadow-lg">
                  ✅ In Stock
                </Badge>
              ) : (
                <Badge className="bg-gray-500 text-white text-xs font-bold px-2 py-1">
                  ❌ Out of Stock
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardContent className={`${compact ? 'p-3' : 'p-5'} relative`}>
          <h3
            className={`font-bold text-gray-800 mb-2 line-clamp-2 ${
              compact ? 'text-sm' : 'text-lg'
            }`}
          >
            {title}
          </h3>

          {/* Rating */}
          {/* <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span
              className={`text-gray-600 font-medium ${
                compact ? 'text-xs' : 'text-sm'
              }`}
            >
              {rating} ({reviews.toLocaleString()})
            </span>
          </div> */}

          {/* Delivery info */}
          <div className="flex items-center gap-1 mb-5">
            <Zap className="text-green-500 w-4 h-4" />
            <span className="text-green-600 font-medium text-sm">
              {deliveryTime} Delivery
            </span>
          </div>

          {/* View More */}
          <Button
            variant="outline"
            className={`w-full border-purple-500 text-purple-700 hover:bg-purple-50 hover:text-purple-800 transition-all duration-300 font-semibold ${
              compact ? 'text-xs py-2' : 'text-sm py-3'
            }`}
          >
            View More
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
