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
    $or: specialDeals.map((deal) => ({
      platform: deal.platform,
      type: deal.type,
    })),
  });

  // Sort products in the order specified in specialDeals
  const sortedProducts = specialDeals
    .map((deal) => {
      return products.find(
        (product) =>
          product.platform === deal.platform && product.type === deal.type
      );
    })
    .filter(Boolean); // Remove any undefined results

  return NextResponse.json(sortedProducts);
}
