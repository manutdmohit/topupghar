import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/config/db';
import User from '@/lib/models/User';
import { Wallet } from '@/models/Wallet';
import { WalletTransaction } from '@/models/Wallet';
import Order from '@/models/Order';

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

    // Get first customer for testing
    const customer = await User.findOne().select('_id email name');

    if (!customer) {
      return NextResponse.json({ error: 'No customers found' });
    }

    const customerId = customer._id.toString();

    // Check wallet
    const wallet = await Wallet.findOne({ userId: customerId });

    // Check transactions
    const transactions = await WalletTransaction.find({ userId: customerId });

    // Check orders
    const orders = await Order.find({ userId: customerId });

    // Raw aggregation test
    const topupTest = await WalletTransaction.aggregate([
      {
        $match: {
          userId: customerId,
          type: 'topup',
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    const orderTest = await Order.aggregate([
      {
        $match: { userId: customerId },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      test: {
        customer: {
          _id: customer._id,
          _idString: customerId,
          email: customer.email,
          name: customer.name,
        },
        wallet: wallet
          ? {
              userId: wallet.userId,
              balance: wallet.balance,
              totalTopups: wallet.totalTopups,
              totalSpent: wallet.totalSpent,
            }
          : null,
        transactions: {
          total: transactions.length,
          sample: transactions.slice(0, 3).map((t) => ({
            transactionId: t.transactionId,
            userId: t.userId,
            type: t.type,
            status: t.status,
            amount: t.amount,
          })),
        },
        orders: {
          total: orders.length,
          sample: orders.slice(0, 3).map((o) => ({
            orderId: o.orderId,
            userId: o.userId,
            status: o.status,
            finalPrice: o.finalPrice,
          })),
        },
        aggregation: {
          topupCount: topupTest[0]?.count || 0,
          orderCount: orderTest[0]?.total || 0,
        },
        allTransactions: transactions.map((t) => ({
          transactionId: t.transactionId,
          userId: t.userId,
          type: t.type,
          status: t.status,
          amount: t.amount,
        })),
      },
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
