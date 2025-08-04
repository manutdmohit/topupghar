import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import connectDB from '@/config/db';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to upload image to Cloudinary
async function uploadImage(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'topupghar-receipts', // Optional: organize uploads
      },
      (err: any, result: UploadApiResponse | undefined) => {
        if (err) {
          console.error('Cloudinary Error:', err);
          return reject(new Error('Image upload failed.'));
        }
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Cloudinary did not return a result.'));
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export const POST = async (req: NextRequest) => {
  try {
    await connectDB(); // Ensure database connection is established

    const formData = await req.formData();
    const receipt = formData.get('receipt') as File | null;

    if (!receipt) {
      return NextResponse.json(
        { message: 'Receipt image is required.' },
        { status: 400 }
      );
    }

    // Upload receipt to Cloudinary
    const uploadResult = (await uploadImage(receipt)) as UploadApiResponse;

    // Prepare order data from form fields
    const orderData: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      if (key !== 'receipt') {
        // Exclude the file itself from the order data object
        orderData[key] = value;
      }
    });

    // Create a new order with the Cloudinary URL
    const newOrder = new Order({
      ...orderData,
      receiptUrl: uploadResult.secure_url,
    });

    await newOrder.save();
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error in POST /orders:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to create order', error: errorMessage },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectDB(); // Ensure database connection is established

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const platform = searchParams.get('platform') || '';

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (platform) filter.platform = { $regex: platform, $options: 'i' };

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    // Get orders with pagination
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    console.error('Error in GET /orders:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch orders', error: errorMessage },
      { status: 500 }
    );
  }
};
