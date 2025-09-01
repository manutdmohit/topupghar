const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Import models
const { Wallet, WalletTransaction } = require('../models/Wallet');
const User = require('../lib/models/User');

async function createTestData() {
  try {
    console.log('Creating test wallet data...');

    // Get a test user (first user in the database)
    const testUser = await User.findOne();
    if (!testUser) {
      console.log('No users found. Please create a user first.');
      return;
    }

    console.log(`Using test user: ${testUser.email} (${testUser._id})`);

    // Create or get wallet
    let wallet = await Wallet.findOne({ userId: testUser._id });
    if (!wallet) {
      wallet = new Wallet({
        userId: testUser._id,
        balance: 0,
        totalTopups: 0,
        totalSpent: 0,
      });
      await wallet.save();
      console.log('Created new wallet');
    }

    // Create some test transactions
    const testTransactions = [
      {
        userId: testUser._id,
        type: 'topup',
        amount: 1000,
        balance: 1000,
        description: 'Test wallet topup via eSewa',
        status: 'completed',
        paymentMethod: 'eSewa',
        receiptUrl: 'https://example.com/receipt1.jpg',
      },
      {
        userId: testUser._id,
        type: 'topup',
        amount: 500,
        balance: 1500,
        description: 'Test wallet topup via Khalti',
        status: 'completed',
        paymentMethod: 'Khalti',
        receiptUrl: 'https://example.com/receipt2.jpg',
      },
      {
        userId: testUser._id,
        type: 'topup',
        amount: 750,
        balance: 2250,
        description: 'Test wallet topup via Bank Transfer',
        status: 'pending',
        paymentMethod: 'Bank Transfer',
        receiptUrl: 'https://example.com/receipt3.jpg',
      },
      {
        userId: testUser._id,
        type: 'payment',
        amount: -500,
        balance: 1750,
        description: 'Payment for order #12345',
        status: 'completed',
        orderId: '12345',
      },
      {
        userId: testUser._id,
        type: 'refund',
        amount: 250,
        balance: 2000,
        description: 'Refund for cancelled order #12345',
        status: 'completed',
        orderId: '12345',
      },
    ];

    for (const transactionData of testTransactions) {
      const transaction = new WalletTransaction(transactionData);
      await transaction.save();
      console.log(
        `Created transaction: ${transaction.transactionId} - ${transaction.type} ${transaction.amount}`
      );
    }

    // Update wallet totals
    const completedTopups = await WalletTransaction.aggregate([
      { $match: { userId: testUser._id, type: 'topup', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalSpent = await WalletTransaction.aggregate([
      {
        $match: { userId: testUser._id, type: 'payment', status: 'completed' },
      },
      { $group: { _id: null, total: { $sum: { $abs: '$amount' } } } },
    ]);

    wallet.totalTopups = completedTopups[0]?.total || 0;
    wallet.totalSpent = totalSpent[0]?.total || 0;
    wallet.balance = 2000; // Current balance after all transactions
    await wallet.save();

    console.log('Test data created successfully!');
    console.log(`Wallet balance: ${wallet.balance}`);
    console.log(`Total topups: ${wallet.totalTopups}`);
    console.log(`Total spent: ${wallet.totalSpent}`);
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    mongoose.disconnect();
  }
}

createTestData();
