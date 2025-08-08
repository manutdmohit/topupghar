import connectDB from '@/config/db';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderStatusUpdateToTelegram } from '@/lib/telegram-service';

export const GET = async (req: NextRequest, context: any) => {
  try {
    await connectDB(); // Ensure database connection is established

    const { id } = context.params;

    console.log(`Fetching order with ID: ${id}`);

    if (!id) {
      return NextResponse.json(
        { message: 'Order ID is required.' },
        { status: 400 }
      );
    }
    const order = await Order.findOne({ _id: id });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error in GET /orders/:id:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch order', error: errorMessage },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: NextRequest, context: any) => {
  try {
    await connectDB();

    const { id } = context.params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: 'Order ID is required.' },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Send Telegram notification for status updates
    if (
      body.status &&
      ['approved', 'rejected', 'processing'].includes(body.status)
    ) {
      try {
        await sendOrderStatusUpdateToTelegram(
          order.orderId,
          body.status,
          body.additionalInfo || body.note
        );
        console.log('Order status update sent to Telegram successfully');
      } catch (telegramError) {
        console.error(
          'Failed to send order status update to Telegram:',
          telegramError
        );
        // Don't fail the request if Telegram notification fails
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error in PATCH /orders/:id:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update order', error: errorMessage },
      { status: 500 }
    );
  }
};
