import bcrypt from 'bcryptjs';
import { connect, disconnect } from 'mongoose';
import User from '../lib/models/User';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/topup-ghar';

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Admin credentials
    const adminEmail = 'admin@topupghar.com';
    const adminPassword = 'Admin@123456'; // This will be hashed automatically

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email:', adminEmail);
      console.log('Role:', existingAdmin.role);
      return;
    }

    // Create admin user
    const adminUser = new User({
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true,
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role: admin');
    console.log('\n⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createAdminUser();
