/**
 * Utility functions for stock management based on variants
 */

export interface StockStatus {
  hasVariants: boolean;
  inStock: boolean;
  variantCount: number;
  isOutOfStock: boolean;
}

/**
 * Check stock status based on variants array and inStock flag
 */
export function checkStockStatus(
  variants: any[] = [],
  inStock: boolean = true
): StockStatus {
  const hasVariants = variants && variants.length > 0;
  const variantCount = variants ? variants.length : 0;

  // Product is out of stock if:
  // 1. No variants available, OR
  // 2. inStock flag is false
  const isOutOfStock = !hasVariants || !inStock;

  return {
    hasVariants,
    inStock: inStock && hasVariants,
    variantCount,
    isOutOfStock,
  };
}

/**
 * Get stock status message for display
 */
export function getStockStatusMessage(stockStatus: StockStatus): string {
  if (!stockStatus.hasVariants) {
    return 'No Packages Available';
  }

  if (!stockStatus.inStock) {
    return 'Out of Stock';
  }

  return 'In Stock';
}

/**
 * Get stock status badge color
 */
export function getStockStatusColor(stockStatus: StockStatus): string {
  if (stockStatus.isOutOfStock) {
    return 'bg-gray-400 text-white';
  }

  return 'bg-green-500 text-white';
}

/**
 * Check if product can be purchased
 */
export function canPurchase(
  variants: any[] = [],
  inStock: boolean = true
): boolean {
  const stockStatus = checkStockStatus(variants, inStock);
  return !stockStatus.isOutOfStock;
}
