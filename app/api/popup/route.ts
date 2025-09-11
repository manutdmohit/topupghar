import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Popup from '@/lib/models/Popup';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the most recently updated active popup
    const popup = (await Popup.findOne({
      isActive: true,
      updatedAt: { $exists: true },
    })
      .sort({ updatedAt: -1 })
      .lean()
      .exec()) as any;

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
