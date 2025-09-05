import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Popup, { IPopupModel } from '@/lib/models/Popup';

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

    // Enhanced validation
    if (!title?.trim() || !message?.trim() || !ctaText?.trim()) {
      return NextResponse.json(
        { error: 'Title, message, and CTA text are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(features) || features.length === 0) {
      return NextResponse.json(
        { error: 'At least one feature is required' },
        { status: 400 }
      );
    }

    // Validate features array
    const validFeatures = features.filter((feature) => feature?.trim());
    if (validFeatures.length === 0) {
      return NextResponse.json(
        { error: 'All features must have content' },
        { status: 400 }
      );
    }

    if (typeof showDelay !== 'number' || showDelay < 0 || showDelay > 10000) {
      return NextResponse.json(
        { error: 'Show delay must be between 0 and 10000 milliseconds' },
        { status: 400 }
      );
    }

    if (frequency && frequency !== '2hours') {
      return NextResponse.json(
        { error: 'Frequency must be set to 2hours' },
        { status: 400 }
      );
    }

    // Find existing popup or create if none exists
    let popup = await Popup.findOne({ isActive: true });

    if (popup) {
      // Update existing popup
      popup.title = title.trim();
      popup.message = message.trim();
      popup.features = validFeatures;
      popup.ctaText = ctaText.trim();
      popup.isActive = Boolean(isActive);
      popup.showDelay = Math.max(0, showDelay);
      popup.frequency = frequency || '2hours';
    } else {
      // Create new popup only if none exists
      popup = new Popup({
        title: title.trim(),
        message: message.trim(),
        features: validFeatures,
        ctaText: ctaText.trim(),
        isActive: Boolean(isActive),
        showDelay: Math.max(0, showDelay),
        frequency: frequency || '2hours',
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
      {
        error: `Failed to update popup: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      },
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

    let popup = await Popup.findOne({ isActive: true });

    if (!popup) {
      // Create a default popup if none exists
      popup = new Popup({
        title: 'Welcome to Topup घर',
        message: 'Discover amazing deals on gaming, subscriptions, and more!',
        features: [
          '🎮 Gaming Top-ups & Gift Cards',
          '📱 Social Media Services',
          '🎬 Premium Subscriptions',
          '💰 Secure & Fast Delivery',
        ],
        ctaText: 'Get Started Now! 🚀',
        isActive: true,
        showDelay: 1000,
        frequency: '2hours',
      });
      await popup.save();
    }

    return NextResponse.json({
      success: true,
      data: popup,
    });
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

export async function DELETE(request: NextRequest) {
  try {
    const adminEmail = request.headers.get('x-admin-email');

    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    // Deactivate all active popups
    const result = await Popup.updateMany(
      { isActive: true },
      { isActive: false }
    );

    return NextResponse.json({
      success: true,
      message: `Deactivated ${result.modifiedCount} popup(s)`,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    console.error('Error deactivating popup:', error);
    return NextResponse.json(
      {
        error: `Failed to deactivate popup: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      },
      { status: 500 }
    );
  }
}
