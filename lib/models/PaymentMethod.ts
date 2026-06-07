import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPaymentMethod extends Document {
  name: string;
  slug: string;
  description?: string;
  qrImage: string;
  instructions?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, trim: true },
    qrImage: { type: String, required: true },
    instructions: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

PaymentMethodSchema.index({ isActive: 1, sortOrder: 1 });

export const PaymentMethod: Model<IPaymentMethod> =
  mongoose.models.PaymentMethod ||
  mongoose.model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema);
