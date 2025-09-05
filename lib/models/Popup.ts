import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPopup extends Document {
  title: string;
  message: string;
  features: string[];
  ctaText: string;
  isActive: boolean;
  showDelay: number; // in milliseconds
  frequency: '2hours';
  createdAt: Date;
  updatedAt: Date;
}

export interface IPopupModel extends Model<IPopup> {
  findActivePopup(): Promise<IPopup | null>;
}

const PopupSchema = new Schema<IPopup>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    ctaText: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    showDelay: {
      type: Number,
      required: true,
    },
    frequency: {
      type: String,
      enum: ['2hours'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Find active popup from database only
PopupSchema.statics.findActivePopup = async function () {
  return await this.findOne({ isActive: true });
};

export default mongoose.models.Popup ||
  mongoose.model<IPopup>('Popup', PopupSchema);
