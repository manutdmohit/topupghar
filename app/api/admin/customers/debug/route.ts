import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/config/db';
import { WalletTransaction } from '@/models/Wallet';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all transactions grouped by type and status
    const transactionStats = await WalletTransaction.aggregate([
      {
        $group: {
          _id: { type: '$type', status: '$status' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: '$_id.type',
          statuses: {
            $push: {
              status: '$_id.status',
              count: '$count',
              totalAmount: '$totalAmount',
            },
          },
        },
      },
    ]);

    // Get recent transactions
    const recentTransactions = await WalletTransaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select(
        'transactionId userId type amount status paymentMethod createdAt'
      );

    // Get user count
    const userCount = await User.countDocuments();

    return NextResponse.json({
      success: true,
      debug: {
        transactionStats,
        recentTransactions,
        userCount,
        totalTransactions: await WalletTransaction.countDocuments(),
      },
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
