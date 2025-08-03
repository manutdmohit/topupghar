import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: Cached;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  try {
    if (cached.conn) {
      console.log('Using cached database connection');
      return cached.conn;
    }

    if (!cached.promise) {
      console.log('Creating new database connection...');
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
        console.log('Database connected successfully');
        return mongoose;
      });
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      console.error('Database connection error:', e);
      throw e;
    }

    return cached.conn;
  } catch (error) {
    console.error('Error in connectDB:', error);
    throw error;
  }
}

export default connectDB;
