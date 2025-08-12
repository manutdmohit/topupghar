import { NextRequest, NextResponse } from 'next/server';
import { ProductType } from '@/lib/models/ProductType';
import connectDB from '@/config/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const productType = await ProductType.findById(params.id);

    if (!productType) {
      return NextResponse.json(
        { message: 'Product type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ productType });
  } catch (error) {
    console.error('Error in GET /product-types/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch product type', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, value, label, description, icon, color } = body;

    // Validate required fields
    if (!name || !value || !label) {
      return NextResponse.json(
        { message: 'Name, value, and label are required' },
        { status: 400 }
      );
    }

    // Check if product type exists
    const existingProductType = await ProductType.findById(params.id);
    if (!existingProductType) {
      return NextResponse.json(
        { message: 'Product type not found' },
        { status: 404 }
      );
    }

    // Check if another product type with same name or value already exists
    const duplicateProductType = await ProductType.findOne({
      _id: { $ne: params.id },
      $or: [{ name }, { value }],
    });

    if (duplicateProductType) {
      return NextResponse.json(
        { message: 'A product type with this name or value already exists' },
        { status: 400 }
      );
    }

    // Update product type
    const updatedProductType = await ProductType.findByIdAndUpdate(
      params.id,
      {
        name,
        value,
        label,
        description,
        icon,
        color,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'Product type updated successfully',
      productType: updatedProductType,
    });
  } catch (error) {
    console.error('Error in PUT /product-types/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update product type', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const productType = await ProductType.findById(params.id);

    if (!productType) {
      return NextResponse.json(
        { message: 'Product type not found' },
        { status: 404 }
      );
    }

    await ProductType.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Product type deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /product-types/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to delete product type', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const { isActive } = body;

    // Check if product type exists
    const existingProductType = await ProductType.findById(params.id);
    if (!existingProductType) {
      return NextResponse.json(
        { message: 'Product type not found' },
        { status: 404 }
      );
    }

    // Toggle active status
    const updatedProductType = await ProductType.findByIdAndUpdate(
      params.id,
      { isActive: !existingProductType.isActive },
      { new: true }
    );

    return NextResponse.json({
      message: `Product type ${
        updatedProductType.isActive ? 'activated' : 'deactivated'
      } successfully`,
      productType: updatedProductType,
    });
  } catch (error) {
    console.error('Error in PATCH /product-types/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update product type status', error: errorMessage },
      { status: 500 }
    );
  }
}
