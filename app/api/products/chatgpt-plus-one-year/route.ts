import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // Find ChatGPT Plus One Year account product
    const product = await Product.findOne({
      platform: 'chatgpt-plus-one-year',
      type: 'account',
    });

    if (!product) {
      return NextResponse.json(
        { error: 'ChatGPT Plus One Year product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching ChatGPT Plus One Year product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
