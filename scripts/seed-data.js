const mongoose = require('mongoose');

// MongoDB connection string - UPDATE THIS WITH YOUR ACTUAL MONGODB URI
// Examples:
// - Local: 'mongodb://localhost:27017/topup-ghar'
// - Atlas: 'mongodb+srv://username:password@cluster.mongodb.net/topup-ghar'
const MONGODB_URI = 'mongodb://localhost:27017/topup-ghar'; // UPDATE THIS LINE

// Define schemas directly in the script
const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    color: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PlatformSchema = new mongoose.Schema(
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

const ProductTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    color: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Create models
const Category =
  mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Platform =
  mongoose.models.Platform || mongoose.model('Platform', PlatformSchema);
const ProductType =
  mongoose.models.ProductType ||
  mongoose.model('ProductType', ProductTypeSchema);

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

// Initial data
const categories = [
  {
    name: 'Subscription Services',
    value: 'subscription',
    label: 'Subscription Services',
    description: 'Streaming, software, and subscription-based services',
    icon: '🎬',
    color: '#3B82F6',
    isActive: true,
  },
  {
    name: 'Gaming',
    value: 'gaming',
    label: 'Gaming',
    description: 'Gaming-related products and services',
    icon: '🎮',
    color: '#10B981',
    isActive: true,
  },
  {
    name: 'Social Media',
    value: 'social-media',
    label: 'Social Media',
    description: 'Social media services and engagement',
    icon: '📱',
    color: '#8B5CF6',
    isActive: true,
  },
  {
    name: 'Load Balance',
    value: 'load-balance',
    label: 'Load Balance',
    description: 'Payment and balance services',
    icon: '💰',
    color: '#F59E0B',
    isActive: true,
  },
];

const platforms = [
  // Subscription Services
  {
    name: 'Netflix',
    value: 'netflix',
    label: 'Netflix',
    category: 'subscription',
    description: 'Streaming service for movies and TV shows',
    icon: '🎬',
    isActive: true,
  },
  {
    name: 'Netflix 4K HD',
    value: 'netflix-4k-hd',
    label: 'Netflix 4K HD',
    category: 'subscription',
    description: 'Netflix with 4K Ultra HD quality',
    icon: '🎬',
    isActive: true,
  },
  {
    name: 'Prime Video',
    value: 'prime-video',
    label: 'Prime Video',
    category: 'subscription',
    description: 'Amazon Prime Video streaming service',
    icon: '📺',
    isActive: true,
  },
  {
    name: 'YouTube Premium',
    value: 'youtube-premium',
    label: 'YouTube Premium',
    category: 'subscription',
    description: 'Ad-free YouTube with premium features',
    icon: '📺',
    isActive: true,
  },
  {
    name: 'Microsoft 365',
    value: 'microsoft-365',
    label: 'Microsoft 365',
    category: 'subscription',
    description: 'Microsoft Office suite and cloud services',
    icon: '💼',
    isActive: true,
  },
  {
    name: 'Adobe Creative Cloud',
    value: 'adobe-creative-cloud',
    label: 'Adobe Creative Cloud',
    category: 'subscription',
    description: 'Creative software suite',
    icon: '🎨',
    isActive: true,
  },
  {
    name: 'Canva Pro',
    value: 'canva',
    label: 'Canva Pro',
    category: 'subscription',
    description: 'Design platform for graphics and presentations',
    icon: '🎨',
    isActive: true,
  },
  {
    name: 'Figma Professional',
    value: 'figma',
    label: 'Figma Professional',
    category: 'subscription',
    description: 'Collaborative design tool',
    icon: '🎨',
    isActive: true,
  },
  {
    name: 'ChatGPT Plus',
    value: 'chatgpt-plus',
    label: 'ChatGPT Plus',
    category: 'subscription',
    description: 'Advanced AI chatbot with premium features',
    icon: '🤖',
    isActive: true,
  },
  {
    name: 'ChatGPT Plus (1 Year)',
    value: 'chatgpt-plus-one-year',
    label: 'ChatGPT Plus (1 Year)',
    category: 'subscription',
    description: 'Annual ChatGPT Plus subscription',
    icon: '🤖',
    isActive: true,
  },
  {
    name: 'Perplexity Pro',
    value: 'perplexity',
    label: 'Perplexity Pro',
    category: 'subscription',
    description: 'AI-powered search and research tool',
    icon: '🔍',
    isActive: true,
  },
  {
    name: 'You.com Pro',
    value: 'you.com',
    label: 'You.com Pro',
    category: 'subscription',
    description: 'AI search engine with premium features',
    icon: '🔍',
    isActive: true,
  },
  {
    name: 'Coursera Plus',
    value: 'coursera-plus',
    label: 'Coursera Plus',
    category: 'subscription',
    description: 'Online learning platform with unlimited access',
    icon: '📚',
    isActive: true,
  },
  {
    name: 'NordVPN',
    value: 'nord-vpn',
    label: 'NordVPN',
    category: 'subscription',
    description: 'Virtual private network service',
    icon: '🔒',
    isActive: true,
  },
  {
    name: 'LinkedIn Premium',
    value: 'linkedin',
    label: 'LinkedIn Premium',
    category: 'subscription',
    description: 'Professional networking with premium features',
    icon: '💼',
    isActive: true,
  },

  // Gaming
  {
    name: 'Free Fire',
    value: 'freefire',
    label: 'Free Fire',
    category: 'gaming',
    description: 'Battle royale mobile game',
    icon: '🎮',
    isActive: true,
  },
  {
    name: 'Free Fire Level Pass',
    value: 'freefire-level-pass',
    label: 'Free Fire Level Pass',
    category: 'gaming',
    description: 'Season pass for Free Fire',
    icon: '🎮',
    isActive: true,
  },
  {
    name: 'PUBG Mobile',
    value: 'pubg',
    label: 'PUBG Mobile',
    category: 'gaming',
    description: 'Battle royale mobile game',
    icon: '🎮',
    isActive: true,
  },
  {
    name: 'Garena Shell',
    value: 'garena-shell',
    label: 'Garena Shell',
    category: 'gaming',
    description: 'Garena gaming currency',
    icon: '🎮',
    isActive: true,
  },

  // Social Media
  {
    name: 'Instagram',
    value: 'instagram',
    label: 'Instagram',
    category: 'social-media',
    description: 'Photo and video sharing social media',
    icon: '📸',
    isActive: true,
  },
  {
    name: 'Facebook',
    value: 'facebook',
    label: 'Facebook',
    category: 'social-media',
    description: 'Social networking platform',
    icon: '📘',
    isActive: true,
  },
  {
    name: 'TikTok',
    value: 'tiktok',
    label: 'TikTok',
    category: 'social-media',
    description: 'Short-form video sharing platform',
    icon: '🎵',
    isActive: true,
  },
  {
    name: 'YouTube',
    value: 'youtube',
    label: 'YouTube',
    category: 'social-media',
    description: 'Video sharing platform',
    icon: '📺',
    isActive: true,
  },
  {
    name: 'Poppo',
    value: 'poppo',
    label: 'Poppo',
    category: 'social-media',
    description: 'Social media platform',
    icon: '📱',
    isActive: true,
  },

  // Load Balance
  {
    name: 'PayPal Balance',
    value: 'paypal',
    label: 'PayPal Balance',
    category: 'load-balance',
    description: 'PayPal account balance',
    icon: '💰',
    isActive: true,
  },
  {
    name: 'Skrill Balance',
    value: 'skrill',
    label: 'Skrill Balance',
    category: 'load-balance',
    description: 'Skrill digital wallet balance',
    icon: '💰',
    isActive: true,
  },
];

const productTypes = [
  {
    name: 'Account',
    value: 'account',
    label: 'Account',
    description: 'Account-based services and subscriptions',
    icon: '👤',
    color: '#3B82F6',
    isActive: true,
  },
  {
    name: 'Diamonds',
    value: 'diamonds',
    label: 'Diamonds',
    description: 'In-game currency for Free Fire',
    icon: '💎',
    color: '#10B981',
    isActive: true,
  },
  {
    name: 'UC (Unknown Cash)',
    value: 'uc',
    label: 'UC (Unknown Cash)',
    description: 'In-game currency for PUBG Mobile',
    icon: '💰',
    color: '#F59E0B',
    isActive: true,
  },
  {
    name: 'Followers',
    value: 'followers',
    label: 'Followers',
    description: 'Social media followers',
    icon: '👥',
    color: '#8B5CF6',
    isActive: true,
  },
  {
    name: 'Likes',
    value: 'likes',
    label: 'Likes',
    description: 'Social media likes',
    icon: '👍',
    color: '#EF4444',
    isActive: true,
  },
  {
    name: 'Views',
    value: 'views',
    label: 'Views',
    description: 'Social media views',
    icon: '👁️',
    color: '#06B6D4',
    isActive: true,
  },
  {
    name: 'Subscribers',
    value: 'subscribers',
    label: 'Subscribers',
    description: 'YouTube subscribers',
    icon: '📺',
    color: '#EF4444',
    isActive: true,
  },
  {
    name: 'Coins',
    value: 'coins',
    label: 'Coins',
    description: 'In-game coins for various platforms',
    icon: '🪙',
    color: '#F59E0B',
    isActive: true,
  },
  {
    name: 'Balance',
    value: 'balance',
    label: 'Balance',
    description: 'Account balance for payment services',
    icon: '💰',
    color: '#10B981',
    isActive: true,
  },
  {
    name: 'Pass',
    value: 'pass',
    label: 'Pass',
    description: 'Gaming season passes',
    icon: '🎫',
    color: '#8B5CF6',
    isActive: true,
  },
  {
    name: 'Shell',
    value: 'shell',
    label: 'Shell',
    description: 'Garena Shell currency',
    icon: '🐚',
    color: '#F59E0B',
    isActive: true,
  },
  {
    name: 'Evo Access',
    value: 'evo-access',
    label: 'Evo Access',
    description: 'Free Fire evolution access',
    icon: '⚡',
    color: '#10B981',
    isActive: true,
  },
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');
    console.log(`🔗 Connecting to MongoDB: ${MONGODB_URI}`);

    // Clear existing data
    await Category.deleteMany({});
    await Platform.deleteMany({});
    await ProductType.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Seed categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Seed platforms
    const createdPlatforms = await Platform.insertMany(platforms);
    console.log(`✅ Created ${createdPlatforms.length} platforms`);

    // Seed product types
    const createdProductTypes = await ProductType.insertMany(productTypes);
    console.log(`✅ Created ${createdProductTypes.length} product types`);

    console.log('🎉 Data seeding completed successfully!');

    // Display summary
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Platforms: ${createdPlatforms.length}`);
    console.log(`- Product Types: ${createdProductTypes.length}`);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    console.error('Error details:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
seedData();
