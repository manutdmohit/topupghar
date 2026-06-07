import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { requireAdmin } from '@/lib/admin-auth';
import {
  PaymentMethod,
} from '@/lib/models/PaymentMethod';
import {
  ensureDefaultPaymentMethods,
  normalizePaymentMethodSlug,
  toPaymentMethodDto,
} from '@/lib/payment-methods';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    await connectDB();
    await ensureDefaultPaymentMethods();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';

    const filter: Record<string, unknown> = {};
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const paymentMethods = await PaymentMethod.find(filter)
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    const total = await PaymentMethod.countDocuments();
    const totalActive = await PaymentMethod.countDocuments({ isActive: true });
    const totalInactive = await PaymentMethod.countDocuments({
      isActive: false,
    });

    return NextResponse.json({
      paymentMethods: paymentMethods.map(toPaymentMethodDto),
      stats: { total, totalActive, totalInactive },
    });
  } catch (error) {
    console.error('Error in GET /admin/payment-methods:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch payment methods', error: errorMessage },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    await connectDB();

    const body = await req.json();
    const { name, slug, description, qrImage, instructions, sortOrder, isActive } =
      body;

    if (!name?.trim() || !slug?.trim() || !qrImage?.trim()) {
      return NextResponse.json(
        { message: 'Name, slug, and QR image are required' },
        { status: 400 },
      );
    }

    const normalizedSlug = normalizePaymentMethodSlug(slug);
    if (normalizedSlug === 'wallet') {
      return NextResponse.json(
        { message: 'The slug "wallet" is reserved for internal wallet payments' },
        { status: 400 },
      );
    }

    const existing = await PaymentMethod.findOne({ slug: normalizedSlug });
    if (existing) {
      return NextResponse.json(
        { message: 'A payment method with this slug already exists' },
        { status: 400 },
      );
    }

    const paymentMethod = await PaymentMethod.create({
      name: name.trim(),
      slug: normalizedSlug,
      description: description?.trim() || undefined,
      qrImage: qrImage.trim(),
      instructions: instructions?.trim() || undefined,
      sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
      isActive: isActive !== false,
    });

    return NextResponse.json(
      {
        message: 'Payment method created successfully',
        paymentMethod: toPaymentMethodDto(paymentMethod),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error in POST /admin/payment-methods:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to create payment method', error: errorMessage },
      { status: 500 },
    );
  }
}
