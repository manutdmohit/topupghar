import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // Find Netflix account product
    const product = await Product.findOne({
      platform: 'netflix',
      type: 'account',
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Netflix product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching Netflix product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
