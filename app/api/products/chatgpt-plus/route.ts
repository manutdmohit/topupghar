import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // Find ChatGPT Plus account product
    const product = await Product.findOne({
      platform: 'chatgpt-plus',
      type: 'account',
    });

    if (!product) {
      return NextResponse.json(
        { error: 'ChatGPT Plus product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching ChatGPT Plus product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
