import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // Find Coursera Plus account product
    const product = await Product.findOne({
      platform: 'coursera-plus',
      type: 'account',
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Coursera Plus product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching Coursera Plus product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
