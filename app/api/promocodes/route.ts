import { NextRequest, NextResponse } from 'next/server';
import Promocode from '@/lib/models/Promocode';
import connectDB from '@/config/db';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (status) {
      if (status === 'active') {
        filter.isActive = true;
      } else if (status === 'inactive') {
        filter.isActive = false;
      } else if (status === 'expired') {
        filter.expiry = { $lt: new Date() };
      } else if (status === 'valid') {
        filter.isActive = true;
        filter.expiry = { $gt: new Date() };
        filter.$expr = { $lt: ['$usedCount', '$maxCount'] };
      }
    }

    // Get total count for pagination
    const totalPromocodes = await Promocode.countDocuments(filter);
    const totalPages = Math.ceil(totalPromocodes / limit);

    // Get promocodes with pagination
    const promocodes = await Promocode.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      promocodes,
      pagination: {
        currentPage: page,
        totalPages,
        totalPromocodes,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    console.error('Error in GET /promocodes:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch promocodes', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, maxCount, expiry, discountPercentage, discountAmount, minimumOrderAmount } = body;

    // Validate required fields
    if (!name || !maxCount || !expiry) {
      return NextResponse.json(
        { message: 'Name, max count, and expiry are required' },
        { status: 400 }
      );
    }

    // Check if promocode name already exists
    const existingPromocode = await Promocode.findOne({ name: name.toUpperCase() });
    if (existingPromocode) {
      return NextResponse.json(
        { message: 'Promocode with this name already exists' },
        { status: 400 }
      );
    }

    // Validate expiry date
    const expiryDate = new Date(expiry);
    if (expiryDate <= new Date()) {
      return NextResponse.json(
        { message: 'Expiry date must be in the future' },
        { status: 400 }
      );
    }

    // Create new promocode
    const promocode = new Promocode({
      name: name.toUpperCase(),
      maxCount,
      expiry: expiryDate,
      discountPercentage,
      discountAmount,
      minimumOrderAmount,
    });

    await promocode.save();

    return NextResponse.json({
      message: 'Promocode created successfully',
      promocode,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /promocodes:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to create promocode', error: errorMessage },
      { status: 500 }
    );
  }
}
