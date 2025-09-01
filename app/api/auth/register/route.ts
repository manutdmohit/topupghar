import { NextRequest, NextResponse } from 'next/server';
import { connect } from 'mongoose';
import User from '@/lib/models/User';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/gameshop';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    await connect(MONGODB_URI);

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'user',
      isActive: true,
    });

    await user.save();

    // Return user data without password
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    return NextResponse.json({
      success: true,
      user: userData,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
