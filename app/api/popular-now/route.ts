import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();

  const specialDeals = [
    { platform: 'freefire', type: 'diamonds' },
    {
      platform: 'pubg',
      type: 'uc',
    },
    {
      platform: 'netflix',
      type: 'account',
    },
  ];

  const products = await Product.find({
    $nor: specialDeals.map((deal) => ({
      platform: deal.platform,
      type: deal.type,
    })),
  });

  return NextResponse.json(products);
}
