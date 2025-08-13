import { randomBytes, createHmac } from 'crypto';

// Secret key for signing tokens (should be in environment variables)
const SECRET_KEY = process.env.SESSION_SECRET!;

export interface OrderSessionData {
  platform: string;
  type: string;
  amount: string;
  price: number;
  duration: string;
  level?: string;
  diamonds?: string;
  storage?: string;
  timestamp: number;
}

/**
 * Creates a secure, signed token containing order data
 */
export function createOrderToken(
  data: Omit<OrderSessionData, 'timestamp'>
): string {
  const sessionData: OrderSessionData = {
    ...data,
    timestamp: Date.now(),
  };

  // Convert to base64
  const dataString = JSON.stringify(sessionData);
  const dataBase64 = Buffer.from(dataString).toString('base64');

  // Create signature
  const signature = createHmac('sha256', SECRET_KEY)
    .update(dataBase64)
    .digest('hex');

  // Combine data and signature
  return `${dataBase64}.${signature}`;
}

/**
 * Verifies and decodes an order token
 */
export function verifyOrderToken(token: string): OrderSessionData | null {
  try {
    const [dataBase64, signature] = token.split('.');

    if (!dataBase64 || !signature) {
      return null;
    }

    // Verify signature
    const expectedSignature = createHmac('sha256', SECRET_KEY)
      .update(dataBase64)
      .digest('hex');

    if (signature !== expectedSignature) {
      return null;
    }

    // Decode data
    const dataString = Buffer.from(dataBase64, 'base64').toString();
    const sessionData: OrderSessionData = JSON.parse(dataString);

    // Check if token is expired (24 hours)
    const now = Date.now();
    const tokenAge = now - sessionData.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (tokenAge > maxAge) {
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('Error verifying order token:', error);
    return null;
  }
}

/**
 * Creates a temporary session ID for storing order data server-side
 */
export function generateSessionId(): string {
  return randomBytes(32).toString('hex');
}
