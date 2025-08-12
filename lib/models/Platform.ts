import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPlatform extends Document {
  name: string;
  value: string; // unique identifier like 'netflix', 'freefire'
  label: string; // display name like 'Netflix', 'Free Fire'
  category: string; // reference to category
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlatformSchema = new Schema<IPlatform>(
  {
    name: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Create index for better search performance
PlatformSchema.index({ name: 1, value: 1, category: 1 });

export const Platform: Model<IPlatform> =
  mongoose.models.Platform ||
  mongoose.model<IPlatform>('Platform', PlatformSchema);
