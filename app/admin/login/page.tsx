'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    // Frontend validation
    if (!email || !pw) {
      setMsg({ type: 'error', text: 'Please enter both email and password.' });
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: pw }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Check if user is admin
        if (data.user.role === 'admin') {
          setMsg({ type: 'success', text: 'Login successful! Redirecting…' });
          // Store user data in localStorage or session
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 1000);
        } else {
          setMsg({
            type: 'error',
            text: 'Access denied. Admin privileges required.',
          });
        }
      } else {
        setMsg({
          type: 'error',
          text: data.error || 'Login failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setMsg({
        type: 'error',
        text: 'Network error. Please check your connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-800 relative">
      {/* Background animation */}
      <div className="absolute inset-0 pointer-events-none animate-pulse opacity-40 z-0">
        <div className="w-96 h-96 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 blur-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-2/3" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <form
          className="bg-white/95 border border-purple-100 shadow-2xl rounded-2xl px-8 py-10 flex flex-col gap-7 animate-fade-in"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center mb-3">
            <Lock className="w-10 h-10 text-purple-700 mb-2" />
            <h1 className="text-2xl font-bold text-purple-800 mb-1 tracking-tight">
              Admin Login
            </h1>
            <span className="text-sm text-gray-500">
              Topup Ghar Admin Panel
            </span>
          </div>
          {/* Email */}
          <div>
            <label
              className="block mb-1 font-semibold text-gray-700"
              htmlFor="admin-email"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              placeholder="admin@topupghar.com"
              disabled={loading}
              required
            />
          </div>
          {/* Password */}
          <div>
            <label
              className="block mb-1 font-semibold text-gray-700"
              htmlFor="admin-password"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="admin-password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 pr-11"
                placeholder="Your password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="absolute right-3 text-gray-500 hover:text-purple-700"
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
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
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-2 rounded-xl font-semibold transition-all"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Login'}
          </Button>
        </form>
        <div className="text-center mt-8 text-xs text-white/80">
          &copy; {new Date().getFullYear()} Topup Ghar. All rights reserved.
        </div>
      </div>
    </div>
  );
}
