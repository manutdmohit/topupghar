import { NextRequest, NextResponse } from 'next/server';
import Promocode from '@/lib/models/Promocode';
import connectDB from '@/config/db';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { promocodeName, orderAmount } = await req.json();

    console.log('Promocode validation debug:', {
      promocodeName,
      orderAmount,
    });

    if (!promocodeName || !orderAmount) {
      return NextResponse.json(
        { message: 'Promocode name and order amount are required' },
        { status: 400 }
      );
    }

    // Find the promocode
    const promocode = await Promocode.findOne({
      name: promocodeName.toUpperCase(),
    });

    if (!promocode) {
      return NextResponse.json(
        { message: 'Invalid promocode' },
        { status: 400 }
      );
    }

    // Check if promocode is active
    if (!promocode.isActive) {
      return NextResponse.json(
        { message: 'This promocode is inactive' },
        { status: 400 }
      );
    }

    // Check if promocode is expired
    if (new Date() > promocode.expiry) {
      return NextResponse.json(
        { message: 'This promocode has expired' },
        { status: 400 }
      );
    }

    // Check if usage limit is reached
    if (promocode.usedCount >= promocode.maxCount) {
      return NextResponse.json(
        { message: 'This promocode usage limit has been reached' },
        { status: 400 }
      );
    }

    // Calculate discount
    const discountAmount = (orderAmount * promocode.discountPercentage) / 100;
    const finalAmount = orderAmount - discountAmount;

    return NextResponse.json({
      message: 'Promocode applied successfully',
      promocode: {
        name: promocode.name,
        discountPercentage: promocode.discountPercentage,
      },
      calculation: {
        originalAmount: orderAmount,
        discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimal places
        finalAmount: Math.round(finalAmount * 100) / 100,
      },
    });
  } catch (error) {
    console.error('Error in POST /promocodes/validate:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to validate promocode', error: errorMessage },
      { status: 500 }
    );
  }
}
