import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/config/db';
import { Wallet, WalletTransaction } from '@/models/Wallet';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 },
      );
    }

    await connectDB();

    const { orderId, amount } = await request.json();

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Order ID and amount are required' },
        { status: 400 },
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    // Check if order exists and belongs to user
    const order = await Order.findOne({ orderId, userId });
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or does not belong to you' },
        { status: 404 },
      );
    }

    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: 'Order is not pending' },
        { status: 400 },
      );
    }

    // Get user wallet
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found. Please top up your wallet first.' },
        { status: 400 },
      );
    }

    const paymentAmount = Math.round(order.finalPrice ?? amount);
    if (wallet.balance < paymentAmount) {
      return NextResponse.json(
        { error: 'Insufficient wallet balance' },
        { status: 400 },
      );
    }

    // Create payment transaction
    const paymentTransaction = new WalletTransaction({
      userId,
      type: 'payment',
      amount: -paymentAmount, // Negative amount for payments
      balance: wallet.balance - paymentAmount,
      description: `Payment for order ${orderId}`,
      status: 'completed',
      orderId,
    });

    // Apply cashback for eligible purchases
    const cashbackThreshold = 500;
    const cashbackRate = 0.02;
    const cashbackAmount =
      paymentAmount >= cashbackThreshold
        ? Number((paymentAmount * cashbackRate).toFixed(2))
        : 0;

    // Update wallet balance
    wallet.balance -= paymentAmount;
    wallet.totalSpent += paymentAmount;
    if (cashbackAmount > 0) {
      wallet.balance += cashbackAmount;
    }
    wallet.lastTransactionDate = new Date();

    // Update order status and payment method
    order.status = 'approved';
    order.paymentMethod = 'wallet';
    order.cashbackAmount = cashbackAmount;

    // Save wallet payment and order changes
    const saveOperations: Promise<any>[] = [
      paymentTransaction.save(),
      wallet.save(),
      order.save(),
    ];

    if (cashbackAmount > 0) {
      const cashbackTransaction = new WalletTransaction({
        userId,
        type: 'cashback',
        amount: cashbackAmount,
        balance: wallet.balance,
        description: `2% cashback for purchase ${orderId}`,
        status: 'completed',
        orderId,
      });
      saveOperations.push(cashbackTransaction.save());
    }

    await Promise.all(saveOperations);

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      transaction: {
        transactionId: paymentTransaction.transactionId,
        amount: paymentTransaction.amount,
        balance: paymentTransaction.balance,
        status: paymentTransaction.status,
      },
      wallet: {
        balance: wallet.balance,
        totalSpent: wallet.totalSpent,
      },
      order: {
        orderId: order.orderId,
        status: order.status,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (error) {
    console.error('Wallet payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
