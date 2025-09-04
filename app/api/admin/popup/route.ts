import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Popup from '@/lib/models/Popup';

export async function PUT(request: NextRequest) {
  try {
    const adminEmail = request.headers.get('x-admin-email');

    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      title,
      message,
      features,
      ctaText,
      isActive,
      showDelay,
      frequency,
    } = body;

    // Validation
    if (!title || !message || !features || !ctaText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(features) || features.length === 0) {
      return NextResponse.json(
        { error: 'Features must be a non-empty array' },
        { status: 400 }
      );
    }

    if (typeof showDelay !== 'number' || showDelay < 0) {
      return NextResponse.json(
        { error: 'Show delay must be a positive number' },
        { status: 400 }
      );
    }

    if (frequency !== '2hours') {
      return NextResponse.json(
        { error: 'Frequency must be set to 2hours' },
        { status: 400 }
      );
    }

    // Find existing popup or create new one
    let popup = await Popup.findOne({ isActive: true });

    if (popup) {
      // Update existing popup
      popup.title = title;
      popup.message = message;
      popup.features = features;
      popup.ctaText = ctaText;
      popup.isActive = isActive;
      popup.showDelay = showDelay;
      popup.frequency = frequency;
    } else {
      // Create new popup
      popup = new Popup({
        title,
        message,
        features,
        ctaText,
        isActive,
        showDelay,
        frequency,
      });
    }

    await popup.save();

    return NextResponse.json({
      success: true,
      message: 'Popup updated successfully',
      data: popup,
    });
  } catch (error) {
    console.error('Error updating popup:', error);
    return NextResponse.json(
      { error: 'Failed to update popup' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminEmail = request.headers.get('x-admin-email');

    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const popup = await Popup.getDefaultPopup();

    if (!popup) {
      return NextResponse.json({ error: 'No popup found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: popup,
    });
  } catch (error) {
    console.error('Error fetching popup:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popup' },
      { status: 500 }
    );
  }
}
