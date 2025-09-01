export interface PriceInfo {
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  hasDiscount: boolean;
  discountAmount: number;
}

/**
 * Calculate discounted price based on original price and discount percentage
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number
): PriceInfo {
  const hasDiscount = discountPercentage > 0;
  const discountAmount = hasDiscount
    ? (originalPrice * discountPercentage) / 100
    : 0;
  const discountedPrice = hasDiscount
    ? originalPrice - discountAmount
    : originalPrice;

  return {
    originalPrice,
    discountedPrice: Math.round(discountedPrice), // Round to whole number
    discountPercentage,
    hasDiscount,
    discountAmount: Math.round(discountAmount), // Round to whole number
  };
}

/**
 * Calculate price range for a product with variants
 */
export function calculatePriceRange(
  variants: Array<{ price: number }>,
  discountPercentage: number = 0
): {
  lowestOriginalPrice: number;
  highestOriginalPrice: number;
  lowestDiscountedPrice: number;
  highestDiscountedPrice: number;
  hasDiscount: boolean;
} {
  if (!variants || variants.length === 0) {
    return {
      lowestOriginalPrice: 0,
      highestOriginalPrice: 0,
      lowestDiscountedPrice: 0,
      highestDiscountedPrice: 0,
      hasDiscount: false,
    };
  }

  const prices = variants.map((v) => v.price);
  const lowestOriginalPrice = Math.min(...prices);
  const highestOriginalPrice = Math.max(...prices);

  const lowestPriceInfo = calculateDiscountedPrice(
    lowestOriginalPrice,
    discountPercentage
  );
  const highestPriceInfo = calculateDiscountedPrice(
    highestOriginalPrice,
    discountPercentage
  );

  return {
    lowestOriginalPrice,
    highestOriginalPrice,
    lowestDiscountedPrice: lowestPriceInfo.discountedPrice,
    highestDiscountedPrice: highestPriceInfo.discountedPrice,
    hasDiscount: discountPercentage > 0,
  };
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `NPR ${Math.round(price)}`;
}

/**
 * Format discount percentage for display
 */
export function formatDiscount(discountPercentage: number): string {
  return `${discountPercentage}% OFF`;
}
