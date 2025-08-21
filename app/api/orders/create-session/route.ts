import { NextRequest, NextResponse } from 'next/server';
import { createOrderToken } from '@/lib/session-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      platform,
      type,
      amount,
      price,
      originalPrice,
      discountPercentage,
      duration,
      level,
      diamonds,
      storage,
    } = body;

    // Validate required fields
    if (!platform || !type || !price || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate price is a number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    // Create secure token
    const orderData = {
      platform,
      type,
      amount: amount || '',
      price: priceNum,
      originalPrice: originalPrice ? parseFloat(originalPrice) : priceNum,
      discountPercentage: discountPercentage
        ? parseFloat(discountPercentage)
        : 0,
      duration,
      level: level || '',
      diamonds: diamonds || '',
      storage: storage || '',
    };

    const token = createOrderToken(orderData);

    return NextResponse.json({
      success: true,
      token,
      message: 'Order session created successfully',
    });
  } catch (error) {
    console.error('Error creating order session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
