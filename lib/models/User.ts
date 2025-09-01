import bcrypt from 'bcryptjs';
import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  name?: string;
  image?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified?: Date;
  accounts?: Array<{
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: function (this: IUser) {
        // Password is required only if no OAuth accounts exist
        return !this.accounts || this.accounts.length === 0;
      },
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Date,
    },
    accounts: [
      {
        provider: {
          type: String,
          required: true,
        },
        providerAccountId: {
          type: String,
          required: true,
        },
        refresh_token: String,
        access_token: String,
        expires_at: Number,
        token_type: String,
        scope: String,
        id_token: String,
        session_state: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create compound index for OAuth accounts
userSchema.index(
  { 'accounts.provider': 1, 'accounts.providerAccountId': 1 },
  { unique: true, sparse: true }
);

// Hash password before saving (only if password exists and is modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method (only if password exists)
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent password from being returned in queries
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    (ret as any).password = undefined;
    return ret;
  },
});

const User = models.User || model<IUser>('User', userSchema);

export default User;
