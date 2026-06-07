import connectDB from '@/config/db';
import {
  PaymentMethod,
  type IPaymentMethod,
} from '@/lib/models/PaymentMethod';

export type PaymentMethodDto = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  qrImage: string;
  instructions?: string;
  isActive: boolean;
  sortOrder: number;
};

export const DEFAULT_PAYMENT_METHODS = [
  {
    name: 'eSewa',
    slug: 'esewa',
    description: 'Digital wallet & payment gateway',
    qrImage: '/esewa.jpg',
    instructions:
      'Scan the QR code and upload your payment receipt after completing the transaction.',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'Khalti/IME',
    slug: 'khalti',
    description: 'Digital wallet & payment solution',
    qrImage: '/khalti.jpg',
    instructions:
      'Scan the QR code and upload your payment receipt after completing the transaction.',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'Bank Transfer',
    slug: 'bank',
    description: 'Direct bank transfer',
    qrImage: '/bank.jpg',
    instructions:
      'Scan the QR code and upload your payment receipt after completing the transaction.',
    sortOrder: 3,
    isActive: true,
  },
] as const;

export function toPaymentMethodDto(
  method: IPaymentMethod | Record<string, unknown>,
): PaymentMethodDto {
  return {
    _id: String(method._id),
    name: String(method.name),
    slug: String(method.slug),
    description: method.description ? String(method.description) : undefined,
    qrImage: String(method.qrImage),
    instructions: method.instructions
      ? String(method.instructions)
      : undefined,
    isActive: Boolean(method.isActive),
    sortOrder: Number(method.sortOrder ?? 0),
  };
}

export async function ensureDefaultPaymentMethods() {
  await connectDB();
  const count = await PaymentMethod.countDocuments();
  if (count > 0) return;

  await PaymentMethod.insertMany(DEFAULT_PAYMENT_METHODS);
}

export async function getActivePaymentMethods(): Promise<PaymentMethodDto[]> {
  await ensureDefaultPaymentMethods();
  const methods = await PaymentMethod.find({ isActive: true })
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();

  return methods.map((method) => toPaymentMethodDto(method));
}

const LEGACY_PAYMENT_METHOD_ALIASES: Record<string, string> = {
  bank_transfer: 'bank',
};

export async function isValidExternalPaymentMethod(
  slug: string,
): Promise<boolean> {
  if (!slug || slug === 'wallet') return false;

  await ensureDefaultPaymentMethods();

  const lookupSlug =
    LEGACY_PAYMENT_METHOD_ALIASES[slug.toLowerCase()] || slug.toLowerCase();

  const method = await PaymentMethod.findOne({
    slug: lookupSlug,
    isActive: true,
  }).lean();

  return !!method;
}

export function normalizePaymentMethodSlug(slug: string) {
  return slug.trim().toLowerCase().replace(/\s+/g, '_');
}
