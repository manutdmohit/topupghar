import { NextRequest, NextResponse } from 'next/server';

import { Product } from '@/models/Product';
import connectDB from '@/config/db';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const products = await Product.find({
      category: 'social-media',
      isActive: true,
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
