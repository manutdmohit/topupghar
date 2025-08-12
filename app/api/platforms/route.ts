import { NextRequest, NextResponse } from 'next/server';
import { Platform } from '@/lib/models/Platform';
import connectDB from '@/config/db';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { label: { $regex: search, $options: 'i' } },
        { value: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      if (status === 'active') {
        filter.isActive = true;
      } else if (status === 'inactive') {
        filter.isActive = false;
      }
    }

    // Get total counts for stats
    const totalPlatforms = await Platform.countDocuments();
    const totalActivePlatforms = await Platform.countDocuments({
      isActive: true,
    });
    const totalInactivePlatforms = await Platform.countDocuments({
      isActive: false,
    });

    // Get filtered count for pagination
    const filteredCount = await Platform.countDocuments(filter);
    const totalPages = Math.ceil(filteredCount / limit);

    // Get platforms with pagination
    const platforms = await Platform.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      platforms,
      pagination: {
        currentPage: page,
        totalPages,
        totalPlatforms,
        totalActivePlatforms,
        totalInactivePlatforms,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    console.error('Error in GET /platforms:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch platforms', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, value, label, category, description, icon } = body;

    // Validate required fields
    if (!name || !value || !label || !category) {
      return NextResponse.json(
        { message: 'Name, value, label, and category are required' },
        { status: 400 }
      );
    }

    // Check if platform with same name or value already exists
    const existingPlatform = await Platform.findOne({
      $or: [{ name }, { value }],
    });

    if (existingPlatform) {
      return NextResponse.json(
        { message: 'A platform with this name or value already exists' },
        { status: 400 }
      );
    }

    // Create new platform
    const newPlatform = new Platform({
      name,
      value,
      label,
      category,
      description,
      icon,
      isActive: true,
    });

    await newPlatform.save();

    return NextResponse.json(
      {
        message: 'Platform created successfully',
        platform: newPlatform,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /platforms:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to create platform', error: errorMessage },
      { status: 500 }
    );
  }
}
