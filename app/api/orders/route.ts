import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import connectDB from '@/config/db';

export const POST = async (req: NextRequest) => {
  try {
    await connectDB(); // Ensure database connection is established

    const order = await req.json();
    console.log('Received order data:', order);

    const newOrder = new Order(order);
    await newOrder.save();
    return NextResponse.json(newOrder);
  } catch (error) {
    console.error('Error in POST /orders:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
};
