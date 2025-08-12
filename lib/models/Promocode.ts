import { Schema, model, models, Document } from 'mongoose';

export interface IPromocode extends Document {
  name: string;
  maxCount: number;
  usedCount: number;
  expiry: Date;
  isActive: boolean;
  discountPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const promocodeSchema = new Schema<IPromocode>(
  {
    name: {
      type: String,
      required: [true, 'Promocode name is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    maxCount: {
      type: Number,
      required: [true, 'Maximum usage count is required'],
      min: [1, 'Maximum count must be at least 1'],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, 'Used count cannot be negative'],
    },
    expiry: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100%'],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for checking if promocode is expired
promocodeSchema.virtual('isExpired').get(function () {
  return new Date() > this.expiry;
});

// Virtual for checking if promocode usage limit is reached
promocodeSchema.virtual('isUsageLimitReached').get(function () {
  return this.usedCount >= this.maxCount;
});

// Virtual for checking if promocode is valid
promocodeSchema.virtual('isValid').get(function () {
  return (
    this.isActive &&
    !(new Date() > this.expiry) &&
    !(this.usedCount >= this.maxCount)
  );
});

// Ensure virtuals are serialized
promocodeSchema.set('toJSON', { virtuals: true });

const Promocode =
  models.Promocode || model<IPromocode>('Promocode', promocodeSchema);

export default Promocode;
