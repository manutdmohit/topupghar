import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/config/db';
import { Wallet, WalletTransaction } from '@/models/Wallet';
import User from '@/lib/models/User';
import {
  sendWalletTopupDetailsToTelegram,
  sendSimpleNotificationToTelegram,
} from '@/lib/telegram-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    await connectDB();

    const { amount, paymentMethod, receiptUrl } = await request.json();

    if (!amount || !paymentMethod || !receiptUrl) {
      return NextResponse.json(
        { error: 'Amount, payment method, and receipt are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Get or create user wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({
        userId,
        balance: 0,
        totalTopups: 0,
        totalSpent: 0,
      });
    }

    // Create pending topup transaction
    const transaction = new WalletTransaction({
      userId,
      type: 'topup',
      amount,
      balance: wallet.balance, // Current balance (will be updated when approved)
      description: `Wallet topup via ${paymentMethod}`,
      status: 'pending',
      paymentMethod,
      receiptUrl,
    });

    await transaction.save();

    // Send Telegram notification
    try {
      // Get user details for notification
      const user = await User.findById(userId).select('email name');

      const telegramData = {
        transactionId: transaction.transactionId,
        userId: transaction.userId,
        amount: transaction.amount,
        paymentMethod: transaction.paymentMethod,
        receiptUrl: transaction.receiptUrl,
        createdAt: transaction.createdAt,
        status: transaction.status,
        user: user
          ? {
              email: user.email,
              name: user.name,
            }
          : undefined,
      };

      await sendWalletTopupDetailsToTelegram(telegramData);
      console.log('Wallet top-up notification sent to Telegram successfully');
    } catch (telegramError) {
      // Log telegram error but don't fail the top-up request
      console.error('Failed to send Telegram notification:', telegramError);

      // Try to send a simple notification as fallback
      try {
        await sendSimpleNotificationToTelegram(
          'New Wallet Top-up Request',
          `Transaction ID: ${transaction.transactionId}\nAmount: NPR ${transaction.amount}\nPayment Method: ${transaction.paymentMethod}`
        );
        console.log('Simple Telegram notification sent as fallback');
      } catch (fallbackError) {
        console.error(
          'Failed to send fallback Telegram notification:',
          fallbackError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message:
        'Topup request submitted successfully. Waiting for admin approval.',
      transaction: {
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error) {
    console.error('Wallet topup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    await connectDB();

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get user's topup transactions
    const transactions = await WalletTransaction.find({
      userId,
      type: 'topup',
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await WalletTransaction.countDocuments({
      userId,
      type: 'topup',
    });

    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get topup history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
