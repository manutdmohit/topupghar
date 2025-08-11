import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import connectDB from '@/config/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get admin user email from request headers (sent by frontend)
    const adminEmail = req.headers.get('x-admin-email');

    if (!adminEmail) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin email not provided' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Find the admin user
    const adminUser = await User.findOne({
      email: adminEmail,
      role: 'admin',
    });

    if (!adminUser) {
      return NextResponse.json(
        { message: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await adminUser.comparePassword(
      currentPassword
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Validate new password strength
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (newPassword.length < minLength) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    if (!hasUpperCase) {
      return NextResponse.json(
        { message: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      );
    }
    if (!hasLowerCase) {
      return NextResponse.json(
        { message: 'Password must contain at least one lowercase letter' },
        { status: 400 }
      );
    }
    if (!hasNumbers) {
      return NextResponse.json(
        { message: 'Password must contain at least one number' },
        { status: 400 }
      );
    }
    if (!hasSpecialChar) {
      return NextResponse.json(
        { message: 'Password must contain at least one special character' },
        { status: 400 }
      );
    }

    // Check if new password is different from current password
    const isSamePassword = await adminUser.comparePassword(newPassword);
    if (isSamePassword) {
      return NextResponse.json(
        { message: 'New password must be different from current password' },
        { status: 400 }
      );
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password using findOneAndUpdate to avoid double hashing
    await User.findOneAndUpdate(
      { _id: adminUser._id },
      { password: hashedNewPassword },
      { new: true }
    );

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in change password:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update password', error: errorMessage },
      { status: 500 }
    );
  }
}
