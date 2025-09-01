'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, User, LogOut, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileMenu } from './mobile-menu';
import WalletBalanceDisplay from './wallet/WalletBalanceDisplay';
import WalletNotificationBadge from './wallet/WalletNotificationBadge';

const HeaderSection = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white px-4 py-4 sticky top-0 z-50 shadow-2xl backdrop-blur-md border-b border-purple-500/20 animate-fade-in-down">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo (Clickable Home) */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative animate-glow">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.jpg"
                alt="Game Shop Logo"
                width={40}
                height={40}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full animate-ping shadow-md" />
          </div>
          <div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              Topup घर
            </span>
            <div className="text-xs font-medium text-purple-300">
              डिजिटल दुनियाँको तपाईंको भरपर्दो साथी
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/"
            className="hover:text-purple-300 transition-all duration-300 font-medium relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Shop Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 hover:text-purple-300 transition"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <span>Shop</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <div
              className={`absolute top-full right-0 mt-3 w-48 bg-slate-800 border border-purple-500/20 rounded-lg shadow-2xl transform transition-all duration-300 origin-top-right ${
                isDropdownOpen
                  ? 'opacity-100 visible scale-100'
                  : 'opacity-0 invisible scale-95'
              }`}
            >
              {['Gaming', 'Social Media', 'Subscription', 'Load Balance'].map(
                (item, idx) => (
                  <Link
                    key={idx}
                    href={`/products/${item.toLowerCase().replace(' ', '-')}`}
                    className="block px-4 py-3 text-sm text-gray-200 hover:bg-purple-500/10 hover:text-purple-300 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>

          <Link
            href="/contact-us"
            className="hover:text-purple-300 transition-all duration-300 font-medium relative group"
          >
            Contact Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        {/* Authentication Section */}
        <div className="hidden md:flex items-center space-x-4">
          {status === 'loading' ? (
            // Loading state
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full animate-pulse" />
              <div className="w-16 h-4 bg-purple-600 rounded animate-pulse" />
            </div>
          ) : session?.user ? (
            // Logged in user
            <>
              <WalletBalanceDisplay />
              {session.user.role === 'admin' && <WalletNotificationBadge />}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 hover:bg-purple-500/10 rounded-lg p-2 transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={session.user.image || ''}
                      alt={session.user.name || 'User'}
                    />
                    <AvatarFallback className="bg-purple-600 text-white text-sm">
                      {session.user.name ? (
                        session.user.name.charAt(0).toUpperCase()
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-white">
                    {session.user.name || 'User'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-purple-500/20 rounded-lg shadow-2xl">
                    <div className="px-4 py-3 border-b border-purple-500/20">
                      <p className="text-sm font-medium text-white">
                        {session.user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href="/my-orders"
                      className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-gray-200 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span>My Orders</span>
                    </Link>
                    <Link
                      href="/wallet"
                      className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-gray-200 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <Wallet className="w-4 h-4" />
                      <span>My Wallet</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-gray-200 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Guest user - show login/signup buttons
            <div className="flex items-center space-x-3">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(
                  window.location.href
                )}`}
              >
                <Button
                  variant="ghost"
                  className="text-white hover:text-purple-300 hover:bg-purple-500/10"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
