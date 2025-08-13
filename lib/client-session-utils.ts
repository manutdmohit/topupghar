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
 * Extracts the data portion from a token without verification
 * This is for client-side use only and should not be trusted for security
 */
export function extractTokenData(token: string): OrderSessionData | null {
  try {
    const [dataBase64] = token.split('.');

    if (!dataBase64) {
      return null;
    }

    // Decode data (without signature verification)
    const dataString = Buffer.from(dataBase64, 'base64').toString();
    const sessionData: OrderSessionData = JSON.parse(dataString);

    return sessionData;
  } catch (error) {
    console.error('Error extracting token data:', error);
    return null;
  }
}
