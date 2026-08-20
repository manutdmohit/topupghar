import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import connectDB from '@/config/db';

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { slug } = await params;

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }

    // Filter out variants that are not in stock
    const productObj = product.toObject();
    if (productObj.variants && Array.isArray(productObj.variants)) {
      productObj.variants = productObj.variants.filter(
        (variant: any) => variant.inStock !== false,
      );
    }

    return NextResponse.json(productObj);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
