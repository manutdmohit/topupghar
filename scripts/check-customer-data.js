require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Import models
const User = require('../lib/models/User');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/Wallet');
const Order = require('../models/Order');

async function checkCustomerData() {
  try {
    console.log('🔍 Checking customer data...\n');

    // Get first customer
    const customer = await User.findOne().select('_id email name');
    if (!customer) {
      console.log('❌ No customers found');
      return;
    }

    console.log('👤 Customer:', {
      _id: customer._id,
      _idString: customer._id.toString(),
      email: customer.email,
      name: customer.name,
    });

    const customerId = customer._id.toString();

    // Check wallet
    console.log('\n💰 Checking wallet...');
    const wallet = await Wallet.findOne({ userId: customerId });
    if (wallet) {
      console.log('✅ Wallet found:', {
        userId: wallet.userId,
        balance: wallet.balance,
        totalTopups: wallet.totalTopups,
        totalSpent: wallet.totalSpent,
      });
    } else {
      console.log('❌ No wallet found for userId:', customerId);
    }

    // Check transactions
    console.log('\n💳 Checking transactions...');
    const transactions = await WalletTransaction.find({ userId: customerId });
    console.log(`📊 Total transactions: ${transactions.length}`);

    if (transactions.length > 0) {
      console.log('📋 Sample transactions:');
      transactions.slice(0, 5).forEach((t) => {
        console.log(
          `  - ${t.transactionId}: ${t.type} (${t.status}) - NPR ${t.amount}`
        );
      });
    }

    // Check top-up transactions specifically
    const topupTransactions = transactions.filter((t) => t.type === 'topup');
    console.log(`\n💸 Top-up transactions: ${topupTransactions.length}`);

    const completedTopups = topupTransactions.filter(
      (t) => t.status === 'completed'
    );
    const pendingTopups = topupTransactions.filter(
      (t) => t.status === 'pending'
    );

    console.log(`  ✅ Completed: ${completedTopups.length}`);
    console.log(`  ⏳ Pending: ${pendingTopups.length}`);

    // Check orders
    console.log('\n📦 Checking orders...');
    const orders = await Order.find({ userId: customerId });
    console.log(`📊 Total orders: ${orders.length}`);

    if (orders.length > 0) {
      console.log('📋 Sample orders:');
      orders.slice(0, 5).forEach((o) => {
        console.log(`  - ${o.orderId}: ${o.status} - NPR ${o.finalPrice}`);
      });
    }

    // Test aggregation
    console.log('\n🔧 Testing aggregation...');

    const topupAggregation = await WalletTransaction.aggregate([
      {
        $match: {
          userId: customerId,
          type: 'topup',
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    const orderAggregation = await Order.aggregate([
      {
        $match: { userId: customerId },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);

    console.log('📊 Aggregation results:');
    console.log(`  Top-ups: ${topupAggregation[0]?.count || 0}`);
    console.log(`  Orders: ${orderAggregation[0]?.total || 0}`);

    // Check if there are any transactions with different userId format
    console.log('\n🔍 Checking for userId format issues...');
    const allTransactions = await WalletTransaction.find().limit(10);
    console.log('📋 Sample transaction userIds:');
    allTransactions.forEach((t) => {
      console.log(
        `  - ${t.transactionId}: userId = "${
          t.userId
        }" (type: ${typeof t.userId})`
      );
    });

    const allOrders = await Order.find().limit(10);
    console.log('\n📋 Sample order userIds:');
    allOrders.forEach((o) => {
      console.log(
        `  - ${o.orderId}: userId = "${o.userId}" (type: ${typeof o.userId})`
      );
    });
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkCustomerData();
