import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import connectDB from '@/config/db';
import { requireAdmin } from '@/lib/admin-auth';
import { normalizeCheckoutInput } from '@/lib/checkout-config';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const updateData = {
      name: body.name,
      slug: body.slug,
      platform: body.platform,
      category: body.category,
      type: body.type,
      description: body.description,
      image: body.image,
      variants: body.variants,
      discountPercentage: body.discountPercentage,
      inStock: body.inStock,
      isActive: body.isActive,
      checkout: normalizeCheckoutInput(body.checkout),
    };

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;
    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
