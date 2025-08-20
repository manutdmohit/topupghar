import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IVariant {
  label: string; // e.g., "1 Month"
  duration: string; // e.g., "1 Month"
  price: number; // e.g., 425 (in INR)
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
}

const VariantSchema = new Schema<IVariant>(
  {
    label: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
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
  },
  { timestamps: true }
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

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
