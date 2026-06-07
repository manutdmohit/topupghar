import mongoose, { Document, Schema, Model } from 'mongoose';
import {
  DEFAULT_CHECKOUT,
  normalizeCheckoutInput,
  type ProductCheckoutConfig,
} from '@/lib/checkout-config';

export interface IVariant {
  label: string; // e.g., "1 Month"
  duration: string; // e.g., "1 Month"
  price: number; // e.g., 425 (in INR)
  inStock: boolean; // NEW -> admin toggles this to show/hide the variant from the product
}

export interface IProduct extends Document {
  name: string;
  slug: string; // e.g., "netflix"
  platform: string; // e.g., "netflix"
  type: string; // e.g., "account"
  category: string; // e.g., "streaming"
  description?: string;
  image?: string;
  variants: IVariant[];
  discountPercentage?: number; // New field for discount percentage
  inStock: boolean; // true if the product is available for purchase'
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  /** @deprecated Use checkout.identifier instead */
  gameId?: string;
  /** @deprecated Use checkout.identifier instead */
  emailId?: string;
  /** @deprecated Use checkout instead */
  zone?: string;
  checkout?: ProductCheckoutConfig;
}

const VariantSchema = new Schema<IVariant>(
  {
    label: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, required: true, default: true }, // NEW -> admin toggles this to show/hide the variant from the product
  },
  { _id: false },
);

const CheckoutSchema = new Schema<ProductCheckoutConfig>(
  {
    identifier: {
      type: String,
      enum: [
        'gameId',
        'gameIdWithZone',
        'email',
        'username',
        'postLink',
        'channelUrl',
        'none',
      ],
      required: true,
      default: 'email',
    },
    identifierLabel: { type: String },
    identifierPlaceholder: { type: String },
    requiresAccountPassword: { type: Boolean, default: false },
    accountPasswordLabel: { type: String },
    requiresServicePassword: { type: Boolean, default: false },
    servicePasswordLabel: { type: String },
    requiresSocialLogin: { type: Boolean, default: false },
    socialLoginMethods: {
      type: [String],
      enum: ['google', 'facebook'],
      default: ['google', 'facebook'],
    },
    requiresSeparateZone: { type: Boolean, default: false },
    zoneLabel: { type: String },
    customerNote: { type: String },
  },
  { _id: false },
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    platform: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, default: 'account' },
    description: { type: String },
    image: { type: String },
    variants: { type: [VariantSchema], required: true },
    discountPercentage: { type: Number, min: 0, max: 100, default: 0 }, // New field
    inStock: { type: Boolean, required: true, default: true },
    isActive: { type: Boolean, default: true },
    gameId: { type: String, enum: ['yes', 'no'], default: 'no' },
    emailId: { type: String, enum: ['yes', 'no'], default: 'no' },
    zone: { type: String, enum: ['yes', 'no'], default: 'no' },
    checkout: {
      type: CheckoutSchema,
      default: () => ({ ...DEFAULT_CHECKOUT }),
    },
  },
  { timestamps: true },
);

// Pre-save middleware to automatically set inStock based on variants
ProductSchema.pre('save', function (next) {
  // If variants array is empty, set inStock to false
  if (!this.variants || this.variants.length === 0) {
    this.inStock = false;
  }
  next();
});

// Virtual property to check if product has stock based on variants
ProductSchema.virtual('hasStock').get(function () {
  return this.variants && this.variants.length > 0;
});

// Method to check stock status
ProductSchema.methods.checkStockStatus = function () {
  return {
    hasVariants: this.variants && this.variants.length > 0,
    inStock: this.inStock,
    variantCount: this.variants ? this.variants.length : 0,
  };
};

// Virtual property to calculate discounted price
ProductSchema.virtual('hasDiscount').get(function () {
  return this.discountPercentage && this.discountPercentage > 0;
});

// Re-register model so schema changes apply during Next.js hot reload
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

export const Product: Model<IProduct> = mongoose.model<IProduct>(
  'Product',
  ProductSchema,
);
