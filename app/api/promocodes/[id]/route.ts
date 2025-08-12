import { NextRequest, NextResponse } from 'next/server';
import Promocode from '@/lib/models/Promocode';
import connectDB from '@/config/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await req.json();
    const { name, maxCount, expiry, discountPercentage, isActive } = body;

    // Validate required fields
    if (!name || !maxCount || !expiry || discountPercentage === undefined) {
      return NextResponse.json(
        {
          message:
            'Name, max count, expiry, and discount percentage are required',
        },
        { status: 400 }
      );
    }

    // Check if promocode exists
    const existingPromocode = await Promocode.findById(id);
    if (!existingPromocode) {
      return NextResponse.json(
        { message: 'Promocode not found' },
        { status: 404 }
      );
    }

    // Check if name is being changed and if it already exists
    if (name !== existingPromocode.name) {
      const nameExists = await Promocode.findOne({ name: name.toUpperCase() });
      if (nameExists) {
        return NextResponse.json(
          { message: 'Promocode with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Validate expiry date
    const expiryDate = new Date(expiry);
    if (expiryDate <= new Date()) {
      return NextResponse.json(
        { message: 'Expiry date must be in the future' },
        { status: 400 }
      );
    }

    // Update promocode
    const updatedPromocode = await Promocode.findByIdAndUpdate(
      id,
      {
        name: name.toUpperCase(),
        maxCount,
        expiry: expiryDate,
        discountPercentage,
        isActive: isActive !== undefined ? isActive : true, // Default to true if not provided
      },
      { new: true }
    );

    return NextResponse.json({
      message: 'Promocode updated successfully',
      promocode: updatedPromocode,
    });
  } catch (error) {
    console.error('Error in PUT /promocodes/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update promocode', error: errorMessage },
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

    const { id } = params;
    const body = await req.json();
    const { isActive } = body;

    // Check if promocode exists
    const existingPromocode = await Promocode.findById(id);
    if (!existingPromocode) {
      return NextResponse.json(
        { message: 'Promocode not found' },
        { status: 404 }
      );
    }

    // Update promocode status
    const updatedPromocode = await Promocode.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    return NextResponse.json({
      message: `Promocode ${
        isActive ? 'activated' : 'deactivated'
      } successfully`,
      promocode: updatedPromocode,
    });
  } catch (error) {
    console.error('Error in PATCH /promocodes/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update promocode status', error: errorMessage },
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

    const { id } = params;

    // Check if promocode exists
    const existingPromocode = await Promocode.findById(id);
    if (!existingPromocode) {
      return NextResponse.json(
        { message: 'Promocode not found' },
        { status: 404 }
      );
    }

    // Delete promocode
    await Promocode.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Promocode deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /promocodes/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to delete promocode', error: errorMessage },
      { status: 500 }
    );
  }
}
