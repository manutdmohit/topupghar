import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import connectDB from '@/config/db';
import { v2 as cloudinary } from 'cloudinary';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
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
        { platform: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      if (status === 'active') {
        filter.isActive = true;
      } else if (status === 'inactive') {
        filter.isActive = false;
      } else if (status === 'inStock') {
        filter.inStock = true;
      } else if (status === 'outOfStock') {
        filter.inStock = false;
      }
    }

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    // Get additional stats for all products (not filtered)
    const totalActiveProducts = await Product.countDocuments({
      isActive: true,
    });
    const totalInStockProducts = await Product.countDocuments({
      inStock: true,
    });

    // Get products with pagination
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
      stats: {
        totalActiveProducts,
        totalInStockProducts,
      },
    });
  } catch (error) {
    console.error('Error in GET /products:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch products', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const data = formData.get('data') as string;
    const imageFile = formData.get('image') as File;

    if (!data) {
      return NextResponse.json(
        { message: 'Product data is required' },
        { status: 400 }
      );
    }

    const productData = JSON.parse(data);

    // Validate required fields
    if (
      !productData.name ||
      !productData.platform ||
      !productData.category ||
      !productData.type
    ) {
      return NextResponse.json(
        { message: 'Name, platform, category, and type are required' },
        { status: 400 }
      );
    }

    // Validate variants
    if (
      !productData.variants ||
      !Array.isArray(productData.variants) ||
      productData.variants.length === 0
    ) {
      return NextResponse.json(
        { message: 'At least one variant is required' },
        { status: 400 }
      );
    }

    // Check if product with same slug already exists
    const existingProduct = await Product.findOne({ slug: productData.slug });
    if (existingProduct) {
      return NextResponse.json(
        { message: 'A product with this name already exists' },
        { status: 400 }
      );
    }

    let imageUrl = '';

    // Upload image to Cloudinary if provided
    if (imageFile) {
      try {
        // Convert File to buffer
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: 'auto',
                folder: 'products',
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(buffer);
        });

        imageUrl = (result as any).secure_url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json(
          { message: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Create new product
    const newProduct = new Product({
      ...productData,
      image: imageUrl,
    });

    await newProduct.save();

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /products:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to create product', error: errorMessage },
      { status: 500 }
    );
  }
}
