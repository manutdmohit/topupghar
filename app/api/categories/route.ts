import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/lib/models/Category';
import connectDB from '@/config/db';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};

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
    const totalCategories = await Category.countDocuments();
    const totalActiveCategories = await Category.countDocuments({
      isActive: true,
    });
    const totalInactiveCategories = await Category.countDocuments({
      isActive: false,
    });

    // Get filtered count for pagination
    const filteredCount = await Category.countDocuments(filter);
    const totalPages = Math.ceil(filteredCount / limit);

    // Get categories with pagination
    const categories = await Category.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      categories,
      pagination: {
        currentPage: page,
        totalPages,
        totalCategories,
        totalActiveCategories,
        totalInactiveCategories,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    console.error('Error in GET /categories:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch categories', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, value, label, description, icon, color } = body;

    // Validate required fields
    if (!name || !value || !label) {
      return NextResponse.json(
        { message: 'Name, value, and label are required' },
        { status: 400 }
      );
    }

    // Check if category with same name or value already exists
    const existingCategory = await Category.findOne({
      $or: [{ name }, { value }],
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: 'A category with this name or value already exists' },
        { status: 400 }
      );
    }

    // Create new category
    const newCategory = new Category({
      name,
      value,
      label,
      description,
      icon,
      color,
      isActive: true,
    });

    await newCategory.save();

    return NextResponse.json(
      {
        message: 'Category created successfully',
        category: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /categories:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to create category', error: errorMessage },
      { status: 500 }
    );
  }
}
