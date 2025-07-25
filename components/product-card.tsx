'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Star, Zap, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  title: string;
  image: string;
  badge: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  rating?: number;
  reviews?: number;
  isPopular?: boolean;
  deliveryTime?: string;
  compact?: boolean;
  inStock?: boolean;
}

export function ProductCard({
  title,
  image,
  badge,
  price,
  originalPrice,
  discount,
  rating = 4.8,
  reviews = 1250,
  isPopular = false,
  deliveryTime = 'Instant',
  compact = false,
  inStock = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <Card
      className={`overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 bg-white border-0 shadow-lg ${
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
          } object-cover transition-all duration-700`}
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

        {/* Badges */}
        {/* <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge
            className={`font-bold text-xs px-3 py-1 ${
              badge === 'BESTSELLER'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : badge === 'HOT DEAL'
                ? 'bg-gradient-to-r from-red-500 to-pink-500'
                : badge === 'EXCLUSIVE'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                : badge === 'TRENDING'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : badge === 'NEW'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                : 'bg-gradient-to-r from-gray-600 to-gray-700'
            } hover:scale-105 transition-transform duration-200 shadow-lg`}
          >
            {badge}
          </Badge>
          {discount && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 font-bold text-xs px-3 py-1 shadow-lg">
              {discount}
            </Badge>
          )}
        </div> */}

        {/* Wishlist button */}
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button> */}

        {/* Popular badge */}
        {/* {isPopular && (
          <div className="absolute top-3 right-12 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            🔥 Hot
          </div>
        )} */}
        {inStock ? (
          <div className="absolute top-3 right-12 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            🔥 In Stock
          </div>
        ) : (
          <div className="">🥲 Out of Stock </div>
        )}
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
        <div className="flex items-center gap-2 mb-3">
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
        </div>

        {/* Delivery info */}
        <div className="flex items-center gap-1 mb-3">
          <Zap
            className={`text-green-500 ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
          />
          <span
            className={`text-green-600 font-medium ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            {deliveryTime} Delivery
          </span>
        </div>

        {/* Price */}
        {/* {price && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className={`font-bold text-purple-600 ${
                  compact ? 'text-lg' : 'text-xl'
                }`}
              >
                {price}
              </span>
              {originalPrice && (
                <span
                  className={`text-gray-500 line-through ${
                    compact ? 'text-sm' : 'text-base'
                  }`}
                >
                  {originalPrice}
                </span>
              )}
            </div>
          </div>
        )} */}

        {/* Add to cart button */}
        {/* <Button
          className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-bold ${
            compact ? "text-xs py-2" : "text-sm py-3"
          }`}
        >
          <ShoppingCart className={`mr-2 ${compact ? "w-3 h-3" : "w-4 h-4"}`} />
          Add to Cart
        </Button> */}
      </CardContent>
    </Card>
  );
}
