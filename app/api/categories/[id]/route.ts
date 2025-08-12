import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/lib/models/Category';
import connectDB from '@/config/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const category = await Category.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error in GET /categories/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch category', error: errorMessage },
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

    // Check if category exists
    const existingCategory = await Category.findById(params.id);
    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if another category with same name or value already exists
    const duplicateCategory = await Category.findOne({
      _id: { $ne: params.id },
      $or: [{ name }, { value }],
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { message: 'A category with this name or value already exists' },
        { status: 400 }
      );
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
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
      message: 'Category updated successfully',
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Error in PUT /categories/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update category', error: errorMessage },
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

    const category = await Category.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    await Category.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /categories/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to delete category', error: errorMessage },
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

    // Check if category exists
    const existingCategory = await Category.findById(params.id);
    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    // Toggle active status
    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      { isActive: !existingCategory.isActive },
      { new: true }
    );

    return NextResponse.json({
      message: `Category ${
        updatedCategory.isActive ? 'activated' : 'deactivated'
      } successfully`,
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Error in PATCH /categories/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update category status', error: errorMessage },
      { status: 500 }
    );
  }
}
