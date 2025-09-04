import mongoose, { Schema, Document } from 'mongoose';

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

// Create a default popup if none exists
PopupSchema.statics.getDefaultPopup = async function () {
  let popup = await this.findOne({ isActive: true });

  if (!popup) {
    popup = await this.create({
      title: 'Welcome to Topup घर',
      message:
        'Your one-stop destination for gaming top-ups, streaming services, and social media boosts. Get instant delivery and amazing deals on all your favorite platforms!',
      features: [
        'Instant delivery on all orders',
        'Secure payment methods',
        '24/7 customer support',
        'Best prices guaranteed',
      ],
      ctaText: 'Get Started Now! 🚀',
      isActive: true,
      showDelay: 1000,
      frequency: '2hours',
    });
  }

  return popup;
};

export default mongoose.models.Popup ||
  mongoose.model<IPopup>('Popup', PopupSchema);
