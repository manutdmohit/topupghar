import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    // Find Adobe Creative Cloud account product
    const product = await Product.findOne({
      platform: 'adobe-creative-cloud',
      type: 'account',
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Adobe Creative Cloud product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching Adobe Creative Cloud product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
