import connectDB from '@/config/db';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderStatusUpdateToTelegram } from '@/lib/telegram-service';
import { Wallet, WalletTransaction } from '@/models/Wallet';

// Helper function to process wallet refunds
async function processWalletRefund(order: any) {
  try {
    const userId = order.userId;
    const refundAmount = order.finalPrice || order.price || 0;

    if (refundAmount <= 0) {
      throw new Error('Invalid refund amount');
    }

    console.log('Processing refund:', {
      userId,
      refundAmount,
      orderId: order.orderId,
    });

    // Get user wallet
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      throw new Error('User wallet not found');
    }

    // Create refund transaction
    const refundTransaction = new WalletTransaction({
      userId,
      type: 'refund',
      amount: refundAmount, // Positive amount for refunds
      balance: wallet.balance + refundAmount,
      description: `Refund for rejected order ${order.orderId}`,
      status: 'completed',
      orderId: order.orderId,
      notes: 'Order rejected by admin - automatic refund processed',
    });

    // Update wallet balance
    wallet.balance += refundAmount;
    wallet.lastTransactionDate = new Date();

    // Save all changes
    await Promise.all([refundTransaction.save(), wallet.save()]);

    console.log('Refund completed:', {
      transactionId: refundTransaction.transactionId,
      newBalance: wallet.balance,
      refundAmount,
    });

    return {
      success: true,
      transactionId: refundTransaction.transactionId,
      refundAmount,
      newBalance: wallet.balance,
    };
  } catch (error) {
    console.error('Error in processWalletRefund:', error);
    throw error;
  }
}

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

    // Get the order before updating to check if it was a wallet payment
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Check if this is a status change to 'rejected' for a wallet payment
    if (
      body.status === 'rejected' &&
      existingOrder.paymentMethod === 'wallet'
    ) {
      console.log('Processing wallet refund for rejected order:', {
        orderId: existingOrder.orderId,
        userId: existingOrder.userId,
        amount: existingOrder.finalPrice || existingOrder.price,
        paymentMethod: existingOrder.paymentMethod,
      });

      try {
        // Process wallet refund
        const refundResult = await processWalletRefund(existingOrder);
        console.log('Wallet refund processed successfully:', refundResult);
      } catch (refundError) {
        console.error('Failed to process wallet refund:', refundError);
        return NextResponse.json(
          {
            message:
              'Order rejected but failed to process wallet refund. Please contact support.',
            error:
              refundError instanceof Error
                ? refundError.message
                : 'Unknown refund error',
          },
          { status: 500 }
        );
      }
    }

    // Update the order
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
