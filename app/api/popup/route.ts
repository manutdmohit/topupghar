import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Popup from '@/lib/models/Popup';

export async function GET(request: NextRequest) {
  try {
    // Check for force refresh parameter
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('force') === 'true';

    // Force a completely fresh database connection
    await connectDB();

    // AGGRESSIVE CACHE BUSTING - Multiple approaches
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);

    // Method 1: Direct query with timestamp condition
    const popup1 = (await Popup.findOne({
      isActive: true,
      updatedAt: { $exists: true }, // Force fresh query
    })
      .sort({ updatedAt: -1 })
      .lean()
      .exec()) as any;

    // Method 2: Query by ID with additional conditions
    const popup2 = (await Popup.findOne({
      isActive: true,
      _id: { $exists: true },
      title: { $exists: true },
    })
      .sort({ updatedAt: -1 })
      .lean()
      .exec()) as any;

    // Method 3: Force fresh query with timestamp
    const popup3 = (await Popup.findOne({
      isActive: true,
      $expr: { $gte: ['$updatedAt', new Date(0)] }, // Always true but forces fresh query
    })
      .sort({ updatedAt: -1 })
      .lean()
      .exec()) as any;

    // Use the most recent result
    const popup = popup1 || popup2 || popup3;

    if (!popup) {
      return NextResponse.json(
        { error: 'No active popup found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        title: popup.title,
        message: popup.message,
        features: popup.features,
        ctaText: popup.ctaText,
        isActive: popup.isActive,
        showDelay: popup.showDelay,
        frequency: popup.frequency,
      },
    });

    // Add cache-busting headers
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to fetch popup: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      },
      { status: 500 }
    );
  }
}
