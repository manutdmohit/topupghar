import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/config/db';
import { WalletTransaction } from '@/models/Wallet';

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

    // Get statistics for topup transactions
    const totalRequests = await WalletTransaction.countDocuments({
      type: 'topup',
    });
    const pendingRequests = await WalletTransaction.countDocuments({
      type: 'topup',
      status: 'pending',
    });
    const completedRequests = await WalletTransaction.countDocuments({
      type: 'topup',
      status: 'completed',
    });
    const cancelledRequests = await WalletTransaction.countDocuments({
      type: 'topup',
      status: 'cancelled',
    });
    const failedRequests = await WalletTransaction.countDocuments({
      type: 'topup',
      status: 'failed',
    });

    // Get total amount statistics
    const totalAmount = await WalletTransaction.aggregate([
      { $match: { type: 'topup', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const pendingAmount = await WalletTransaction.aggregate([
      { $match: { type: 'topup', status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalRequests,
        pendingRequests,
        completedRequests,
        cancelledRequests,
        failedRequests,
        totalAmount: totalAmount[0]?.total || 0,
        pendingAmount: pendingAmount[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('Get wallet statistics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
