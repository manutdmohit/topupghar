import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // Find Microsoft 365 account product
    const product = await Product.findOne({
      platform: 'microsoft-365',
      type: 'account',
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Microsoft 365 product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching Microsoft 365 product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
