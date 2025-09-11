import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Popup from '@/lib/models/Popup';

export async function GET() {
  try {
    console.log('🔍 Popup API: Starting popup fetch...');
    await connectDB();
    console.log('✅ Popup API: Database connected');

    // Force fresh data retrieval in production - use sort to get latest
    const popup = await Popup.findOne({ isActive: true }).sort({
      updatedAt: -1,
    });
    console.log('🔍 Popup API: Popup found:', popup ? 'YES' : 'NO');
    console.log('🔍 Popup API: Popup title:', popup?.title);
    console.log('🔍 Popup API: Popup ID:', popup?._id);

    if (!popup) {
      console.log('❌ Popup API: No active popup found');
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
    console.error('Error fetching popup:', error);
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
