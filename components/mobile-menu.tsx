'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  ChevronDown,
  Home,
  ShoppingBag,
  Phone,
  Gamepad2,
  Gift,
  ShoppingCart,
  DollarSign,
  User,
  LogOut,
  Wallet,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface WalletData {
  balance: number;
  totalTopups: number;
  totalSpent: number;
}

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);
  const { data: session, status } = useSession();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setOpenSubmenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape + focus first item
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setOpenSubmenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        firstMenuItemRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Fetch wallet balance when user is logged in
  useEffect(() => {
    if (session?.user?.id) {
      fetchWalletBalance();
    }
  }, [session?.user?.id]);

  // Refresh wallet balance when menu opens
  useEffect(() => {
    if (isOpen && session?.user?.id) {
      fetchWalletBalance();
    }
  }, [isOpen, session?.user?.id]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    setIsOpen(false);
  };

  const fetchWalletBalance = async () => {
    if (!session?.user?.id) return;

    setIsLoadingWallet(true);
    try {
      const response = await fetch('/api/wallet/balance');
      if (response.ok) {
        const data = await response.json();
        setWalletData(data.wallet);
      }
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', href: '/' },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: 'Shop',
      href: '#',
      hasSubmenu: true,
      submenu: [
        {
          icon: <Gamepad2 className="w-4 h-4" />,
          label: 'Gaming',
          href: '/products/gaming',
        },
        {
          icon: <Gift className="w-4 h-4" />,
          label: 'Social Media',
          href: '/products/social-media',
        },
        {
          icon: <ShoppingCart className="w-4 h-4" />,
          label: 'Subscription',
          href: '/products/subscription',
        },
        {
          icon: <DollarSign className="w-4 h-4" />,
          label: 'Load Balance',
          href: '/products/load-balance',
        },
      ],
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      label: 'Wallet',
      href: '/wallet',
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Contact Us',
      href: '/contact-us',
    },
  ];

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:bg-purple-700/50 backdrop-blur-sm rounded-full p-2"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40" />

          <div
            ref={modalRef}
            className="fixed top-16 left-4 right-4 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 transform scale-95 opacity-0 animate-scaleIn max-h-[85vh] overflow-y-auto"
          >
            <nav className="p-6">
              {/* User Authentication Section */}
              <div className="mb-8">
                {status === 'loading' ? (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-purple-600 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="w-24 h-4 bg-purple-600 rounded animate-pulse mb-2" />
                      <div className="w-36 h-3 bg-purple-600 rounded animate-pulse" />
                    </div>
                  </div>
                ) : session?.user ? (
                  // Logged in user
                  <div className="space-y-6">
                    {/* User Info Card */}
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100 animate-slideIn">
                      <Avatar className="w-12 h-12 border-2 border-purple-200">
                        <AvatarImage
                          src={session.user.image || ''}
                          alt={session.user.name || 'User'}
                        />
                        <AvatarFallback className="bg-purple-600 text-white font-semibold">
                          {session.user.name ? (
                            session.user.name.charAt(0).toUpperCase()
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {session.user.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user.email}
                        </p>
                        {/* Wallet Balance Display */}
                        <div className="flex items-center gap-2 mt-2">
                          <Wallet className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-medium text-purple-600">
                            {isLoadingWallet ? (
                              <span className="animate-pulse">Loading...</span>
                            ) : (
                              `Wallet: ${formatAmount(
                                walletData?.balance || 0
                              )}`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions Section */}
                    <div
                      className="animate-slideIn"
                      style={{ animationDelay: '0.1s' }}
                    >
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
                        Quick Actions
                      </h4>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <Link
                          href="/my-orders"
                          onClick={() => setIsOpen(false)}
                          className="block"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-center text-gray-700 border-gray-300 hover:bg-gray-50 h-10"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
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
                            My Orders
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSignOut}
                          className="w-full justify-center text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 hover:border-red-300 h-10"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <Link
                          href="/wallet"
                          onClick={() => setIsOpen(false)}
                          className="block"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-center text-gray-700 border-gray-300 hover:bg-gray-50 h-10"
                          >
                            <Wallet className="w-4 h-4 mr-2" />
                            My Wallet
                          </Button>
                        </Link>

                        <Link
                          href="/wallet?tab=topup"
                          onClick={() => setIsOpen(false)}
                          className="block"
                        >
                          <Button
                            size="sm"
                            className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white h-10"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Top Up Wallet
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Guest user
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Welcome to GameShop
                      </h3>
                      <p className="text-sm text-gray-600">
                        Sign in to access your account and wallet
                      </p>
                    </div>
                    <Link
                      href={`/login?callbackUrl=${encodeURIComponent(
                        window.location.href
                      )}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-center h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Navigation Menu */}
              <div
                className="space-y-2 animate-slideIn"
                style={{ animationDelay: '0.2s' }}
              >
                {menuItems.map((item, index) => (
                  <div key={index}>
                    {item.hasSubmenu ? (
                      <div>
                        <button
                          ref={index === 0 ? firstMenuItemRef : null}
                          onClick={() =>
                            setOpenSubmenu(
                              openSubmenu === item.label ? null : item.label
                            )
                          }
                          className="w-full flex items-center justify-between py-4 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-purple-600 group-hover:scale-110 transition-transform duration-300">
                              {item.icon}
                            </div>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-all duration-300 ${
                              openSubmenu === item.label
                                ? 'rotate-180 text-purple-600'
                                : ''
                            }`}
                          />
                        </button>

                        {openSubmenu === item.label && (
                          <div className="mt-2 ml-8 space-y-1">
                            {item.submenu?.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className="flex items-center gap-3 py-3 px-4 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                              >
                                <div className="text-purple-500">
                                  {subItem.icon}
                                </div>
                                <span>{subItem.label}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center justify-between py-4 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-purple-600 group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                          </div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
