import { NextRequest, NextResponse } from 'next/server';
import { connect } from 'mongoose';
import User from '@/lib/models/User';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/gameshop';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connect(MONGODB_URI);

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Invalid credentials or account is inactive' },
        { status: 401 }
      );
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user data without password
    const userData = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
