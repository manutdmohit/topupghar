import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();
  try {
    const product = await Product.findOne({
      platform: 'youtube-premium',
      type: 'account',
    });
    if (!product) {
      return NextResponse.json(
        { error: 'YouTube Premium product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching YouTube Premium product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
