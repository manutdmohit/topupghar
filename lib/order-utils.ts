/**
 * Utility functions for order management
 */

/**
 * Generates a unique order ID with format: ORD-YYYYMMDD-HHMMSS-RANDOM
 * @returns {string} A unique order ID
 */
export function generateOrderId(): string {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  const timeStr =
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `ORD-${dateStr}-${timeStr}-${random}`;
}

/**
 * Generates a temporary order ID for failed orders
 * @returns {string} A temporary order ID
 */
export function generateTempOrderId(): string {
  return `ORD-${Date.now()}-TEMP`;
}

/**
 * Generates a failed order ID
 * @returns {string} A failed order ID
 */
export function generateFailedOrderId(): string {
  return `ORD-${Date.now()}-FAILED`;
}

/**
 * Validates if an order ID follows the correct format
 * @param orderId - The order ID to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidOrderId(orderId: string): boolean {
  // Check if it follows the pattern: ORD-YYYYMMDD-HHMMSS-RANDOM
  const orderIdPattern = /^ORD-\d{8}-\d{6}-\d{3}$/;
  return orderIdPattern.test(orderId);
}

/**
 * Formats an order ID for display
 * @param orderId - The order ID to format
 * @returns {string} Formatted order ID
 */
export function formatOrderId(orderId: string): string {
  if (!orderId) return 'N/A';

  // If it's a valid order ID, format it nicely
  if (isValidOrderId(orderId)) {
    const parts = orderId.split('-');
    if (parts.length === 4) {
      const [prefix, date, time, random] = parts;
      return `${prefix}-${date}-${time}-${random}`;
    }
  }

  return orderId;
}
