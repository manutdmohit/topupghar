import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // Find YouTube subscribers product
    const product = await Product.findOne({
      platform: 'youtube',
      type: 'subscribers',
    });

    if (!product) {
      return NextResponse.json(
        { error: 'YouTube subscribers product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching YouTube subscribers product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
