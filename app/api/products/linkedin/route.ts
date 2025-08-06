import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // Find LinkedIn account product
    const product = await Product.findOne({
      platform: 'linkedin',
      type: 'account',
    });

    if (!product) {
      return NextResponse.json(
        { error: 'LinkedIn product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching LinkedIn product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
