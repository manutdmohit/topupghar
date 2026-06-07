import { NextResponse } from 'next/server';
import { getActivePaymentMethods } from '@/lib/payment-methods';

export async function GET() {
  try {
    const paymentMethods = await getActivePaymentMethods();
    return NextResponse.json({ paymentMethods });
  } catch (error) {
    console.error('Error in GET /payment-methods:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch payment methods', error: errorMessage },
      { status: 500 },
    );
  }
}
