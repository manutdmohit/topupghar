import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import User from './models/User';
import { connect } from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/gameshop';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          await connect(MONGODB_URI);

          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          });

          if (!user || !user.isActive) {
            throw new Error('Invalid credentials or account is inactive');
          }

          const isPasswordValid = await user.comparePassword(
            credentials.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid credentials');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
      }

      // If this is a Google OAuth sign-in, ensure the user has a role
      if (account?.provider === 'google' && user) {
        try {
          await connect(MONGODB_URI);
          const dbUser = await User.findById(user.id);
          if (dbUser && !dbUser.role) {
            await User.findByIdAndUpdate(user.id, { role: 'user' });
            token.role = 'user';
          }
        } catch (error) {
          console.error('Error updating user role:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connect(MONGODB_URI);

          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user with Google OAuth data
            const newUser = new User({
              email: user.email,
              name: user.name,
              image: user.image,
              role: 'user',
              isActive: true,
              emailVerified: new Date(),
              accounts: [
                {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              ],
            });

            await newUser.save();
            user.id = newUser._id.toString();
          } else {
            // For existing users, always allow linking Google account
            // This prevents OAuthAccountNotLinked error

            // Check if this Google account is already linked
            const existingAccount = existingUser.accounts?.find(
              (acc: any) =>
                acc.provider === 'google' &&
                acc.providerAccountId === account.providerAccountId
            );

            if (!existingAccount) {
              // Link the Google account to the existing user
              if (!existingUser.accounts) {
                existingUser.accounts = [];
              }

              existingUser.accounts.push({
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              });

              // Update user info if not already set
              if (!existingUser.name && user.name) {
                existingUser.name = user.name;
              }
              if (!existingUser.image && user.image) {
                existingUser.image = user.image;
              }
              if (!existingUser.emailVerified) {
                existingUser.emailVerified = new Date();
              }

              await existingUser.save();
            }

            user.id = existingUser._id.toString();
            user.name = existingUser.name || user.name;
            user.image = existingUser.image || user.image;
            user.role = existingUser.role;
          }

          return true;
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }

      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export async function registerUser(email: string, password: string) {
  try {
    await connect(MONGODB_URI);

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      role: 'user',
      isActive: true,
    });

    await user.save();

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function validateAdmin(userId: string) {
  try {
    await connect(MONGODB_URI);

    const user = await User.findById(userId);
    return user?.role === 'admin' && user?.isActive;
  } catch (error) {
    console.error('Admin validation error:', error);
    return false;
  }
}
