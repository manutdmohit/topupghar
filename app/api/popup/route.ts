import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Popup from '@/lib/models/Popup';

export async function GET() {
  try {
    await connectDB();

    const popup = await Popup.getDefaultPopup();

    if (!popup) {
      return NextResponse.json({ error: 'No popup found' }, { status: 404 });
    }

    return NextResponse.json({
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
  } catch (error) {
    console.error('Error fetching popup:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popup' },
      { status: 500 }
    );
  }
}
