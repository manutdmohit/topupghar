import { NextRequest, NextResponse } from 'next/server';
import { ProductType } from '@/lib/models/ProductType';
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
    const totalProductTypes = await ProductType.countDocuments();
    const totalActiveProductTypes = await ProductType.countDocuments({
      isActive: true,
    });
    const totalInactiveProductTypes = await ProductType.countDocuments({
      isActive: false,
    });

    // Get filtered count for pagination
    const filteredCount = await ProductType.countDocuments(filter);
    const totalPages = Math.ceil(filteredCount / limit);

    // Get product types with pagination
    const productTypes = await ProductType.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      productTypes,
      pagination: {
        currentPage: page,
        totalPages,
        totalProductTypes,
        totalActiveProductTypes,
        totalInactiveProductTypes,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    console.error('Error in GET /product-types:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch product types', error: errorMessage },
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

    // Check if product type with same name or value already exists
    const existingProductType = await ProductType.findOne({
      $or: [{ name }, { value }],
    });

    if (existingProductType) {
      return NextResponse.json(
        { message: 'A product type with this name or value already exists' },
        { status: 400 }
      );
    }

    // Create new product type
    const newProductType = new ProductType({
      name,
      value,
      label,
      description,
      icon,
      color,
      isActive: true,
    });

    await newProductType.save();

    return NextResponse.json(
      {
        message: 'Product type created successfully',
        productType: newProductType,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /product-types:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to create product type', error: errorMessage },
      { status: 500 }
    );
  }
}
