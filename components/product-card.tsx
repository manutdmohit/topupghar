'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  title: string;
  href?: string;
  image: string;
  badge: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
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
  price,
  originalPrice,
  discount,
  isPopular = false,
  deliveryTime = 'Instant',
  compact = false,
  inStock = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href} className="block h-full focus:outline-none">
      <Card
        className={`
          overflow-hidden transition-all duration-300 cursor-pointer
          hover:-translate-y-1 hover:shadow-xl
          bg-white border-0 shadow h-full flex flex-col active:scale-[0.98]
        `}
        style={{
          minHeight: compact ? '190px' : '240px',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={0}
      >
        {/* Image */}
        <div className="w-full aspect-[4/3] bg-gray-100 relative">
          <Image
            src={image || '/placeholder.svg'}
            alt={title}
            fill
            className={`
              object-cover transition-transform duration-500 rounded-t-xl 
              ${isHovered ? 'scale-105 brightness-110' : ''}
            `}
            sizes="(max-width: 640px) 100vw, 400px"
            priority={compact}
          />
        </div>
        {/* Content */}
        <CardContent
          className={`
            flex-1 flex flex-col justify-between pt-2 pb-2 px-2
            ${compact ? 'min-h-[60px]' : ''}
          `}
        >
          <div>
            {/* FIXED HEIGHT TITLE */}
            <h3 className="font-semibold text-gray-800 text-xs sm:text-sm mb-1 leading-snug block w-full line-clamp-2 min-h-[2.6em]">
              {title}
            </h3>
            {/* Badges row: always starts at the same Y-position */}
            <div className="flex flex-wrap items-center gap-1 mt-0 min-h-[1.5rem] mb-2 w-full">
              <Badge className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5">
                {badge}
              </Badge>
              {isPopular && (
                <Badge className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-orange-400 text-white">
                  Hot
                </Badge>
              )}
              {inStock ? (
                <Badge className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-green-500 text-white">
                  In Stock
                </Badge>
              ) : (
                <Badge className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-gray-400 text-white">
                  Out of Stock
                </Badge>
              )}
              {deliveryTime && (
                <Badge className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-purple-500 text-white flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {deliveryTime}
                </Badge>
              )}
            </div>
          </div>

          {/* Price Display */}
          {price && (
            <div className="mt-2 mb-3">
              {originalPrice && originalPrice !== price && discount ? (
                // Discounted price layout - stacked for better mobile display
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-green-600">
                      {price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-medium">
                      {discount}
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                      Save{' '}
                      {(() => {
                        // Extract numeric values from price strings
                        const originalPriceNum = parseFloat(
                          originalPrice.replace(/[^\d.]/g, '')
                        );
                        const priceNum = parseFloat(
                          price.replace(/[^\d.]/g, '')
                        );

                        if (!isNaN(originalPriceNum) && !isNaN(priceNum)) {
                          return (
                            Math.round((originalPriceNum - priceNum) * 100) /
                            100
                          );
                        }
                        return 0;
                      })()}{' '}
                      NPR
                    </span>
                  </div>
                </div>
              ) : (
                // Regular price layout
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    {price}
                  </span>
                  {originalPrice && originalPrice !== price && (
                    <span className="text-sm text-gray-500 line-through">
                      {originalPrice}
                    </span>
                  )}
                  {discount && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-medium">
                      {discount}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* View More Button */}
          <Button
            variant="outline"
            className={`
              w-full border-purple-500 text-purple-700 
              hover:bg-purple-50 hover:text-purple-800 
              transition-all duration-300 font-semibold
              py-1.5 sm:py-2 text-xs
            `}
            tabIndex={-1}
          >
            View More
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
