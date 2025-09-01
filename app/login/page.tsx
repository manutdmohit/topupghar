'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import Link from 'next/link';

export default function UserLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  // Get the callback URL from search parameters, default to homepage
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setMsg(null);

    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: callbackUrl,
      });

      if (result?.error) {
        setMsg({
          type: 'error',
          text: 'Google sign-in failed. Please try again.',
        });
      } else if (result?.ok) {
        setMsg({ type: 'success', text: 'Login successful! Redirecting…' });
        setTimeout(() => {
          router.push(callbackUrl);
        }, 1000);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setMsg({
        type: 'error',
        text: 'Google sign-in failed. Please try again.',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-800 relative">
      {/* Background animation */}
      <div className="absolute inset-0 pointer-events-none animate-pulse opacity-40 z-0">
        <div className="w-96 h-96 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 blur-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-2/3" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 border border-purple-100 shadow-2xl rounded-2xl px-8 py-10 flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col items-center mb-3">
            <User className="w-10 h-10 text-purple-700 mb-2" />
            <h1 className="text-2xl font-bold text-purple-800 mb-1 tracking-tight">
              Welcome Back
            </h1>
            <span className="text-sm text-gray-500">
              Sign in to your Topup Ghar account
            </span>
          </div>

          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 text-base"
          >
            {googleLoading ? (
              'Signing in...'
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </Button>

          {/* Message */}
          {msg && (
            <div
              className={`text-center text-sm rounded-lg px-3 py-2 font-medium ${
                msg.type === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {msg.text}
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Sign up with Google
            </Link>
          </div>
        </div>
        <div className="text-center mt-8 text-xs text-white/80">
          &copy; {new Date().getFullYear()} Topup Ghar. All rights reserved.
        </div>
      </div>
    </div>
  );
}
