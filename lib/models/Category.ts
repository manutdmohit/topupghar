import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  value: string; // unique identifier like 'subscription', 'gaming'
  label: string; // display name like 'Subscription Services', 'Gaming'
  description?: string;
  icon?: string;
  color?: string; // for UI styling
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
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
CategorySchema.index({ name: 1, value: 1 });

export const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>('Category', CategorySchema);
