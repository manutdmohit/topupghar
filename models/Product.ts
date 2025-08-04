import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IVariant {
  label: string; // e.g., "1 Month"
  duration: string; // e.g., "1 Month"
  price: number; // e.g., 425 (in INR)
}

export interface IProduct extends Document {
  name: string; // e.g., "Netflix"
  platform: string; // e.g., "netflix"
  type: string; // e.g., "account"
  description?: string;
  image?: string;
  variants: IVariant[];
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
    platform: { type: String, required: true },
    type: { type: String, default: 'account' },
    description: { type: String },
    image: { type: String },
    variants: { type: [VariantSchema], required: true },
    inStock: { type: Boolean, required: true, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
