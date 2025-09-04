import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

async function connectDB() {
  try {
    console.log('Creating new database connection...');
    const opts = {
      bufferCommands: false,
      // Disable caching in production
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Force fresh reads
      readPreference: 'primary' as const,
    };

    const connection = await mongoose.connect(MONGODB_URI!, opts);
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Error in connectDB:', error);
    throw error;
  }
}

export default connectDB;
