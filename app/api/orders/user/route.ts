import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Order from '@/models/Order';
import connectDB from '@/config/db';

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    // Get user session for authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message:
            'Authentication required. Please log in to view your orders.',
        },
        { status: 401 }
      );
    }

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // Optional filter by status
    const platform = searchParams.get('platform'); // Optional filter by platform

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build query filter
    const filter: any = { userId: session.user.id };

    if (status) {
      filter.status = status;
    }

    if (platform) {
      filter.platform = platform;
    }

    // Fetch orders for the user with pagination
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .select('-__v'); // Exclude version key

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    // Calculate pagination info
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          hasNextPage,
          hasPrevPage,
          limit,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders. Please try again.' },
      { status: 500 }
    );
  }
};



