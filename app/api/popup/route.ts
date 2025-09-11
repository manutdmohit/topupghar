import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Popup from '@/lib/models/Popup';

export async function GET() {
  try {
    console.log('🔍 Popup API: Starting popup fetch...');
    await connectDB();
    console.log('✅ Popup API: Database connected');

    // Force fresh data retrieval - clear any potential caches
    const popup = (await Popup.findOne({ isActive: true })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean()
      .exec()) as any;

    // Force a fresh query by adding a random condition (always true)
    const freshPopup = (await Popup.findOne({
      isActive: true,
      _id: { $exists: true }, // This forces a fresh query
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean()
      .exec()) as any;
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

    console.log('🔍 Popup API: Original popup title:', popup?.title);
    console.log('🔍 Popup API: Fresh popup title:', freshPopup?.title);
    console.log('🔍 Popup API: Using fresh popup:', freshPopup ? 'YES' : 'NO');
    console.log('🔍 Popup API: Fresh popup ID:', freshPopup?._id);
    console.log(
      '🔍 Popup API: Full fresh popup object:',
      JSON.stringify(freshPopup, null, 2)
    );

    const finalPopup = freshPopup || popup;

    if (!finalPopup) {
      console.log('❌ Popup API: No active popup found');
      return NextResponse.json(
        { error: 'No active popup found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        title: finalPopup.title,
        message: finalPopup.message,
        features: finalPopup.features,
        ctaText: finalPopup.ctaText,
        isActive: finalPopup.isActive,
        showDelay: finalPopup.showDelay,
        frequency: finalPopup.frequency,
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
