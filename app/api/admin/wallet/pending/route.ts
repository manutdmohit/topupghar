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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || 'pending';

    // Build query
    const query: any = { type: 'topup' };
    if (status !== 'all') {
      query.status = status;
    }

    // Get pending topup transactions with user details
    const transactions = await WalletTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get user details for each transaction
    const transactionsWithUserDetails = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await User.findById(transaction.userId).select(
          'email name'
        );
        return {
          ...transaction.toObject(),
          user: user
            ? {
                email: user.email,
                name: user.name,
              }
            : null,
        };
      })
    );

    const total = await WalletTransaction.countDocuments(query);

    return NextResponse.json({
      success: true,
      transactions: transactionsWithUserDetails,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get pending topup requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
