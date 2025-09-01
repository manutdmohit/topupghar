import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/config/db';
import { Wallet, WalletTransaction } from '@/models/Wallet';

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
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type'); // Optional filter by transaction type

    // Get or create user wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({
        userId,
        balance: 0,
        totalTopups: 0,
        totalSpent: 0,
      });
      await wallet.save();
    }

    // Build query for transactions
    const query: any = { userId };
    if (type) {
      query.type = type;
    }

    // Get user's transactions
    const transactions = await WalletTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await WalletTransaction.countDocuments(query);

    return NextResponse.json({
      success: true,
      wallet: {
        balance: wallet.balance,
        totalTopups: wallet.totalTopups,
        totalSpent: wallet.totalSpent,
        lastTransactionDate: wallet.lastTransactionDate,
      },
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get wallet balance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
