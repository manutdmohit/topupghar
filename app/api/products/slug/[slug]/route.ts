import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import connectDB from '@/config/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const product = await Product.findOne({ slug: params.slug });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Filter out variants that are not in stock
    const productObj = product.toObject();
    if (productObj.variants && Array.isArray(productObj.variants)) {
      productObj.variants = productObj.variants.filter(
        (variant: any) => variant.inStock !== false
      );
    }

    return NextResponse.json(productObj);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
