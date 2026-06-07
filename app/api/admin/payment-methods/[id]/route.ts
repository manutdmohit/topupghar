import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { requireAdmin } from '@/lib/admin-auth';
import { PaymentMethod } from '@/lib/models/PaymentMethod';
import {
  normalizePaymentMethodSlug,
  toPaymentMethodDto,
} from '@/lib/payment-methods';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;
    await connectDB();

    const paymentMethod = await PaymentMethod.findById(id);
    if (!paymentMethod) {
      return NextResponse.json(
        { message: 'Payment method not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      paymentMethod: toPaymentMethodDto(paymentMethod),
    });
  } catch (error) {
    console.error('Error in GET /admin/payment-methods/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch payment method', error: errorMessage },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;
    await connectDB();

    const existing = await PaymentMethod.findById(id);
    if (!existing) {
      return NextResponse.json(
        { message: 'Payment method not found' },
        { status: 404 },
      );
    }

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

    const duplicate = await PaymentMethod.findOne({
      _id: { $ne: id },
      slug: normalizedSlug,
    });
    if (duplicate) {
      return NextResponse.json(
        { message: 'A payment method with this slug already exists' },
        { status: 400 },
      );
    }

    const updated = await PaymentMethod.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        slug: normalizedSlug,
        description: description?.trim() || undefined,
        qrImage: qrImage.trim(),
        instructions: instructions?.trim() || undefined,
        sortOrder: Number.isFinite(Number(sortOrder))
          ? Number(sortOrder)
          : existing.sortOrder,
        isActive: isActive !== false,
      },
      { new: true, runValidators: true },
    );

    return NextResponse.json({
      message: 'Payment method updated successfully',
      paymentMethod: toPaymentMethodDto(updated!),
    });
  } catch (error) {
    console.error('Error in PUT /admin/payment-methods/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update payment method', error: errorMessage },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;
    await connectDB();

    const existing = await PaymentMethod.findById(id);
    if (!existing) {
      return NextResponse.json(
        { message: 'Payment method not found' },
        { status: 404 },
      );
    }

    const body = await req.json();
    const isActive =
      typeof body.isActive === 'boolean'
        ? body.isActive
        : !existing.isActive;

    const updated = await PaymentMethod.findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    );

    return NextResponse.json({
      message: `Payment method ${updated!.isActive ? 'enabled' : 'disabled'} successfully`,
      paymentMethod: toPaymentMethodDto(updated!),
    });
  } catch (error) {
    console.error('Error in PATCH /admin/payment-methods/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update payment method status', error: errorMessage },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;
    await connectDB();

    const existing = await PaymentMethod.findById(id);
    if (!existing) {
      return NextResponse.json(
        { message: 'Payment method not found' },
        { status: 404 },
      );
    }

    await PaymentMethod.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Payment method deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /admin/payment-methods/[id]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to delete payment method', error: errorMessage },
      { status: 500 },
    );
  }
}
