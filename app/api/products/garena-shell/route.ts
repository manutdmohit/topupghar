import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { Product } from '@/models/Product';

export async function GET() {
  try {
    await connectDB();

    const product = await Product.findOne({
      platform: 'garena-shell',
      type: 'shell',
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Garena Shell product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching Garena Shell product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
