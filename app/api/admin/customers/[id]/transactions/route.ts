import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/config/db';
import User from '@/lib/models/User';
import { WalletTransaction } from '@/models/Wallet';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();

    const customerId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Verify customer exists
    const customer = await User.findById(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Get transactions with pagination
    const skip = (page - 1) * limit;
    const transactions = await WalletTransaction.find({ userId: customerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        '_id transactionId type amount balance description status paymentMethod createdAt receiptUrl'
      );

    // Get total count for pagination
    const total = await WalletTransaction.countDocuments({
      userId: customerId,
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
    console.error('Get customer transactions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
