import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import connectDB from '@/config/db';

export async function GET(req: NextRequest) {
  await connectDB();
  const products = await Product.find({}).populate('variants');

  return NextResponse.json(products);
}
