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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Build search query
    const searchQuery: any = {};
    if (search) {
      searchQuery.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    // Get customers with pagination
    const skip = (page - 1) * limit;
    const customers = await User.find(searchQuery)
      .select('_id email name image createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments(searchQuery);

    // Get wallet information for each customer
    const customersWithWallet = await Promise.all(
      customers.map(async (customer) => {
        const wallet = await Wallet.findOne({
          userId: customer._id.toString(),
        });

        // Get top-up statistics (only completed top-ups)
        const topupStats = await WalletTransaction.aggregate([
          {
            $match: {
              userId: customer._id.toString(), // Convert ObjectId to string
              type: 'topup',
              status: 'completed',
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              lastTopupDate: { $max: '$createdAt' },
            },
          },
        ]);

        const topupCount = topupStats[0]?.count || 0;
        const lastTopupDate = topupStats[0]?.lastTopupDate || null;

        // Get pending top-up count
        const pendingTopupStats = await WalletTransaction.aggregate([
          {
            $match: {
              userId: customer._id.toString(), // Convert ObjectId to string
              type: 'topup',
              status: 'pending',
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
        ]);

        const pendingTopupCount = pendingTopupStats[0]?.count || 0;

        // Get order counts
        const orderStats = await Order.aggregate([
          {
            $match: { userId: customer._id.toString() }, // Convert ObjectId to string
          },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              completedOrders: {
                $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
              },
              pendingOrders: {
                $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
              },
            },
          },
        ]);

        const orderCounts = orderStats[0] || {
          totalOrders: 0,
          completedOrders: 0,
          pendingOrders: 0,
        };

        return {
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
          topupCount,
          pendingTopupCount,
          lastTopupDate,
          orderCounts: {
            total: orderCounts.totalOrders,
            completed: orderCounts.completedOrders,
            pending: orderCounts.pendingOrders,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      customers: customersWithWallet,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCustomers: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
