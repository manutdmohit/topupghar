import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Popup from '@/lib/models/Popup';

export async function GET(request: NextRequest) {
  try {
    // Check for force refresh parameter
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('force') === 'true';

    console.log('🔍 Popup API: Starting popup fetch...');
    console.log('🔍 Popup API: Environment:', process.env.NODE_ENV);
    console.log('🔍 Popup API: MongoDB URI exists:', !!process.env.MONGODB_URI);
    console.log('🔍 Popup API: Force refresh:', forceRefresh);

    // Force a completely fresh database connection
    await connectDB();
    console.log('✅ Popup API: Database connected');

    // AGGRESSIVE CACHE BUSTING - Multiple approaches
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);

    console.log(
      '🔍 Popup API: Cache busting with timestamp:',
      timestamp,
      'randomId:',
      randomId
    );

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
    // Debug: Check all active popups
    const allActivePopups = await Popup.find({ isActive: true }).sort({
      updatedAt: -1,
    });
    console.log('🔍 Popup API: Total active popups:', allActivePopups.length);
    allActivePopups.forEach((p, index) => {
      console.log(`🔍 Popup API: Popup ${index + 1}:`, {
        id: p._id,
        title: p.title,
        updatedAt: p.updatedAt,
        createdAt: p.createdAt,
      });
    });

    console.log('🔍 Popup API: Method 1 result:', popup1?.title);
    console.log('🔍 Popup API: Method 2 result:', popup2?.title);
    console.log('🔍 Popup API: Method 3 result:', popup3?.title);
    console.log('🔍 Popup API: Final popup title:', popup?.title);
    console.log('🔍 Popup API: Final popup ID:', popup?._id);
    console.log('🔍 Popup API: Final popup updatedAt:', popup?.updatedAt);
    console.log(
      '🔍 Popup API: Full popup object:',
      JSON.stringify(popup, null, 2)
    );

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
