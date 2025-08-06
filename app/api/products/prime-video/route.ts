import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { Product } from '@/models/Product';

export async function GET() {
  try {
    await connectDB();

    const product = await Product.findOne({
      platform: 'prime-video',
      type: 'account',
      isActive: true,
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching prime-video product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product data' },
      { status: 500 }
    );
  }
}
