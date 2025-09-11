const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/topup-ghar';

async function updatePopupFrequency() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define Popup schema
    const PopupSchema = new mongoose.Schema(
      {
        title: String,
        message: String,
        features: [String],
        ctaText: String,
        isActive: { type: Boolean, default: true },
        showDelay: Number,
        frequency: String,
      },
      { timestamps: true }
    );

    const Popup = mongoose.model('Popup', PopupSchema);

    // Find and update the active popup
    const result = await Popup.updateOne(
      { isActive: true },
      {
        $unset: { frequency: 1 }, // Remove frequency field
        $set: { updatedAt: new Date() },
      }
    );

    console.log('🔧 Update result:', result);

    if (result.modifiedCount > 0) {
      console.log('✅ Successfully removed frequency restriction from popup');
    } else {
      console.log('⚠️  No popup was updated');
    }

    // Verify the update
    const updatedPopup = await Popup.findOne({ isActive: true });
    console.log('🔍 Updated popup:', {
      title: updatedPopup?.title,
      frequency: updatedPopup?.frequency,
      updatedAt: updatedPopup?.updatedAt,
    });
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updatePopupFrequency();
