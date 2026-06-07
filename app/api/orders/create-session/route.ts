import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { createOrderToken } from '@/lib/session-utils';
import { calculateDiscountedPrice } from '@/lib/price-utils';
import { resolveCheckoutConfig } from '@/lib/checkout-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, variantIndex, quantity = 1 } = body;

    if (productId !== undefined && variantIndex !== undefined) {
      await connectDB();

      const product = await Product.findById(productId).lean();
      if (!product || !product.isActive) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const variant = product.variants[variantIndex];
      if (!variant || variant.inStock === false) {
        return NextResponse.json(
          { error: 'Selected package is unavailable' },
          { status: 400 },
        );
      }

      const qty = Math.max(1, Math.min(10, parseInt(String(quantity), 10) || 1));
      const priceInfo = calculateDiscountedPrice(
        variant.price,
        product.discountPercentage || 0,
      );
      const checkout = resolveCheckoutConfig(product);

      const orderData = {
        productId: product._id.toString(),
        slug: product.slug,
        variantIndex,
        platform: product.platform,
        type: product.type,
        amount: variant.label,
        quantity: qty,
        price: priceInfo.discountedPrice,
        originalPrice: variant.price,
        discountPercentage: product.discountPercentage || 0,
        duration: variant.duration,
        checkout,
      };

      const token = createOrderToken(orderData);

      return NextResponse.json({
        success: true,
        token,
        quote: orderData,
        message: 'Order session created successfully',
      });
    }

    // Legacy body support for older clients
    const {
      platform,
      type,
      amount,
      price,
      originalPrice,
      discountPercentage,
      duration,
      level,
      diamonds,
      storage,
      gameId,
      emailId,
      zone,
    } = body;

    if (!platform || !type || !price || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    const orderData = {
      platform,
      type,
      amount: amount || '',
      quantity: body.quantity ? parseInt(body.quantity) : 1,
      price: priceNum,
      originalPrice: originalPrice ? parseFloat(originalPrice) : priceNum,
      discountPercentage: discountPercentage
        ? parseFloat(discountPercentage)
        : 0,
      duration,
      level: level || '',
      diamonds: diamonds || '',
      storage: storage || '',
      gameId: gameId || 'no',
      emailId: emailId || 'no',
      zone: zone || 'no',
    };

    const token = createOrderToken(orderData);

    return NextResponse.json({
      success: true,
      token,
      message: 'Order session created successfully',
    });
  } catch (error) {
    console.error('Error creating order session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
