const mongoose = require('mongoose');
require('dotenv').config();

// Define the Popup schema (same as in your model)
const popupSchema = new mongoose.Schema(
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

const Popup = mongoose.model('Popup', popupSchema);

async function createPopup() {
  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if popup already exists
    const existingPopup = await Popup.findOne({ isActive: true });

    if (existingPopup) {
      console.log('✅ Popup already exists:', existingPopup.title);
      console.log('📊 Popup details:', {
        title: existingPopup.title,
        isActive: existingPopup.isActive,
        showDelay: existingPopup.showDelay,
        features: existingPopup.features.length,
      });
    } else {
      console.log('❌ No popup found, creating one...');

      // Create new popup
      const popup = new Popup({
        title: 'Welcome to Topup घर',
        message:
          'Your one-stop destination for gaming top-ups, streaming services, and social media boosts. Get instant delivery and amazing deals on all your favorite platforms!',
        features: [
          '🎮 Gaming Top-ups & Gift Cards',
          '📱 Social Media Services',
          '🎬 Premium Subscriptions',
          '💰 Secure & Fast Delivery',
        ],
        ctaText: 'Get Started Now! 🚀',
        isActive: true,
        showDelay: 1000,
        frequency: '2hours',
      });

      await popup.save();
      console.log('✅ Popup created successfully!');
      console.log('📊 Popup details:', {
        id: popup._id,
        title: popup.title,
        isActive: popup.isActive,
        showDelay: popup.showDelay,
        features: popup.features.length,
      });
    }

    console.log('🎉 Script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createPopup();
