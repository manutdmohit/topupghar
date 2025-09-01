import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/config/db';
import User from '@/lib/models/User';
import { Wallet } from '@/models/Wallet';
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

    // Get total customers
    const totalCustomers = await User.countDocuments();

    // Get active customers (customers with completed wallet activity in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeCustomers = await WalletTransaction.distinct('userId', {
      createdAt: { $gte: thirtyDaysAgo },
      status: 'completed',
    });

    // Get total wallet balance
    const walletStats = await Wallet.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: '$balance' },
          totalTopups: { $sum: '$totalTopups' },
        },
      },
    ]);

    const stats = {
      totalCustomers,
      activeCustomers: activeCustomers.length,
      totalWalletBalance: walletStats[0]?.totalBalance || 0,
      totalTopups: walletStats[0]?.totalTopups || 0,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
