const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gameshop-clone');

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  color: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

// Default categories
const defaultCategories = [
  {
    name: 'Gaming',
    value: 'gaming',
    label: 'Gaming',
    description: 'Premium gaming accounts, in-game currency, and gaming accessories',
    icon: 'gamepad',
    color: 'red',
    isActive: true,
  },
  {
    name: 'Streaming',
    value: 'streaming',
    label: 'Streaming Services',
    description: 'Netflix, Amazon Prime, Disney+, and other streaming platform accounts',
    icon: 'tv',
    color: 'blue',
    isActive: true,
  },
  {
    name: 'Social Media',
    value: 'social',
    label: 'Social Media',
    description: 'Instagram, Facebook, TikTok, Twitter followers, likes, and views',
    icon: 'heart',
    color: 'pink',
    isActive: true,
  },
  {
    name: 'Music',
    value: 'music',
    label: 'Music Services',
    description: 'Spotify, Apple Music, and other music streaming accounts',
    icon: 'music',
    color: 'green',
    isActive: true,
  },
  {
    name: 'Design',
    value: 'design',
    label: 'Design Tools',
    description: 'Adobe Creative Suite, Canva Pro, and design software accounts',
    icon: 'camera',
    color: 'purple',
    isActive: true,
  },
  {
    name: 'Productivity',
    value: 'productivity',
    label: 'Productivity Tools',
    description: 'Microsoft Office, Google Workspace, and productivity software',
    icon: 'zap',
    color: 'yellow',
    isActive: true,
  },
  {
    name: 'Education',
    value: 'education',
    label: 'Education',
    description: 'Online learning platforms, course subscriptions, and educational tools',
    icon: 'globe',
    color: 'indigo',
    isActive: true,
  },
  {
    name: 'Entertainment',
    value: 'entertainment',
    label: 'Entertainment',
    description: 'YouTube Premium, Twitch, and other entertainment services',
    icon: 'star',
    color: 'cyan',
    isActive: true,
  },
];

async function seedCategories() {
  try {
    console.log('Starting category seeding...');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const insertedCategories = await Category.insertMany(defaultCategories);
    console.log(`Successfully inserted ${insertedCategories.length} categories:`);

    insertedCategories.forEach(category => {
      console.log(`- ${category.label} (${category.value})`);
    });

    console.log('Category seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedCategories();
