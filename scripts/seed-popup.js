const mongoose = require('mongoose');
require('dotenv').config();

// Define the Popup schema
const popupSchema = new mongoose.Schema(
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
      default: 1000,
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

// Create the model
const Popup = mongoose.model('Popup', popupSchema);

async function seedPopup() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if popup already exists
    const existingPopup = await Popup.findOne({ isActive: true });

    if (existingPopup) {
      console.log('Popup already exists, updating...');
      existingPopup.title = 'Welcome to Topup घर';
      existingPopup.message =
        'Your one-stop destination for gaming top-ups, streaming services, and social media boosts. Get instant delivery and amazing deals on all your favorite platforms!';
      existingPopup.features = [
        'Instant delivery on all orders',
        'Secure payment methods',
        '24/7 customer support',
        'Best prices guaranteed',
      ];
      existingPopup.ctaText = 'Get Started Now! 🚀';
      existingPopup.isActive = true;
      existingPopup.showDelay = 1000;
      existingPopup.frequency = '2hours';

      await existingPopup.save();
      console.log('Popup updated successfully');
    } else {
      // Create new popup
      const popup = new Popup({
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

      await popup.save();
      console.log('Popup created successfully');
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding popup:', error);
    process.exit(1);
  }
}

seedPopup();
