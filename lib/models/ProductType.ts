import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IProductType extends Document {
  name: string;
  value: string; // unique identifier like 'account', 'diamonds'
  label: string; // display name like 'Account', 'Diamonds'
  description?: string;
  icon?: string;
  color?: string; // for UI styling
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductTypeSchema = new Schema<IProductType>(
  {
    name: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    color: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Create index for better search performance
ProductTypeSchema.index({ name: 1, value: 1 });

export const ProductType: Model<IProductType> =
  mongoose.models.ProductType ||
  mongoose.model<IProductType>('ProductType', ProductTypeSchema);
