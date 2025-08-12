import { NextRequest, NextResponse } from 'next/server';
import { Platform } from '@/lib/models/Platform';
import connectDB from '@/config/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const platform = await Platform.findById(params.id);

    if (!platform) {
      return NextResponse.json(
        { message: 'Platform not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ platform });
  } catch (error) {
    console.error('Error in GET /platforms/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch platform', error: errorMessage },
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
    const { name, value, label, category, description, icon } = body;

    // Validate required fields
    if (!name || !value || !label || !category) {
      return NextResponse.json(
        { message: 'Name, value, label, and category are required' },
        { status: 400 }
      );
    }

    // Check if platform exists
    const existingPlatform = await Platform.findById(params.id);
    if (!existingPlatform) {
      return NextResponse.json(
        { message: 'Platform not found' },
        { status: 404 }
      );
    }

    // Check if another platform with same name or value already exists
    const duplicatePlatform = await Platform.findOne({
      _id: { $ne: params.id },
      $or: [{ name }, { value }],
    });

    if (duplicatePlatform) {
      return NextResponse.json(
        { message: 'A platform with this name or value already exists' },
        { status: 400 }
      );
    }

    // Update platform
    const updatedPlatform = await Platform.findByIdAndUpdate(
      params.id,
      {
        name,
        value,
        label,
        category,
        description,
        icon,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'Platform updated successfully',
      platform: updatedPlatform,
    });
  } catch (error) {
    console.error('Error in PUT /platforms/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update platform', error: errorMessage },
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

    const platform = await Platform.findById(params.id);

    if (!platform) {
      return NextResponse.json(
        { message: 'Platform not found' },
        { status: 404 }
      );
    }

    await Platform.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Platform deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /platforms/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to delete platform', error: errorMessage },
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

    // Check if platform exists
    const existingPlatform = await Platform.findById(params.id);
    if (!existingPlatform) {
      return NextResponse.json(
        { message: 'Platform not found' },
        { status: 404 }
      );
    }

    // Toggle active status
    const updatedPlatform = await Platform.findByIdAndUpdate(
      params.id,
      { isActive: !existingPlatform.isActive },
      { new: true }
    );

    return NextResponse.json({
      message: `Platform ${
        updatedPlatform.isActive ? 'activated' : 'deactivated'
      } successfully`,
      platform: updatedPlatform,
    });
  } catch (error) {
    console.error('Error in PATCH /platforms/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update platform status', error: errorMessage },
      { status: 500 }
    );
  }
}
