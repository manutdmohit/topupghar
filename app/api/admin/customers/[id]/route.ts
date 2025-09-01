import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/config/db';
import User from '@/lib/models/User';
import { Wallet } from '@/models/Wallet';

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

    // Get customer details
    const customer = await User.findById(customerId).select(
      '_id email name image createdAt'
    );

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Get wallet information
    const wallet = await Wallet.findOne({ userId: customerId });

    const customerWithWallet = {
      _id: customer._id,
      email: customer.email,
      name: customer.name,
      image: customer.image,
      createdAt: customer.createdAt,
      wallet: wallet
        ? {
            balance: wallet.balance,
            totalTopups: wallet.totalTopups,
            totalSpent: wallet.totalSpent,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      customer: customerWithWallet,
    });
  } catch (error) {
    console.error('Get customer error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
