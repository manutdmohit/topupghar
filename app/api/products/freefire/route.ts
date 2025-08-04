import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // Find Freefire diamonds product
    const product = await Product.findOne({
      platform: 'freefire',
      type: 'diamonds',
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Freefire product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching Freefire product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
