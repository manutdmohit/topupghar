import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/config/db';
import { Wallet, WalletTransaction } from '@/models/Wallet';
import User from '@/lib/models/User';
import {
  sendWalletTopupStatusUpdateToTelegram,
  sendSimpleNotificationToTelegram,
} from '@/lib/telegram-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();

    const { transactionId, action, notes } = await request.json();

    if (!transactionId || !action) {
      return NextResponse.json(
        { error: 'Transaction ID and action are required' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Find the transaction
    const transaction = await WalletTransaction.findOne({ transactionId });
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (transaction.status !== 'pending') {
      return NextResponse.json(
        { error: 'Transaction is not pending' },
        { status: 400 }
      );
    }

    if (transaction.type !== 'topup') {
      return NextResponse.json(
        { error: 'Only topup transactions can be approved/rejected' },
        { status: 400 }
      );
    }

    // Get or create user wallet
    let wallet = await Wallet.findOne({ userId: transaction.userId });
    if (!wallet) {
      wallet = new Wallet({
        userId: transaction.userId,
        balance: 0,
        totalTopups: 0,
        totalSpent: 0,
      });
    }

    if (action === 'approve') {
      // Update transaction status
      transaction.status = 'completed';
      transaction.notes = notes || 'Approved by admin';
      transaction.balance = wallet.balance + transaction.amount;
      await transaction.save();

      // Update wallet balance
      wallet.balance += transaction.amount;
      wallet.totalTopups += transaction.amount;
      wallet.lastTransactionDate = new Date();
      await wallet.save();

      // Send Telegram notification for approval
      try {
        await sendWalletTopupStatusUpdateToTelegram(
          transaction.transactionId,
          'approved',
          notes || 'Approved by admin'
        );
        console.log(
          'Wallet top-up approval notification sent to Telegram successfully'
        );
      } catch (telegramError) {
        console.error(
          'Failed to send Telegram approval notification:',
          telegramError
        );

        // Try to send a simple notification as fallback
        try {
          await sendSimpleNotificationToTelegram(
            'Wallet Top-up Approved',
            `Transaction ID: ${transaction.transactionId}\nAmount: NPR ${transaction.amount}\nStatus: Approved`
          );
          console.log('Simple Telegram approval notification sent as fallback');
        } catch (fallbackError) {
          console.error(
            'Failed to send fallback Telegram approval notification:',
            fallbackError
          );
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Topup approved successfully',
        transaction: {
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          status: transaction.status,
          balance: transaction.balance,
        },
        wallet: {
          balance: wallet.balance,
          totalTopups: wallet.totalTopups,
        },
      });
    } else {
      // Reject the transaction
      transaction.status = 'cancelled';
      transaction.notes = notes || 'Rejected by admin';
      await transaction.save();

      // Send Telegram notification for rejection
      try {
        await sendWalletTopupStatusUpdateToTelegram(
          transaction.transactionId,
          'rejected',
          notes || 'Rejected by admin'
        );
        console.log(
          'Wallet top-up rejection notification sent to Telegram successfully'
        );
      } catch (telegramError) {
        console.error(
          'Failed to send Telegram rejection notification:',
          telegramError
        );

        // Try to send a simple notification as fallback
        try {
          await sendSimpleNotificationToTelegram(
            'Wallet Top-up Rejected',
            `Transaction ID: ${transaction.transactionId}\nAmount: NPR ${transaction.amount}\nStatus: Rejected`
          );
          console.log(
            'Simple Telegram rejection notification sent as fallback'
          );
        } catch (fallbackError) {
          console.error(
            'Failed to send fallback Telegram rejection notification:',
            fallbackError
          );
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Topup rejected',
        transaction: {
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          status: transaction.status,
        },
      });
    }
  } catch (error) {
    console.error('Admin wallet approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
