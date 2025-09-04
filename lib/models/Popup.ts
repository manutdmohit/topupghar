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
      default: 'Welcome to Topup घर',
    },
    message: {
      type: String,
      required: true,
      default:
        'Your one-stop destination for gaming top-ups, streaming services, and social media boosts. Get instant delivery and amazing deals on all your favorite platforms!',
    },
    features: [
      {
        type: String,
        required: true,
        default: [
          'Instant delivery on all orders',
          'Secure payment methods',
          '24/7 customer support',
          'Best prices guaranteed',
        ],
      },
    ],
    ctaText: {
      type: String,
      required: true,
      default: 'Get Started Now! 🚀',
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    showDelay: {
      type: Number,
      required: true,
      default: 1000, // 1 second
    },
    frequency: {
      type: String,
      enum: ['2hours'],
      required: true,
      default: '2hours',
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
